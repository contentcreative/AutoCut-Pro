-- Create enums for AI Video features
CREATE TYPE "public"."video_status_enum" AS ENUM('draft', 'queued', 'processing', 'ready', 'failed', 'canceled');
CREATE TYPE "public"."job_status_enum" AS ENUM('queued', 'generating_script', 'generating_voiceover', 'fetching_broll', 'generating_captions', 'rendering', 'completed', 'failed', 'canceled');
CREATE TYPE "public"."asset_type_enum" AS ENUM('script', 'voiceover_audio', 'broll_clip', 'subtitle_srt', 'thumbnail_image', 'final_video');
CREATE TYPE "public"."asset_status_enum" AS ENUM('queued', 'processing', 'ready', 'failed');
CREATE TYPE "public"."platform" AS ENUM('youtube', 'tiktok', 'instagram');
CREATE TYPE "public"."remix_job_status" AS ENUM('queued','processing','completed','failed','cancelled');
CREATE TYPE "public"."remix_job_step" AS ENUM('init','fetch_transcript','rewrite_script','tts','assemble','upload','done');

-- AI Video Projects table
CREATE TABLE IF NOT EXISTS "ai_video_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"topic" text NOT NULL,
	"status" "video_status_enum" DEFAULT 'queued' NOT NULL,
	"tts_provider" text DEFAULT 'elevenlabs' NOT NULL,
	"voice_style" text DEFAULT 'narration_female' NOT NULL,
	"captions_theme" text DEFAULT 'bold-yellow' NOT NULL,
	"aspect_ratio" text DEFAULT '9:16' NOT NULL,
	"target_duration_sec" integer DEFAULT 30 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"seed" integer,
	"duration_ms" integer,
	"width" integer,
	"height" integer,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- AI Generation Jobs table
CREATE TABLE IF NOT EXISTS "ai_generation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"status" "job_status_enum" DEFAULT 'queued' NOT NULL,
	"current_step" text DEFAULT 'queued' NOT NULL,
	"progress_pct" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"worker_id" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- AI Assets table
CREATE TABLE IF NOT EXISTS "ai_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" "asset_type_enum" NOT NULL,
	"status" "asset_status_enum" DEFAULT 'queued' NOT NULL,
	"storage_path" text,
	"public_url" text,
	"duration_ms" integer,
	"width" integer,
	"height" integer,
	"provider" text,
	"provider_ref" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- AI Regeneration Requests table
CREATE TABLE IF NOT EXISTS "ai_regeneration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"step" text NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Trending Videos table
CREATE TABLE IF NOT EXISTS "trending_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "platform" NOT NULL,
	"source_video_id" text NOT NULL,
	"niche" text NOT NULL,
	"title" text NOT NULL,
	"creator_handle" text,
	"thumbnail_url" text,
	"permalink" text NOT NULL,
	"duration_seconds" integer,
	"published_at" timestamp with time zone,
	"views_count" bigint DEFAULT 0,
	"likes_count" bigint DEFAULT 0,
	"comments_count" bigint DEFAULT 0,
	"shares_count" bigint DEFAULT 0,
	"virality_score" numeric(8, 4) DEFAULT '0' NOT NULL,
	"score_breakdown" jsonb,
	"raw" jsonb,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Remix Jobs table
CREATE TABLE IF NOT EXISTS "remix_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"trending_video_id" uuid,
	"niche" text,
	"status" "remix_job_status" DEFAULT 'queued' NOT NULL,
	"step" "remix_job_step" DEFAULT 'init',
	"options" jsonb,
	"rewritten_script" text,
	"transcript_url" text,
	"output_video_url" text,
	"output_thumbnail_url" text,
	"voice_model" text,
	"aspect_ratio" text,
	"duration_seconds" integer,
	"tokens_used" integer DEFAULT 0,
	"tts_seconds" integer DEFAULT 0,
	"cost_estimate_cents" integer DEFAULT 0,
	"error" text,
	"internal_only" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);

-- Trending Fetch Runs table
CREATE TABLE IF NOT EXISTS "trending_fetch_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "platform" NOT NULL,
	"niche" text NOT NULL,
	"total_found" integer DEFAULT 0,
	"total_inserted" integer DEFAULT 0,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "ai_generation_jobs" ADD CONSTRAINT "ai_generation_jobs_project_id_ai_video_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ai_video_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ai_assets" ADD CONSTRAINT "ai_assets_project_id_ai_video_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ai_video_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ai_regeneration_requests" ADD CONSTRAINT "ai_regeneration_requests_project_id_ai_video_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ai_video_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "remix_jobs" ADD CONSTRAINT "remix_jobs_trending_video_id_trending_videos_id_fk" FOREIGN KEY ("trending_video_id") REFERENCES "public"."trending_videos"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "ai_video_projects_user_idx" ON "ai_video_projects" ("user_id");
CREATE INDEX IF NOT EXISTS "ai_video_projects_status_idx" ON "ai_video_projects" ("status");
CREATE INDEX IF NOT EXISTS "ai_generation_jobs_project_idx" ON "ai_generation_jobs" ("project_id");
CREATE INDEX IF NOT EXISTS "ai_generation_jobs_status_idx" ON "ai_generation_jobs" ("status");
CREATE INDEX IF NOT EXISTS "ai_assets_project_idx" ON "ai_assets" ("project_id");
CREATE INDEX IF NOT EXISTS "ai_assets_type_idx" ON "ai_assets" ("type");
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_platform_source" ON "trending_videos" ("platform","source_video_id");
CREATE INDEX IF NOT EXISTS "idx_trending_niche" ON "trending_videos" ("niche");
CREATE INDEX IF NOT EXISTS "idx_trending_score" ON "trending_videos" ("virality_score");
CREATE INDEX IF NOT EXISTS "idx_trending_published" ON "trending_videos" ("published_at");
CREATE INDEX IF NOT EXISTS "idx_remix_user" ON "remix_jobs" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_remix_status" ON "remix_jobs" ("status");
CREATE INDEX IF NOT EXISTS "idx_remix_trending" ON "remix_jobs" ("trending_video_id");
CREATE INDEX IF NOT EXISTS "idx_fetch_niche_platform" ON "trending_fetch_runs" ("niche","platform");
