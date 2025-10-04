import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAIVideoTables() {
  console.log('🚀 Creating AI Video tables in Supabase...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'db/migrations/0008_ai_video_features.sql');
    const sqlScript = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('✅ Connected to database');
    console.log('📝 Executing SQL script...');
    
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      return;
    }
    
    console.log('✅ AI Video tables created successfully!');
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'ai_video_projects',
        'ai_generation_jobs', 
        'ai_assets',
        'ai_regeneration_requests',
        'trending_videos',
        'remix_jobs',
        'trending_fetch_runs'
      ]);
    
    if (tablesError) {
      console.error('❌ Error verifying tables:', tablesError);
      return;
    }
    
    console.log('📋 Tables found:');
    tables?.forEach(table => {
      console.log(`  ✅ ${table.table_name}`);
    });
    
    console.log('🎉 AI Video tables setup complete!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Verify tables in Supabase dashboard > Table Editor');
    console.log('2. Test the AI video creation functionality');
    console.log('3. Create some sample data');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAIVideoTables();
