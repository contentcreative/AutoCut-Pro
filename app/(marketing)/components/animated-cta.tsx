"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap } from "lucide-react";
import Link from "next/link";

export default function AnimatedCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center space-y-8"
    >
      {/* Main CTA */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold">
          Ready to transform your
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}content workflow?
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of creators who are already using AutoCut Pro to export 
          their videos faster and more efficiently than ever before.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">Free to get started</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">No credit card required</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">Cancel anytime</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
          <Link href="/dashboard">
            <Zap className="mr-2 h-5 w-5" />
            Start Exporting Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
          <Link href="/pricing">
            View Pricing Plans
          </Link>
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="pt-8 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-4">
          Trusted by creators at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-lg font-semibold">TikTok</div>
          <div className="text-lg font-semibold">YouTube</div>
          <div className="text-lg font-semibold">Instagram</div>
          <div className="text-lg font-semibold">LinkedIn</div>
          <div className="text-lg font-semibold">Twitter</div>
        </div>
      </div>
    </motion.div>
  );
}