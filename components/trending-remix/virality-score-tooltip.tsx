'use client';

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ViralityBreakdown } from "@/types/trending-remix";

interface ViralityScoreTooltipProps {
  score: number;
  breakdown: ViralityBreakdown | null;
  className?: string;
}

export function ViralityScoreTooltip({ score, breakdown, className }: ViralityScoreTooltipProps) {
  const safeScore = score || 0;
  
  if (!breakdown) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        {safeScore.toFixed(2)} <Info className="h-3 w-3" />
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Badge variant="secondary" className={`flex items-center gap-1 cursor-help ${className}`}>
              {safeScore.toFixed(2)} <Info className="h-3 w-3" />
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-3">
            <div className="font-semibold text-sm">Virality Score Breakdown</div>
            
            {/* Score components */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Views (35%)</span>
                <span className="font-mono">{(breakdown.views?.normalizedScore || 0).toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Likes (25%)</span>
                <span className="font-mono">{(breakdown.likes?.normalizedScore || 0).toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Comments (20%)</span>
                <span className="font-mono">{(breakdown.comments?.normalizedScore || 0).toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Shares (20%)</span>
                <span className="font-mono">{(breakdown.shares?.normalizedScore || 0).toFixed(3)}</span>
              </div>
            </div>
            
            <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
              <div>Age: {(breakdown.ageHours || 0).toFixed(1)} hours</div>
              {breakdown.durationPenalty && breakdown.durationPenalty < 1 && (
                <div>Duration penalty: {((1 - breakdown.durationPenalty) * 100).toFixed(0)}%</div>
              )}
              <div>Final score: {(breakdown.finalScore || 0).toFixed(4)}</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
