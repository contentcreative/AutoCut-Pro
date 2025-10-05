require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testTrendingSearch() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('🔍 Testing trending search functionality...\n');

  // Check if trending_videos table has any data
  const { data: videos, error: videosError } = await supabase
    .from('trending_videos')
    .select('*')
    .limit(5);

  if (videosError) {
    console.log('❌ Error fetching trending videos:', videosError.message);
  } else {
    console.log(`✅ Found ${videos.length} trending videos in database:`);
    videos.forEach((video, i) => {
      console.log(`   ${i + 1}. ${video.title} (${video.platform}) - Score: ${video.virality_score}`);
    });
  }

  console.log('');

  // Check if remix_jobs table has any data
  const { data: jobs, error: jobsError } = await supabase
    .from('remix_jobs')
    .select('*')
    .limit(5);

  if (jobsError) {
    console.log('❌ Error fetching remix jobs:', jobsError.message);
  } else {
    console.log(`✅ Found ${jobs.length} remix jobs in database:`);
    jobs.forEach((job, i) => {
      console.log(`   ${i + 1}. Niche: ${job.niche} - Status: ${job.status}`);
    });
  }

  console.log('\n✨ The Search Trends button should now:');
  console.log('   1. Accept a niche/topic input');
  console.log('   2. Call fetchAndUpsertTrending server action');
  console.log('   3. Fetch data from YouTube API (or use mock data if API fails)');
  console.log('   4. Store results in trending_videos table');
  console.log('   5. Display results in the UI table');
  console.log('\n📝 Try searching for: "AI tools", "Fitness", or "Cooking"');
}

testTrendingSearch();
