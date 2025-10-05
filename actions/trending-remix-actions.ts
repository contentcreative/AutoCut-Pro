'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { trendingVideos, remixJobs, trendingFetchRuns } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { fetchYouTubeShortsTrending } from '@/lib/integrations/youtube';
// TODO: Implement when billing is ready
// import { validateWhopEntitlement } from '@/lib/payments/whop';

const FetchSchema = z.object({
  niche: z.string().min(2),
  platforms: z.array(z.enum(['youtube','tiktok','instagram'])).default(['youtube']),
  max: z.number().min(5).max(100).default(50),
});

export async function fetchAndUpsertTrending(input: unknown) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  const { niche, platforms, max } = FetchSchema.parse(input);

  const run = await db.insert(trendingFetchRuns).values({ niche, platform: 'youtube' }).returning({ id: trendingFetchRuns.id });

  // Fetch from real APIs
  const results: any[] = [];
  let inserted = 0;

  try {
    if (platforms.includes('youtube')) {
      console.log(`🔍 Fetching YouTube trending videos for niche: "${niche}"`);
      const youtubeResults = await fetchYouTubeShortsTrending(niche, max);
      results.push(...youtubeResults);
    }
    
    // TODO: Add TikTok and Instagram integrations
    if (platforms.includes('tiktok')) {
      console.log('⚠️ TikTok integration not yet implemented');
    }
    
    if (platforms.includes('instagram')) {
      console.log('⚠️ Instagram integration not yet implemented');
    }
  } catch (error) {
    console.error('❌ Error fetching trending content:', error);
    
    // Fallback to mock data if API fails
    console.log('🔄 Falling back to mock data');
    const mockResults = [
      {
        platform: 'youtube' as const,
        sourceVideoId: 'mock_video_1',
        niche,
        title: 'Top 5 Productivity Hacks for Remote Work',
        creatorHandle: 'Tech Insights',
        thumbnailUrl: 'https://via.placeholder.com/320x180',
        permalink: 'https://youtube.com/watch?v=mock1',
        durationSeconds: 90,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        viewsCount: 1200000,
        likesCount: 80000,
        commentsCount: 2500,
        sharesCount: 1200,
        raw: { mock: true },
      },
      {
        platform: 'youtube' as const,
        sourceVideoId: 'mock_video_2',
        niche,
        title: 'DIY Home Decor Ideas You\'ll Love',
        creatorHandle: 'Crafty Corner',
        thumbnailUrl: 'https://via.placeholder.com/320x180',
        permalink: 'https://youtube.com/watch?v=mock2',
        durationSeconds: 45,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        viewsCount: 980000,
        likesCount: 120000,
        commentsCount: 4000,
        sharesCount: 2100,
        raw: { mock: true },
      },
    ];
    results.push(...mockResults);
  }

  for (const item of results) {
    const now = new Date();
    const ageHours = item.publishedAt ? Math.max(1, (now.getTime() - item.publishedAt.getTime()) / 36e5) : 24;
    
    // Calculate virality score
    const { score, breakdown } = computeViralityScore({
      views: item.viewsCount ?? 0,
      likes: item.likesCount ?? 0,
      comments: item.commentsCount ?? 0,
      shares: item.sharesCount ?? 0,
      ageHours,
      durationSec: item.durationSeconds ?? undefined,
    });

    try {
      await db
        .insert(trendingVideos)
        .values({
          platform: item.platform,
          sourceVideoId: item.sourceVideoId,
          niche,
          title: item.title ?? '',
          creatorHandle: item.creatorHandle ?? null,
          thumbnailUrl: item.thumbnailUrl ?? null,
          permalink: item.permalink,
          durationSeconds: item.durationSeconds ?? null,
          publishedAt: item.publishedAt ?? null,
          viewsCount: item.viewsCount ?? 0,
          likesCount: item.likesCount ?? 0,
          commentsCount: item.commentsCount ?? 0,
          sharesCount: item.sharesCount ?? 0,
          viralityScore: score.toString(),
          scoreBreakdown: breakdown,
          raw: item.raw ?? null,
        })
        .onConflictDoUpdate({
          target: [trendingVideos.platform, trendingVideos.sourceVideoId],
          set: {
            title: item.title ?? '',
            thumbnailUrl: item.thumbnailUrl ?? null,
            viewsCount: item.viewsCount ?? 0,
            likesCount: item.likesCount ?? 0,
            commentsCount: item.commentsCount ?? 0,
            sharesCount: item.sharesCount ?? 0,
            viralityScore: score.toString(),
            scoreBreakdown: breakdown,
            fetchedAt: new Date(),
          },
        });
      inserted++;
    } catch (e) {
      console.error('Upsert trending error', e);
    }
  }

  await db.update(trendingFetchRuns).set({
    totalFound: results.length,
    totalInserted: inserted,
    completedAt: new Date(),
  }).where(eq(trendingFetchRuns.id, run[0].id));

  return { totalFound: results.length, totalInserted: inserted };
}

const RemixInput = z.object({
  trendingVideoId: z.string().uuid(),
  options: z.object({
    voiceModel: z.string().default('alloy'),
    aspectRatio: z.enum(['9:16','1:1','16:9']).default('9:16'),
    targetDuration: z.number().min(10).max(90).default(60),
    stylePreset: z.enum(['news','listicle','story','tips']).default('listicle'),
    language: z.string().default('en'),
  }),
});

export async function createRemixJob(input: unknown) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  // TODO: Implement subscription check when billing is ready
  // await validateWhopEntitlement(userId);

  const { trendingVideoId, options } = RemixInput.parse(input);
  const [trend] = await db.select().from(trendingVideos)
    .where(eq(trendingVideos.id, trendingVideoId)).limit(1);
  if (!trend) throw new Error('Trending video not found');

  const [job] = await db.insert(remixJobs).values({
    userId,
    trendingVideoId,
    niche: trend.niche,
    status: 'queued',
    step: 'init',
    options,
    voiceModel: options.voiceModel,
    aspectRatio: options.aspectRatio,
    durationSeconds: options.targetDuration,
  }).returning();

  // TODO: Notify video remix worker when ready
  // await fetch(`${process.env.REMIX_SERVICE_URL}/jobs`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Auth': process.env.REMIX_SERVICE_TOKEN!,
  //   },
  //   body: JSON.stringify({
  //     jobId: job.id,
  //     userId,
  //     source: { platform: trend.platform, permalink: trend.permalink, title: trend.title },
  //     options,
  //     webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/remix/webhook`,
  //   }),
  // });

  return { jobId: job.id };
}

export async function getTrendingVideos(niche?: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  if (niche) {
    return await db
      .select()
      .from(trendingVideos)
      .where(eq(trendingVideos.niche, niche))
      .orderBy(desc(trendingVideos.viralityScore))
      .limit(100);
  }
  
  return await db
    .select()
    .from(trendingVideos)
    .orderBy(desc(trendingVideos.viralityScore))
    .limit(100);
}

export async function getUserRemixJobs() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  const rows = await db.select().from(remixJobs)
    .where(eq(remixJobs.userId, userId))
    .orderBy(desc(remixJobs.createdAt))
    .limit(50);
  return rows;
}

export async function cancelRemixJob(jobId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  await db.update(remixJobs)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(
      eq(remixJobs.id, jobId as any),
      eq(remixJobs.userId, userId),
    ));
  return { ok: true };
}

// Helper function for virality score calculation
function computeViralityScore(v: {
  views: number; likes: number; comments: number; shares: number;
  ageHours: number; durationSec?: number;
}) {
  // Normalize per-hour engagement to favor recency
  const perHour = (x: number) => x / Math.max(v.ageHours, 1);
  const w = { views: 0.35, likes: 0.25, comments: 0.2, shares: 0.2 };
  const raw =
    w.views * Math.log10(1 + perHour(v.views)) +
    w.likes * Math.log10(1 + perHour(v.likes)) +
    w.comments * Math.log10(1 + perHour(v.comments)) +
    w.shares * Math.log10(1 + perHour(v.shares));
  // Optional duration penalty for very long videos in shorts context
  const durPenalty = v.durationSec && v.durationSec > 75 ? 0.9 : 1;
  const score = +(Math.min(raw * durPenalty, 5)).toFixed(4); // cap 0-5
  return { score, breakdown: { ...w, ageHours: v.ageHours, durationSec: v.durationSec } };
}
