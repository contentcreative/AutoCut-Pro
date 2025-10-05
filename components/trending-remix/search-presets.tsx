'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bookmark, Star, Plus, X, ChevronDown } from "lucide-react";
import { SearchPreset } from "@/types/trending-remix";
import { getSearchPresets, saveSearchPreset } from "@/actions/trending-remix-actions";
import { toast } from "sonner";

interface SearchPresetsProps {
  onPresetSelect: (preset: SearchPreset) => void;
  onSaveCurrentAsPreset?: () => void;
  className?: string;
  currentSearchState?: any; // Pass current search state to save as preset
}

export function SearchPresets({ onPresetSelect, onSaveCurrentAsPreset, className, currentSearchState }: SearchPresetsProps) {
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-preset-dropdown]')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const loadPresets = async () => {
    try {
      const presetData = await getSearchPresets();
      setPresets(presetData);
    } catch (error) {
      console.error('Error loading presets:', error);
      toast.error('Failed to load search presets');
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      onPresetSelect(preset);
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      toast.error('Please enter a name for the preset');
      return;
    }

    if (!currentSearchState) {
      toast.error('No search state to save');
      return;
    }

    try {
      const newPreset: Omit<SearchPreset, 'id' | 'createdAt'> = {
        name: presetName.trim(),
        niche: currentSearchState.basicSearch?.niche || '',
        platforms: [currentSearchState.basicSearch?.platform || 'youtube'],
        filters: currentSearchState.advancedFilters || {},
        isDefault: false,
      };

      await saveSearchPreset(newPreset);
      toast.success(`Preset "${presetName}" saved successfully!`);
      setShowSaveDialog(false);
      setPresetName('');
      await loadPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
      toast.error('Failed to save preset');
    }
  };

  const handleRemovePreset = async (presetId: string) => {
    // For now, just show a toast since we don't have delete functionality in actions
    toast.info('Preset removal feature coming soon!');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search Presets</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowSaveDialog(true)}>
          <Plus className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
      
      {/* Active preset display */}
      {selectedPreset && (
        <div className="relative">
          {(() => {
            const activePreset = presets.find(p => p.id === selectedPreset);
            if (!activePreset) return null;
            
            return (
              <div className="relative" data-preset-dropdown>
                <Button
                  variant={activePreset.isDefault ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full justify-between h-9"
                >
                  <div className="flex items-center gap-2">
                    {activePreset.isDefault && <Star className="h-3 w-3 text-yellow-500" />}
                    <span className="font-medium">{activePreset.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activePreset.platforms.length} platform{activePreset.platforms.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
                    <div className="p-2">
                      <div className="text-sm text-muted-foreground mb-2">Actions:</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowDropdown(false);
                          handleRemovePreset(activePreset.id);
                        }}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3 mr-2" />
                        Remove preset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
      
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.slice(0, 4).map((preset) => (
          <Button
            key={preset.id}
            variant={selectedPreset === preset.id ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetSelect(preset.id)}
            className="h-8 text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Save Preset Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Search Preset</DialogTitle>
            <DialogDescription>
              Save your current search settings as a reusable preset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preset-name" className="text-right">
                Name
              </Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., My AI Tools Search"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
