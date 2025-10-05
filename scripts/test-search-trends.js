const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSearchTrends() {
  console.log('🔍 Testing Search Trends functionality...');
  
  try {
    // Test 1: Check if trending_videos table exists and has data
    console.log('\n1️⃣ Checking trending_videos table...');
    const { data: videos, error: videosError } = await supabase
      .from('trending_videos')
      .select('*')
      .limit(5);
    
    if (videosError) {
      console.error('❌ Error querying trending_videos:', videosError);
    } else {
      console.log(`✅ Found ${videos?.length || 0} trending videos`);
      if (videos && videos.length > 0) {
        console.log('📺 Sample video:', {
          id: videos[0].id,
          title: videos[0].title,
          niche: videos[0].niche,
          platform: videos[0].platform,
          viralityScore: videos[0].virality_score
        });
      }
    }

    // Test 2: Check if remix_jobs table exists
    console.log('\n2️⃣ Checking remix_jobs table...');
    const { data: jobs, error: jobsError } = await supabase
      .from('remix_jobs')
      .select('*')
      .limit(5);
    
    if (jobsError) {
      console.error('❌ Error querying remix_jobs:', jobsError);
    } else {
      console.log(`✅ Found ${jobs?.length || 0} remix jobs`);
    }

    // Test 3: Check if trending_fetch_runs table exists
    console.log('\n3️⃣ Checking trending_fetch_runs table...');
    const { data: runs, error: runsError } = await supabase
      .from('trending_fetch_runs')
      .select('*')
      .limit(5);
    
    if (runsError) {
      console.error('❌ Error querying trending_fetch_runs:', runsError);
    } else {
      console.log(`✅ Found ${runs?.length || 0} fetch runs`);
    }

    // Test 4: Try to insert a test trending video
    console.log('\n4️⃣ Testing insert functionality...');
    const testVideo = {
      platform: 'youtube',
      source_video_id: 'test_' + Date.now(),
      niche: 'test',
      title: 'Test Video',
      creator_handle: 'test_creator',
      thumbnail_url: 'https://via.placeholder.com/320x180',
      permalink: 'https://youtube.com/watch?v=test',
      duration_seconds: 30,
      published_at: new Date().toISOString(),
      views_count: 1000,
      likes_count: 50,
      comments_count: 10,
      shares_count: 5,
      virality_score: '2.5',
      score_breakdown: { views: 0.35, likes: 0.25, comments: 0.2, shares: 0.2 },
      raw: { test: true }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('trending_videos')
      .insert(testVideo)
      .select();

    if (insertError) {
      console.error('❌ Error inserting test video:', insertError);
    } else {
      console.log('✅ Successfully inserted test video:', insertData[0].id);
      
      // Clean up test data
      await supabase
        .from('trending_videos')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🧹 Cleaned up test data');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSearchTrends();
