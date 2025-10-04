import { ExportCreateDialog, ExportJobsTable } from "@/components/exports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Plus,
  ArrowRight,
  FileVideo,
  Settings,
  Palette,
  Target,
  Zap,
  Download,
  Clock,
  CheckCircle,
  Play,
  Layers
} from "lucide-react";
import Link from "next/link";

export default function ExportsPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Video Exports</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your video exports with multiple formats, brand overlays, and professional settings.
          </p>
        </div>
        <ExportCreateDialog />
      </div>

      {/* Export Stats - Real data will be loaded here */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Successfully exported
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Per export job
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Export success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Export Options */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Quick Export Templates</h2>
            <p className="text-muted-foreground">Start with pre-configured templates for popular platforms</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TT</span>
                </div>
                <div>
                  <h4 className="font-semibold">TikTok Vertical</h4>
                  <p className="text-xs text-muted-foreground">9:16 • 1080x1920 • 30fps</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">6Mbps</Badge>
                  <Badge variant="outline" className="text-xs">H.264</Badge>
                  <Badge variant="outline" className="text-xs">Brand Overlay</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Quick Export
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IG</span>
                </div>
                <div>
                  <h4 className="font-semibold">Instagram Stories</h4>
                  <p className="text-xs text-muted-foreground">9:16 • 1080x1920 • 30fps</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">8Mbps</Badge>
                  <Badge variant="outline" className="text-xs">H.264</Badge>
                  <Badge variant="outline" className="text-xs">Brand Overlay</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Quick Export
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">YT</span>
                </div>
                <div>
                  <h4 className="font-semibold">YouTube Shorts</h4>
                  <p className="text-xs text-muted-foreground">9:16 • 1080x1920 • 30fps</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">12Mbps</Badge>
                  <Badge variant="outline" className="text-xs">H.264</Badge>
                  <Badge variant="outline" className="text-xs">Thumbnail</Badge>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Quick Export
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Export Configuration */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Export Configuration
            </CardTitle>
            <CardDescription>
              Fine-tune your exports with professional settings and custom formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Video Quality</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolution</span>
                    <Badge variant="outline">1080p</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bitrate</span>
                    <Badge variant="outline">6Mbps</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frame Rate</span>
                    <Badge variant="outline">30fps</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Brand Overlays</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logo Position</span>
                    <Badge variant="outline">Top Right</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opacity</span>
                    <Badge variant="outline">80%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Size</span>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Output Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Format</span>
                    <Badge variant="outline">MP4</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Codec</span>
                    <Badge variant="outline">H.264</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audio</span>
                    <Badge variant="outline">AAC</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Additional</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thumbnails</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Metadata</span>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ZIP Output</span>
                    <Badge variant="outline">Yes</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button asChild>
                <Link href="/dashboard/targets">
                  <Target className="mr-2 h-4 w-4" />
                  Manage Templates
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/members">
                  <Palette className="mr-2 h-4 w-4" />
                  Brand Kit Settings
                </Link>
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Export Jobs Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Export Jobs</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/data-source">
              <FileVideo className="mr-2 h-4 w-4" />
              Manage Source Videos
            </Link>
          </Button>
        </div>
        <ExportJobsTable />
      </div>
    </main>
  );
}