require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkTrendingTables() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🔍 Checking trending tables...');

  try {
    // Check trending_videos table
    const { data: trendingVideos, error: trendingError } = await supabase
      .from('trending_videos')
      .select('count')
      .limit(1);

    if (trendingError) {
      console.log('❌ trending_videos table missing:', trendingError.message);
    } else {
      console.log('✅ trending_videos table exists');
    }

    // Check remix_jobs table
    const { data: remixJobs, error: remixError } = await supabase
      .from('remix_jobs')
      .select('count')
      .limit(1);

    if (remixError) {
      console.log('❌ remix_jobs table missing:', remixError.message);
    } else {
      console.log('✅ remix_jobs table exists');
    }

    // Check trending_fetch_runs table
    const { data: fetchRuns, error: fetchError } = await supabase
      .from('trending_fetch_runs')
      .select('count')
      .limit(1);

    if (fetchError) {
      console.log('❌ trending_fetch_runs table missing:', fetchError.message);
    } else {
      console.log('✅ trending_fetch_runs table exists');
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

checkTrendingTables();
