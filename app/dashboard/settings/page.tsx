/**
 * Settings page for AutoCut Pro dashboard
 * Allows users to configure their account and application settings
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download,
  Zap,
  Palette,
  Settings as SettingsIcon,
  Save,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="max-w-4xl space-y-6">
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" placeholder="Your company name" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Export Settings
            </CardTitle>
            <CardDescription>
              Configure your default export preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-quality">Default Quality</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="high">High (6M bitrate)</option>
                  <option value="medium" selected>Medium (4M bitrate)</option>
                  <option value="low">Low (2M bitrate)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-fps">Default Frame Rate</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="30" selected>30 FPS</option>
                  <option value="60">60 FPS</option>
                  <option value="24">24 FPS</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Thumbnails</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate thumbnails for all exports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when exports are completed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-delete Source Videos</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete source videos after 30 days
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Export Settings
            </Button>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Storage Settings
            </CardTitle>
            <CardDescription>
              Manage your storage usage and download preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">8.2GB</div>
                <div className="text-sm text-muted-foreground">Used Storage</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">50GB</div>
                <div className="text-sm text-muted-foreground">Total Storage</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">16%</div>
                <div className="text-sm text-muted-foreground">Usage</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-cleanup Completed Exports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete completed exports after 7 days
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="download-format">Download Format</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="zip" selected>ZIP Archive</option>
                  <option value="individual">Individual Files</option>
                </select>
              </div>
            </div>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All Data
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Completed</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when export jobs are completed
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Failed</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when export jobs fail
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Storage Warnings</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when storage is running low
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Product Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about new features and updates
                </p>
              </div>
              <Switch />
            </div>
            
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="p-3 border rounded-lg bg-secondary/50">
                  <div className="font-medium">Pro Plan</div>
                  <div className="text-sm text-muted-foreground">$29/month • 50GB storage</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Next Billing Date</Label>
                <div className="p-3 border rounded-lg bg-secondary/50">
                  <div className="font-medium">March 15, 2024</div>
                  <div className="text-sm text-muted-foreground">Monthly subscription</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Update Payment Method
              </Button>
              <Button variant="outline">
                View Billing History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Delete All Data</h4>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete all your videos, exports, and account data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Delete All Data
              </Button>
            </div>
            
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Cancel Subscription</h4>
              <p className="text-sm text-red-700 mb-4">
                Cancel your subscription and lose access to premium features. You can reactivate anytime.
              </p>
              <Button variant="destructive" size="sm">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 