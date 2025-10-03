"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  title: string;
  content: string;
  rating: number;
}

interface AnimatedReviewsProps {
  reviews: Review[];
}

export default function AnimatedReviews({ reviews }: AnimatedReviewsProps) {
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
          Loved by content creators
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}worldwide
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See what our users say about AutoCut Pro&apos;s powerful export capabilities.
        </p>
      </motion.div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/60" />
                  
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Review Content */}
                  <p className="text-muted-foreground leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  
                  {/* Author */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="font-semibold text-foreground">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-secondary/20 rounded-2xl p-8 md:p-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Videos Exported</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Happy Creators</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50TB+</div>
            <div className="text-sm text-muted-foreground">Data Processed</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}