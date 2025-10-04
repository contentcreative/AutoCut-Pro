const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function checkVideoAssets() {
  console.log('🔍 CHECKING REAL VIDEO ASSETS IN DATABASE...');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check AI assets table
    console.log('📹 AI Assets in database:');
    const { data: assets, error: assetsError } = await supabase
      .from('ai_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (assetsError) throw assetsError;

    if (assets && assets.length > 0) {
      console.log(`   Found ${assets.length} assets:`);
      assets.forEach((asset, index) => {
        console.log(`   ${index + 1}. Type: ${asset.type}`);
        console.log(`      Project ID: ${asset.project_id}`);
        console.log(`      Status: ${asset.status}`);
        console.log(`      Storage Path: ${asset.storage_path}`);
        console.log(`      Public URL: ${asset.public_url}`);
        console.log(`      Provider: ${asset.provider}`);
        console.log(`      Duration: ${asset.duration_ms}ms`);
        console.log(`      Created: ${new Date(asset.created_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('   ❌ No assets found');
    }

    console.log('');

    // Check projects with their assets
    console.log('🎬 Projects with their assets:');
    const { data: projects, error: projectsError } = await supabase
      .from('ai_video_projects')
      .select(`
        *,
        ai_assets (*)
      `)
      .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;

    if (projects && projects.length > 0) {
      console.log(`   Found ${projects.length} projects:`);
      projects.forEach((project, index) => {
        console.log(`   ${index + 1}. "${project.topic}"`);
        console.log(`      Status: ${project.status}`);
        console.log(`      Duration: ${project.duration_ms}ms (${Math.round(project.duration_ms / 1000)}s)`);
        console.log(`      Aspect Ratio: ${project.aspect_ratio}`);
        console.log(`      Voice Style: ${project.voice_style}`);
        console.log(`      Assets: ${project.ai_assets?.length || 0}`);
        
        if (project.ai_assets && project.ai_assets.length > 0) {
          project.ai_assets.forEach((asset, assetIndex) => {
            console.log(`         ${assetIndex + 1}. ${asset.type} - ${asset.status}`);
            console.log(`            URL: ${asset.public_url || 'No URL'}`);
          });
        }
        console.log('');
      });
    } else {
      console.log('   ❌ No projects found');
    }

    console.log('');

    // Check Supabase Storage buckets
    console.log('🪣 Supabase Storage buckets:');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log(`   ❌ Error: ${bucketsError.message}`);
    } else if (buckets && buckets.length > 0) {
      console.log(`   Found ${buckets.length} buckets:`);
      buckets.forEach((bucket, index) => {
        console.log(`   ${index + 1}. ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    } else {
      console.log('   ❌ No buckets found');
    }

    console.log('');

    // Check files in ai-videos bucket
    console.log('📁 Files in ai-videos bucket:');
    const { data: files, error: filesError } = await supabase.storage
      .from('ai-videos')
      .list('', { limit: 20 });

    if (filesError) {
      console.log(`   ❌ Error: ${filesError.message}`);
    } else if (files && files.length > 0) {
      console.log(`   Found ${files.length} files:`);
      files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`);
      });
    } else {
      console.log('   ❌ No files found in ai-videos bucket');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVideoAssets();
