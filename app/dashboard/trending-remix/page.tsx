/**
 * Enhanced Trending Remix page
 * Discover trending content with advanced filtering and create original faceless remixes
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Search, 
  Youtube, 
  Instagram, 
  Music, 
  RefreshCw, 
  Zap, 
  Play, 
  Download, 
  Info,
  Filter,
  ArrowUpDown,
  X
} from "lucide-react";
import { 
  fetchAndUpsertTrending, 
  createRemixJob, 
  getTrendingVideosAdvanced, 
  getTrendingVideos,
  getUserRemixJobs 
} from "@/actions/trending-remix-actions";
import { toast } from "sonner";
import Image from "next/image";
import { AdvancedFilters, SortOption, TrendingSearchState } from "@/types/trending-remix";
import { ViralityScoreTooltip } from "@/components/trending-remix/virality-score-tooltip";
import { AdvancedFiltersPanel } from "@/components/trending-remix/advanced-filters-panel";
import { SearchSuggestions } from "@/components/trending-remix/search-suggestions";
import { SortControls } from "@/components/trending-remix/sort-controls";
import { PaginationControls } from "@/components/trending-remix/pagination-controls";

// Helper functions
function formatNumber(num: number | null | undefined): string {
  if (num == null || isNaN(num)) {
    return '0';
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatAge(publishedAt: string | Date | null): string {
  if (!publishedAt) return 'Unknown';
  
  const now = new Date();
  const published = new Date(publishedAt);
  const diffHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffHours < 168) {
    return `${Math.floor(diffHours / 24)}d ago`;
  } else {
    return `${Math.floor(diffHours / 168)}w ago`;
  }
}

export default function TrendingRemixPage() {
  // Enhanced state management
  const [isSearching, setIsSearching] = useState(false);
  const [isRemixing, setIsRemixing] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Search state
  const [searchState, setSearchState] = useState<TrendingSearchState>({
    basicSearch: {
      niche: '',
      platform: 'youtube',
    },
    advancedFilters: {
      dateRange: { start: null, end: null },
      viewCountRange: { min: null, max: null },
      durationRange: { min: null, max: null },
      engagementFilters: { minLikes: null, minComments: null, minShares: null },
      languageFilters: { videoLanguages: [], audioLanguages: [] },
      platformSpecific: {
        youtube: { duration: 'all' },
        tiktok: { music: null, hashtags: [] },
        instagram: { reels: null, hashtags: [] },
      },
    },
    sortBy: {
      key: 'viralityScore',
      label: 'Virality Score',
      direction: 'desc',
    },
    searchPresets: [],
    searchHistory: [],
    searchSuggestions: [],
    advancedSearch: {
      keywords: [],
      excludeTerms: [],
      exactPhrase: '',
      matchAll: false,
    },
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
    },
  });
  
  // Results data
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [remixJobs, setRemixJobs] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  // Load data on component mount
  useEffect(() => {
    loadTrendingVideos();
    loadRemixJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrendingVideos = async (useAdvanced = false) => {
    console.log('📊 Loading trending videos, useAdvanced:', useAdvanced);
    console.log('🔍 Current niche:', searchState.basicSearch.niche);
    
    try {
      let result;
      
      if (useAdvanced) {
        console.log('🚀 Using advanced search...');
        result = await getTrendingVideosAdvanced({
          niche: searchState.basicSearch.niche || undefined,
          platforms: [searchState.basicSearch.platform as 'youtube' | 'tiktok' | 'instagram'],
          filters: searchState.advancedFilters,
          sortBy: searchState.sortBy,
          pagination: searchState.pagination,
          advancedSearch: searchState.advancedSearch,
        });
      } else {
        console.log('📋 Using basic search...');
        const videos = await getTrendingVideos(searchState.basicSearch.niche || undefined);
        console.log('📺 Raw videos from DB:', videos?.length || 0);
        result = { 
          videos: videos || [], 
          pagination: { 
            page: 1, 
            limit: 50, 
            total: videos?.length || 0, 
            totalPages: 1 
          } 
        };
      }
      
      console.log('📊 Search result:', {
        videoCount: result.videos?.length || 0,
        total: result.pagination?.total || 0
      });
      
      // Format the data for the UI
      const formattedVideos = (result.videos || []).map((video: any) => ({
        id: video.id || 'unknown',
        title: video.title || 'Untitled',
        platform: video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'Instagram',
        thumbnail: video.thumbnailUrl || video.thumbnail_url || 'https://via.placeholder.com/320x180',
        creator: video.creatorHandle || video.creator_handle || 'Unknown',
        views: formatNumber(video.viewsCount || video.views_count),
        likes: formatNumber(video.likesCount || video.likes_count),
        age: formatAge(video.publishedAt || video.published_at),
        viralityScore: Number(video.viralityScore || video.virality_score || 0),
        scoreBreakdown: video.scoreBreakdown || video.score_breakdown || {},
      }));
      
      console.log('🎨 Formatted videos:', formattedVideos.length);
      setTrendingVideos(formattedVideos);
      setTotalResults(result.pagination?.total || 0);
    } catch (error) {
      console.error('❌ Error loading trending videos:', error);
      toast.error(`Failed to load trending videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const loadRemixJobs = async () => {
    try {
      const jobs = await getUserRemixJobs();
      
      // Format the data for the UI
      const formattedJobs = jobs.map((job: any) => ({
        id: job.id,
        trendingVideoTitle: job.niche || 'Unknown Video',
        status: job.status,
        step: job.step || 'queued',
        createdAt: new Date(job.createdAt).toLocaleDateString(),
        outputUrl: job.outputVideoUrl || null,
      }));
      
      setRemixJobs(formattedJobs);
    } catch (error) {
      console.error('Error loading remix jobs:', error);
      toast.error('Failed to load remix jobs');
    }
  };

  // Enhanced handler functions
  const updateSearchState = (updates: Partial<TrendingSearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  };

  const updateBasicSearch = (updates: Partial<typeof searchState.basicSearch>) => {
    updateSearchState({
      basicSearch: { ...searchState.basicSearch, ...updates }
    });
  };

  const updateAdvancedFilters = (filters: AdvancedFilters) => {
    updateSearchState({ advancedFilters: filters });
  };

  const updateSortBy = (sortBy: SortOption) => {
    updateSearchState({ sortBy });
  };

  const updatePagination = (pagination: Partial<typeof searchState.pagination>) => {
    updateSearchState({
      pagination: { ...searchState.pagination, ...pagination }
    });
  };

  const clearAllFilters = () => {
    updateSearchState({
      advancedFilters: {
        dateRange: { start: null, end: null },
        viewCountRange: { min: null, max: null },
        durationRange: { min: null, max: null },
        engagementFilters: { minLikes: null, minComments: null, minShares: null },
        languageFilters: { videoLanguages: [], audioLanguages: [] },
        platformSpecific: {
          youtube: { duration: 'all' },
          tiktok: { music: null, hashtags: [] },
          instagram: { reels: null, hashtags: [] },
        },
      }
    });
  };

  const handleSearchTrends = async () => {
    console.log('🔍 Search Trends button clicked');
    console.log('📝 Current niche:', searchState.basicSearch.niche);
    
    if (!searchState.basicSearch.niche.trim()) {
      toast.error('Please enter a niche or topic to search');
      return;
    }

    setIsSearching(true);
    try {
      console.log('🚀 Starting trending search...');
      const result = await fetchAndUpsertTrending({
        niche: searchState.basicSearch.niche,
        platforms: [searchState.basicSearch.platform as 'youtube' | 'tiktok' | 'instagram'],
        max: 50,
      });
      
      console.log('✅ Search result:', result);
      toast.success(`Found ${result.totalFound} trending videos, inserted ${result.totalInserted} new ones!`);
      
      // Reload trending videos after search with current filters
      console.log('🔄 Reloading trending videos...');
      await loadTrendingVideos(true);
    } catch (error) {
      console.error('❌ Search error:', error);
      toast.error(`Failed to fetch trending content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdvancedSearch = async () => {
    setIsSearching(true);
    try {
      await loadTrendingVideos(true);
    } catch (error) {
      console.error('Advanced search error:', error);
      toast.error('Failed to perform advanced search');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    updateBasicSearch({ niche: suggestion });
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    updateBasicSearch({ niche: '' });
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-search-suggestions]')) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);


  const handleSortChange = async (sortBy: SortOption) => {
    updateSortBy(sortBy);
    // Reload with new sort
    setTimeout(() => loadTrendingVideos(true), 100);
  };

  const handlePageChange = async (page: number) => {
    updatePagination({ page });
    // Reload with new page
    setTimeout(() => loadTrendingVideos(true), 100);
  };

  const handleItemsPerPageChange = async (limit: number) => {
    updatePagination({ limit, page: 1 });
    // Reload with new limit
    setTimeout(() => loadTrendingVideos(true), 100);
  };

  const handleRemix = async (videoId: string, title: string) => {
    setIsRemixing(videoId);
    try {
      const result = await createRemixJob({
        trendingVideoId: videoId,
        options: {
          voiceModel: 'alloy',
          aspectRatio: '9:16',
          targetDuration: 60,
          stylePreset: 'listicle',
          language: 'en',
        }
      });
      
      toast.success(`Remix job started for "${title}"! Check your jobs for progress.`);
    } catch (error) {
      console.error('Remix error:', error);
      toast.error('Failed to start remix job. Please try again.');
    } finally {
      setIsRemixing(null);
    }
  };

  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            Trending Remix
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover viral content with advanced filtering and create your own faceless remixes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Viral Content
          </Badge>
        </div>
      </div>


      {/* Enhanced Trend Discovery */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Discover Trends</CardTitle>
          <CardDescription>
            Find trending short-form videos by niche and platform with advanced filtering options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-medium">Niche / Topic</label>
              <div className="relative" data-search-suggestions>
                <SearchSuggestions
                  query={searchState.basicSearch.niche}
                  onSuggestionSelect={handleSuggestionSelect}
                  open={showSuggestions}
                  onOpenChange={setShowSuggestions}
                >
                  <Input 
                    id="niche" 
                    placeholder="e.g., 'AI tools', 'Fitness', 'Cooking'" 
                    value={searchState.basicSearch.niche}
                    onChange={(e) => {
                      updateBasicSearch({ niche: e.target.value });
                      // Only show suggestions when typing, not when clearing
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => {
                      // Only show suggestions if there's content or when first focusing
                      setShowSuggestions(searchState.basicSearch.niche.length > 0 || true);
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="pr-8"
                  />
                </SearchSuggestions>
                {searchState.basicSearch.niche && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">Platform</label>
              <Select 
                value={searchState.basicSearch.platform} 
                onValueChange={(value) => updateBasicSearch({ platform: value })}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram Reels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          <AdvancedFiltersPanel
            filters={searchState.advancedFilters}
            onFiltersChange={updateAdvancedFilters}
            onClearFilters={clearAllFilters}
          />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleSearchTrends}
              disabled={isSearching}
              className="flex-1 md:flex-none"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Trends
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleAdvancedSearch}
              disabled={isSearching}
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Trending Videos Table */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trending Videos</CardTitle>
              <CardDescription>
                Ranked by virality score. Click Remix to create your own version.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <SortControls 
                sortBy={searchState.sortBy}
                onSortChange={handleSortChange}
              />
              <Badge variant="outline" className="text-sm">
                {totalResults} results
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trendingVideos.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trending videos found</h3>
              <p className="text-muted-foreground mb-4">
                {searchState.basicSearch.niche ? 
                  `No results found for "${searchState.basicSearch.niche}". Try adjusting your filters or search terms.` :
                  'Search for trending content to discover viral videos in your niche'
                }
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Try searching for:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• &ldquo;AI tools&rdquo;</li>
                      <li>• &ldquo;Productivity tips&rdquo;</li>
                      <li>• &ldquo;Fitness routines&rdquo;</li>
                      <li>• &ldquo;Cooking hacks&rdquo;</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2 max-w-xs">
                          <Image 
                            src={video.thumbnail} 
                            alt={video.title} 
                            width={64} 
                            height={36} 
                            className="object-cover rounded flex-shrink-0" 
                          />
                          <span className="truncate" title={video.title}>
                            {video.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {video.platform === "YouTube" && <Youtube className="h-5 w-5 text-red-600" />}
                        {video.platform === "TikTok" && <Music className="h-5 w-5 text-black" />}
                        {video.platform === "Instagram" && <Instagram className="h-5 w-5 text-pink-600" />}
                      </TableCell>
                      <TableCell className="max-w-24 truncate" title={video.creator}>
                        {video.creator}
                      </TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>{video.likes}</TableCell>
                      <TableCell>{video.age}</TableCell>
                      <TableCell>
                        <ViralityScoreTooltip 
                          score={video.viralityScore}
                          breakdown={video.scoreBreakdown}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemix(video.id, video.title)}
                          disabled={isRemixing === video.id}
                        >
                          {isRemixing === video.id ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Remixing...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Remix
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {totalResults > searchState.pagination.limit && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={searchState.pagination.page}
                    totalPages={Math.ceil(totalResults / searchState.pagination.limit)}
                    totalItems={totalResults}
                    itemsPerPage={searchState.pagination.limit}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Remix Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Remix Jobs</CardTitle>
          <CardDescription>
            Track the status of your trending video remixes with real-time updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {remixJobs.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No remix jobs yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first remix by searching for trending videos above
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">How it works:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Search for trending videos</li>
                      <li>• Click "Remix" on any video</li>
                      <li>• AI creates original version</li>
                      <li>• Download when ready</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original Video</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remixJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium max-w-48 truncate" title={job.trendingVideoTitle}>
                      {job.trendingVideoTitle}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          job.status === "completed" ? "default" : 
                          job.status === "failed" ? "destructive" :
                          job.status === "processing" ? "secondary" :
                          "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.step}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {job.status === "completed" && job.outputUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.outputUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      ) : job.status === "failed" ? (
                        <Button variant="outline" size="sm" onClick={() => handleRemix(job.id, job.trendingVideoTitle)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Play className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}