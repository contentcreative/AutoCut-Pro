'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { aiVideoProjects, aiGenerationJobs, aiAssets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
// TODO: Implement when billing is ready
// import { verifyActiveSubscription } from '@/lib/billing';
// import { csFetch } from '@/lib/cs-fetch';

const CreateProjectSchema = z.object({
  topic: z.string().min(3).max(120),
  settings: z.object({
    ttsProvider: z.string().optional(),
    voiceStyle: z.string().optional(),
    captionsTheme: z.string().optional(),
    aspectRatio: z.enum(['9:16','1:1','16:9']).optional(),
    targetDurationSec: z.number().min(10).max(90).optional(),
    language: z.string().optional(),
    seed: z.number().optional(),
  }).partial().default({}),
});

export async function createAIVideoProject(input: z.infer<typeof CreateProjectSchema>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  // TODO: Implement subscription check when billing is ready
  // await verifyActiveSubscription(userId);

  const data = CreateProjectSchema.parse(input);
  const [project] = await db.insert(aiVideoProjects).values({
    userId,
    topic: data.topic,
    status: 'queued',
    ...data.settings,
  }).returning();

  const [job] = await db.insert(aiGenerationJobs).values({
    projectId: project.id,
    status: 'queued',
    currentStep: 'queued',
  }).returning();

  // TODO: Kick off Express worker when ready
  // await csFetch(`${process.env.WORKER_BASE_URL}/video/generate`, {
  //   method: 'POST',
  //   headers: { 'x-api-key': process.env.WORKER_API_KEY! },
  //   body: JSON.stringify({ jobId: job.id, projectId: project.id }),
  // });

  return { projectId: project.id, jobId: job.id };
}

const UpdateSettingsSchema = z.object({
  projectId: z.string().uuid(),
  settings: z.object({
    ttsProvider: z.string().optional(),
    voiceStyle: z.string().optional(),
    captionsTheme: z.string().optional(),
    aspectRatio: z.enum(['9:16','1:1','16:9']).optional(),
    targetDurationSec: z.number().min(10).max(90).optional(),
    language: z.string().optional(),
    seed: z.number().optional(),
  }).partial(),
});

export async function updateAIVideoSettings(input: z.infer<typeof UpdateSettingsSchema>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  const { projectId, settings } = UpdateSettingsSchema.parse(input);

  const [project] = await db.update(aiVideoProjects)
    .set({ ...settings })
    .where(eq(aiVideoProjects.id, projectId))
    .returning();

  if (!project || project.userId !== userId) throw new Error('Not found or forbidden');
  return project;
}

export async function getAIVideoProject(projectId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const [project] = await db.select().from(aiVideoProjects)
    .where(eq(aiVideoProjects.id, projectId));
  if (!project || project.userId !== userId) throw new Error('Not found');

  const assets = await db.select().from(aiAssets).where(eq(aiAssets.projectId, projectId));
  const [job] = await db.select().from(aiGenerationJobs).where(eq(aiGenerationJobs.projectId, projectId));

  return { project, assets, job };
}

export async function requestRegeneration(projectId: string, step: 'script'|'voiceover'|'broll'|'captions'|'render') {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  // Verify ownership
  const [project] = await db.select().from(aiVideoProjects).where(eq(aiVideoProjects.id, projectId));
  if (!project || project.userId !== userId) throw new Error('Not found');

  // TODO: Re-enqueue job with step override when worker is ready
  // await csFetch(`${process.env.WORKER_BASE_URL}/video/regenerate`, {
  //   method: 'POST',
  //   headers: { 'x-api-key': process.env.WORKER_API_KEY! },
  //   body: JSON.stringify({ projectId, step }),
  // });

  return { ok: true };
}

export async function getSignedAssetUrl(assetId: string) {
  // TODO: Use Supabase server client to produce signed URL for private buckets
  return { url: 'SIGNED_URL_PLACEHOLDER' };
}
