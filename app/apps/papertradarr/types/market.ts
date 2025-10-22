/**
 * Market Data Types
 * Normalized types for stock quotes, company info, and market data
 */

// ============================================================================
// Stock Quote Types
// ============================================================================

export interface StockQuote {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  provider: "polygon" | "alphaVantage" | "cache";
}

export interface StockSnapshot extends StockQuote {
  vwap?: number; // Volume-weighted average price
  marketCap?: number;
  pe?: number; // Price-to-earnings ratio
  week52High?: number;
  week52Low?: number;
}

// ============================================================================
// Historical Data Types
// ============================================================================

export interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
}

export interface HistoricalData {
  symbol: string;
  interval: "1min" | "5min" | "15min" | "30min" | "1hour" | "1day" | "1week" | "1month";
  data: OHLCV[];
  lastUpdated: Date;
}

// ============================================================================
// Company Information Types
// ============================================================================

export interface CompanyInfo {
  symbol: string;
  name: string;
  description?: string;
  industry?: string;
  sector?: string;
  ceo?: string;
  employees?: number;
  headquarters?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  website?: string;
  phone?: string;
  logo?: string;
  marketCap?: number;
  sharesOutstanding?: number;
  listDate?: Date;
  lastUpdated: Date;
}

// ============================================================================
// Search & Discovery Types
// ============================================================================

export interface SearchResult {
  symbol: string;
  name: string;
  type: "stock" | "etf" | "mutual_fund" | "crypto" | "forex";
  exchange: string;
  currency: string;
  region: string;
  matchScore: number;
}

// ============================================================================
// Market Status Types
// ============================================================================

export type MarketStatus = "pre" | "open" | "closed" | "after-hours" | "holiday";

export interface MarketHours {
  status: MarketStatus;
  isOpen: boolean;
  nextOpen?: Date;
  nextClose?: Date;
  earlyClose?: boolean;
  timezone: string;
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CachedQuote {
  quote: StockQuote;
  expiresAt: Date;
}

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Max number of cached items
}
