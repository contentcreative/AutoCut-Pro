import { google } from 'googleapis';

/**
 * YouTube Data API integration for trending content discovery
 */
export class YouTubeTrendingService {
  private youtube: any;

  constructor(apiKey: string) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });
  }

  /**
   * Fetch trending YouTube Shorts by niche
   */
  async fetchTrendingShorts(niche: string, maxResults: number = 50) {
    try {
      console.log(`🔍 Searching YouTube Shorts for niche: "${niche}"`);
      
      // Search for videos with the niche keyword, filtered for shorts
      const searchResponse = await this.youtube.search.list({
        part: ['snippet'],
        q: niche,
        type: ['video'],
        videoDuration: 'short',
        order: 'viewCount',
        maxResults: Math.min(maxResults, 50),
      });

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        console.log('⚠️ No YouTube Shorts found for niche');
        return [];
      }

      // Get video IDs for detailed statistics
      const videoIds = searchResponse.data.items
        .map((item: any) => item.id?.videoId)
        .filter(Boolean);

      if (videoIds.length === 0) {
        console.log('⚠️ No valid video IDs found');
        return [];
      }

      // Get detailed video information including statistics
      const videosResponse = await this.youtube.videos.list({
        id: videoIds,
        part: ['snippet', 'statistics', 'contentDetails'],
      });

      if (!videosResponse.data.items) {
        console.log('⚠️ No detailed video data found');
        return [];
      }

      // Transform and return the data
      const trendingVideos = videosResponse.data.items.map((video: any) => {
        const publishedAt = video.snippet?.publishedAt 
          ? new Date(video.snippet.publishedAt) 
          : null;
        
        const ageHours = publishedAt 
          ? Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60))
          : 24;

        return {
          platform: 'youtube' as const,
          sourceVideoId: video.id!,
          niche,
          title: video.snippet?.title || 'Untitled Video',
          creatorHandle: video.snippet?.channelTitle || 'Unknown Creator',
          thumbnailUrl: video.snippet?.thumbnails?.medium?.url || '',
          permalink: `https://www.youtube.com/watch?v=${video.id}`,
          publishedAt,
          durationSeconds: this.parseDuration(video.contentDetails?.duration),
          viewsCount: parseInt(video.statistics?.viewCount || '0'),
          likesCount: parseInt(video.statistics?.likeCount || '0'),
          commentsCount: parseInt(video.statistics?.commentCount || '0'),
          sharesCount: 0, // YouTube API doesn't provide share count
          raw: video,
        };
      });

      console.log(`✅ Found ${trendingVideos.length} YouTube Shorts for niche "${niche}"`);
      return trendingVideos;

    } catch (error) {
      console.error('❌ Error fetching YouTube trending videos:', error);
      throw new Error(`YouTube API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private parseDuration(isoDuration?: string): number | null {
    if (!isoDuration) return null;
    
    // Parse ISO 8601 duration (PT1M30S format)
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return null;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Get trending videos by category (limited functionality without OAuth)
   */
  async getTrendingByCategory(categoryId: string = '0', maxResults: number = 25) {
    try {
      console.log(`📈 Fetching YouTube trending videos for category: ${categoryId}`);
      
      const response = await this.youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        chart: 'mostPopular',
        regionCode: 'US',
        categoryId,
        maxResults: Math.min(maxResults, 50),
      });

      if (!response.data.items) {
        console.log('⚠️ No trending videos found');
        return [];
      }

      return response.data.items.map((video: any) => ({
        platform: 'youtube' as const,
        sourceVideoId: video.id!,
        niche: 'trending',
        title: video.snippet?.title || 'Untitled Video',
        creatorHandle: video.snippet?.channelTitle || 'Unknown Creator',
        thumbnailUrl: video.snippet?.thumbnails?.medium?.url || '',
        permalink: `https://www.youtube.com/watch?v=${video.id}`,
        publishedAt: video.snippet?.publishedAt ? new Date(video.snippet.publishedAt) : null,
        durationSeconds: this.parseDuration(video.contentDetails?.duration),
        viewsCount: parseInt(video.statistics?.viewCount || '0'),
        likesCount: parseInt(video.statistics?.likeCount || '0'),
        commentsCount: parseInt(video.statistics?.commentCount || '0'),
        sharesCount: 0,
        raw: video,
      }));

    } catch (error) {
      console.error('❌ Error fetching YouTube trending videos:', error);
      throw new Error(`YouTube trending API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Create YouTube trending service instance
 */
export function createYouTubeService(): YouTubeTrendingService {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is required');
  }

  return new YouTubeTrendingService(apiKey);
}

/**
 * Fetch trending YouTube Shorts (convenience function)
 */
export async function fetchYouTubeShortsTrending(niche: string, max = 50) {
  const service = createYouTubeService();
  return service.fetchTrendingShorts(niche, max);
}
