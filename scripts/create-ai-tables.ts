import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAITables() {
  console.log('🚀 Creating AI Video tables in Supabase...');
  
  try {
    // Create AI Video Projects table
    const { error: projectsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_video_projects (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id text NOT NULL,
          topic text NOT NULL,
          status text DEFAULT 'queued' NOT NULL,
          tts_provider text DEFAULT 'elevenlabs' NOT NULL,
          voice_style text DEFAULT 'narration_female' NOT NULL,
          captions_theme text DEFAULT 'bold-yellow' NOT NULL,
          aspect_ratio text DEFAULT '9:16' NOT NULL,
          target_duration_sec integer DEFAULT 30 NOT NULL,
          language text DEFAULT 'en' NOT NULL,
          seed integer,
          duration_ms integer,
          width integer,
          height integer,
          error_message text,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        );
      `
    });
    
    if (projectsError) console.log('Projects table error:', projectsError.message);
    else console.log('✅ AI Video Projects table created');

    // Create AI Generation Jobs table
    const { error: jobsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_generation_jobs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id uuid NOT NULL,
          status text DEFAULT 'queued' NOT NULL,
          current_step text DEFAULT 'queued' NOT NULL,
          progress_pct integer DEFAULT 0 NOT NULL,
          error_message text,
          worker_id text,
          started_at timestamp with time zone,
          finished_at timestamp with time zone,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        );
      `
    });
    
    if (jobsError) console.log('Jobs table error:', jobsError.message);
    else console.log('✅ AI Generation Jobs table created');

    // Create AI Assets table
    const { error: assetsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_assets (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id uuid NOT NULL,
          type text NOT NULL,
          status text DEFAULT 'queued' NOT NULL,
          storage_path text,
          public_url text,
          duration_ms integer,
          width integer,
          height integer,
          provider text,
          provider_ref text,
          metadata jsonb DEFAULT '{}'::jsonb,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        );
      `
    });
    
    if (assetsError) console.log('Assets table error:', assetsError.message);
    else console.log('✅ AI Assets table created');

    console.log('🎉 AI Video tables setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAITables();
