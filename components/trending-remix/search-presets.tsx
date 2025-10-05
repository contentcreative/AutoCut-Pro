'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Star, Plus } from "lucide-react";
import { SearchPreset } from "@/types/trending-remix";
import { getSearchPresets } from "@/actions/trending-remix-actions";

interface SearchPresetsProps {
  onPresetSelect: (preset: SearchPreset) => void;
  onSaveCurrentAsPreset?: () => void;
  className?: string;
}

export function SearchPresets({ onPresetSelect, onSaveCurrentAsPreset, className }: SearchPresetsProps) {
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    getSearchPresets()
      .then(setPresets)
      .catch(console.error);
  }, []);

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      onPresetSelect(preset);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search Presets</span>
        </div>
        {onSaveCurrentAsPreset && (
          <Button variant="ghost" size="sm" onClick={onSaveCurrentAsPreset}>
            <Plus className="h-3 w-3 mr-1" />
            Save
          </Button>
        )}
      </div>
      
      <Select value={selectedPreset} onValueChange={handlePresetSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a preset..." />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex items-center gap-2">
                {preset.isDefault && <Star className="h-3 w-3 text-yellow-500" />}
                <span>{preset.name}</span>
                <Badge variant="outline" className="text-xs">
                  {preset.platforms.length} platform{preset.platforms.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {presets.slice(0, 3).map((preset) => (
            <Button
              key={preset.id}
              variant={selectedPreset === preset.id ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetSelect(preset.id)}
              className="h-7 text-xs"
            >
              {preset.name}
            </Button>
          ))}
          {presets.length > 3 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              +{presets.length - 3} more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
