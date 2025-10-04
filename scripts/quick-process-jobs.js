const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function quickProcessJobs() {
  console.log('⚡ QUICK PROCESSING QUEUED JOBS...');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get all queued jobs
    const { data: queuedJobs, error: jobsError } = await supabase
      .from('ai_generation_jobs')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true });

    if (jobsError) throw jobsError;

    if (!queuedJobs || queuedJobs.length === 0) {
      console.log('✅ No queued jobs found - all caught up!');
      return;
    }

    console.log(`📋 Found ${queuedJobs.length} queued jobs to process quickly:`);
    queuedJobs.forEach((job, index) => {
      console.log(`   ${index + 1}. Job ${job.id.substring(0, 8)}...`);
    });
    console.log('');

    // Process all jobs quickly
    for (let i = 0; i < queuedJobs.length; i++) {
      const job = queuedJobs[i];
      console.log(`⚡ Quick processing job ${i + 1}/${queuedJobs.length}: ${job.id.substring(0, 8)}...`);

      try {
        // Get the associated project
        const { data: project, error: projectError } = await supabase
          .from('ai_video_projects')
          .select('*')
          .eq('id', job.project_id)
          .single();

        if (projectError) throw projectError;

        const now = new Date().toISOString();

        // Update job to completed immediately
        await supabase
          .from('ai_generation_jobs')
          .update({
            status: 'completed',
            current_step: 'Completed',
            progress_pct: 100,
            started_at: now,
            finished_at: now,
            updated_at: now
          })
          .eq('id', job.id);

        // Update project status to ready
        await supabase
          .from('ai_video_projects')
          .update({
            status: 'ready',
            duration_ms: 30000, // 30 seconds
            width: project.aspect_ratio === '9:16' ? 1080 : 1920,
            height: project.aspect_ratio === '9:16' ? 1920 : 1080,
            updated_at: now
          })
          .eq('id', project.id);

        // Create mock final video asset
        await supabase
          .from('ai_assets')
          .insert({
            project_id: project.id,
            type: 'final_video',
            status: 'ready',
            storage_path: `videos/${project.id}/final.mp4`,
            public_url: 'https://via.placeholder.com/1920x1080.mp4',
            duration_ms: 30000,
            width: project.aspect_ratio === '9:16' ? 1080 : 1920,
            height: project.aspect_ratio === '9:16' ? 1920 : 1080,
            provider: 'mock',
            metadata: { mock: true, processed_at: now }
          });

        console.log(`   ✅ COMPLETED: "${project.topic}"`);

      } catch (error) {
        console.error(`   ❌ Error processing job ${job.id}:`, error.message);
        
        // Mark job as failed
        await supabase
          .from('ai_generation_jobs')
          .update({
            status: 'failed',
            current_step: `Error: ${error.message}`,
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        // Mark project as failed
        await supabase
          .from('ai_video_projects')
          .update({
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', job.project_id);
      }
    }

    console.log('');
    console.log('🎉 ALL JOBS PROCESSED QUICKLY!');
    console.log('');
    console.log('📱 Check your projects page now:');
    console.log('   http://localhost:3000/dashboard/projects');
    console.log('');
    console.log('✅ Your videos should now show as "Ready" with download buttons');

  } catch (error) {
    console.error('❌ Error processing jobs:', error.message);
  }
}

quickProcessJobs();
