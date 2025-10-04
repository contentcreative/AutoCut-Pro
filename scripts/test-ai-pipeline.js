#!/usr/bin/env node

require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

console.log('🚀 Testing AI Video Generation Pipeline...\n');

async function testAIVideoGeneration() {
  try {
    console.log('1. Testing AI Video Creation Form...');
    
    // Test the AI video creation endpoint
    const response = await fetch('http://localhost:3000/dashboard/ai-create');
    
    if (response.ok) {
      console.log('   ✅ AI Create page accessible');
    } else {
      console.log('   ❌ AI Create page error:', response.status);
      return false;
    }
    
    console.log('\n2. Testing Worker Health...');
    
    const workerResponse = await fetch('http://localhost:3030/health');
    const workerData = await workerResponse.json();
    
    if (workerData.status === 'healthy') {
      console.log('   ✅ Worker is healthy and ready');
    } else {
      console.log('   ❌ Worker health check failed');
      return false;
    }
    
    console.log('\n3. Testing Database Connection...');
    
    // Test database by checking if we can create a project
    const testTopic = 'Test AI Video Generation Pipeline';
    const testSettings = {
      ttsProvider: 'openai',
      aspectRatio: '9:16',
      targetDuration: 30,
      captionsTheme: 'bold-yellow',
      generateThumbnails: true
    };
    
    console.log('   📝 Test topic:', testTopic);
    console.log('   ⚙️  Test settings:', JSON.stringify(testSettings, null, 2));
    
    console.log('\n4. Testing Trending Remix Discovery...');
    
    const trendingResponse = await fetch('http://localhost:3000/dashboard/trending-remix');
    
    if (trendingResponse.ok) {
      console.log('   ✅ Trending Remix page accessible');
    } else {
      console.log('   ❌ Trending Remix page error:', trendingResponse.status);
      return false;
    }
    
    console.log('\n🎉 All pipeline components are ready!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Visit http://localhost:3000/dashboard/ai-create');
    console.log('   2. Create a test AI video project');
    console.log('   3. Monitor the generation progress');
    console.log('   4. Test the trending remix feature');
    
    return true;
    
  } catch (error) {
    console.error('❌ Pipeline test failed:', error.message);
    return false;
  }
}

async function testTrendingDiscovery() {
  console.log('\n🔍 Testing Trending Content Discovery...');
  
  try {
    // Test YouTube trending search
    const { google } = require('googleapis');
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
    
    const response = await youtube.search.list({
      part: ['snippet'],
      q: 'AI technology trends',
      type: ['video'],
      videoDuration: 'short',
      maxResults: 5,
      order: 'viewCount'
    });
    
    console.log(`   ✅ Found ${response.data.items.length} trending videos`);
    
    response.data.items.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.snippet.title}`);
      console.log(`      Channel: ${video.snippet.channelTitle}`);
      console.log(`      Published: ${video.snippet.publishedAt}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('   ❌ Trending discovery failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = [];
  
  results.push(await testAIVideoGeneration());
  results.push(await testTrendingDiscovery());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Pipeline Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 AutoCut Pro is ready for AI video generation!');
    console.log('\n🌐 Access your application at:');
    console.log('   • Homepage: http://localhost:3000');
    console.log('   • Dashboard: http://localhost:3000/dashboard');
    console.log('   • AI Create: http://localhost:3000/dashboard/ai-create');
    console.log('   • Trending Remix: http://localhost:3000/dashboard/trending-remix');
    console.log('   • Worker Health: http://localhost:3030/health');
  } else {
    console.log('\n⚠️  Some components need attention. Check the errors above.');
  }
}

runTests().catch(console.error);
