const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

async function testFullPipeline() {
  console.log('🎬 Testing Full AI Video Generation Pipeline');
  console.log('');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test data
  const testUserId = 'test-user-' + Date.now();
  const testTopic = 'The Future of Artificial Intelligence';
  const projectId = uuidv4();
  const jobId = uuidv4();
  
  console.log('📋 Test Configuration:');
  console.log(`   User ID: ${testUserId}`);
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Job ID: ${jobId}`);
  console.log(`   Topic: "${testTopic}"`);
  console.log('');
  
  try {
    // Step 1: Create AI video project
    console.log('1️⃣ Creating AI video project...');
    const { data: project, error: projectError } = await supabase
      .from('ai_video_projects')
      .insert({
        id: projectId,
        user_id: testUserId,
        topic: testTopic,
        status: 'queued',
        tts_provider: 'openai',
        voice_style: 'narration_female',
        captions_theme: 'bold-yellow',
        aspect_ratio: '9:16',
        target_duration_sec: 30,
        language: 'en'
      })
      .select()
      .single();
    
    if (projectError) {
      console.log('❌ Project creation failed:', projectError.message);
      return;
    }
    console.log('✅ Project created successfully');
    
    // Step 2: Create generation job
    console.log('\n2️⃣ Creating generation job...');
    const { data: job, error: jobError } = await supabase
      .from('ai_generation_jobs')
      .insert({
        id: jobId,
        project_id: projectId,
        status: 'queued',
        current_step: 'queued',
        progress_pct: 0
      })
      .select()
      .single();
    
    if (jobError) {
      console.log('❌ Job creation failed:', jobError.message);
      return;
    }
    console.log('✅ Job created successfully');
    
    // Step 3: Test storage bucket access
    console.log('\n3️⃣ Testing storage bucket access...');
    const testContent = Buffer.from('Test audio content');
    const { error: uploadError } = await supabase.storage
      .from('ai-audio')
      .upload(`${projectId}/test-audio.mp3`, testContent, {
        contentType: 'audio/mpeg'
      });
    
    if (uploadError) {
      console.log('❌ Storage upload failed:', uploadError.message);
      return;
    }
    console.log('✅ Storage upload successful');
    
    // Step 4: Call worker to process the job
    console.log('\n4️⃣ Calling worker to process job...');
    const workerResponse = await fetch('http://localhost:3030/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.WORKER_API_KEY || 'dev-secret'
      },
      body: JSON.stringify({
        jobId: jobId,
        projectId: projectId,
        inputTopic: testTopic,
        settings: {
          voiceStyle: 'narration_female',
          aspectRatio: '9:16',
          targetDurationSec: 30,
          captionsTheme: 'bold-yellow'
        }
      })
    });
    
    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.log('❌ Worker request failed:', workerResponse.status, errorText);
      return;
    }
    
    console.log('✅ Worker request successful');
    console.log('\n🎯 Pipeline test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Check the worker terminal for processing logs');
    console.log('2. Monitor the job status in the database');
    console.log('3. Try the UI button - it should work now!');
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('ai_generation_jobs').delete().eq('id', jobId);
    await supabase.from('ai_video_projects').delete().eq('id', projectId);
    await supabase.storage.from('ai-audio').remove([`${projectId}/test-audio.mp3`]);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.log('❌ Pipeline test failed:', error.message);
  }
}

testFullPipeline();
