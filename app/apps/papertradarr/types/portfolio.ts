/**
 * Portfolio & Trading Types
 * Types for portfolios, positions, transactions, and trading operations
 */

// ============================================================================
// Portfolio Types
// ============================================================================

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  initialCash: number;
  currentCash: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  totalValue: number; // Cash + positions value
  totalGainLoss: number; // Total P&L
  totalGainLossPercent: number;
  positionsValue: number;
  positionsCount: number;
  transactionsCount: number;
  dayGainLoss?: number;
  dayGainLossPercent?: number;
}

// ============================================================================
// Position Types
// ============================================================================

export interface Position {
  id: string;
  portfolioId: string;
  symbol: string;
  shares: number;
  avgPrice: number; // Average cost basis
  currentPrice: number;
  lastUpdated: Date;
}

export interface PositionWithMetrics extends Position {
  totalValue: number; // shares * currentPrice
  totalCost: number; // shares * avgPrice
  gainLoss: number; // totalValue - totalCost
  gainLossPercent: number;
  dayGainLoss?: number;
  dayGainLossPercent?: number;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = "BUY" | "SELL";

export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: TransactionType;
  shares: number;
  price: number;
  commission: number;
  totalAmount: number; // (shares * price) + commission
  timestamp: Date;
  notes?: string;
}

export interface TransactionCreate {
  portfolioId: string;
  symbol: string;
  type: TransactionType;
  shares: number;
  price: number;
  commission?: number;
  notes?: string;
}

// ============================================================================
// Watchlist Types
// ============================================================================

export interface WatchlistItem {
  id: string;
  symbol: string;
  addedAt: Date;
  notes?: string;
  targetPrice?: number;
  stopLoss?: number;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderType = "market" | "limit" | "stop" | "stop-limit";
export type OrderAction = "buy" | "sell";
export type OrderStatus = "pending" | "filled" | "cancelled" | "rejected";

export interface Order {
  id: string;
  portfolioId: string;
  symbol: string;
  action: OrderAction;
  type: OrderType;
  shares: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledPrice?: number;
  filledAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface OrderValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Trading Operation Types
// ============================================================================

export interface BuyOrderParams {
  portfolioId: string;
  symbol: string;
  shares: number;
  price: number;
  commission?: number;
}

export interface SellOrderParams {
  portfolioId: string;
  symbol: string;
  shares: number;
  price: number;
  commission?: number;
}

export interface TradeResult {
  success: boolean;
  transaction?: Transaction;
  position?: Position;
  portfolio?: Portfolio;
  error?: string;
}

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface PerformanceMetrics {
  portfolioId: string;
  totalReturn: number;
  totalReturnPercent: number;
  dayReturn: number;
  dayReturnPercent: number;
  weekReturn: number;
  weekReturnPercent: number;
  monthReturn: number;
  monthReturnPercent: number;
  yearReturn: number;
  yearReturnPercent: number;
  allTimeHigh: number;
  allTimeLow: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio?: number;
  winRate?: number; // % of profitable trades
  averageWin?: number;
  averageLoss?: number;
  largestWin?: number;
  largestLoss?: number;
  calculatedAt: Date;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface TradingSettings {
  defaultCommission: number;
  confirmOrders: boolean;
  displayCurrency: string;
  dateFormat: string;
  numberFormat: string;
  refreshInterval: number; // Milliseconds
  enableNotifications: boolean;
}

export interface APISettings {
  polygonApiKey?: string;
  alphaVantageApiKey?: string;
  preferredProvider: "polygon" | "alphaVantage";
  enableFallback: boolean;
  requestTimeout: number;
  maxRetries: number;
}
