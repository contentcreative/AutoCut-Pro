'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { aiVideoProjects, aiGenerationJobs, aiAssets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
// TODO: Implement when billing is ready
import { verifyActiveSubscription } from '@/lib/billing';
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
  await verifyActiveSubscription(userId);

  const data = CreateProjectSchema.parse(input);
  
  // Create the project with proper schema mapping
  const [project] = await db.insert(aiVideoProjects).values({
    userId,
    topic: data.topic,
    status: 'queued',
    ttsProvider: data.settings.ttsProvider || 'openai',
    voiceStyle: data.settings.voiceStyle || 'narration_female',
    captionsTheme: data.settings.captionsTheme || 'bold-yellow',
    aspectRatio: data.settings.aspectRatio || '9:16',
    targetDurationSec: data.settings.targetDurationSec || 30,
    language: data.settings.language || 'en',
    seed: data.settings.seed,
  }).returning();

  const [job] = await db.insert(aiGenerationJobs).values({
    projectId: project.id,
    status: 'queued',
    currentStep: 'queued',
    progressPct: 0,
  }).returning();

  // Kick off Express worker
  try {
    const response = await fetch(`${process.env.WORKER_BASE_URL || 'http://localhost:3030'}/video/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.WORKER_API_KEY || 'dev-secret'
      },
      body: JSON.stringify({ 
        jobId: job.id, 
        projectId: project.id,
        inputTopic: data.topic,
        settings: data.settings
      }),
    });

    if (!response.ok) {
      console.error('Worker request failed:', response.status, response.statusText);
      // Don't throw error - job is still created, just not processed yet
    }
  } catch (error) {
    console.error('Failed to start worker:', error);
    // Don't throw error - job is still created, just not processed yet
  }

  return { projectId: project.id, jobId: job.id };
}

export async function listUserProjects() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const userProjects = await db
      .select({
        id: aiVideoProjects.id,
        topic: aiVideoProjects.topic,
        status: aiVideoProjects.status,
        createdAt: aiVideoProjects.createdAt,
        settings: {
          aspectRatio: aiVideoProjects.aspectRatio,
          voiceStyle: aiVideoProjects.voiceStyle,
          captionsTheme: aiVideoProjects.captionsTheme,
          targetDurationSec: aiVideoProjects.targetDurationSec,
        },
        videoUrl: aiAssets.publicUrl,
        thumbnailUrl: aiAssets.publicUrl,
        duration: aiVideoProjects.durationMs,
      })
      .from(aiVideoProjects)
      .leftJoin(aiAssets, eq(aiAssets.projectId, aiVideoProjects.id))
      .where(eq(aiVideoProjects.userId, userId))
      .orderBy(aiVideoProjects.createdAt);

    // Group by project to avoid duplicates from joins
    const projectMap = new Map();
    userProjects.forEach(project => {
      if (!projectMap.has(project.id)) {
        projectMap.set(project.id, {
          id: project.id,
          topic: project.topic,
          status: project.status,
          createdAt: project.createdAt,
          settings: project.settings,
          videoUrl: null,
          thumbnailUrl: null,
          duration: project.duration,
        });
      }
    });

    return Array.from(projectMap.values());
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
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
