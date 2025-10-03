// Test script to verify worker setup
import { config } from 'dotenv';
import { Client } from 'pg';
import { createSupabaseAdminClient } from '../lib/supabase/admin';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testWorkerSetup() {
  console.log('ðŸ§ª Testing worker setup...');
  
  try {
    // Test database connection
    console.log('ðŸ“Š Testing database connection...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('âœ… Database connection successful');
    
    // Test export_jobs table access
    const result = await client.query('SELECT COUNT(*) as count FROM export_jobs');
    console.log(`âœ… Export jobs table accessible (${result.rows[0].count} jobs)`);
    
    await client.end();
    
    // Test Supabase Storage connection
    console.log('â˜ï¸ Testing Supabase Storage connection...');
    const supabase = createSupabaseAdminClient();
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('âŒ Supabase Storage error:', error.message);
    } else {
      console.log(`âœ… Supabase Storage accessible (${buckets?.length || 0} buckets)`);
    }
    
    // Test FFmpeg availability
    console.log('ðŸŽ¬ Testing FFmpeg availability...');
    try {
      const ffmpegStatic = require('ffmpeg-static');
      if (ffmpegStatic) {
        console.log('âœ… FFmpeg binary found:', ffmpegStatic);
      } else {
        console.log('âŒ FFmpeg binary not found');
      }
    } catch (error) {
      console.error('âŒ FFmpeg test failed:', error);
    }
    
    console.log('');
    console.log('ðŸŽ‰ Worker setup test complete!');
    console.log('');
    console.log('ðŸ“‹ To start the worker:');
    console.log('  npm run worker:dev    # Development mode with auto-reload');
    console.log('  npm run worker:start  # Production mode');
    console.log('');
    console.log('ðŸ“‹ Worker will:');
    console.log('- Listen on port 3030 (or WORKER_PORT env var)');
    console.log('- Process export jobs from the database queue');
    console.log('- Use FFmpeg to process videos and generate thumbnails');
    console.log('- Upload results to Supabase Storage');
    
  } catch (error) {
    console.error('âŒ Worker setup test failed:', error);
  }
}

// Run the test
testWorkerSetup().catch(console.error);