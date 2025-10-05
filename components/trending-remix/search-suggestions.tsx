'use client';

import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, History, Star } from "lucide-react";
import { SearchSuggestion } from "@/types/trending-remix";
import { getSearchSuggestions } from "@/actions/trending-remix-actions";

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
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search niches..." value={query} />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading suggestions...</CommandEmpty>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>No suggestions found.</CommandEmpty>
            ) : (
              <>
                {query.length === 0 && (
                  <CommandGroup heading="Trending Niches">
                    {suggestions.slice(0, 5).map((suggestion) => (
                      <CommandItem
                        key={suggestion.text}
                        onSelect={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-2"
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <span className="flex-1">{suggestion.text}</span>
                        {getSuggestionBadge(suggestion)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {query.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.text}
                        onSelect={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-2"
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <span className="flex-1">{suggestion.text}</span>
                        {getSuggestionBadge(suggestion)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
