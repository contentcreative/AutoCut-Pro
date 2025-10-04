const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

async function debugQueuedJobs() {
  console.log('🔍 DEBUGGING QUEUED JOBS...');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check all jobs regardless of status
    console.log('📊 All AI generation jobs:');
    const { data: allJobs, error: allJobsError } = await supabase
      .from('ai_generation_jobs')
      .select('id, status, current_step, progress_pct, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allJobsError) throw allJobsError;

    if (allJobs && allJobs.length > 0) {
      allJobs.forEach((job, index) => {
        console.log(`   ${index + 1}. Job ${job.id.substring(0, 8)}... - Status: ${job.status} - Step: ${job.current_step}`);
      });
    } else {
      console.log('   ❌ No jobs found at all');
    }

    console.log('');

    // Check specifically for queued jobs
    console.log('📋 Jobs with status = "queued":');
    const { data: queuedJobs, error: queuedError } = await supabase
      .from('ai_generation_jobs')
      .select('id, status, current_step, progress_pct, created_at')
      .eq('status', 'queued')
      .order('created_at', { ascending: false });

    if (queuedError) {
      console.log(`   ❌ Error: ${queuedError.message}`);
    } else if (queuedJobs && queuedJobs.length > 0) {
      console.log(`   ✅ Found ${queuedJobs.length} queued jobs:`);
      queuedJobs.forEach((job, index) => {
        console.log(`      ${index + 1}. Job ${job.id.substring(0, 8)}... - Created: ${new Date(job.created_at).toLocaleString()}`);
      });
    } else {
      console.log('   ✅ No queued jobs found');
    }

    console.log('');

    // Check all projects
    console.log('📹 All AI video projects:');
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('ai_video_projects')
      .select('id, topic, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allProjectsError) throw allProjectsError;

    if (allProjects && allProjects.length > 0) {
      allProjects.forEach((project, index) => {
        console.log(`   ${index + 1}. "${project.topic}" - Status: ${project.status} - Created: ${new Date(project.created_at).toLocaleString()}`);
      });
    } else {
      console.log('   ❌ No projects found');
    }

    console.log('');

    // Check specifically for queued projects
    console.log('📋 Projects with status = "queued":');
    const { data: queuedProjects, error: queuedProjectsError } = await supabase
      .from('ai_video_projects')
      .select('id, topic, status, created_at')
      .eq('status', 'queued')
      .order('created_at', { ascending: false });

    if (queuedProjectsError) {
      console.log(`   ❌ Error: ${queuedProjectsError.message}`);
    } else if (queuedProjects && queuedProjects.length > 0) {
      console.log(`   ✅ Found ${queuedProjects.length} queued projects:`);
      queuedProjects.forEach((project, index) => {
        console.log(`      ${index + 1}. "${project.topic}" - Created: ${new Date(project.created_at).toLocaleString()}`);
      });
    } else {
      console.log('   ✅ No queued projects found');
    }

    console.log('');
    console.log('🎯 ANALYSIS:');
    console.log('   - If you see queued jobs/projects above, they exist');
    console.log('   - If you don\'t see any, they may have been processed');
    console.log('   - Check the projects page to see current status');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugQueuedJobs();
