'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AdvancedFilters } from "@/types/trending-remix";

interface AdvancedFiltersPanelProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
}

export function AdvancedFiltersPanel({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<AdvancedFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const updateDateRange = (field: 'start' | 'end', date: Date | undefined) => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: date || null,
      },
    });
  };

  const updateViewCountRange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : null;
    updateFilters({
      viewCountRange: {
        ...filters.viewCountRange,
        [field]: numValue,
      },
    });
  };

  const updateDurationRange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : null;
    updateFilters({
      durationRange: {
        ...filters.durationRange,
        [field]: numValue,
      },
    });
  };

  const updateEngagementFilters = (field: 'minLikes' | 'minComments' | 'minShares', value: string) => {
    const numValue = value ? parseInt(value) : null;
    updateFilters({
      engagementFilters: {
        ...filters.engagementFilters,
        [field]: numValue,
      },
    });
  };

  const updatePlatformSpecific = (platform: 'youtube' | 'tiktok' | 'instagram', field: string, value: any) => {
    updateFilters({
      platformSpecific: {
        ...filters.platformSpecific,
        [platform]: {
          ...filters.platformSpecific[platform],
          [field]: value,
        },
      },
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.viewCountRange.min !== null ||
      filters.viewCountRange.max !== null ||
      filters.durationRange.min !== null ||
      filters.durationRange.max !== null ||
      filters.engagementFilters.minLikes !== null ||
      filters.engagementFilters.minComments !== null ||
      filters.engagementFilters.minShares !== null ||
      filters.platformSpecific.youtube.duration !== 'all' ||
      filters.platformSpecific.tiktok.music !== null ||
      filters.platformSpecific.instagram.reels !== null
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              {hasActiveFilters() && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Published Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.start ? format(filters.dateRange.start, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start || undefined}
                      onSelect={(date) => updateDateRange('start', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.end ? format(filters.dateRange.end, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end || undefined}
                      onSelect={(date) => updateDateRange('end', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* View Count Range */}
            <div className="space-y-2">
              <Label>View Count Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="views-min" className="text-xs text-muted-foreground">Min Views</Label>
                  <Input
                    id="views-min"
                    type="number"
                    placeholder="e.g., 10000"
                    value={filters.viewCountRange.min || ''}
                    onChange={(e) => updateViewCountRange('min', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="views-max" className="text-xs text-muted-foreground">Max Views</Label>
                  <Input
                    id="views-max"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={filters.viewCountRange.max || ''}
                    onChange={(e) => updateViewCountRange('max', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Duration Range */}
            <div className="space-y-2">
              <Label>Duration Range (seconds)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="duration-min" className="text-xs text-muted-foreground">Min Duration</Label>
                  <Input
                    id="duration-min"
                    type="number"
                    placeholder="e.g., 15"
                    value={filters.durationRange.min || ''}
                    onChange={(e) => updateDurationRange('min', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration-max" className="text-xs text-muted-foreground">Max Duration</Label>
                  <Input
                    id="duration-max"
                    type="number"
                    placeholder="e.g., 90"
                    value={filters.durationRange.max || ''}
                    onChange={(e) => updateDurationRange('max', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Engagement Filters */}
            <div className="space-y-2">
              <Label>Minimum Engagement</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="min-likes" className="text-xs text-muted-foreground">Min Likes</Label>
                  <Input
                    id="min-likes"
                    type="number"
                    placeholder="e.g., 100"
                    value={filters.engagementFilters.minLikes || ''}
                    onChange={(e) => updateEngagementFilters('minLikes', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="min-comments" className="text-xs text-muted-foreground">Min Comments</Label>
                  <Input
                    id="min-comments"
                    type="number"
                    placeholder="e.g., 50"
                    value={filters.engagementFilters.minComments || ''}
                    onChange={(e) => updateEngagementFilters('minComments', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="min-shares" className="text-xs text-muted-foreground">Min Shares</Label>
                  <Input
                    id="min-shares"
                    type="number"
                    placeholder="e.g., 20"
                    value={filters.engagementFilters.minShares || ''}
                    onChange={(e) => updateEngagementFilters('minShares', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Platform Specific Filters */}
            <div className="space-y-4">
              <Label>Platform Specific Filters</Label>
              
              {/* YouTube */}
              <div className="space-y-2">
                <Label className="text-sm">YouTube</Label>
                <Select
                  value={filters.platformSpecific.youtube.duration}
                  onValueChange={(value) => updatePlatformSpecific('youtube', 'duration', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Video duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All durations</SelectItem>
                    <SelectItem value="short">Short (&lt; 60s)</SelectItem>
                    <SelectItem value="medium">Medium (60s - 4m)</SelectItem>
                    <SelectItem value="long">Long (&gt; 4m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TikTok */}
              <div className="space-y-2">
                <Label className="text-sm">TikTok</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tiktok-music"
                    checked={filters.platformSpecific.tiktok.music || false}
                    onChange={(e) => updatePlatformSpecific('tiktok', 'music', e.target.checked)}
                  />
                  <Label htmlFor="tiktok-music" className="text-sm">Has background music</Label>
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label className="text-sm">Instagram</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="instagram-reels"
                    checked={filters.platformSpecific.instagram.reels || false}
                    onChange={(e) => updatePlatformSpecific('instagram', 'reels', e.target.checked)}
                  />
                  <Label htmlFor="instagram-reels" className="text-sm">Reels only</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
