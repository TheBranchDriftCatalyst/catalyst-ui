/**
 * useTrading Hook
 * Execute buy/sell orders with validation and state updates
 */

import { useState, useCallback } from "react";
import {
  PortfolioStorage,
  PositionStorage,
  TransactionStorage,
  calculateNewAvgPrice,
  canAffordBuy,
  hasEnoughShares,
} from "../services";
import type {
  Portfolio,
  Position,
  Transaction,
  BuyOrderParams,
  SellOrderParams,
  TradeResult,
} from "../types";

interface UseTradingResult {
  executing: boolean;
  error: Error | null;
  executeBuy: (params: BuyOrderParams) => Promise<TradeResult>;
  executeSell: (params: SellOrderParams) => Promise<TradeResult>;
}

export function useTrading(): UseTradingResult {
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeBuy = useCallback(async (params: BuyOrderParams): Promise<TradeResult> => {
    try {
      setExecuting(true);
      setError(null);

      const { portfolioId, symbol, shares, price, commission = 0 } = params;

      // Get portfolio
      const portfolio = await PortfolioStorage.getById(portfolioId);
      if (!portfolio) {
        throw new Error("Portfolio not found");
      }

      // Validate affordability
      if (!canAffordBuy(portfolio.currentCash, shares, price, commission)) {
        return {
          success: false,
          error: "Insufficient funds",
        };
      }

      // Calculate total cost
      const totalCost = shares * price + commission;

      // Get or create position
      let position = await PositionStorage.getByPortfolioAndSymbol(
        portfolioId,
        symbol.toUpperCase()
      );

      if (position) {
        // Update existing position
        const newAvgPrice = calculateNewAvgPrice(position.shares, position.avgPrice, shares, price);

        position = {
          ...position,
          shares: position.shares + shares,
          avgPrice: newAvgPrice,
          currentPrice: price,
          lastUpdated: new Date(),
        };

        await PositionStorage.update(position);
      } else {
        // Create new position
        position = {
          id: crypto.randomUUID(),
          portfolioId,
          symbol: symbol.toUpperCase(),
          shares,
          avgPrice: price,
          currentPrice: price,
          lastUpdated: new Date(),
        };

        await PositionStorage.create(position);
      }

      // Create transaction
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        portfolioId,
        symbol: symbol.toUpperCase(),
        type: "BUY",
        shares,
        price,
        commission,
        totalAmount: totalCost,
        timestamp: new Date(),
      };

      await TransactionStorage.create(transaction);

      // Update portfolio cash
      const updatedPortfolio: Portfolio = {
        ...portfolio,
        currentCash: portfolio.currentCash - totalCost,
        updatedAt: new Date(),
      };

      await PortfolioStorage.update(updatedPortfolio);

      return {
        success: true,
        transaction,
        position,
        portfolio: updatedPortfolio,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Buy order failed";
      setError(err as Error);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setExecuting(false);
    }
  }, []);

  const executeSell = useCallback(async (params: SellOrderParams): Promise<TradeResult> => {
    try {
      setExecuting(true);
      setError(null);

      const { portfolioId, symbol, shares, price, commission = 0 } = params;

      // Get portfolio
      const portfolio = await PortfolioStorage.getById(portfolioId);
      if (!portfolio) {
        throw new Error("Portfolio not found");
      }

      // Get position
      const position = await PositionStorage.getByPortfolioAndSymbol(
        portfolioId,
        symbol.toUpperCase()
      );

      if (!hasEnoughShares(position, shares)) {
        return {
          success: false,
          error: "Insufficient shares",
        };
      }

      // Calculate total proceeds
      const totalProceeds = shares * price - commission;

      // Update position
      const newShares = position!.shares - shares;

      let updatedPosition: Position | undefined;

      if (newShares === 0) {
        // Close position
        await PositionStorage.delete(position!.id);
      } else {
        // Update position
        updatedPosition = {
          ...position!,
          shares: newShares,
          currentPrice: price,
          lastUpdated: new Date(),
        };

        await PositionStorage.update(updatedPosition);
      }

      // Create transaction
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        portfolioId,
        symbol: symbol.toUpperCase(),
        type: "SELL",
        shares,
        price,
        commission,
        totalAmount: totalProceeds,
        timestamp: new Date(),
      };

      await TransactionStorage.create(transaction);

      // Update portfolio cash
      const updatedPortfolio: Portfolio = {
        ...portfolio,
        currentCash: portfolio.currentCash + totalProceeds,
        updatedAt: new Date(),
      };

      await PortfolioStorage.update(updatedPortfolio);

      return {
        success: true,
        transaction,
        position: updatedPosition,
        portfolio: updatedPortfolio,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Sell order failed";
      setError(err as Error);
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setExecuting(false);
    }
  }, []);

  return {
    executing,
    error,
    executeBuy,
    executeSell,
  };
}
