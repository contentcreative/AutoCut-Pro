/**
 * Trending Remix page
 * Discover trending content and create original faceless remixes
 */
'use client';

import { useState } from 'react';
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
import { fetchAndUpsertTrending, createRemixJob } from "@/actions/trending-remix-actions";
import { toast } from "sonner";
import Image from "next/image";

export default function TrendingRemixPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [isRemixing, setIsRemixing] = useState<string | null>(null);
  const [searchForm, setSearchForm] = useState({
    niche: '',
    platform: 'youtube',
  });
  
  // Mock trending videos data (in real app, this would come from server state)
  const [trendingVideos] = useState([
    {
      id: "1",
      title: "Top 5 Productivity Hacks for Remote Work",
      creator: "Tech Insights",
      platform: "YouTube",
      views: "1.2M",
      likes: "80K",
      comments: "2.5K",
      age: "2 days ago",
      duration: "1:30",
      viralityScore: 4.8,
      thumbnail: "https://via.placeholder.com/150x84?text=Video1"
    },
    {
      id: "2", 
      title: "DIY Home Decor Ideas You'll Love",
      creator: "Crafty Corner",
      platform: "TikTok",
      views: "980K",
      likes: "120K",
      comments: "4K",
      age: "1 day ago",
      duration: "0:45",
      viralityScore: 4.5,
      thumbnail: "https://via.placeholder.com/150x84?text=Video2"
    },
    {
      id: "3",
      title: "Healthy Meal Prep for Busy Weekdays",
      creator: "Fit Foodie",
      platform: "Instagram",
      views: "750K",
      likes: "95K",
      comments: "3.1K",
      age: "3 days ago",
      duration: "1:00",
      viralityScore: 4.2,
      thumbnail: "https://via.placeholder.com/150x84?text=Video3"
    },
  ]);

  // Mock remix jobs data
  const [remixJobs] = useState([
    {
      id: "job1",
      trendingVideoTitle: "Top 5 Productivity Hacks for Remote Work",
      status: "completed",
      step: "done",
      outputUrl: "#",
      createdAt: "2023-10-26",
    },
    {
      id: "job2",
      trendingVideoTitle: "DIY Home Decor Ideas You'll Love",
      status: "processing",
      step: "assemble",
      outputUrl: null,
      createdAt: "2023-10-25",
    },
  ]);

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
        </CardContent>
      </Card>
    </main>
  );
}