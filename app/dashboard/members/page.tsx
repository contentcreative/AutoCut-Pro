/**
 * Brand Kits page for AutoCut Pro dashboard
 * Allows users to create and manage brand kits for video exports
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Palette, 
  Upload, 
  Edit, 
  Trash2,
  Eye,
  Star,
  Image,
  Settings,
  Copy
} from "lucide-react";

export default function BrandKitsPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Brand Kits</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage brand kits for consistent video exports
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Brand Kit
        </Button>
      </div>

      {/* Brand Kit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kits</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +1 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Kit</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Main Brand</div>
            <p className="text-xs text-muted-foreground">
              Default brand kit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Logos & overlays
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Exports this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Main Brand Kit
              </CardTitle>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
            <CardDescription>
              Primary brand kit with logo and colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AC</span>
                </div>
                <div>
                  <h4 className="font-medium">AutoCut Logo</h4>
                  <p className="text-sm text-muted-foreground">PNG • 512×512</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Brand Colors</h5>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded bg-blue-500 border"></div>
                  <div className="w-6 h-6 rounded bg-purple-600 border"></div>
                  <div className="w-6 h-6 rounded bg-gray-800 border"></div>
                  <div className="w-6 h-6 rounded bg-white border"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              Client Brand A
            </CardTitle>
            <CardDescription>
              Brand kit for Client A projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CA</span>
                </div>
                <div>
                  <h4 className="font-medium">Client A Logo</h4>
                  <p className="text-sm text-muted-foreground">SVG • Vector</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Brand Colors</h5>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded bg-green-500 border"></div>
                  <div className="w-6 h-6 rounded bg-teal-600 border"></div>
                  <div className="w-6 h-6 rounded bg-gray-900 border"></div>
                  <div className="w-6 h-6 rounded bg-white border"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Star className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              Minimal Kit
            </CardTitle>
            <CardDescription>
              Clean, minimal brand kit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-medium">Minimal Logo</h4>
                  <p className="text-sm text-muted-foreground">PNG • 256×256</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Brand Colors</h5>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded bg-gray-800 border"></div>
                  <div className="w-6 h-6 rounded bg-gray-600 border"></div>
                  <div className="w-6 h-6 rounded bg-gray-400 border"></div>
                  <div className="w-6 h-6 rounded bg-white border"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Star className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="flex items-center text-muted-foreground">
              <Plus className="mr-2 h-5 w-5" />
              Create New Brand Kit
            </CardTitle>
            <CardDescription>
              Build a custom brand kit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new brand kit with your logo, colors, and overlay settings.
            </p>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Brand Kit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Brand Kit Features */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Kit Features</CardTitle>
          <CardDescription>
            What you can do with brand kits in AutoCut Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Image className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">Logo Overlays</h4>
              <p className="text-sm text-muted-foreground">
                Automatically apply your logo to all exports with custom positioning
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Palette className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">Color Schemes</h4>
              <p className="text-sm text-muted-foreground">
                Define primary and secondary colors for consistent branding
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Settings className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">Custom Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure opacity, size, and position for each platform
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Copy className="h-6 w-6" />
              </div>
              <h4 className="font-semibold">Quick Apply</h4>
              <p className="text-sm text-muted-foreground">
                Apply brand kits to any export with one click
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 