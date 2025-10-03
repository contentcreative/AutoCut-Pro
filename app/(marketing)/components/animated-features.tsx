"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  Zap, 
  Download, 
  Shield, 
  Clock, 
  Palette,
  FileVideo,
  Settings,
  BarChart3,
  Cloud
} from "lucide-react";

const features = [
  {
    icon: <Video className="h-6 w-6" />,
    title: "Multi-Format Export",
    description: "Export to TikTok (9:16), YouTube (16:9), Instagram (1:1), and 7+ other formats with a single click."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast Processing",
    description: "Powered by FFmpeg and optimized workers. Process videos 5x faster than traditional tools."
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Instant Downloads",
    description: "Get your exports as downloadable ZIP files with thumbnails and metadata included."
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Brand Kit Integration",
    description: "Apply your logo, colors, and overlays automatically to all exports with custom positioning."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description: "Row-level security, encrypted storage, and secure signed URLs for all file downloads."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Progress",
    description: "Track your export jobs with live progress bars and status updates in your dashboard."
  },
  {
    icon: <FileVideo className="h-6 w-6" />,
    title: "Thumbnail Generation",
    description: "Automatically generate preview thumbnails for each format with custom timecode selection."
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Advanced Options",
    description: "Customize bitrate, FPS, resolution, and metadata overrides for professional results."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Usage Analytics",
    description: "Track your export history, storage usage, and processing statistics in detailed reports."
  }
];

export default function AnimatedFeatures() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          Everything you need to
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}export like a pro
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From content creators to marketing teams, AutoCut Pro provides the tools you need 
          to transform your videos for any platform.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Process Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-secondary/20 rounded-2xl p-8 md:p-12"
      >
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your content in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <FileVideo className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold">1. Upload Video</h4>
              <p className="text-sm text-muted-foreground">
                Upload your source video and select the formats you want to export to.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold">2. AI Processing</h4>
              <p className="text-sm text-muted-foreground">
                Our FFmpeg workers process your video with brand overlays and thumbnails.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Download className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold">3. Download Ready</h4>
              <p className="text-sm text-muted-foreground">
                Get your formatted videos as a ZIP file with all formats and metadata.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}