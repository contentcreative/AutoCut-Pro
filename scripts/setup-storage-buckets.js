const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function setupStorageBuckets() {
  console.log('🪣 Setting up Supabase Storage Buckets...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Required buckets for AI video generation
  const buckets = [
    { name: 'ai-videos', public: false },
    { name: 'ai-audio', public: false },
    { name: 'ai-captions', public: false },
    { name: 'ai-thumbnails', public: false },
    { name: 'ai-temp', public: false },
    { name: 'exports', public: false },
    { name: 'remixes', public: false },
    { name: 'transcripts', public: false },
    { name: 'scripts', public: false }
  ];
  
  console.log('\n📋 Creating storage buckets...');
  
  for (const bucket of buckets) {
    try {
      console.log(`\n🪣 Creating bucket: ${bucket.name}`);
      
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✅ Bucket '${bucket.name}' already exists`);
        } else {
          console.log(`❌ Error creating bucket '${bucket.name}':`, error.message);
        }
      } else {
        console.log(`✅ Bucket '${bucket.name}' created successfully`);
      }
    } catch (err) {
      console.log(`❌ Exception creating bucket '${bucket.name}':`, err.message);
    }
  }
  
  // List buckets for verification
  try {
    const { data: bucketsList, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.log('❌ Error listing buckets:', listErr.message);
    } else {
      console.log('\n📦 Buckets currently in project:');
      for (const b of bucketsList) {
        console.log(` - ${b.name}`);
      }
    }
  } catch (e) {
    console.log('❌ Exception listing buckets:', e.message);
  }

  console.log('\n🎯 Storage buckets setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Try the AI video generation button again');
  console.log('2. The worker should now be able to upload files');
  console.log('3. Check the terminal for successful uploads');
}

setupStorageBuckets();
