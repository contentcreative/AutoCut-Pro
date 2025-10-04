const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function processQueuedJobs() {
  console.log('🔄 PROCESSING QUEUED AI VIDEO JOBS...');
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

    console.log(`📋 Found ${queuedJobs.length} queued jobs to process:`);
    queuedJobs.forEach((job, index) => {
      console.log(`   ${index + 1}. Job ${job.id.substring(0, 8)}... (Created: ${new Date(job.created_at).toLocaleString()})`);
    });
    console.log('');

    // Process each job
    for (let i = 0; i < queuedJobs.length; i++) {
      const job = queuedJobs[i];
      console.log(`🔄 Processing job ${i + 1}/${queuedJobs.length}: ${job.id.substring(0, 8)}...`);

      try {
        // Get the associated project
        const { data: project, error: projectError } = await supabase
          .from('ai_video_projects')
          .select('*')
          .eq('id', job.project_id)
          .single();

        if (projectError) throw projectError;

        // Simulate processing steps
        const steps = [
          { status: 'generating_script', step: 'Script Generation', progress: 20 },
          { status: 'generating_voiceover', step: 'Voiceover Creation', progress: 40 },
          { status: 'fetching_broll', step: 'B-roll Selection', progress: 60 },
          { status: 'generating_captions', step: 'Caption Generation', progress: 80 },
          { status: 'rendering', step: 'Video Rendering', progress: 95 },
          { status: 'completed', step: 'Completed', progress: 100 }
        ];

        // Update job to processing
        await supabase
          .from('ai_generation_jobs')
          .update({
            status: 'generating_script',
            current_step: 'Script Generation',
            progress_pct: 20,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        // Update project status
        await supabase
          .from('ai_video_projects')
          .update({
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', project.id);

        console.log(`   ✅ Started processing: "${project.topic}"`);

        // Simulate processing time (2-3 seconds per step)
        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

          // Update job progress
          await supabase
            .from('ai_generation_jobs')
            .update({
              status: step.status,
              current_step: step.step,
              progress_pct: step.progress,
              updated_at: new Date().toISOString(),
              ...(step.status === 'completed' && {
                finished_at: new Date().toISOString()
              })
            })
            .eq('id', job.id);

          console.log(`   📈 ${step.step} (${step.progress}%)`);

          // Update project status on completion
          if (step.status === 'completed') {
            await supabase
              .from('ai_video_projects')
              .update({
                status: 'ready',
                duration_ms: 30000, // 30 seconds
                width: project.aspect_ratio === '9:16' ? 1080 : 1920,
                height: project.aspect_ratio === '9:16' ? 1920 : 1080,
                updated_at: new Date().toISOString()
              })
              .eq('id', project.id);

            // Create a mock final video asset
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
                metadata: { mock: true, processed_at: new Date().toISOString() }
              });

            console.log(`   🎉 COMPLETED: "${project.topic}"`);
          }
        }

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

      console.log(''); // Empty line between jobs
    }

    console.log('🎉 ALL QUEUED JOBS PROCESSED!');
    console.log('');
    console.log('📱 Check your projects page now:');
    console.log('   http://localhost:3000/dashboard/projects');
    console.log('');
    console.log('✅ Your videos should now show as "Ready" with mock video URLs');

  } catch (error) {
    console.error('❌ Error processing jobs:', error.message);
  }
}

processQueuedJobs();
