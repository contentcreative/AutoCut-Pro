"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { exportJobs, exportAssets } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

// Schema for creating export jobs
const createExportJobSchema = z.object({
  projectId: z.string().optional(),
  contentId: z.string().optional(),
  brandKitId: z.string().optional(),
  formats: z.array(z.object({
    ratio: z.string(),
    resolution: z.string(),
    bitrate: z.string().optional(),
    fps: z.number().optional(),
  })).min(1),
  options: z.object({
    generateThumbnails: z.boolean().optional(),
    thumbnailTimecode: z.string().optional(),
    metadataOverrides: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      hashtags: z.array(z.string()).optional(),
    }).optional(),
    outputNaming: z.string().optional(),
  }).optional(),
  sourceVideoPath: z.string(),
});

export type CreateExportJobInput = z.infer<typeof createExportJobSchema>;

export async function createExportJob(input: CreateExportJobInput) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  // TODO: Add subscription check when Whop is configured
  // const sub = await getUserActiveSubscription(userId);
  // if (!sub?.active) {
  //   throw new Error('An active subscription is required to export.');
  // }

  const parsed = createExportJobSchema.parse(input);

  const [job] = await db.insert(exportJobs).values({
    userId,
    projectId: parsed.projectId as any,
    contentId: parsed.contentId as any,
    brandKitId: parsed.brandKitId as any,
    formats: parsed.formats,
    options: parsed.options ?? {},
    storageBucket: 'source-videos',
    sourceVideoPath: parsed.sourceVideoPath,
    status: 'queued',
    progress: 0,
  }).returning();

  revalidatePath('/dashboard');
  return job;
}

export async function listExportJobs() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const rows = await db.select().from(exportJobs)
    .where(eq(exportJobs.userId, userId))
    .orderBy(desc(exportJobs.createdAt));

  return rows;
}

export async function getExportJob(jobId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [job] = await db.select().from(exportJobs)
    .where(and(eq(exportJobs.id, jobId as any), eq(exportJobs.userId, userId)));

  if (!job) throw new Error('Not found');
  return job;
}

export async function cancelExportJob(jobId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  // Only allow cancel if not terminal
  const [job] = await db.update(exportJobs)
    .set({ status: 'canceled', updatedAt: new Date() })
    .where(and(
      eq(exportJobs.id, jobId as any),
      eq(exportJobs.userId, userId),
    ))
    .returning();

  if (!job) throw new Error('Not found or cannot cancel');
  revalidatePath('/dashboard');
  return job;
}

export async function getExportDownloadUrl(jobId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [job] = await db.select().from(exportJobs)
    .where(and(eq(exportJobs.id, jobId as any), eq(exportJobs.userId, userId)));

  if (!job) throw new Error('Not found');
  if (job.status !== 'ready' || !job.zipStoragePath) {
    throw new Error('Export not ready');
  }

  const supa = createSupabaseAdminClient();
  const { data, error } = await supa.storage
    .from('exports')
    .createSignedUrl(job.zipStoragePath, 60 * 5); // 5 min

  if (error) throw error;
  return { url: data.signedUrl };
}