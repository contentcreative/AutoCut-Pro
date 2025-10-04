const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function clearAllProjects() {
  console.log('🧹 CLEARING ALL PROJECTS FOR FRESH START...');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Clear all AI assets first (due to foreign key constraints)
    console.log('🗑️ Clearing AI assets...');
    const { error: assetsError } = await supabase
      .from('ai_assets')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (assetsError) {
      console.log(`   ⚠️ Assets error: ${assetsError.message}`);
    } else {
      console.log('   ✅ All AI assets cleared');
    }

    // Clear all generation jobs
    console.log('🗑️ Clearing generation jobs...');
    const { error: jobsError } = await supabase
      .from('ai_generation_jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (jobsError) {
      console.log(`   ⚠️ Jobs error: ${jobsError.message}`);
    } else {
      console.log('   ✅ All generation jobs cleared');
    }

    // Clear all AI video projects
    console.log('🗑️ Clearing AI video projects...');
    const { error: projectsError } = await supabase
      .from('ai_video_projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (projectsError) {
      console.log(`   ⚠️ Projects error: ${projectsError.message}`);
    } else {
      console.log('   ✅ All AI video projects cleared');
    }

    console.log('');
    console.log('🎉 DATABASE CLEARED!');
    console.log('');

    // Verify everything is cleared
    console.log('🔍 Verifying cleanup...');
    
    const { data: remainingProjects } = await supabase
      .from('ai_video_projects')
      .select('count(*)')
      .limit(1);

    const { data: remainingJobs } = await supabase
      .from('ai_generation_jobs')
      .select('count(*)')
      .limit(1);

    const { data: remainingAssets } = await supabase
      .from('ai_assets')
      .select('count(*)')
      .limit(1);

    console.log(`   📊 Remaining projects: ${remainingProjects?.[0]?.count || 0}`);
    console.log(`   📊 Remaining jobs: ${remainingJobs?.[0]?.count || 0}`);
    console.log(`   📊 Remaining assets: ${remainingAssets?.[0]?.count || 0}`);

    if ((remainingProjects?.[0]?.count || 0) === 0 && 
        (remainingJobs?.[0]?.count || 0) === 0 && 
        (remainingAssets?.[0]?.count || 0) === 0) {
      console.log('');
      console.log('✅ SUCCESS: Database is completely clean!');
      console.log('');
      console.log('📱 Your projects page will now show:');
      console.log('   - Empty state: "No projects yet"');
      console.log('   - "Create New Video" button');
      console.log('   - Ready for fresh testing');
    } else {
      console.log('');
      console.log('⚠️ Some data may still remain - check manually');
    }

  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
  }
}

clearAllProjects();
