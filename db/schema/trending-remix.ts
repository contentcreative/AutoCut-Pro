// /db/schema/trending-remix.ts
import {
  pgTable, uuid, text, timestamp, integer, bigint, numeric, jsonb, pgEnum, index, uniqueIndex, boolean
} from 'drizzle-orm/pg-core';

export const trendingPlatformEnum = pgEnum('trending_video_platform', ['youtube', 'tiktok', 'instagram']);
export const trendingRemixJobStatusEnum = pgEnum('trending_remix_job_status', ['queued','processing','completed','failed','cancelled']);
export const trendingRemixJobStepEnum = pgEnum('trending_remix_job_step', ['init','fetch_transcript','rewrite_script','tts','assemble','upload','done']);

export const trendingVideos = pgTable('trending_videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: trendingPlatformEnum('platform').notNull(),
  sourceVideoId: text('source_video_id').notNull(),
  niche: text('niche').notNull(),
  title: text('title').notNull(),
  creatorHandle: text('creator_handle'),
  thumbnailUrl: text('thumbnail_url'),
  permalink: text('permalink').notNull(), // canonical URL to source
  durationSeconds: integer('duration_seconds'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  viewsCount: bigint('views_count', { mode: 'number' }).default(0),
  likesCount: bigint('likes_count', { mode: 'number' }).default(0),
  commentsCount: bigint('comments_count', { mode: 'number' }).default(0),
  sharesCount: bigint('shares_count', { mode: 'number' }).default(0),
  viralityScore: numeric('virality_score', { precision: 8, scale: 4 }).default('0').notNull(),
  scoreBreakdown: jsonb('score_breakdown'), // weights and normalized metrics
  raw: jsonb('raw'), // raw API payload
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('uniq_platform_source').on(t.platform, t.sourceVideoId),
  nicheIdx: index('idx_trending_niche').on(t.niche),
  scoreIdx: index('idx_trending_score').on(t.viralityScore),
  publishedIdx: index('idx_trending_published').on(t.publishedAt),
}));

export const remixJobs = pgTable('remix_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user id
  trendingVideoId: uuid('trending_video_id').references(() => trendingVideos.id, { onDelete: 'set null' }),
  niche: text('niche'),
  status: trendingRemixJobStatusEnum('status').notNull().default('queued'),
  step: trendingRemixJobStepEnum('step').default('init'),
  options: jsonb('options'), // {voiceModel, aspectRatio, targetDuration, stylePreset, language, musicPack, ...}
  rewrittenScript: text('rewritten_script'),
  transcriptUrl: text('transcript_url'), // Supabase file URL for original transcript
  outputVideoUrl: text('output_video_url'),
  outputThumbnailUrl: text('output_thumbnail_url'),
  voiceModel: text('voice_model'),
  aspectRatio: text('aspect_ratio'),
  durationSeconds: integer('duration_seconds'),
  tokensUsed: integer('tokens_used').default(0),
  ttsSeconds: integer('tts_seconds').default(0),
  costEstimateCents: integer('cost_estimate_cents').default(0),
  error: text('error'),
  internalOnly: boolean('internal_only').default(false), // e.g., for test jobs
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  userIdx: index('idx_remix_user').on(t.userId),
  statusIdx: index('idx_remix_status').on(t.status),
  trendingIdx: index('idx_remix_trending').on(t.trendingVideoId),
}));

export const trendingFetchRuns = pgTable('trending_fetch_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  platform: trendingPlatformEnum('platform').notNull(),
  niche: text('niche').notNull(),
  totalFound: integer('total_found').default(0),
  totalInserted: integer('total_inserted').default(0),
  error: text('error'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  nichePlatIdx: index('idx_fetch_niche_platform').on(t.niche, t.platform),
}));
