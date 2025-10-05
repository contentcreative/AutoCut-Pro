// Types for enhanced trending remix functionality

export interface AdvancedFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  viewCountRange: {
    min: number | null;
    max: number | null;
  };
  durationRange: {
    min: number | null;
    max: number | null;
  };
  engagementFilters: {
    minLikes: number | null;
    minComments: number | null;
    minShares: number | null;
  };
  platformSpecific: {
    youtube: {
      duration: 'short' | 'medium' | 'long' | 'all';
    };
    tiktok: {
      music: boolean | null;
      hashtags: string[];
    };
    instagram: {
      reels: boolean | null;
      hashtags: string[];
    };
  };
}

export interface ViralityBreakdown {
  views: { weight: number; normalizedScore: number; rawValue: number };
  likes: { weight: number; normalizedScore: number; rawValue: number };
  comments: { weight: number; normalizedScore: number; rawValue: number };
  shares: { weight: number; normalizedScore: number; rawValue: number };
  ageHours: number;
  durationPenalty?: number;
  finalScore: number;
}

export interface SearchPreset {
  id: string;
  name: string;
  niche: string;
  platforms: string[];
  filters: AdvancedFilters;
  isDefault?: boolean;
  createdAt: Date;
}

export interface TrendingVideo {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  sourceVideoId: string;
  niche: string;
  title: string;
  creatorHandle: string | null;
  thumbnailUrl: string | null;
  permalink: string;
  durationSeconds: number | null;
  publishedAt: Date | null;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viralityScore: string;
  scoreBreakdown: ViralityBreakdown | null;
  raw: any;
  fetchedAt: Date;
}

export interface SortOption {
  key: 'viralityScore' | 'viewsCount' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'publishedAt' | 'durationSeconds';
  label: string;
  direction: 'asc' | 'desc';
}

export interface SearchSuggestion {
  text: string;
  type: 'trending' | 'history' | 'popular';
  count?: number;
}

export interface AdvancedSearchOptions {
  keywords: string[];
  excludeTerms: string[];
  exactPhrase: string;
  matchAll: boolean;
}

export interface TrendingSearchState {
  basicSearch: {
    niche: string;
    platform: string;
  };
  advancedFilters: AdvancedFilters;
  sortBy: SortOption;
  searchPresets: SearchPreset[];
  searchHistory: string[];
  searchSuggestions: SearchSuggestion[];
  advancedSearch: AdvancedSearchOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
