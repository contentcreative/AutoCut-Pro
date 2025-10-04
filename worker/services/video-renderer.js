const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs').promises;
const path = require('path');
const { uploadToStorage } = require('../lib/database');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Render final video using FFmpeg
 */
async function renderVideo({ voiceoverUrl, stockClips, captions, aspectRatio, targetDuration }) {
  try {
    console.log(`🎬 Rendering final video (${aspectRatio}, ${targetDuration}s)`);
    
    // For now, create a simple mock video
    // In a real implementation, this would use FFmpeg to combine audio, video, and captions
    const mockVideoUrl = await createMockVideo({ aspectRatio, targetDuration, captions });
    
    console.log(`✅ Video rendered: ${mockVideoUrl}`);
    
    return mockVideoUrl;
  } catch (error) {
    console.error('❌ Error rendering video:', error);
    throw new Error(`Video rendering failed: ${error.message}`);
  }
}

/**
 * Create a mock video for testing (placeholder)
 */
async function createMockVideo({ aspectRatio, targetDuration, captions }) {
  try {
    // Generate dimensions based on aspect ratio
    const dimensions = getVideoDimensions(aspectRatio);
    
    // Create a simple colored video with text overlay
    const filename = `video_${Date.now()}.mp4`;
    const storagePath = `videos/${filename}`;
    
    // For now, create a placeholder video URL
    // In a real implementation, this would use FFmpeg to create the actual video
    const mockVideoUrl = `https://via.placeholder.com/${dimensions.width}x${dimensions.height}/FF0000/FFFFFF?text=Mock+Video+${targetDuration}s`;
    
    console.log(`🎭 Created mock video: ${mockVideoUrl}`);
    
    return mockVideoUrl;
  } catch (error) {
    console.error('❌ Error creating mock video:', error);
    throw error;
  }
}

/**
 * Get video dimensions based on aspect ratio
 */
function getVideoDimensions(aspectRatio) {
  const dimensions = {
    '9:16': { width: 1080, height: 1920 },
    '16:9': { width: 1920, height: 1080 },
    '1:1': { width: 1080, height: 1080 }
  };
  
  return dimensions[aspectRatio] || dimensions['9:16'];
}

/**
 * Real FFmpeg video rendering (for future implementation)
 */
async function renderWithFFmpeg({ voiceoverUrl, stockClips, captions, aspectRatio, targetDuration }) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, `../temp/output_${Date.now()}.mp4`);
    const dimensions = getVideoDimensions(aspectRatio);
    
    let command = ffmpeg()
      .input(voiceoverUrl)
      .inputOptions(['-stream_loop -1'])
      .outputOptions([
        `-vf scale=${dimensions.width}:${dimensions.height}`,
        '-c:v libx264',
        '-preset fast',
        '-crf 23',
        '-c:a aac',
        '-b:a 128k',
        `-t ${targetDuration}`
      ])
      .output(outputPath);
    
    // Add caption overlay if provided
    if (captions && captions.srt) {
      const srtPath = path.join(__dirname, `../temp/captions_${Date.now()}.srt`);
      fs.writeFile(srtPath, captions.srt);
      
      command = command
        .inputOptions([`-vf subtitles=${srtPath}`])
        .outputOptions(['-c:s mov_text']);
    }
    
    command
      .on('start', (commandLine) => {
        console.log('🎬 FFmpeg started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`📊 Rendering progress: ${progress.percent}%`);
      })
      .on('end', async () => {
        try {
          // Upload the rendered video
          const videoBuffer = await fs.readFile(outputPath);
          const uploadResult = await uploadToStorage('ai-videos', `rendered/${path.basename(outputPath)}`, videoBuffer);
          
          // Clean up temp files
          await fs.unlink(outputPath);
          if (captions && captions.srt) {
            await fs.unlink(srtPath);
          }
          
          const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/ai-videos/rendered/${path.basename(outputPath)}`;
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ FFmpeg error:', error);
        reject(error);
      })
      .run();
  });
}

module.exports = { renderVideo };
