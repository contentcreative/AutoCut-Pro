/**
 * Trending Remix page
 * Discover trending content and create original faceless remixes
 */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Info 
} from "lucide-react";
import { fetchAndUpsertTrending, createRemixJob, getTrendingVideos, getUserRemixJobs } from "@/actions/trending-remix-actions";
import { toast } from "sonner";
import Image from "next/image";

// Helper functions
function formatNumber(num: number): string {
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
  const [isSearching, setIsSearching] = useState(false);
  const [isRemixing, setIsRemixing] = useState<string | null>(null);
  const [searchForm, setSearchForm] = useState({
    niche: '',
    platform: 'youtube',
  });
  
  // Real trending videos data - loaded from database
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);

  // Real remix jobs data - loaded from database
  const [remixJobs, setRemixJobs] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadTrendingVideos();
    loadRemixJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrendingVideos = async () => {
    try {
      const videos = await getTrendingVideos(searchForm.niche || undefined);
      
      // Format the data for the UI
      const formattedVideos = videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        platform: video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'Instagram',
        thumbnail: video.thumbnailUrl || 'https://via.placeholder.com/320x180',
        creator: video.creatorHandle || 'Unknown',
        views: formatNumber(video.viewsCount),
        likes: formatNumber(video.likesCount),
        age: formatAge(video.publishedAt),
        viralityScore: Number(video.viralityScore).toFixed(2),
      }));
      
      setTrendingVideos(formattedVideos);
    } catch (error) {
      console.error('Error loading trending videos:', error);
      toast.error('Failed to load trending videos');
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

  const handleSearchTrends = async () => {
    if (!searchForm.niche.trim()) {
      toast.error('Please enter a niche or topic to search');
      return;
    }

    setIsSearching(true);
    try {
      const result = await fetchAndUpsertTrending({
        niche: searchForm.niche,
        platforms: [searchForm.platform as 'youtube' | 'tiktok' | 'instagram'],
        max: 50,
      });
      
      toast.success(`Found ${result.totalFound} trending videos, inserted ${result.totalInserted} new ones!`);
      
      // Reload trending videos after search
      await loadTrendingVideos();
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to fetch trending content. Please try again.');
    } finally {
      setIsSearching(false);
    }
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
            Discover viral content and create your own faceless remixes.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Viral Content
        </Badge>
      </div>

      {/* Trend Discovery Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Discover Trends</CardTitle>
          <CardDescription>
            Find trending short-form videos by niche and platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-medium">Niche / Topic</label>
              <Input 
                id="niche" 
                placeholder="e.g., 'AI tools', 'Fitness', 'Cooking'" 
                value={searchForm.niche}
                onChange={(e) => setSearchForm(prev => ({ ...prev, niche: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">Platform</label>
              <Select 
                value={searchForm.platform} 
                onValueChange={(value) => setSearchForm(prev => ({ ...prev, platform: value }))}
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
          <Button 
            onClick={handleSearchTrends}
            disabled={isSearching}
            className="w-full md:w-auto"
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
        </CardContent>
      </Card>

      {/* Trending Videos Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Trending Videos</CardTitle>
          <CardDescription>
            Ranked by virality score. Click Remix to create your own version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendingVideos.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trending videos yet</h3>
              <p className="text-muted-foreground mb-4">
                Search for trending content to discover viral videos in your niche
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
                    <TableCell className="font-medium flex items-center gap-2">
                      <Image src={video.thumbnail} alt={video.title} width={64} height={36} className="object-cover rounded" />
                      {video.title}
                    </TableCell>
                    <TableCell>
                      {video.platform === "YouTube" && <Youtube className="h-5 w-5 text-red-600" />}
                      {video.platform === "TikTok" && <Music className="h-5 w-5 text-black" />}
                      {video.platform === "Instagram" && <Instagram className="h-5 w-5 text-pink-600" />}
                    </TableCell>
                    <TableCell>{video.creator}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>{video.likes}</TableCell>
                    <TableCell>{video.age}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {video.viralityScore} <Info className="h-3 w-3" />
                      </Badge>
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
          )}
        </CardContent>
      </Card>

      {/* Recent Remix Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Remix Jobs</CardTitle>
          <CardDescription>
            Track the status of your trending video remixes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {remixJobs.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No remix jobs yet</h3>
              <p className="text-muted-foreground">
                Create your first remix by searching for trending videos above
              </p>
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
                    <TableCell className="font-medium">{job.trendingVideoTitle}</TableCell>
                    <TableCell>
                      <Badge variant={job.status === "completed" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.step}</TableCell>
                    <TableCell>{job.createdAt}</TableCell>
                    <TableCell className="text-right">
                      {job.status === "completed" ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={job.outputUrl!} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
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