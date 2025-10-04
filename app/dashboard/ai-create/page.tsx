/**
 * AI Video Creation page
 * Allows users to create faceless short-form videos from scratch using AI
 */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Wand2, 
  Video, 
  Target, 
  Clock,
  Settings,
  Play,
  Sparkles,
  FileText,
  Mic,
  Image,
  Download,
  RefreshCw
} from "lucide-react";
import { createAIVideoProject } from "@/actions/ai-video-actions";
import { toast } from "sonner";

export default function AICreatePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    voiceStyle: 'narration_female',
    aspectRatio: '9:16',
    targetDuration: 30,
    captionsTheme: 'bold-yellow',
    generateThumbnails: true,
  });

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic for your video');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createAIVideoProject({
        topic: formData.topic,
        settings: {
          voiceStyle: formData.voiceStyle,
          aspectRatio: formData.aspectRatio as '9:16' | '1:1' | '16:9',
          targetDurationSec: formData.targetDuration,
          captionsTheme: formData.captionsTheme,
        }
      });
      
      toast.success('AI video generation started! Check your projects for progress.');
      
      // Reset form
      setFormData({
        topic: '',
        voiceStyle: 'narration_female',
        aspectRatio: '9:16',
        targetDuration: 30,
        captionsTheme: 'bold-yellow',
        generateThumbnails: true,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to start video generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Video Creation
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate faceless short-form videos from any topic, fully automated.
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate from Topic
            </CardTitle>
            <CardDescription>
              Enter a topic and customize settings to create your AI-powered video.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Video Topic</Label>
              <Input 
                id="topic" 
                placeholder="e.g., 'The Future of AI in daily life'" 
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="mt-1" 
              />
              <p className="text-sm text-muted-foreground">
                A concise topic (3-120 characters) for your video.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voiceStyle">Voice Style</Label>
                <Select 
                  value={formData.voiceStyle} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, voiceStyle: value }))}
                >
                  <SelectTrigger id="voiceStyle" className="mt-1">
                    <SelectValue placeholder="Select a voice style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narration_female">Female Narrator</SelectItem>
                    <SelectItem value="narration_male">Male Narrator</SelectItem>
                    <SelectItem value="upbeat_female">Upbeat Female</SelectItem>
                    <SelectItem value="calm_male">Calm Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select 
                  value={formData.aspectRatio} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, aspectRatio: value }))}
                >
                  <SelectTrigger id="aspectRatio" className="mt-1">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (Vertical - TikTok, Reels)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square - Instagram)</SelectItem>
                    <SelectItem value="16:9">16:9 (Horizontal - YouTube)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Target Duration: {formData.targetDuration} seconds</Label>
              <input
                type="range"
                id="duration"
                min="15"
                max="90"
                step="5"
                value={formData.targetDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDuration: parseInt(e.target.value) }))}
                className="w-full mt-3"
              />
              <p className="text-sm text-muted-foreground">
                Roughly how long should the final video be (15-90 seconds).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="captionsTheme">Captions Theme</Label>
              <Select 
                value={formData.captionsTheme} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, captionsTheme: value }))}
              >
                <SelectTrigger id="captionsTheme" className="mt-1">
                  <SelectValue placeholder="Select captions theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bold-yellow">Bold Yellow</SelectItem>
                  <SelectItem value="clean-white">Clean White</SelectItem>
                  <SelectItem value="modern-gradient">Modern Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="generateThumbnails" 
                checked={formData.generateThumbnails}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, generateThumbnails: !!checked }))}
              />
              <Label htmlFor="generateThumbnails">Generate Thumbnail</Label>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic.trim()}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate AI Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generation Process Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Generation Process
              </CardTitle>
              <CardDescription>
                Here&apos;s what happens when you create an AI video.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">1. Script Generation</h4>
                  <p className="text-sm text-muted-foreground">AI creates engaging content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">2. Voiceover</h4>
                  <p className="text-sm text-muted-foreground">Natural-sounding narration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Image className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">3. Stock Footage</h4>
                  <p className="text-sm text-muted-foreground">Relevant B-roll selection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Video className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">4. Final Assembly</h4>
                  <p className="text-sm text-muted-foreground">Complete video with captions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Topic Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Be specific and actionable. &quot;How to meditate for beginners&quot; works better than just &quot;meditation&quot;.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Duration Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Shorter videos (30-45s) perform better on TikTok and Instagram Stories.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Aspect Ratio</h4>
                <p className="text-sm text-muted-foreground">
                  Choose 9:16 for vertical platforms, 16:9 for YouTube, or 1:1 for Instagram feed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}