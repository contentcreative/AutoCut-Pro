/**
 * Export Templates page for AutoCut Pro dashboard
 * Allows users to create and manage export templates for different platforms
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Video, 
  Copy, 
  Edit, 
  Trash2,
  Zap,
  Download,
  Settings,
  Star,
  TrendingUp
} from "lucide-react";

export default function ExportTemplatesPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Export Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage export templates for different platforms and use cases
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Template Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Social Pack</div>
            <p className="text-xs text-muted-foreground">
              24 uses this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5h</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Starred templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-primary" />
              Social Media Pack
            </CardTitle>
            <CardDescription>
              TikTok, Instagram, and YouTube formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">TikTok (9:16)</span>
                <Badge variant="outline">1080×1920</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Instagram (1:1)</span>
                <Badge variant="outline">1080×1080</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">YouTube (16:9)</span>
                <Badge variant="outline">1920×1080</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-primary" />
              YouTube Creator
            </CardTitle>
            <CardDescription>
              Multiple YouTube formats with thumbnails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">YouTube HD</span>
                <Badge variant="outline">1920×1080</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">YouTube 720p</span>
                <Badge variant="outline">1280×720</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Thumbnails</span>
                <Badge variant="secondary">3 variants</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Star className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-primary" />
              LinkedIn Professional
            </CardTitle>
            <CardDescription>
              Professional formats for LinkedIn content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">LinkedIn Square</span>
                <Badge variant="outline">1080×1080</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">LinkedIn Video</span>
                <Badge variant="outline">1280×720</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Brand Kit</span>
                <Badge variant="secondary">Applied</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-primary" />
              Instagram Stories
            </CardTitle>
            <CardDescription>
              Vertical format optimized for Instagram Stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stories (9:16)</span>
                <Badge variant="outline">1080×1920</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reels (9:16)</span>
                <Badge variant="outline">1080×1920</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IGTV Cover</span>
                <Badge variant="outline">1080×1350</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Star className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-primary" />
              TikTok Viral
            </CardTitle>
            <CardDescription>
              Optimized for TikTok algorithm and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">TikTok (9:16)</span>
                <Badge variant="outline">1080×1920</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High Quality</span>
                <Badge variant="secondary">6M bitrate</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Thumbnails</span>
                <Badge variant="secondary">5 variants</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="flex items-center text-muted-foreground">
              <Plus className="mr-2 h-5 w-5" />
              Create New Template
            </CardTitle>
            <CardDescription>
              Build a custom export template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create a custom template with your preferred formats, settings, and brand configurations.
            </p>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Template Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Template Usage Analytics</CardTitle>
          <CardDescription>
            Track which templates are used most frequently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Social Media Pack</h4>
                  <p className="text-sm text-muted-foreground">24 uses this month</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-medium">100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-medium">TikTok Viral</h4>
                  <p className="text-sm text-muted-foreground">18 uses this month</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-medium">YouTube Creator</h4>
                  <p className="text-sm text-muted-foreground">12 uses this month</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm font-medium">50%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 