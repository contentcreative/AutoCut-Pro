'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, History, Star, Search } from "lucide-react";
import { SearchSuggestion } from "@/types/trending-remix";
import { getSearchSuggestions } from "@/actions/trending-remix-actions";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function SearchSuggestions({ query, onSuggestionSelect, open, onOpenChange, children }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      getSearchSuggestions(query)
        .then(setSuggestions)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      // Load trending suggestions when query is empty
      getSearchSuggestions()
        .then(setSuggestions)
        .catch(console.error);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion.text);
    onOpenChange(false);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'history':
        return <History className="h-4 w-4 text-blue-500" />;
      case 'popular':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getSuggestionBadge = (suggestion: SearchSuggestion) => {
    if (suggestion.count) {
      return (
        <Badge variant="secondary" className="ml-auto text-xs">
          {suggestion.count}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {children}
      {open && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="py-2">
            {loading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            ) : suggestions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                No suggestions found.
              </div>
            ) : (
              <>
                {query.length === 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Trending Niches
                    </div>
                    {suggestions.slice(0, 5).map((suggestion) => (
                      <button
                        key={suggestion.text}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(suggestion);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <span className="flex-1">{suggestion.text}</span>
                        {getSuggestionBadge(suggestion)}
                      </button>
                    ))}
                  </div>
                )}
                
                {query.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Suggestions
                    </div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.text}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(suggestion);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <span className="flex-1">{suggestion.text}</span>
                        {getSuggestionBadge(suggestion)}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
