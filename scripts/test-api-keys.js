#!/usr/bin/env node

require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

console.log('🧪 Testing API Key Integrations...\n');

// Test OpenAI API
async function testOpenAI() {
  console.log('1. Testing OpenAI API...');
  if (!process.env.OPENAI_API_KEY) {
    console.log('   ❌ OPENAI_API_KEY not found');
    return false;
  }
  
  try {
    const { OpenAI } = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say 'OpenAI API is working!'" }],
      max_tokens: 10,
    });
    
    console.log('   ✅ OpenAI API working:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.log('   ❌ OpenAI API error:', error.message);
    return false;
  }
}

// Test ElevenLabs API
async function testElevenLabs() {
  console.log('\n2. Testing ElevenLabs API...');
  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('   ❌ ELEVENLABS_API_KEY not found');
    return false;
  }
  
  try {
    // Test with direct API call to verify key works
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ ElevenLabs API working: Found ${data.voices.length} voices`);
      return true;
    } else {
      console.log('   ❌ ElevenLabs API error: HTTP', response.status);
      return false;
    }
  } catch (error) {
    console.log('   ❌ ElevenLabs API error:', error.message);
    return false;
  }
}

// Test YouTube API
async function testYouTube() {
  console.log('\n3. Testing YouTube Data API...');
  if (!process.env.YOUTUBE_API_KEY) {
    console.log('   ❌ YOUTUBE_API_KEY not found');
    return false;
  }
  
  try {
    const { google } = require('googleapis');
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
    
    const response = await youtube.search.list({
      part: ['snippet'],
      q: 'test',
      maxResults: 1,
    });
    
    console.log(`   ✅ YouTube API working: Found ${response.data.items.length} results`);
    return true;
  } catch (error) {
    console.log('   ❌ YouTube API error:', error.message);
    return false;
  }
}

// Test Worker Authentication
function testWorkerAuth() {
  console.log('\n4. Testing Worker Authentication...');
  if (!process.env.WORKER_AUTH_SECRET) {
    console.log('   ❌ WORKER_AUTH_SECRET not found');
    return false;
  }
  if (!process.env.WORKER_WEBHOOK_SECRET) {
    console.log('   ❌ WORKER_WEBHOOK_SECRET not found');
    return false;
  }
  
  console.log('   ✅ Worker auth secrets configured');
  return true;
}

// Run all tests
async function runTests() {
  const results = [];
  
  results.push(await testOpenAI());
  results.push(await testElevenLabs());
  results.push(await testYouTube());
  results.push(testWorkerAuth());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} APIs working`);
  
  if (passed === total) {
    console.log('🎉 All API keys are working correctly!');
  } else {
    console.log('⚠️  Some API keys need attention. Check the errors above.');
  }
}

runTests().catch(console.error);
