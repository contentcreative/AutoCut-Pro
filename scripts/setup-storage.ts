// Script to set up Supabase Storage buckets for AutoCut Pro
// Run this script to create the required storage buckets

import { config } from 'dotenv';
import { createSupabaseAdminClient } from '../lib/supabase/admin';

// Load environment variables from .env.local
config({ path: '.env.local' });

const BUCKETS = [
  {
    name: 'source-videos',
    description: 'Source videos uploaded by users',
    public: true, // Users need to access their own videos
  },
  {
    name: 'exports',
    description: 'Processed export ZIP files',
    public: false, // Private bucket - only accessible via signed URLs
  },
  {
    name: 'brand-assets',
    description: 'Brand kit assets (logos, overlays, etc.)',
    public: true, // Users can access brand assets
  }
];

async function setupStorageBuckets() {
  const supabase = createSupabaseAdminClient();
  
  console.log('ðŸš€ Setting up Supabase Storage buckets...');
  
  for (const bucket of BUCKETS) {
    try {
      // Check if bucket exists
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);
      
      if (bucketExists) {
        console.log(`âœ… Bucket "${bucket.name}" already exists`);
        continue;
      }
      
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.name === 'source-videos' 
          ? ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
          : bucket.name === 'exports'
          ? ['application/zip']
          : ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
      });
      
      if (error) {
        console.error(`âŒ Error creating bucket "${bucket.name}":`, error.message);
        continue;
      }
      
      console.log(`âœ… Created bucket "${bucket.name}"`);
      
    } catch (error) {
      console.error(`âŒ Error setting up bucket "${bucket.name}":`, error);
    }
  }
  
  console.log('ðŸŽ‰ Storage bucket setup complete!');
  console.log('');
  console.log('ðŸ“‹ Next steps:');
  console.log('1. Go to your Supabase dashboard > Storage');
  console.log('2. Verify the buckets were created');
  console.log('3. Set up RLS policies for each bucket');
  console.log('4. Test file upload/download functionality');
}

// Run the setup
setupStorageBuckets().catch(console.error);