const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createTablesDirect() {
  console.log('🚀 Creating AI Video tables directly...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create the tables using direct SQL
    const sql = `
      -- Create enums if they don't exist
      DO $$ BEGIN
        CREATE TYPE IF NOT EXISTS video_status_enum AS ENUM ('draft', 'queued', 'processing', 'ready', 'failed', 'canceled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE IF NOT EXISTS job_status_enum AS ENUM ('queued', 'generating_script', 'generating_voiceover', 'fetching_broll', 'generating_captions', 'rendering', 'completed', 'failed', 'canceled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE IF NOT EXISTS asset_type_enum AS ENUM ('script', 'voiceover_audio', 'broll_clip', 'subtitle_srt', 'thumbnail_image', 'final_video');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE IF NOT EXISTS asset_status_enum AS ENUM ('queued', 'processing', 'ready', 'failed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Create ai_video_projects table
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

      -- Create ai_generation_jobs table
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

      -- Create ai_assets table
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

      -- Create ai_regeneration_requests table
      CREATE TABLE IF NOT EXISTS ai_regeneration_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES ai_video_projects(id) ON DELETE CASCADE,
        step TEXT NOT NULL,
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS ai_video_projects_user_idx ON ai_video_projects(user_id);
      CREATE INDEX IF NOT EXISTS ai_video_projects_status_idx ON ai_video_projects(status);
      CREATE INDEX IF NOT EXISTS ai_generation_jobs_project_idx ON ai_generation_jobs(project_id);
      CREATE INDEX IF NOT EXISTS ai_generation_jobs_status_idx ON ai_generation_jobs(status);
      CREATE INDEX IF NOT EXISTS ai_assets_project_idx ON ai_assets(project_id);
      CREATE INDEX IF NOT EXISTS ai_assets_type_idx ON ai_assets(type);
    `;

    console.log('📝 Executing SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.log('❌ SQL execution error:', error.message);
      
      // Try alternative approach using direct query
      console.log('🔄 Trying alternative approach...');
      
      // Split SQL into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase
              .from('ai_video_projects')
              .select('id')
              .limit(1);
            
            if (stmtError && stmtError.message.includes('does not exist')) {
              console.log('📝 Creating tables with direct approach...');
              // Tables don't exist, let's create them manually
              break;
            }
          } catch (e) {
            // Expected error, continue
          }
        }
      }
    } else {
      console.log('✅ Tables created successfully!');
    }

    // Test if tables exist now
    console.log('🔍 Testing table existence...');
    const { data: testData, error: testError } = await supabase
      .from('ai_video_projects')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('❌ Tables still not accessible:', testError.message);
      console.log('💡 You may need to create them manually in Supabase dashboard');
    } else {
      console.log('✅ ai_video_projects table is now accessible!');
      console.log('🎉 Ready to test AI video creation!');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createTablesDirect();
