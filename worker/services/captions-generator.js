/**
 * Generate captions/subtitles for the video
 */
async function generateCaptions({ script, voiceoverUrl, theme, duration }) {
  try {
    console.log(`📝 Generating captions with theme: ${theme}`);
    
    // For now, create simple time-based captions
    // In a real implementation, you would use audio analysis or AI to sync with voiceover
    const words = script.split(' ');
    const wordsPerSecond = words.length / duration;
    
    const captions = [];
    let currentTime = 0;
    const wordsPerCaption = Math.max(3, Math.floor(wordsPerSecond * 2)); // 2 seconds per caption
    
    for (let i = 0; i < words.length; i += wordsPerCaption) {
      const captionWords = words.slice(i, i + wordsPerCaption);
      const captionText = captionWords.join(' ');
      const captionDuration = captionWords.length / wordsPerSecond;
      
      captions.push({
        start: formatTime(currentTime),
        end: formatTime(currentTime + captionDuration),
        text: captionText
      });
      
      currentTime += captionDuration;
    }
    
    // Generate SRT format
    const srtContent = captions.map((caption, index) => 
      `${index + 1}\n${caption.start} --> ${caption.end}\n${caption.text}\n`
    ).join('\n');
    
    console.log(`✅ Captions generated: ${captions.length} segments, ${words.length} words`);
    
    return {
      srt: srtContent,
      segments: captions,
      wordCount: words.length,
      theme
    };
  } catch (error) {
    console.error('❌ Error generating captions:', error);
    throw new Error(`Caption generation failed: ${error.message}`);
  }
}

/**
 * Format time for SRT format (HH:MM:SS,mmm)
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

module.exports = { generateCaptions };
