const { updateJobStatus, getProject, createAsset } = require('../lib/database');
const { generateScript } = require('./script-generator');
const { generateVoiceover } = require('./voiceover-generator');
const { fetchStockFootage } = require('./stock-footage-fetcher');
const { generateCaptions } = require('./captions-generator');
const { renderVideo } = require('./video-renderer');
const { generateThumbnail } = require('./thumbnail-generator');

/**
 * Main AI video generation pipeline
 * Orchestrates the entire process from script to final video
 */
async function startGenerationPipeline({ jobId, projectId }) {
  console.log(`🚀 Starting AI video pipeline for job ${jobId}, project ${projectId}`);
  
  try {
    // Get project details
    const project = await getProject(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    console.log(`📝 Project: "${project.topic}"`);
    
    // Step 1: Generate Script
    await updateJobStatus(jobId, 'generating_script', 10, 'Generating AI script...');
    console.log('🤖 Step 1: Generating script...');
    
    const script = await generateScript({
      topic: project.topic,
      targetDuration: project.targetDurationSec,
      style: project.voiceStyle,
      language: project.language
    });

    const scriptAsset = await createAsset(projectId, 'script', {
      content: script,
      wordCount: script.split(' ').length,
      estimatedDuration: project.targetDurationSec
    });

    console.log(`✅ Script generated: ${script.length} characters`);

    // Step 2: Generate Voiceover
    await updateJobStatus(jobId, 'generating_voiceover', 30, 'Creating voiceover...');
    console.log('🎤 Step 2: Generating voiceover...');
    
    const voiceoverUrl = await generateVoiceover({
      text: script,
      voice: project.voiceStyle,
      provider: project.ttsProvider
    });

    const voiceoverAsset = await createAsset(projectId, 'voiceover_audio', {
      url: voiceoverUrl,
      provider: project.ttsProvider,
      voiceStyle: project.voiceStyle
    });

    console.log(`✅ Voiceover generated: ${voiceoverUrl}`);

    // Step 3: Fetch Stock Footage
    await updateJobStatus(jobId, 'fetching_broll', 50, 'Fetching stock footage...');
    console.log('🎬 Step 3: Fetching stock footage...');
    
    const stockClips = await fetchStockFootage({
      topic: project.topic,
      duration: project.targetDurationSec,
      aspectRatio: project.aspectRatio
    });

    const brollAssets = [];
    for (const clip of stockClips) {
      const asset = await createAsset(projectId, 'broll_clip', {
        url: clip.url,
        duration: clip.duration,
        startTime: clip.startTime,
        provider: clip.provider
      });
      brollAssets.push(asset);
    }

    console.log(`✅ Stock footage fetched: ${stockClips.length} clips`);

    // Step 4: Generate Captions
    await updateJobStatus(jobId, 'generating_captions', 70, 'Creating captions...');
    console.log('📝 Step 4: Generating captions...');
    
    const captions = await generateCaptions({
      script,
      voiceoverUrl,
      theme: project.captionsTheme,
      duration: project.targetDurationSec
    });

    const captionsAsset = await createAsset(projectId, 'subtitle_srt', {
      content: captions.srt,
      style: project.captionsTheme
    });

    console.log(`✅ Captions generated: ${captions.wordCount} words`);

    // Step 5: Render Final Video
    await updateJobStatus(jobId, 'rendering', 85, 'Rendering final video...');
    console.log('🎬 Step 5: Rendering final video...');
    
    const videoUrl = await renderVideo({
      voiceoverUrl,
      stockClips,
      captions,
      aspectRatio: project.aspectRatio,
      targetDuration: project.targetDurationSec
    });

    const videoAsset = await createAsset(projectId, 'final_video', {
      url: videoUrl,
      aspectRatio: project.aspectRatio,
      duration: project.targetDurationSec,
      resolution: project.aspectRatio === '9:16' ? '1080x1920' : '1920x1080'
    });

    console.log(`✅ Video rendered: ${videoUrl}`);

    // Step 6: Generate Thumbnail
    await updateJobStatus(jobId, 'rendering', 95, 'Generating thumbnail...');
    console.log('🖼️ Step 6: Generating thumbnail...');
    
    const thumbnailUrl = await generateThumbnail({
      videoUrl,
      topic: project.topic,
      aspectRatio: project.aspectRatio
    });

    const thumbnailAsset = await createAsset(projectId, 'thumbnail_image', {
      url: thumbnailUrl,
      aspectRatio: project.aspectRatio
    });

    console.log(`✅ Thumbnail generated: ${thumbnailUrl}`);

    // Complete the job
    await updateJobStatus(jobId, 'completed', 100, 'Video generation completed!');
    console.log(`🎉 AI video generation completed for project ${projectId}!`);

    return {
      success: true,
      assets: {
        script: scriptAsset,
        voiceover: voiceoverAsset,
        broll: brollAssets,
        captions: captionsAsset,
        video: videoAsset,
        thumbnail: thumbnailAsset
      }
    };

  } catch (error) {
    console.error(`❌ Pipeline error for job ${jobId}:`, error);
    
    // Update job status to failed
    await updateJobStatus(jobId, 'failed', 0, error.message);
    
    throw error;
  }
}

module.exports = { startGenerationPipeline };
