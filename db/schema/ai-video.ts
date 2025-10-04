// /db/schema/ai-video.ts
import {
  pgTable, uuid, text, timestamp, jsonb, integer, pgEnum, boolean, index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const videoStatusEnum = pgEnum('video_status_enum', [
  'draft', 'queued', 'processing', 'ready', 'failed', 'canceled'
]);

export const jobStatusEnum = pgEnum('job_status_enum', [
  'queued', 'generating_script', 'generating_voiceover', 'fetching_broll', 'generating_captions', 'rendering', 'completed', 'failed', 'canceled'
]);

export const assetTypeEnum = pgEnum('asset_type_enum', [
  'script', 'voiceover_audio', 'broll_clip', 'subtitle_srt', 'thumbnail_image', 'final_video'
]);

export const assetStatusEnum = pgEnum('asset_status_enum', [
  'queued', 'processing', 'ready', 'failed'
]);

// Projects
export const aiVideoProjects = pgTable('ai_video_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk userId
  topic: text('topic').notNull(),
  status: videoStatusEnum('status').notNull().default('queued'),
  // Settings
  ttsProvider: text('tts_provider').notNull().default('elevenlabs'),
  voiceStyle: text('voice_style').notNull().default('narration_female'),
  captionsTheme: text('captions_theme').notNull().default('bold-yellow'),
  aspectRatio: text('aspect_ratio').notNull().default('9:16'),
  targetDurationSec: integer('target_duration_sec').notNull().default(30),
  language: text('language').notNull().default('en'),
  seed: integer('seed'),
  // Summary metadata
  durationMs: integer('duration_ms'),
  width: integer('width'),
  height: integer('height'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdx: index('ai_video_projects_user_idx').on(table.userId),
  statusIdx: index('ai_video_projects_status_idx').on(table.status),
}));

// Generation Jobs
export const aiGenerationJobs = pgTable('ai_generation_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => aiVideoProjects.id, { onDelete: 'cascade' }),
  status: jobStatusEnum('status').notNull().default('queued'),
  currentStep: text('current_step').notNull().default('queued'), // freeform step label
  progressPct: integer('progress_pct').notNull().default(0), // 0-100
  errorMessage: text('error_message'),
  workerId: text('worker_id'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  projIdx: index('ai_generation_jobs_project_idx').on(table.projectId),
  statusIdx: index('ai_generation_jobs_status_idx').on(table.status),
}));

// Assets produced/used by the pipeline
export const aiAssets = pgTable('ai_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => aiVideoProjects.id, { onDelete: 'cascade' }),
  type: assetTypeEnum('type').notNull(),
  status: assetStatusEnum('status').notNull().default('queued'),
  // Storage references (Supabase)
  storagePath: text('storage_path'), // e.g., videos/{projectId}/final.mp4
  publicUrl: text('public_url'),     // optional if using public bucket
  // Metadata
  durationMs: integer('duration_ms'),
  width: integer('width'),
  height: integer('height'),
  provider: text('provider'), // e.g., 'pexels', 'openai', 'elevenlabs'
  providerRef: text('provider_ref'), // external ID/reference
  metadata: jsonb('metadata').$type<Record<string, any>>().default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  projectIdx: index('ai_assets_project_idx').on(table.projectId),
  typeIdx: index('ai_assets_type_idx').on(table.type),
}));

// Optional: regeneration requests (per-step)
export const aiRegenerationRequests = pgTable('ai_regeneration_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => aiVideoProjects.id, { onDelete: 'cascade' }),
  step: text('step').notNull(), // 'script' | 'voiceover' | 'broll' | 'captions' | 'render'
  reason: text('reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
