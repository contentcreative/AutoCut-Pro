-- Create trending remix tables directly in Supabase
-- This avoids Drizzle migration conflicts

-- Create enums (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE trending_video_platform AS ENUM ('youtube', 'tiktok', 'instagram');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trending_remix_job_status AS ENUM ('queued','processing','completed','failed','cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trending_remix_job_step AS ENUM ('init','fetch_transcript','rewrite_script','tts','assemble','upload','done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create trending_videos table
CREATE TABLE IF NOT EXISTS trending_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform trending_video_platform NOT NULL,
    source_video_id TEXT NOT NULL,
    niche TEXT NOT NULL,
    title TEXT NOT NULL,
    creator_handle TEXT,
    thumbnail_url TEXT,
    permalink TEXT NOT NULL,
    duration_seconds INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    shares_count BIGINT DEFAULT 0,
    virality_score NUMERIC(8,4) DEFAULT 0 NOT NULL,
    score_breakdown JSONB,
    raw JSONB,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT uniq_platform_source UNIQUE(platform, source_video_id)
);

-- Create indexes for trending_videos
CREATE INDEX IF NOT EXISTS idx_trending_niche ON trending_videos(niche);
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending_videos(virality_score);
CREATE INDEX IF NOT EXISTS idx_trending_published ON trending_videos(published_at);

-- Create remix_jobs table
CREATE TABLE IF NOT EXISTS remix_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    trending_video_id UUID REFERENCES trending_videos(id) ON DELETE SET NULL,
    niche TEXT,
    status trending_remix_job_status NOT NULL DEFAULT 'queued',
    step trending_remix_job_step DEFAULT 'init',
    options JSONB,
    rewritten_script TEXT,
    transcript_url TEXT,
    output_video_url TEXT,
    output_thumbnail_url TEXT,
    voice_model TEXT,
    aspect_ratio TEXT,
    duration_seconds INTEGER,
    tokens_used INTEGER DEFAULT 0,
    tts_seconds INTEGER DEFAULT 0,
    cost_estimate_cents INTEGER DEFAULT 0,
    error TEXT,
    internal_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for remix_jobs
CREATE INDEX IF NOT EXISTS idx_remix_user ON remix_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_remix_status ON remix_jobs(status);
CREATE INDEX IF NOT EXISTS idx_remix_trending ON remix_jobs(trending_video_id);

-- Create trending_fetch_runs table
CREATE TABLE IF NOT EXISTS trending_fetch_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform trending_video_platform NOT NULL,
    niche TEXT NOT NULL,
    total_found INTEGER DEFAULT 0,
    total_inserted INTEGER DEFAULT 0,
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for trending_fetch_runs
CREATE INDEX IF NOT EXISTS idx_fetch_niche_platform ON trending_fetch_runs(niche, platform);

-- Enable RLS (Row Level Security)
ALTER TABLE trending_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE remix_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_fetch_runs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on trending_videos" ON trending_videos FOR ALL USING (true);
CREATE POLICY "Allow all operations on remix_jobs" ON remix_jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on trending_fetch_runs" ON trending_fetch_runs FOR ALL USING (true);

-- Add update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to remix_jobs
DROP TRIGGER IF EXISTS update_remix_jobs_updated_at ON remix_jobs;
CREATE TRIGGER update_remix_jobs_updated_at
    BEFORE UPDATE ON remix_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
