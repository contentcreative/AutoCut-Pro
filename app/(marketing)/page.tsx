/**
 * Landing page for AutoCut Pro
 * Professional video export platform for content creators
 * Uses ShadCN components for consistent styling and separate client components for animations
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Video, Zap, Download, Github, Twitter, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import AnimatedHero from "./components/animated-hero";
import AnimatedFeatures from "./components/animated-features";
import AnimatedReviews from "./components/animated-reviews";
import AnimatedCTA from "./components/animated-cta";

// Reviews data
const reviews = [
  {
    name: "Sarah Chen",
    title: "Content Creator",
    content: "AutoCut Pro has completely transformed my workflow. I can now export videos for TikTok, YouTube, and Instagram in one click. The quality is amazing and it saves me hours every week!",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    title: "Marketing Director",
    content: "Our team exports hundreds of videos monthly for different social platforms. AutoCut Pro's batch processing and brand kit features have made our content creation 10x more efficient.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    title: "YouTuber",
    content: "The thumbnail generation and metadata features are game-changers. I can create professional-looking content for all platforms without any technical knowledge. Absolutely love it!",
    rating: 5
  },
  {
    name: "Alex Kim",
    title: "Social Media Manager",
    content: "The real-time progress tracking and instant downloads make managing multiple client projects so much easier. The FFmpeg processing is incredibly fast and reliable.",
    rating: 5
  },
  {
    name: "Jordan Lee",
    title: "Video Editor",
    content: "As a professional editor, I need tools that can handle high-quality exports. AutoCut Pro delivers professional results with custom bitrates and resolution options. Highly recommended!",
    rating: 5
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">AutoCut Pro</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/#reviews" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </Link>
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost">
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 md:px-6 lg:pt-28 lg:pb-32 relative bg-gradient-to-b from-background to-background/95">
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNi02aDZ2LTZoLTZ2NnptLTEyIDEyaDZ2LTZoLTZ2NnptLTYtNmg2di02aC02djZ6bS02LTZoNnYtNmgtNnY2em0xMi0xMmg2di02aC02djZ6bTYtNmg2VjZoLTZ2NnptLTYtNnY2aDZWNmgtNnptLTYgMTJoNnYtNmgtNnY2em0tNi02aDZWNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 mix-blend-soft-light pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <AnimatedHero />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-6 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <AnimatedFeatures />
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <AnimatedReviews reviews={reviews} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <AnimatedCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Video className="h-6 w-6 mr-2 text-primary" />
                AutoCut Pro
              </h3>
              <p className="text-muted-foreground max-w-md">
                The professional video export platform that transforms your content for TikTok, YouTube, Instagram, and more with AI-powered processing.
              </p>
              <div className="flex space-x-4 mt-6">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard/exports" className="text-muted-foreground hover:text-foreground transition-colors">Export Jobs</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status Page</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AutoCut Pro. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
