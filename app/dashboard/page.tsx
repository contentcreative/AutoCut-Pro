/**
 * Dashboard page for AutoCut Pro
 * Displays the main dashboard interface for authenticated users
 * Features video export statistics and quick actions
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
  CheckCircle
} from "lucide-react";
import Link from "next/link";

/**
 * Main dashboard page component
 * Shows export statistics and quick actions
 */
export default function DashboardPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your video exports and track your content creation workflow
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/exports">
            <Plus className="mr-2 h-4 w-4" />
            Create Export
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3min</div>
            <p className="text-xs text-muted-foreground">
              Average per export
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2GB</div>
            <p className="text-xs text-muted-foreground">
              of 50GB available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">
              Export success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/exports">
                <Video className="mr-2 h-4 w-4" />
                Create New Export
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Recent Export
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest export jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">TikTok Campaign Export</p>
                  <p className="text-xs text-muted-foreground">Completed 2 minutes ago</p>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Instagram Stories Pack</p>
                  <p className="text-xs text-muted-foreground">Processing... 45%</p>
                </div>
                <Badge variant="outline">Processing</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">YouTube Thumbnail Set</p>
                  <p className="text-xs text-muted-foreground">Completed 1 hour ago</p>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            New to AutoCut Pro? Here&apos;s how to create your first export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <FileVideo className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">1. Upload Video</h4>
              <p className="text-sm text-muted-foreground">
                Upload your source video file (MP4, MOV, AVI)
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Video className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">2. Select Formats</h4>
              <p className="text-sm text-muted-foreground">
                Choose TikTok, YouTube, Instagram, and other formats
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Download className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">3. Download Results</h4>
              <p className="text-sm text-muted-foreground">
                Get your formatted videos as a ZIP file
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link href="/dashboard/exports">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Export
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 