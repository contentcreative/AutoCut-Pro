/**
 * Virality Score Calculation
 * 
 * Computes a normalized virality score (0-5) for trending videos based on:
 * - Views, likes, comments, shares (weighted)
 * - Recency (per-hour engagement rate)
 * - Duration penalty for overly long "shorts"
 */

export type ViralityInput = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  ageHours: number;
  durationSec?: number;
};

export type ViralityBreakdown = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  ageHours: number;
  durationSec?: number;
  durationPenalty?: number;
  finalScore?: number;
};

/**
 * Compute virality score for a video
 * 
 * @param v - Video metrics input
 * @returns Object containing score (0-5) and detailed breakdown
 */
export function computeViralityScore(v: ViralityInput): {
  score: number;
  breakdown: ViralityBreakdown;
} {
  // Normalize per-hour engagement to favor recency
  const perHour = (x: number) => x / Math.max(v.ageHours, 1);
  
  // Weights for different engagement metrics
  const w = {
    views: 0.35,
    likes: 0.25,
    comments: 0.2,
    shares: 0.2,
  };
  
  // Calculate raw score using logarithmic scale to handle large numbers
  const raw =
    w.views * Math.log10(1 + perHour(v.views)) +
    w.likes * Math.log10(1 + perHour(v.likes)) +
    w.comments * Math.log10(1 + perHour(v.comments)) +
    w.shares * Math.log10(1 + perHour(v.shares));
  
  // Optional duration penalty for very long videos in shorts context
  const durPenalty = v.durationSec && v.durationSec > 75 ? 0.9 : 1;
  
  // Cap score at 5 and round to 4 decimal places
  const score = +(Math.min(raw * durPenalty, 5)).toFixed(4);
  
  return {
    score,
    breakdown: {
      ...w,
      ageHours: v.ageHours,
      durationSec: v.durationSec,
      durationPenalty: durPenalty < 1 ? durPenalty : undefined,
      finalScore: score,
    },
  };
}

/**
 * Format a number for display (K, M, B suffixes)
 */
export function formatMetricNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Calculate age in hours from a date
 */
export function calculateAgeHours(publishedAt: Date | null | undefined): number {
  if (!publishedAt) return 24; // Default to 24 hours if unknown
  
  const now = new Date();
  const ageMs = now.getTime() - new Date(publishedAt).getTime();
  return Math.max(1, ageMs / (1000 * 60 * 60)); // Convert to hours, minimum 1
}

