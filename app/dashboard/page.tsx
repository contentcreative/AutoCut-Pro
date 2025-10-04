/**
 * Dashboard page for AutoCut Pro
 * Displays the main dashboard interface for authenticated users
 * Features three main AI-powered video creation tools
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Zap, 
  Download, 
  Clock, 
  TrendingUp, 
  Plus,
  ArrowRight,
  FileVideo,
  CheckCircle,
  Palette,
  Settings,
  Layers,
  Sparkles,
  Target,
  Play,
  FolderOpen,
  Calendar,
  Users,
  Brain,
  RefreshCw,
  Package,
  Wand2,
  TrendingDown,
  Upload
} from "lucide-react";
import Link from "next/link";

/**
 * Main dashboard page component
 * Features three main AI-powered video creation tools
 */
export default function DashboardPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to AutoCut Pro</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered video creation platform. Generate, remix, and export professional content across all platforms.
        </p>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Video Creation */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Video Creation</CardTitle>
                <Badge variant="secondary" className="mt-1">From Scratch</Badge>
              </div>
            </div>
            <CardDescription>
              Generate faceless short-form videos from any topic. AI creates script, voiceover, selects stock footage, and produces a complete video.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wand2 className="h-4 w-4" />
                <span>AI Script Generation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>Auto Voiceover & B-roll</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Platform-Optimized Output</span>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/dashboard/ai-create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create AI Video
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trending Remix */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Trending Remix</CardTitle>
                <Badge variant="secondary" className="mt-1">Trend-Based</Badge>
              </div>
            </div>
            <CardDescription>
              Discover trending content, analyze virality scores, and create original faceless remixes that capitalize on trending topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span>Trend Discovery & Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
                <span>AI Script Rewriting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Instant Viral Content</span>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/dashboard/trending-remix">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Trends
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smart Exports */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Smart Exports</CardTitle>
                <Badge variant="secondary" className="mt-1">Multi-Format</Badge>
              </div>
            </div>
            <CardDescription>
              Package your content into ready-to-post bundles with multiple formats, branded thumbnails, and platform-specific optimizations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>Multi-Platform Formats</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Palette className="h-4 w-4" />
                <span>Brand Kit Integration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>One-Click Export</span>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/dashboard/exports">
                  <Package className="mr-2 h-4 w-4" />
                  Smart Export
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Overview */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">How AutoCut Pro Works</h2>
          <p className="text-muted-foreground">Three powerful ways to create professional video content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold">Choose Your Method</h4>
            <p className="text-sm text-muted-foreground">
              Start from scratch with AI, remix trending content, or export existing videos
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold">AI Processing</h4>
            <p className="text-sm text-muted-foreground">
              Our AI handles script writing, voiceover, stock footage, and video assembly
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold">Export & Share</h4>
            <p className="text-sm text-muted-foreground">
              Get professional videos optimized for all platforms with your brand styling
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="text-muted-foreground">Get started with your first video creation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">Create from Topic</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Generate a complete video from just a topic idea
              </p>
              <Button size="sm" className="w-full" asChild>
                <Link href="/dashboard/ai-create">
                  Start Creating
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-semibold mb-1">Find Trends</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Discover what&apos;s trending in your niche
              </p>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/dashboard/trending-remix">
                  Explore Trends
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold mb-1">Upload Video</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upload existing content for processing
              </p>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/dashboard/data-source">
                  Upload Now
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Palette className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold mb-1">Setup Brand Kit</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Configure your brand identity and styling
              </p>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/dashboard/members">
                  Configure
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Support */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Supported Platforms</CardTitle>
            <CardDescription>
              Optimize your content for all major social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5">
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TT</span>
                </div>
                <div>
                  <div className="font-medium text-sm">TikTok</div>
                  <div className="text-xs text-muted-foreground">9:16 Vertical</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">IG</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Instagram</div>
                  <div className="text-xs text-muted-foreground">Stories & Reels</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10">
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">YT</span>
                </div>
                <div>
                  <div className="font-medium text-sm">YouTube</div>
                  <div className="text-xs text-muted-foreground">Shorts & Long-form</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">LI</span>
                </div>
                <div>
                  <div className="font-medium text-sm">LinkedIn</div>
                  <div className="text-xs text-muted-foreground">Professional</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 