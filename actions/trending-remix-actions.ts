'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { trendingVideos, remixJobs, trendingFetchRuns } from '@/db/schema';
import { eq, and, desc, asc, gte, lte, like, or, count, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { fetchYouTubeShortsTrending } from '@/lib/integrations/youtube';
import { AdvancedFilters, SortOption, SearchPreset, TrendingVideo } from '@/types/trending-remix';
import { computeViralityScore } from '@/lib/virality';
import { validateWhopEntitlement } from '@/lib/billing'; // Updated to use billing.ts

const FetchSchema = z.object({
  niche: z.string().min(2),
  platforms: z.array(z.enum(['youtube','tiktok','instagram'])).default(['youtube']),
  max: z.number().min(5).max(100).default(50),
});

export async function fetchAndUpsertTrending(input: unknown) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  const { niche, platforms, max } = FetchSchema.parse(input);

  // Create fetch runs for each platform
  const fetchRuns = [];
  for (const platform of platforms) {
    const run = await db.insert(trendingFetchRuns).values({ 
      niche, 
      platform: platform as 'youtube' | 'tiktok' | 'instagram' 
    }).returning({ id: trendingFetchRuns.id });
    fetchRuns.push(run[0]);
  }

  // Fetch from real APIs
  const results: any[] = [];
  let inserted = 0;

  try {
    if (platforms.includes('youtube')) {
      console.log(`🔍 Fetching YouTube trending videos for niche: "${niche}"`);
      const youtubeResults = await fetchYouTubeShortsTrending(niche, max);
      console.log(`📺 YouTube API returned ${youtubeResults.length} videos`);
      if (youtubeResults.length > 0) {
        console.log('🎬 Sample YouTube video:', {
          title: youtubeResults[0].title,
          platform: youtubeResults[0].platform,
          views: youtubeResults[0].viewsCount
        });
      }
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

  console.log(`💾 Processing ${results.length} results for database insertion`);
  
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

    console.log(`🔄 Processing video: "${item.title}" (score: ${score})`);

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
      console.log(`✅ Successfully inserted/updated video: "${item.title}"`);
    } catch (e) {
      console.error(`❌ Failed to insert video: "${item.title}"`, e);
    }
  }

  // Update all fetch runs with completion data
  for (const run of fetchRuns) {
    await db.update(trendingFetchRuns).set({
      totalFound: results.length,
      totalInserted: inserted,
      completedAt: new Date(),
    }).where(eq(trendingFetchRuns.id, run.id));
  }

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

// Enhanced search schema for advanced filtering
const AdvancedSearchSchema = z.object({
  niche: z.string().optional(),
  platforms: z.array(z.enum(['youtube','tiktok','instagram'])).optional(),
  filters: z.object({
    dateRange: z.object({
      start: z.date().nullable(),
      end: z.date().nullable(),
    }).optional(),
    viewCountRange: z.object({
      min: z.number().nullable(),
      max: z.number().nullable(),
    }).optional(),
    durationRange: z.object({
      min: z.number().nullable(),
      max: z.number().nullable(),
    }).optional(),
    engagementFilters: z.object({
      minLikes: z.number().nullable(),
      minComments: z.number().nullable(),
      minShares: z.number().nullable(),
    }).optional(),
    languageFilters: z.object({
      videoLanguages: z.array(z.string()).optional(),
      audioLanguages: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
  sortBy: z.object({
    key: z.enum(['viralityScore', 'viewsCount', 'likesCount', 'commentsCount', 'sharesCount', 'publishedAt', 'durationSeconds']),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(200).default(50),
  }).optional(),
  advancedSearch: z.object({
    keywords: z.array(z.string()).optional(),
    excludeTerms: z.array(z.string()).optional(),
    exactPhrase: z.string().optional(),
    matchAll: z.boolean().optional(),
  }).optional(),
});

export async function getTrendingVideosAdvanced(input: unknown) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  const { niche, platforms, filters, sortBy, pagination, advancedSearch } = AdvancedSearchSchema.parse(input);
  
  // Build where conditions
  const whereConditions = [];
  
  if (niche) {
    whereConditions.push(eq(trendingVideos.niche, niche));
  }
  
  if (platforms && platforms.length > 0) {
    whereConditions.push(inArray(trendingVideos.platform, platforms));
  }
  
  // Date range filter
  if (filters?.dateRange?.start) {
    whereConditions.push(gte(trendingVideos.publishedAt, filters.dateRange.start));
  }
  if (filters?.dateRange?.end) {
    whereConditions.push(lte(trendingVideos.publishedAt, filters.dateRange.end));
  }
  
  // View count range filter
  if (filters?.viewCountRange?.min !== null && filters?.viewCountRange?.min !== undefined) {
    whereConditions.push(gte(trendingVideos.viewsCount, filters.viewCountRange.min));
  }
  if (filters?.viewCountRange?.max !== null && filters?.viewCountRange?.max !== undefined) {
    whereConditions.push(lte(trendingVideos.viewsCount, filters.viewCountRange.max));
  }
  
  // Duration range filter
  if (filters?.durationRange?.min !== null && filters?.durationRange?.min !== undefined) {
    whereConditions.push(gte(trendingVideos.durationSeconds, filters.durationRange.min));
  }
  if (filters?.durationRange?.max !== null && filters?.durationRange?.max !== undefined) {
    whereConditions.push(lte(trendingVideos.durationSeconds, filters.durationRange.max));
  }
  
  // Engagement filters
  if (filters?.engagementFilters?.minLikes !== null && filters?.engagementFilters?.minLikes !== undefined) {
    whereConditions.push(gte(trendingVideos.likesCount, filters.engagementFilters.minLikes));
  }
  if (filters?.engagementFilters?.minComments !== null && filters?.engagementFilters?.minComments !== undefined) {
    whereConditions.push(gte(trendingVideos.commentsCount, filters.engagementFilters.minComments));
  }
  if (filters?.engagementFilters?.minShares !== null && filters?.engagementFilters?.minShares !== undefined) {
    whereConditions.push(gte(trendingVideos.sharesCount, filters.engagementFilters.minShares));
  }
  
  // Language filters (filter by language codes in raw metadata)
  if (filters?.languageFilters?.videoLanguages && filters.languageFilters.videoLanguages.length > 0) {
    const languageConditions = filters.languageFilters.videoLanguages.map(lang => 
      sql`${trendingVideos.raw}->>'defaultLanguage' = ${lang}`
    );
    whereConditions.push(or(...languageConditions));
  }
  
  if (filters?.languageFilters?.audioLanguages && filters.languageFilters.audioLanguages.length > 0) {
    const audioLanguageConditions = filters.languageFilters.audioLanguages.map(lang => 
      sql`${trendingVideos.raw}->>'defaultAudioLanguage' = ${lang}`
    );
    whereConditions.push(or(...audioLanguageConditions));
  }
  
  // Advanced search filters
  if (advancedSearch?.keywords && advancedSearch.keywords.length > 0) {
    const keywordConditions = advancedSearch.keywords.map(keyword => 
      like(trendingVideos.title, `%${keyword}%`)
    );
    whereConditions.push(
      advancedSearch.matchAll ? and(...keywordConditions) : or(...keywordConditions)
    );
  }
  
  if (advancedSearch?.excludeTerms && advancedSearch.excludeTerms.length > 0) {
    const excludeConditions = advancedSearch.excludeTerms.map(term => 
      sql`NOT ${trendingVideos.title} ILIKE ${`%${term}%`}`
    );
    whereConditions.push(and(...excludeConditions));
  }
  
  if (advancedSearch?.exactPhrase) {
    whereConditions.push(like(trendingVideos.title, `%${advancedSearch.exactPhrase}%`));
  }
  
  // Build query
  let query = db.select().from(trendingVideos);
  
  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions));
  }
  
  // Apply sorting
  const sortColumn = trendingVideos[sortBy?.key || 'viralityScore'];
  const sortDirection = sortBy?.direction === 'asc' ? asc : desc;
  query = query.orderBy(sortDirection(sortColumn));
  
  // Apply pagination
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 50;
  const offset = (page - 1) * limit;
  query = query.limit(limit).offset(offset);
  
  // Execute query
  console.log(`🔍 Executing query with ${whereConditions.length} conditions`);
  const videos = await query;
  console.log(`📺 Query returned ${videos.length} videos`);
  
  // Get total count for pagination
  let countQuery = db.select({ count: count() }).from(trendingVideos);
  if (whereConditions.length > 0) {
    countQuery = countQuery.where(and(...whereConditions));
  }
  const [{ count: totalCount }] = await countQuery;
  console.log(`📊 Total count: ${totalCount}`);
  
  return {
    videos,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function getTrendingVideos(niche?: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  console.log(`🔍 getTrendingVideos called with niche: "${niche || 'none'}"`);
  
  if (niche) {
    const videos = await db
      .select()
      .from(trendingVideos)
      .where(eq(trendingVideos.niche, niche))
      .orderBy(desc(trendingVideos.viralityScore))
      .limit(100);
    console.log(`📺 Found ${videos.length} videos for niche "${niche}"`);
    return videos;
  }
  
  const videos = await db
    .select()
    .from(trendingVideos)
    .orderBy(desc(trendingVideos.viralityScore))
    .limit(100);
  console.log(`📺 Found ${videos.length} total videos`);
  return videos;
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

// Search suggestions and trending niches
export async function getSearchSuggestions(query?: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  // Get trending niches from database
  const trendingNiches = await db
    .select({ 
      niche: trendingVideos.niche,
      count: count(),
    })
    .from(trendingVideos)
    .groupBy(trendingVideos.niche)
    .orderBy(desc(count()))
    .limit(10);
  
  const suggestions = trendingNiches.map(niche => ({
    text: niche.niche,
    type: 'trending' as const,
    count: niche.count,
  }));
  
  // If query provided, filter suggestions
  if (query) {
    return suggestions.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  return suggestions;
}

// Search presets management
export async function getSearchPresets() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  // For now, return default presets
  // TODO: Implement user-specific presets storage
  const defaultPresets: SearchPreset[] = [
    {
      id: 'tech-trending',
      name: 'Tech & AI',
      niche: 'AI tools',
      platforms: ['youtube'],
      filters: {
        dateRange: { start: null, end: null },
        viewCountRange: { min: 100000, max: null },
        durationRange: { min: 15, max: 90 },
        engagementFilters: { minLikes: 1000, minComments: null, minShares: null },
        languageFilters: { videoLanguages: ['en'], audioLanguages: ['en'] },
        platformSpecific: {
          youtube: { duration: 'short' },
          tiktok: { music: null, hashtags: [] },
          instagram: { reels: true, hashtags: [] },
        },
      },
      isDefault: true,
      createdAt: new Date(),
    },
    {
      id: 'fitness-trending',
      name: 'Fitness & Health',
      niche: 'fitness',
      platforms: ['youtube', 'tiktok'],
      filters: {
        dateRange: { start: null, end: null },
        viewCountRange: { min: 50000, max: null },
        durationRange: { min: 30, max: 120 },
        engagementFilters: { minLikes: 500, minComments: null, minShares: null },
        languageFilters: { videoLanguages: ['en'], audioLanguages: ['en'] },
        platformSpecific: {
          youtube: { duration: 'short' },
          tiktok: { music: true, hashtags: ['fitness', 'workout'] },
          instagram: { reels: true, hashtags: ['fitness'] },
        },
      },
      isDefault: true,
      createdAt: new Date(),
    },
    {
      id: 'cooking-trending',
      name: 'Cooking & Food',
      niche: 'cooking',
      platforms: ['youtube', 'instagram'],
      filters: {
        dateRange: { start: null, end: null },
        viewCountRange: { min: 25000, max: null },
        durationRange: { min: 20, max: 180 },
        engagementFilters: { minLikes: 200, minComments: null, minShares: null },
        languageFilters: { videoLanguages: ['en'], audioLanguages: ['en'] },
        platformSpecific: {
          youtube: { duration: 'short' },
          tiktok: { music: null, hashtags: [] },
          instagram: { reels: true, hashtags: ['cooking', 'food'] },
        },
      },
      isDefault: true,
      createdAt: new Date(),
    },
  ];
  
  return defaultPresets;
}

export async function saveSearchPreset(preset: Omit<SearchPreset, 'id' | 'createdAt'>) {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  
  // TODO: Implement preset storage in database
  // For now, just return success
  return { success: true, id: `preset_${Date.now()}` };
}

// Helper function for virality score calculation
// computeViralityScore is now imported from @/lib/virality
