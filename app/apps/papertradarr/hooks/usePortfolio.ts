/**
 * usePortfolio Hook
 * State management for portfolio operations (create, update, delete)
 */

import { useState, useCallback } from "react";
import { PortfolioStorage, PositionStorage, TransactionStorage } from "../services";
import type { Portfolio } from "../types";

interface UsePortfolioActionsResult {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: Error | null;
  createPortfolio: (name: string, initialCash: number) => Promise<Portfolio | null>;
  updatePortfolio: (portfolio: Portfolio) => Promise<boolean>;
  deletePortfolio: (id: string) => Promise<boolean>;
}

export function usePortfolioActions(): UsePortfolioActionsResult {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPortfolio = useCallback(
    async (name: string, initialCash: number): Promise<Portfolio | null> => {
      try {
        setCreating(true);
        setError(null);

        const portfolio: Portfolio = {
          id: crypto.randomUUID(),
          name,
          description: undefined,
          initialCash,
          currentCash: initialCash,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await PortfolioStorage.create(portfolio);
        return portfolio;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  const updatePortfolio = useCallback(async (portfolio: Portfolio): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);

      const updated: Portfolio = {
        ...portfolio,
        updatedAt: new Date(),
      };

      await PortfolioStorage.update(updated);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deletePortfolio = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);

      // Delete all associated positions and transactions
      await Promise.all([
        PortfolioStorage.delete(id),
        PositionStorage.deleteByPortfolio(id),
        TransactionStorage.deleteByPortfolio(id),
      ]);

      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    creating,
    updating,
    deleting,
    error,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
}
