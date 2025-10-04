const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function testWorkerStorage() {
  console.log('🧪 Testing Worker Storage Access...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test each bucket that the worker needs
  const buckets = ['ai-audio', 'ai-videos', 'ai-captions', 'ai-thumbnails', 'ai-temp'];
  
  console.log('\n📦 Testing bucket access...');
  
  for (const bucketName of buckets) {
    try {
      const testContent = Buffer.from(`Test content for ${bucketName}`);
      const testPath = `test-${Date.now()}.txt`;
      
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(testPath, testContent, {
          contentType: 'text/plain'
        });
      
      if (error) {
        console.log(`❌ ${bucketName}: ${error.message}`);
      } else {
        console.log(`✅ ${bucketName}: Upload successful`);
        
        // Clean up test file
        await supabase.storage.from(bucketName).remove([testPath]);
      }
    } catch (err) {
      console.log(`❌ ${bucketName}: Exception - ${err.message}`);
    }
  }
  
  console.log('\n🎯 Storage test complete!');
}

testWorkerStorage();
