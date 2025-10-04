const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createAITables() {
  console.log('🚀 Creating AI Video tables...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create enums first
    console.log('📝 Creating enums...');
    
    await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE video_status_enum AS ENUM ('draft', 'queued', 'processing', 'ready', 'failed', 'canceled');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    });

    await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE job_status_enum AS ENUM ('queued', 'generating_script', 'generating_voiceover', 'fetching_broll', 'generating_captions', 'rendering', 'completed', 'failed', 'canceled');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    });

    await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE asset_type_enum AS ENUM ('script', 'voiceover_audio', 'broll_clip', 'subtitle_srt', 'thumbnail_image', 'final_video');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    });

    await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE asset_status_enum AS ENUM ('queued', 'processing', 'ready', 'failed');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    });

    console.log('✅ Enums created');

    // Create ai_video_projects table
    console.log('📝 Creating ai_video_projects table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_video_projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          topic TEXT NOT NULL,
          status video_status_enum NOT NULL DEFAULT 'queued',
          tts_provider TEXT NOT NULL DEFAULT 'elevenlabs',
          voice_style TEXT NOT NULL DEFAULT 'narration_female',
          captions_theme TEXT NOT NULL DEFAULT 'bold-yellow',
          aspect_ratio TEXT NOT NULL DEFAULT '9:16',
          target_duration_sec INTEGER NOT NULL DEFAULT 30,
          language TEXT NOT NULL DEFAULT 'en',
          seed INTEGER,
          duration_ms INTEGER,
          width INTEGER,
          height INTEGER,
          error_message TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `
    });

    // Create ai_generation_jobs table
    console.log('📝 Creating ai_generation_jobs table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_generation_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID NOT NULL REFERENCES ai_video_projects(id) ON DELETE CASCADE,
          status job_status_enum NOT NULL DEFAULT 'queued',
          current_step TEXT NOT NULL DEFAULT 'queued',
          progress_pct INTEGER NOT NULL DEFAULT 0,
          error_message TEXT,
          worker_id TEXT,
          started_at TIMESTAMP WITH TIME ZONE,
          finished_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `
    });

    // Create ai_assets table
    console.log('📝 Creating ai_assets table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_assets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID NOT NULL REFERENCES ai_video_projects(id) ON DELETE CASCADE,
          type asset_type_enum NOT NULL,
          status asset_status_enum NOT NULL DEFAULT 'queued',
          storage_path TEXT,
          public_url TEXT,
          duration_ms INTEGER,
          width INTEGER,
          height INTEGER,
          provider TEXT,
          provider_ref TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `
    });

    // Create ai_regeneration_requests table
    console.log('📝 Creating ai_regeneration_requests table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_regeneration_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID NOT NULL REFERENCES ai_video_projects(id) ON DELETE CASCADE,
          step TEXT NOT NULL,
          reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `
    });

    console.log('✅ All AI video tables created successfully!');

  } catch (error) {
    console.log('❌ Error creating tables:', error.message);
  }
}

createAITables();
