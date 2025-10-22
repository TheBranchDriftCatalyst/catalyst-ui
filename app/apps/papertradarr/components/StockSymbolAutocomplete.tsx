/**
 * StockSymbolAutocomplete Component
 * Autocomplete with search + preview cards showing stock stats
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Card, CardContent } from "@/catalyst-ui/ui/card";
import { Badge } from "@/catalyst-ui/ui/badge";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { searchSymbols, getQuote } from "../services/polygon";
import type { StockQuote } from "../types";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

interface StockSymbolAutocompleteProps {
  onSelect: (symbol: string, quote: StockQuote | null) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StockSymbolAutocomplete({
  onSelect,
  value,
  onChange,
  disabled = false,
}: StockSymbolAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const searchTerm = value.trim().toUpperCase();
    if (searchTerm.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchSymbols(searchTerm);
        setResults(searchResults.slice(0, 5)); // Top 5 results
        setIsOpen(searchResults.length > 0);

        // Fetch quotes for each result using Polygon
        const quotePromises = searchResults.slice(0, 5).map(async result => {
          try {
            const quote = await getQuote(result.symbol);
            return [result.symbol, quote] as [string, StockQuote];
          } catch (err) {
            console.warn(`Failed to fetch quote for ${result.symbol}:`, err);
            return null;
          }
        });

        const quoteResults = await Promise.all(quotePromises);
        const newQuotes = new Map<string, StockQuote>();
        quoteResults.forEach(result => {
          if (result) {
            newQuotes.set(result[0], result[1]);
          }
        });
        setQuotes(newQuotes);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            const selected = results[selectedIndex];
            handleSelect(selected);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, selectedIndex, results]
  );

  const handleSelect = (result: SearchResult) => {
    onChange(result.symbol);
    onSelect(result.symbol, quotes.get(result.symbol) || null);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const fmt = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="relative">
      <Label>Stock Symbol</Label>
      <div className="relative mt-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search symbol or company..."
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {results.map((result, index) => {
            const quote = quotes.get(result.symbol);
            const isSelected = index === selectedIndex;

            return (
              <div
                key={result.symbol}
                onClick={() => handleSelect(result)}
                className={`cursor-pointer transition-colors ${
                  isSelected ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <Card className="border-0 border-b border-border last:border-0 rounded-none">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground">{result.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{result.region}</p>
                      </div>

                      {quote ? (
                        <div className="text-right">
                          <div className="text-lg font-bold">{fmt(quote.price)}</div>
                          <div
                            className={`text-sm flex items-center gap-1 justify-end ${
                              quote.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {quote.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {quote.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-right text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
