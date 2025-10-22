/**
 * useStockQuote Hook
 * Fetch real-time stock quotes with automatic refreshing and caching
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getQuote as getPolygonQuote } from "../services/polygon";
import { getQuote as getAlphaVantageQuote } from "../services/alphaVantage";
import type { StockQuote, APIError } from "../types";

interface UseStockQuoteOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  fallbackToAlphaVantage?: boolean;
}

interface UseStockQuoteResult {
  quote: StockQuote | null;
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
}

export function useStockQuote(
  symbol: string | null,
  options: UseStockQuoteOptions = {}
): UseStockQuoteResult {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds default
    fallbackToAlphaVantage = true,
  } = options;

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) {
      setQuote(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try Polygon first
      try {
        const polygonQuote = await getPolygonQuote(symbol);
        setQuote(polygonQuote);
        return;
      } catch (polygonError) {
        console.warn("Polygon failed, trying Alpha Vantage:", polygonError);

        // Fallback to Alpha Vantage if enabled
        if (fallbackToAlphaVantage) {
          try {
            const alphaQuote = await getAlphaVantageQuote(symbol);
            setQuote(alphaQuote);
            return;
          } catch (alphaError) {
            console.error("Alpha Vantage also failed:", alphaError);
            setError(alphaError as APIError);
          }
        } else {
          setError(polygonError as APIError);
        }
      }
    } catch (err) {
      setError(err as APIError);
    } finally {
      setLoading(false);
    }
  }, [symbol, fallbackToAlphaVantage]);

  // Initial fetch
  useEffect(() => {
    if (symbol) {
      fetchQuote();
    } else {
      setQuote(null);
      setError(null);
    }
  }, [symbol, fetchQuote]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && symbol) {
      intervalRef.current = setInterval(fetchQuote, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, symbol, refreshInterval, fetchQuote]);

  return { quote, loading, error, refetch: fetchQuote };
}

/**
 * Hook for batch fetching multiple quotes
 */
export function useBatchQuotes(symbols: string[]): {
  quotes: Map<string, StockQuote>;
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
} {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0) {
      setQuotes(new Map());
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newQuotes = new Map<string, StockQuote>();

      // Fetch sequentially to respect rate limits
      for (const symbol of symbols) {
        try {
          const quote = await getPolygonQuote(symbol);
          newQuotes.set(symbol, quote);
        } catch (err) {
          console.warn(`Failed to fetch quote for ${symbol}:`, err);
        }
      }

      setQuotes(newQuotes);
    } catch (err) {
      setError(err as APIError);
    } finally {
      setLoading(false);
    }
  }, [symbols.join(",")]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return { quotes, loading, error, refetch: fetchQuotes };
}
