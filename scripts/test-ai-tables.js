const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testAITables() {
  console.log('🔍 Testing AI Video Tables...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test if ai_video_projects table exists
    const { data: projects, error: projectsError } = await supabase
      .from('ai_video_projects')
      .select('id')
      .limit(1);

    if (projectsError) {
      console.log('❌ ai_video_projects table not found:', projectsError.message);
      console.log('📋 Need to run: npm run db:push');
      return;
    }
    console.log('✅ ai_video_projects table exists');

    // Test if ai_generation_jobs table exists
    const { data: jobs, error: jobsError } = await supabase
      .from('ai_generation_jobs')
      .select('id')
      .limit(1);

    if (jobsError) {
      console.log('❌ ai_generation_jobs table not found:', jobsError.message);
      console.log('📋 Need to run: npm run db:push');
      return;
    }
    console.log('✅ ai_generation_jobs table exists');

    // Test if ai_assets table exists
    const { data: assets, error: assetsError } = await supabase
      .from('ai_assets')
      .select('id')
      .limit(1);

    if (assetsError) {
      console.log('❌ ai_assets table not found:', assetsError.message);
      console.log('📋 Need to run: npm run db:push');
      return;
    }
    console.log('✅ ai_assets table exists');

    console.log('\n🎉 All AI video tables exist and are accessible!');
    console.log('✅ Ready to test AI video creation');

  } catch (error) {
    console.log('❌ Error testing tables:', error.message);
  }
}

testAITables();
