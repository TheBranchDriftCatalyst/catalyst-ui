/**
 * useStorage Hook
 * React wrapper for IndexedDB operations with loading and error states
 */

import { useState, useEffect, useCallback } from "react";
import {
  PortfolioStorage,
  PositionStorage,
  TransactionStorage,
  WatchlistStorage,
  SettingsStorage,
} from "../services";
import type { Portfolio, Position, Transaction, WatchlistItem } from "../types";

interface UseStorageResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for loading data from IndexedDB
 */
export function useStorageData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): UseStorageResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for all portfolios
 */
export function usePortfolios() {
  return useStorageData(() => PortfolioStorage.getAll(), []);
}

/**
 * Hook for single portfolio
 */
export function usePortfolio(id: string | null) {
  return useStorageData(() => (id ? PortfolioStorage.getById(id) : Promise.resolve(null)), [id]);
}

/**
 * Hook for positions by portfolio
 */
export function usePositions(portfolioId: string | null) {
  return useStorageData(
    () => (portfolioId ? PositionStorage.getByPortfolio(portfolioId) : Promise.resolve([])),
    [portfolioId]
  );
}

/**
 * Hook for transactions by portfolio
 */
export function useTransactions(portfolioId: string | null) {
  return useStorageData(
    () => (portfolioId ? TransactionStorage.getByPortfolio(portfolioId) : Promise.resolve([])),
    [portfolioId]
  );
}

/**
 * Hook for watchlist
 */
export function useWatchlist() {
  return useStorageData(() => WatchlistStorage.getAll(), []);
}
