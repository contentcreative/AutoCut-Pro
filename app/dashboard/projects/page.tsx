'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Video, 
  Download, 
  Play, 
  Clock, 
  User,
  Calendar,
  RefreshCw,
  Eye,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { listUserProjects } from "@/actions/ai-video-actions";

// Real data from database - no mock data
const mockProjects: any[] = [];

function getStatusColor(status: string) {
  switch (status) {
    case 'ready': return 'bg-green-500';
    case 'processing': return 'bg-blue-500';
    case 'queued': return 'bg-yellow-500';
    case 'failed': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'ready': return 'Ready';
    case 'processing': return 'Processing';
    case 'queued': return 'Queued';
    case 'failed': return 'Failed';
    default: return 'Unknown';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'ready': return <CheckCircle className="h-4 w-4" />;
    case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />;
    case 'queued': return <Clock className="h-4 w-4" />;
    case 'failed': return <AlertCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{id: string, topic: string, project: any} | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
    
    // Auto-refresh every 5 seconds to show real-time updates
    const interval = setInterval(loadProjects, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const userProjects = await listUserProjects();
      setProjects(userProjects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadProjects();
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const getSortedProjects = () => {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleDownload = async (projectId: string, topic?: string) => {
    console.log('Download project:', projectId);
    try {
      // Create a download link using topic-specific video
      const videoUrl = topic ? getVideoForTopic(topic) : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `video-${topic?.replace(/[^a-zA-Z0-9]/g, '-') || projectId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getVideoForTopic = (topic: string) => {
    // Select different demo videos based on topic content
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('battle') || lowerTopic.includes('war') || lowerTopic.includes('history')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    } else if (lowerTopic.includes('motivation') || lowerTopic.includes('self') || lowerTopic.includes('success')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
    } else if (lowerTopic.includes('ai') || lowerTopic.includes('technology') || lowerTopic.includes('future')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
    } else if (lowerTopic.includes('cooking') || lowerTopic.includes('food') || lowerTopic.includes('recipe')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
    } else if (lowerTopic.includes('fitness') || lowerTopic.includes('exercise') || lowerTopic.includes('health')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4';
    } else {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    }
  };

  const handleView = (projectId: string, topic: string, project: any) => {
    console.log('View project:', projectId);
    setSelectedVideo({ id: projectId, topic, project });
  };

  const handleRetry = async (projectId: string) => {
    console.log('Retry project:', projectId);
    try {
      // Update project status back to queued
      // In a real app, this would call a server action to retry
      console.log('Retrying project:', projectId);
      // For now, just refresh the page
      loadProjects();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Video className="h-8 w-8 text-blue-600" />
            My Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage your AI-generated videos
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sort Toggle */}
          {projects.length > 1 && (
            <Button 
              onClick={toggleSortOrder}
              variant="outline"
              size="sm"
            >
              {sortOrder === 'newest' ? (
                <>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Newest First
                </>
              ) : (
                <>
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Oldest First
                </>
              )}
            </Button>
          )}
          
          {/* Refresh Button */}
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Processing Notice */}
      {(projects.some(p => p.status === 'processing' || p.status === 'queued')) && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <h4 className="font-semibold text-blue-900">Video Generation in Progress</h4>
                <p className="text-sm text-blue-700">
                  Your videos are being processed. This typically takes 3-5 minutes. 
                  The page will update automatically when ready.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first AI video to get started
            </p>
            <Button asChild>
              <Link href="/dashboard/ai-create">Create Video</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getSortedProjects().map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {project.topic}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {project.settings.aspectRatio} • {project.settings.voiceStyle.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(project.status)} text-white ml-2 flex items-center gap-1`}
                  >
                    {getStatusIcon(project.status)}
                    {getStatusText(project.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Video Preview */}
                <div 
                  className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer group"
                  onClick={() => {
                    if (project.status === 'ready') {
                      handleView(project.id, project.topic, project);
                    } else if (project.status === 'failed') {
                      handleRetry(project.id);
                    }
                  }}
                >
                  {project.status === 'ready' ? (
                    <>
                      {/* Video Thumbnail */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                        {/* Video Icon */}
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          VIDEO
                        </div>
                        {/* Topic Text */}
                        <div className="text-center px-4">
                          <h3 className="text-white font-semibold text-lg mb-2">
                            {project.topic}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {project.settings.aspectRatio} • {project.settings.voiceStyle.replace('_', ' ')}
                          </p>
                        </div>
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="h-8 w-8 text-gray-800 ml-1" />
                          </div>
                        </div>
                      </div>
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-center text-white">
                          <Play className="h-12 w-12 mb-2 mx-auto" />
                          <p className="text-sm font-medium">Click to view</p>
                        </div>
                      </div>
                    </>
                  ) : project.status === 'processing' ? (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-blue-500 mb-2 mx-auto animate-spin" />
                      <p className="text-sm text-blue-500 font-medium">Processing...</p>
                      <p className="text-xs text-muted-foreground">AI is creating your video</p>
                    </div>
                  ) : project.status === 'queued' ? (
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-yellow-500 mb-2 mx-auto" />
                      <p className="text-sm text-yellow-500 font-medium">In Queue</p>
                      <p className="text-xs text-muted-foreground">Waiting to start</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mb-2 mx-auto" />
                      <p className="text-sm text-red-500 font-medium">Failed</p>
                      <p className="text-xs text-muted-foreground cursor-pointer">Click to retry</p>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {project.settings.targetDurationSec}s target
                  </div>
                  {project.duration && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Video className="h-4 w-4 mr-2" />
                      {Math.round(project.duration / 1000)}s final
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {project.status === 'ready' ? (
                    <>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleView(project.id, project.topic, project)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(project.id, project.topic)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  ) : project.status === 'failed' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleRetry(project.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      disabled
                    >
                      {project.status === 'processing' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          In Queue
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Ready</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'processing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Queued</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'queued').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.topic}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video 
              controls 
              autoPlay
              muted
              className="w-full h-full"
              poster={`https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=${encodeURIComponent(selectedVideo?.topic.substring(0, 20) || '')}`}
            >
              <source 
                src={getVideoForTopic(selectedVideo?.topic || '')} 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
            {/* Video Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{selectedVideo?.topic}</h4>
                  <p className="text-sm text-gray-300">
                    {selectedVideo?.project?.settings?.aspectRatio} • {selectedVideo?.project?.settings?.voiceStyle?.replace('_', ' ')} • {Math.round((selectedVideo?.project?.duration || 30000) / 1000)}s
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Demo Video</p>
                  <p className="text-xs text-gray-400">Your AI video will be here</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => handleDownload(selectedVideo?.id || '', selectedVideo?.topic)}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Video
            </Button>
            <Button 
              variant="outline"
              onClick={() => setSelectedVideo(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
