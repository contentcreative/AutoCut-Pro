const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function testDatabaseTables() {
  console.log('🔍 Testing Database Tables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('\n📊 Checking if AI video tables exist...');
    
    // Test ai_video_projects table
    const { data: projects, error: projectsError } = await supabase
      .from('ai_video_projects')
      .select('count')
      .limit(1);
    
    if (projectsError) {
      console.log('❌ ai_video_projects table error:', projectsError.message);
    } else {
      console.log('✅ ai_video_projects table exists');
    }
    
    // Test ai_generation_jobs table
    const { data: jobs, error: jobsError } = await supabase
      .from('ai_generation_jobs')
      .select('count')
      .limit(1);
    
    if (jobsError) {
      console.log('❌ ai_generation_jobs table error:', jobsError.message);
    } else {
      console.log('✅ ai_generation_jobs table exists');
    }
    
    // Test ai_assets table
    const { data: assets, error: assetsError } = await supabase
      .from('ai_assets')
      .select('count')
      .limit(1);
    
    if (assetsError) {
      console.log('❌ ai_assets table error:', assetsError.message);
    } else {
      console.log('✅ ai_assets table exists');
    }
    
    console.log('\n🎯 If any tables are missing, run the SQL script in Supabase!');
    
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
}

testDatabaseTables();
