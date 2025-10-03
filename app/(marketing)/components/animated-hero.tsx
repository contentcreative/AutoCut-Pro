"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Video, Download } from "lucide-react";
import Link from "next/link";

export default function AnimatedHero() {
  return (
    <div className="text-center space-y-8">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
      >
        <Zap className="w-4 h-4 mr-2" />
        AI-Powered Video Export Platform
      </motion.div>

      {/* Main Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Export Videos in
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}Multiple Formats
          </span>
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl text-muted-foreground">
            Instantly
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your content for TikTok, YouTube, Instagram, and more with our 
          <strong className="text-foreground"> professional video export platform</strong>. 
          Powered by FFmpeg and AI-driven processing.
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
          <Link href="/dashboard">
            Start Exporting
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
          <Play className="mr-2 h-5 w-5" />
          Watch Demo
        </Button>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 pt-8"
      >
        <div className="flex items-center px-4 py-2 bg-secondary/50 rounded-full text-sm">
          <Video className="w-4 h-4 mr-2 text-primary" />
          TikTok, YouTube, Instagram
        </div>
        <div className="flex items-center px-4 py-2 bg-secondary/50 rounded-full text-sm">
          <Zap className="w-4 h-4 mr-2 text-primary" />
          Real-time Processing
        </div>
        <div className="flex items-center px-4 py-2 bg-secondary/50 rounded-full text-sm">
          <Download className="w-4 h-4 mr-2 text-primary" />
          Instant Downloads
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50"
      >
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">10+</div>
          <div className="text-sm text-muted-foreground">Export Formats</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">5x</div>
          <div className="text-sm text-muted-foreground">Faster Processing</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
          <div className="text-sm text-muted-foreground">Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
          <div className="text-sm text-muted-foreground">Support</div>
        </div>
      </motion.div>
    </div>
  );
}