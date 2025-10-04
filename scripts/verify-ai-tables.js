const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifyAITables() {
  console.log('🔍 Verifying AI Video Tables...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Use direct SQL query to check if tables exist
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('ai_video_projects', 'ai_generation_jobs', 'ai_assets', 'ai_regeneration_requests')
        ORDER BY table_name;
      `
    });

    if (error) {
      console.log('❌ Error checking tables:', error.message);
      return;
    }

    console.log('📊 Found tables:', data);
    
    if (data && data.length === 4) {
      console.log('✅ All AI video tables exist!');
      console.log('🎯 Ready to test AI video creation');
      return true;
    } else {
      console.log('⚠️ Some tables missing:', data);
      return false;
    }

  } catch (error) {
    console.log('❌ Error verifying tables:', error.message);
    return false;
  }
}

verifyAITables();
