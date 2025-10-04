const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { uploadToStorage } = require('../lib/database');

/**
 * Fetch stock footage from Pexels API
 */
async function fetchStockFootage({ topic, duration, aspectRatio }) {
  try {
    console.log(`🎬 Fetching stock footage for topic: "${topic}"`);
    
    const pexelsApiKey = process.env.PEXELS_API_KEY;
    if (!pexelsApiKey) {
      console.warn('⚠️ PEXELS_API_KEY not configured, using mock footage');
      return await getMockStockFootage({ topic, duration });
    }

    // Search for videos on Pexels
    const searchQuery = topic.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const searchUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=${aspectRatio === '9:16' ? 'portrait' : 'landscape'}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'Authorization': pexelsApiKey
      }
    });

    const videos = response.data.videos || [];
    
    if (videos.length === 0) {
      console.warn('⚠️ No videos found, using mock footage');
      return await getMockStockFootage({ topic, duration });
    }

    // Select and process videos
    const selectedClips = [];
    let totalDuration = 0;
    const targetDuration = duration * 1000; // Convert to milliseconds

    for (const video of videos) {
      if (totalDuration >= targetDuration) break;
      
      // Get the best quality video file
      const videoFiles = video.video_files || [];
      const bestQuality = videoFiles
        .filter(file => file.quality === 'hd' || file.quality === 'sd')
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];

      if (!bestQuality) continue;

      // Calculate clip duration (use full video or portion)
      const clipDuration = Math.min(bestQuality.duration * 1000, targetDuration - totalDuration);
      
      selectedClips.push({
        url: bestQuality.link,
        duration: clipDuration / 1000, // Convert back to seconds
        startTime: 0,
        provider: 'pexels',
        id: video.id,
        title: video.user?.name || 'Stock Footage'
      });

      totalDuration += clipDuration;
    }

    // If we don't have enough footage, add mock clips
    if (totalDuration < targetDuration) {
      const mockClips = await getMockStockFootage({ 
        topic, 
        duration: (targetDuration - totalDuration) / 1000 
      });
      selectedClips.push(...mockClips);
    }

    console.log(`✅ Stock footage fetched: ${selectedClips.length} clips, ${totalDuration/1000}s total`);
    
    return selectedClips;
  } catch (error) {
    console.error('❌ Error fetching stock footage:', error);
    console.log('🔄 Falling back to mock footage');
    return await getMockStockFootage({ topic, duration });
  }
}

/**
 * Generate mock stock footage for testing
 */
async function getMockStockFootage({ topic, duration }) {
  console.log('🎭 Using mock stock footage');
  
  // Create mock clips based on topic
  const mockClips = [];
  const clipsNeeded = Math.ceil(duration / 10); // One clip per 10 seconds
  
  for (let i = 0; i < clipsNeeded; i++) {
    mockClips.push({
      url: `https://via.placeholder.com/${topic.includes('tech') ? '1920x1080' : '1080x1920'}/0066CC/FFFFFF?text=${encodeURIComponent(topic)}-${i+1}`,
      duration: Math.min(10, duration - (i * 10)),
      startTime: 0,
      provider: 'mock',
      id: `mock_${i}`,
      title: `Mock ${topic} Footage ${i + 1}`
    });
  }

  return mockClips;
}

module.exports = { fetchStockFootage };
