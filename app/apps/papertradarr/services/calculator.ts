/**
 * Portfolio Calculator Utilities
 * Pure functions for portfolio calculations (P&L, cost basis, etc.)
 * All functions are stateless and testable
 */

import type {
  Portfolio,
  Position,
  PositionWithMetrics,
  Transaction,
  PortfolioSummary,
  PerformanceMetrics,
} from "../types";

// ============================================================================
// Position Calculations
// ============================================================================

/**
 * Calculate total value of a position (shares * current price)
 */
export function calculatePositionValue(position: Position): number {
  return position.shares * position.currentPrice;
}

/**
 * Calculate total cost basis of a position (shares * average price)
 */
export function calculatePositionCost(position: Position): number {
  return position.shares * position.avgPrice;
}

/**
 * Calculate gain/loss for a position (total value - total cost)
 */
export function calculatePositionGainLoss(position: Position): number {
  return calculatePositionValue(position) - calculatePositionCost(position);
}

/**
 * Calculate gain/loss percentage for a position
 */
export function calculatePositionGainLossPercent(position: Position): number {
  const cost = calculatePositionCost(position);
  if (cost === 0) return 0;
  return (calculatePositionGainLoss(position) / cost) * 100;
}

/**
 * Enrich a position with calculated metrics
 */
export function enrichPositionWithMetrics(position: Position): PositionWithMetrics {
  const totalValue = calculatePositionValue(position);
  const totalCost = calculatePositionCost(position);
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

  return {
    ...position,
    totalValue,
    totalCost,
    gainLoss,
    gainLossPercent,
  };
}

// ============================================================================
// Average Cost Basis Calculations
// ============================================================================

/**
 * Calculate new average cost basis after a buy
 */
export function calculateNewAvgPrice(
  currentShares: number,
  currentAvgPrice: number,
  newShares: number,
  newPrice: number
): number {
  const totalShares = currentShares + newShares;
  if (totalShares === 0) return 0;

  const currentCost = currentShares * currentAvgPrice;
  const newCost = newShares * newPrice;
  return (currentCost + newCost) / totalShares;
}

/**
 * Calculate realized gain/loss from a sell
 */
export function calculateRealizedGainLoss(
  sharesold: number,
  sellPrice: number,
  avgCostBasis: number
): number {
  return sharesSold * (sellPrice - avgCostBasis);
}

// ============================================================================
// Portfolio Calculations
// ============================================================================

/**
 * Calculate total value of all positions
 */
export function calculatePositionsValue(positions: Position[]): number {
  return positions.reduce((sum, pos) => sum + calculatePositionValue(pos), 0);
}

/**
 * Calculate total portfolio value (cash + positions)
 */
export function calculatePortfolioValue(portfolio: Portfolio, positions: Position[]): number {
  return portfolio.currentCash + calculatePositionsValue(positions);
}

/**
 * Calculate total portfolio gain/loss
 */
export function calculatePortfolioGainLoss(portfolio: Portfolio, positions: Position[]): number {
  return calculatePortfolioValue(portfolio, positions) - portfolio.initialCash;
}

/**
 * Calculate total portfolio gain/loss percentage
 */
export function calculatePortfolioGainLossPercent(
  portfolio: Portfolio,
  positions: Position[]
): number {
  if (portfolio.initialCash === 0) return 0;
  return (calculatePortfolioGainLoss(portfolio, positions) / portfolio.initialCash) * 100;
}

/**
 * Create a full portfolio summary with all metrics
 */
export function createPortfolioSummary(
  portfolio: Portfolio,
  positions: Position[],
  transactionsCount: number
): PortfolioSummary {
  const positionsValue = calculatePositionsValue(positions);
  const totalValue = portfolio.currentCash + positionsValue;
  const totalGainLoss = totalValue - portfolio.initialCash;
  const totalGainLossPercent =
    portfolio.initialCash > 0 ? (totalGainLoss / portfolio.initialCash) * 100 : 0;

  return {
    portfolio,
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    positionsValue,
    positionsCount: positions.length,
    transactionsCount,
  };
}

// ============================================================================
// Transaction Analysis
// ============================================================================

/**
 * Calculate total commission paid
 */
export function calculateTotalCommissions(transactions: Transaction[]): number {
  return transactions.reduce((sum, txn) => sum + txn.commission, 0);
}

/**
 * Calculate total amount invested (sum of all BUY transactions)
 */
export function calculateTotalInvested(transactions: Transaction[]): number {
  return transactions
    .filter(txn => txn.type === "BUY")
    .reduce((sum, txn) => sum + txn.totalAmount, 0);
}

/**
 * Calculate total amount received (sum of all SELL transactions)
 */
export function calculateTotalReceived(transactions: Transaction[]): number {
  return transactions
    .filter(txn => txn.type === "SELL")
    .reduce((sum, txn) => sum + txn.totalAmount, 0);
}

/**
 * Get transactions for a specific symbol
 */
export function getTransactionsBySymbol(
  transactions: Transaction[],
  symbol: string
): Transaction[] {
  return transactions.filter(txn => txn.symbol === symbol);
}

/**
 * Get transactions within a date range
 */
export function getTransactionsInDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(txn => txn.timestamp >= startDate && txn.timestamp <= endDate);
}

// ============================================================================
// Performance Metrics
// ============================================================================

/**
 * Calculate win rate (percentage of profitable trades)
 */
export function calculateWinRate(transactions: Transaction[]): number {
  const sells = transactions.filter(txn => txn.type === "SELL");
  if (sells.length === 0) return 0;

  // Group sells by symbol and calculate profit for each
  const symbolProfits = new Map<string, number>();

  sells.forEach(sell => {
    const symbol = sell.symbol;
    const buys = transactions.filter(
      txn => txn.type === "BUY" && txn.symbol === symbol && txn.timestamp < sell.timestamp
    );

    if (buys.length > 0) {
      // Calculate weighted average cost basis
      const totalShares = buys.reduce((sum, buy) => sum + buy.shares, 0);
      const totalCost = buys.reduce((sum, buy) => sum + buy.totalAmount, 0);
      const avgCost = totalCost / totalShares;

      const profit = sell.shares * (sell.price - avgCost);
      symbolProfits.set(symbol, (symbolProfits.get(symbol) || 0) + profit);
    }
  });

  const profitableTrades = Array.from(symbolProfits.values()).filter(profit => profit > 0).length;
  return (profitableTrades / symbolProfits.size) * 100;
}

/**
 * Calculate average win amount
 */
export function calculateAverageWin(transactions: Transaction[]): number {
  const sells = transactions.filter(txn => txn.type === "SELL");
  if (sells.length === 0) return 0;

  const profits: number[] = [];

  sells.forEach(sell => {
    const buys = transactions.filter(
      txn => txn.type === "BUY" && txn.symbol === sell.symbol && txn.timestamp < sell.timestamp
    );

    if (buys.length > 0) {
      const totalShares = buys.reduce((sum, buy) => sum + buy.shares, 0);
      const totalCost = buys.reduce((sum, buy) => sum + buy.totalAmount, 0);
      const avgCost = totalCost / totalShares;
      const profit = sell.shares * (sell.price - avgCost);

      if (profit > 0) {
        profits.push(profit);
      }
    }
  });

  if (profits.length === 0) return 0;
  return profits.reduce((sum, profit) => sum + profit, 0) / profits.length;
}

/**
 * Calculate average loss amount
 */
export function calculateAverageLoss(transactions: Transaction[]): number {
  const sells = transactions.filter(txn => txn.type === "SELL");
  if (sells.length === 0) return 0;

  const losses: number[] = [];

  sells.forEach(sell => {
    const buys = transactions.filter(
      txn => txn.type === "BUY" && txn.symbol === sell.symbol && txn.timestamp < sell.timestamp
    );

    if (buys.length > 0) {
      const totalShares = buys.reduce((sum, buy) => sum + buy.shares, 0);
      const totalCost = buys.reduce((sum, buy) => sum + buy.totalAmount, 0);
      const avgCost = totalCost / totalShares;
      const profit = sell.shares * (sell.price - avgCost);

      if (profit < 0) {
        losses.push(Math.abs(profit));
      }
    }
  });

  if (losses.length === 0) return 0;
  return losses.reduce((sum, loss) => sum + loss, 0) / losses.length;
}

/**
 * Find largest win
 */
export function findLargestWin(transactions: Transaction[]): number {
  const sells = transactions.filter(txn => txn.type === "SELL");
  let largestWin = 0;

  sells.forEach(sell => {
    const buys = transactions.filter(
      txn => txn.type === "BUY" && txn.symbol === sell.symbol && txn.timestamp < sell.timestamp
    );

    if (buys.length > 0) {
      const totalShares = buys.reduce((sum, buy) => sum + buy.shares, 0);
      const totalCost = buys.reduce((sum, buy) => sum + buy.totalAmount, 0);
      const avgCost = totalCost / totalShares;
      const profit = sell.shares * (sell.price - avgCost);

      if (profit > largestWin) {
        largestWin = profit;
      }
    }
  });

  return largestWin;
}

/**
 * Find largest loss
 */
export function findLargestLoss(transactions: Transaction[]): number {
  const sells = transactions.filter(txn => txn.type === "SELL");
  let largestLoss = 0;

  sells.forEach(sell => {
    const buys = transactions.filter(
      txn => txn.type === "BUY" && txn.symbol === sell.symbol && txn.timestamp < sell.timestamp
    );

    if (buys.length > 0) {
      const totalShares = buys.reduce((sum, buy) => sum + buy.shares, 0);
      const totalCost = buys.reduce((sum, buy) => sum + buy.totalAmount, 0);
      const avgCost = totalCost / totalShares;
      const profit = sell.shares * (sell.price - avgCost);

      if (profit < 0 && Math.abs(profit) > largestLoss) {
        largestLoss = Math.abs(profit);
      }
    }
  });

  return largestLoss;
}

/**
 * Calculate Sharpe ratio (simplified version)
 * Note: This is a simplified calculation for paper trading
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02 // 2% annual risk-free rate
): number {
  if (returns.length < 2) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate) / stdDev;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate if a buy order is affordable
 */
export function canAffordBuy(
  availableCash: number,
  shares: number,
  price: number,
  commission: number = 0
): boolean {
  const totalCost = shares * price + commission;
  return totalCost <= availableCash;
}

/**
 * Validate if a sell order has enough shares
 */
export function hasEnoughShares(position: Position | null, sharesToSell: number): boolean {
  if (!position) return false;
  return position.shares >= sharesToSell;
}
