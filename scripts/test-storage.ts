// Test script to verify Supabase Storage connection and operations
import { config } from 'dotenv';
import { createSupabaseAdminClient } from '../lib/supabase/admin';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testSupabaseStorage() {
  console.log('ðŸ§ª Testing Supabase Storage connection...');
  
  // Debug: Check environment variables
  console.log('ðŸ” Environment check:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'âœ… Set' : 'âŒ Missing');
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'âœ… Set' : 'âŒ Missing');
  
  try {
    const supabase = createSupabaseAdminClient();
    
    // Test 1: List existing buckets
    console.log('ðŸ“‹ Checking existing buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('âŒ Error listing buckets:', bucketsError.message);
      return;
    }
    
    console.log('âœ… Connected to Supabase Storage');
    console.log('ðŸ“¦ Existing buckets:');
    buckets?.forEach(bucket => {
      console.log(`  - ${bucket.name} (public: ${bucket.public})`);
    });
    
    // Test 2: Check if our required buckets exist
    const requiredBuckets = ['source-videos', 'exports', 'brand-assets'];
    const existingBucketNames = buckets?.map(b => b.name) || [];
    
    console.log('');
    console.log('ðŸŽ¯ Checking required buckets:');
    requiredBuckets.forEach(bucketName => {
      if (existingBucketNames.includes(bucketName)) {
        console.log(`âœ… ${bucketName} - exists`);
      } else {
        console.log(`âŒ ${bucketName} - missing`);
      }
    });
    
    console.log('');
    console.log('ðŸŽ‰ Supabase Storage test complete!');
    
  } catch (error) {
    console.error('âŒ Test failed:', error);
  }
}

// Run the test
testSupabaseStorage().catch(console.error);