const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testTrendingSearchDebug() {
  console.log('🔍 DEBUGGING TRENDING SEARCH ISSUE');
  console.log('');

  // Check environment variables
  console.log('1. 📋 Environment Variables:');
  console.log(`   YOUTUBE_API_KEY: ${process.env.YOUTUBE_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  // Check if trending tables exist
  console.log('2. 🗄️ Database Tables Check:');
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if trending_videos table exists
    const { data: trendingVideos, error: trendingError } = await supabase
      .from('trending_videos')
      .select('id')
      .limit(1);

    if (trendingError) {
      console.log(`   ❌ trending_videos table: ${trendingError.message}`);
    } else {
      console.log(`   ✅ trending_videos table: Exists`);
    }

    // Check if remix_jobs table exists
    const { data: remixJobs, error: remixError } = await supabase
      .from('remix_jobs')
      .select('id')
      .limit(1);

    if (remixError) {
      console.log(`   ❌ remix_jobs table: ${remixError.message}`);
    } else {
      console.log(`   ✅ remix_jobs table: Exists`);
    }

    // Check if trending_fetch_runs table exists
    const { data: fetchRuns, error: fetchError } = await supabase
      .from('trending_fetch_runs')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.log(`   ❌ trending_fetch_runs table: ${fetchError.message}`);
    } else {
      console.log(`   ✅ trending_fetch_runs table: Exists`);
    }

  } catch (error) {
    console.log(`   ❌ Database connection error: ${error.message}`);
  }

  console.log('');

  // Test YouTube API directly
  console.log('3. 🎬 YouTube API Test:');
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const { google } = require('googleapis');
      const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY,
      });

      const response = await youtube.search.list({
        part: ['snippet'],
        q: 'test',
        type: ['video'],
        videoDuration: 'short',
        maxResults: 1,
      });

      if (response.data.items && response.data.items.length > 0) {
        console.log('   ✅ YouTube API: Working');
        console.log(`   📹 Found ${response.data.items.length} test video(s)`);
      } else {
        console.log('   ⚠️ YouTube API: Working but no results');
      }
    } catch (error) {
      console.log(`   ❌ YouTube API Error: ${error.message}`);
    }
  } else {
    console.log('   ❌ YouTube API: No API key');
  }

  console.log('');

  // Test server action import
  console.log('4. 🔧 Server Action Test:');
  try {
    // This will test if the action can be imported
    const { fetchAndUpsertTrending } = require('../actions/trending-remix-actions.ts');
    console.log('   ✅ fetchAndUpsertTrending: Imported successfully');
  } catch (error) {
    console.log(`   ❌ fetchAndUpsertTrending: ${error.message}`);
  }

  console.log('');
  console.log('🎯 DIAGNOSIS:');
  console.log('');

  if (!process.env.YOUTUBE_API_KEY) {
    console.log('❌ ISSUE: Missing YOUTUBE_API_KEY');
    console.log('   Solution: Add YouTube API key to .env.local');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ ISSUE: Missing Supabase credentials');
    console.log('   Solution: Check Supabase environment variables');
  }

  console.log('');
  console.log('💡 NEXT STEPS:');
  console.log('1. Check if trending tables exist in database');
  console.log('2. Verify YouTube API key is valid');
  console.log('3. Test the search button with browser dev tools');
  console.log('4. Check console for any JavaScript errors');
}

testTrendingSearchDebug();
