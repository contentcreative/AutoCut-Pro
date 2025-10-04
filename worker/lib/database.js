const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update job status and progress
 */
async function updateJobStatus(jobId, status, progress, currentStep) {
  try {
    const { error } = await supabase
      .from('ai_generation_jobs')
      .update({
        status,
        progress_pct: progress,
        current_step: currentStep,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (error) {
      console.error('Error updating job status:', error);
      throw error;
    }

    console.log(`📊 Job ${jobId}: ${status} (${progress}%) - ${currentStep}`);
  } catch (error) {
    console.error('Failed to update job status:', error);
    throw error;
  }
}

/**
 * Get project details
 */
async function getProject(projectId) {
  try {
    const { data, error } = await supabase
      .from('ai_video_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get project:', error);
    throw error;
  }
}

/**
 * Create an asset record
 */
async function createAsset(projectId, type, metadata = {}) {
  try {
    const { data, error } = await supabase
      .from('ai_assets')
      .insert({
        project_id: projectId,
        type,
        status: 'ready',
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating asset:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create asset:', error);
    throw error;
  }
}

/**
 * Upload file to Supabase Storage
 */
async function uploadToStorage(bucket, path, file) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: 'application/octet-stream'
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to upload to storage:', error);
    throw error;
  }
}

/**
 * Get signed URL for private storage
 */
async function getSignedUrl(bucket, path, expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Failed to create signed URL:', error);
    throw error;
  }
}

module.exports = {
  updateJobStatus,
  getProject,
  createAsset,
  uploadToStorage,
  getSignedUrl
};
