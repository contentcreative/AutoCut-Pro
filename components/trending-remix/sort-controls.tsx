'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortOption } from "@/types/trending-remix";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

const sortOptions: Omit<SortOption, 'direction'>[] = [
  { key: 'viralityScore', label: 'Virality Score' },
  { key: 'viewsCount', label: 'Views' },
  { key: 'likesCount', label: 'Likes' },
  { key: 'commentsCount', label: 'Comments' },
  { key: 'sharesCount', label: 'Shares' },
  { key: 'publishedAt', label: 'Published Date' },
  { key: 'durationSeconds', label: 'Duration' },
];

export function SortControls({ sortBy, onSortChange, className }: SortControlsProps) {
  const handleKeyChange = (key: SortOption['key']) => {
    const option = sortOptions.find(opt => opt.key === key);
    if (option) {
      onSortChange({
        key,
        label: option.label,
        direction: sortBy.direction,
      });
    }
  };

  const handleDirectionToggle = () => {
    onSortChange({
      ...sortBy,
      direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={sortBy.key} onValueChange={handleKeyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDirectionToggle}
        className="px-2"
      >
        {sortBy.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
