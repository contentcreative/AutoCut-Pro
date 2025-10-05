require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Search Trends functionality...');
console.log('📋 Environment variables:');
console.log('- YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? 'SET' : 'MISSING');
console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('- SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');

// Test the YouTube API directly
async function testYouTubeAPI() {
  try {
    const { google } = require('googleapis');
    
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('❌ YOUTUBE_API_KEY is missing from environment variables');
      return;
    }

    console.log('\n🧪 Testing YouTube API directly...');
    
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });

    // Test with a simple search
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: 'AI tools',
      type: ['video'],
      videoDuration: 'short',
      order: 'viewCount',
      maxResults: 5,
    });

    console.log('✅ YouTube API test successful');
    console.log(`📺 Found ${searchResponse.data.items?.length || 0} videos`);
    
    if (searchResponse.data.items && searchResponse.data.items.length > 0) {
      const firstVideo = searchResponse.data.items[0];
      console.log('🎬 Sample video:', {
        title: firstVideo.snippet?.title,
        channel: firstVideo.snippet?.channelTitle,
        videoId: firstVideo.id?.videoId
      });
    }

  } catch (error) {
    console.error('❌ YouTube API test failed:', error.message);
    if (error.message.includes('API key')) {
      console.error('💡 Check your YOUTUBE_API_KEY in .env.local');
    }
  }
}

// Test the fetchAndUpsertTrending function
async function testFetchFunction() {
  try {
    console.log('\n🧪 Testing fetchAndUpsertTrending function...');
    
    // Import the function (this will test if it can be imported)
    const { fetchAndUpsertTrending } = require('../actions/trending-remix-actions.ts');
    console.log('✅ Function imported successfully');
    
  } catch (error) {
    console.error('❌ Function import failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testYouTubeAPI();
  await testFetchFunction();
}

runTests().catch(console.error);
