/**
 * Source Videos page for AutoCut Pro dashboard
 * Allows users to manage their uploaded video files
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileVideo, 
  Download, 
  Trash2, 
  Eye,
  Calendar,
  HardDrive,
  Play
} from "lucide-react";

export default function SourceVideosPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Source Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage your uploaded video files and create exports
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2GB</div>
            <p className="text-xs text-muted-foreground">
              of 50GB available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Upload</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">
              Campaign video v3.mp4
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Video List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Videos</CardTitle>
          <CardDescription>
            Upload and manage your source video files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample Video Items */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileVideo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Campaign Video v3.mp4</h4>
                  <p className="text-sm text-muted-foreground">2.4GB • 4K • 3:45 duration</p>
                  <p className="text-xs text-muted-foreground">Uploaded 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Ready</Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileVideo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Product Demo.mp4</h4>
                  <p className="text-sm text-muted-foreground">1.8GB • 1080p • 2:30 duration</p>
                  <p className="text-xs text-muted-foreground">Uploaded 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Ready</Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileVideo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Tutorial Series - Part 1.mov</h4>
                  <p className="text-sm text-muted-foreground">3.1GB • 4K • 8:15 duration</p>
                  <p className="text-xs text-muted-foreground">Uploaded 3 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Ready</Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Empty State */}
            <div className="text-center py-12 text-muted-foreground">
              <FileVideo className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No more videos to display</p>
              <p className="text-sm">Upload your first video to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
          <CardDescription>
            Best practices for video uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Supported Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MP4 (recommended)</li>
                <li>• MOV (Apple QuickTime)</li>
                <li>• AVI (Audio Video Interleave)</li>
                <li>• WebM (web-optimized)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximum file size: 10GB</li>
                <li>• Resolution: up to 4K (3840×2160)</li>
                <li>• Duration: no limit</li>
                <li>• Frame rate: up to 60fps</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 