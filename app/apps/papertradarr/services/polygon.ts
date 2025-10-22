/**
 * Polygon.io API Client
 * Primary provider for real-time and historical market data
 * Docs: https://polygon.io/docs
 */

import type {
  StockQuote,
  CompanyInfo,
  SearchResult,
  HistoricalData,
  OHLCV,
  APIError,
  PolygonSnapshotResponse,
  PolygonTickerDetailsResponse,
  PolygonAggregateResponse,
} from "../types";

// ============================================================================
// Configuration
// ============================================================================

const BASE_URL = "https://api.polygon.io";
const API_VERSION = "v2";

interface PolygonConfig {
  apiKey: string;
  timeout?: number;
  maxRetries?: number;
}

// ============================================================================
// Rate Limiting
// ============================================================================

class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number = 5; // Free tier: 5 calls/min
  private readonly windowMs: number = 60000; // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than the window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  getResetTime(): Date {
    if (this.requests.length === 0) return new Date();
    const oldestRequest = Math.min(...this.requests);
    return new Date(oldestRequest + this.windowMs);
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

// ============================================================================
// Polygon Client
// ============================================================================

export class PolygonClient {
  private config: Required<PolygonConfig>;
  private rateLimiter: RateLimiter;
  private cache: Map<string, { data: any; expiresAt: number }>;

  constructor(config: PolygonConfig) {
    this.config = {
      apiKey: config.apiKey,
      timeout: config.timeout || 10000,
      maxRetries: config.maxRetries || 3,
    };
    this.rateLimiter = new RateLimiter();
    this.cache = new Map();
  }

  // ==========================================================================
  // HTTP Request Utilities
  // ==========================================================================

  private async fetch<T>(
    endpoint: string,
    params: Record<string, any> = {},
    cacheTTL: number = 0
  ): Promise<T> {
    // Check cache first
    if (cacheTTL > 0) {
      const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as T;
      }
    }

    // Check rate limit
    if (!this.rateLimiter.canMakeRequest()) {
      const resetTime = this.rateLimiter.getResetTime();
      const error: APIError = {
        message: `Rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`,
        code: "RATE_LIMIT_EXCEEDED",
        status: 429,
        provider: "polygon",
      };
      throw error;
    }

    // Build URL
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.append("apiKey", this.config.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    // Make request with retries
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        this.rateLimiter.recordRequest();

        if (!response.ok) {
          const error: APIError = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            code: "HTTP_ERROR",
            status: response.status,
            provider: "polygon",
          };
          throw error;
        }

        const data = await response.json();

        // Check for API errors
        if (data.status === "ERROR" || data.error) {
          const error: APIError = {
            message: data.error || "Unknown API error",
            code: "API_ERROR",
            provider: "polygon",
          };
          throw error;
        }

        // Cache successful response
        if (cacheTTL > 0) {
          const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
          this.cache.set(cacheKey, {
            data,
            expiresAt: Date.now() + cacheTTL,
          });
        }

        return data as T;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.maxRetries - 1) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    const apiError: APIError = {
      message: lastError?.message || "Request failed",
      code: "REQUEST_FAILED",
      provider: "polygon",
    };
    throw apiError;
  }

  // ==========================================================================
  // Quote Methods
  // ==========================================================================

  async getQuote(symbol: string): Promise<StockQuote> {
    const response = await this.fetch<PolygonSnapshotResponse>(
      `v2/snapshot/locale/us/markets/stocks/tickers/${symbol.toUpperCase()}`,
      {},
      30000 // Cache for 30 seconds
    );

    if (!response.ticker) {
      throw {
        message: `Symbol ${symbol} not found`,
        code: "SYMBOL_NOT_FOUND",
        provider: "polygon",
      } as APIError;
    }

    const ticker = response.ticker;
    const quote: StockQuote = {
      symbol: ticker.ticker,
      price: ticker.day.c,
      open: ticker.day.o,
      high: ticker.day.h,
      low: ticker.day.l,
      close: ticker.day.c,
      previousClose: ticker.prevDay.c,
      change: ticker.todaysChange,
      changePercent: ticker.todaysChangePerc,
      volume: ticker.day.v,
      timestamp: new Date(ticker.updated),
      provider: "polygon",
    };

    return quote;
  }

  async getBatchQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    const quotes = new Map<string, StockQuote>();

    // Polygon doesn't have batch quotes, so we fetch sequentially
    // In production, consider using WebSocket for multiple symbols
    for (const symbol of symbols) {
      try {
        const quote = await getQuote(symbol);
        quotes.set(symbol, quote);
      } catch (error) {
        console.warn(`Failed to fetch quote for ${symbol}:`, error);
      }
    }

    return quotes;
  }

  // ==========================================================================
  // Historical Data Methods
  // ==========================================================================

  async getHistoricalData(
    symbol: string,
    from: Date,
    to: Date,
    interval: "1min" | "5min" | "15min" | "30min" | "1hour" | "1day" = "1day"
  ): Promise<HistoricalData> {
    // Map intervals to Polygon multiplier/timespan
    const intervalMap = {
      "1min": { multiplier: 1, timespan: "minute" },
      "5min": { multiplier: 5, timespan: "minute" },
      "15min": { multiplier: 15, timespan: "minute" },
      "30min": { multiplier: 30, timespan: "minute" },
      "1hour": { multiplier: 1, timespan: "hour" },
      "1day": { multiplier: 1, timespan: "day" },
    };

    const { multiplier, timespan } = intervalMap[interval];
    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    const response = await this.fetch<PolygonAggregateResponse>(
      `v2/aggs/ticker/${symbol.toUpperCase()}/range/${multiplier}/${timespan}/${fromStr}/${toStr}`,
      { adjusted: true, sort: "asc" },
      300000 // Cache for 5 minutes
    );

    if (!response.results || response.results.length === 0) {
      return {
        symbol: symbol.toUpperCase(),
        interval,
        data: [],
        lastUpdated: new Date(),
      };
    }

    const ohlcv: OHLCV[] = response.results.map(bar => ({
      timestamp: new Date(bar.t),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
      vwap: bar.vw,
    }));

    return {
      symbol: symbol.toUpperCase(),
      interval,
      data: ohlcv,
      lastUpdated: new Date(),
    };
  }

  // ==========================================================================
  // Company Info Methods
  // ==========================================================================

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    const response = await this.fetch<PolygonTickerDetailsResponse>(
      `v3/reference/tickers/${symbol.toUpperCase()}`,
      {},
      3600000 // Cache for 1 hour (doesn't change often)
    );

    if (!response.results) {
      throw {
        message: `Company info for ${symbol} not found`,
        code: "NOT_FOUND",
        provider: "polygon",
      } as APIError;
    }

    const r = response.results;
    const info: CompanyInfo = {
      symbol: r.ticker,
      name: r.name,
      description: r.description,
      website: r.homepage_url,
      phone: r.phone_number,
      marketCap: r.market_cap,
      listDate: r.list_date ? new Date(r.list_date) : undefined,
      logo: r.branding?.logo_url,
      lastUpdated: new Date(),
    };

    if (r.address) {
      info.headquarters = {
        address: r.address.address1,
        city: r.address.city,
        state: r.address.state,
        postalCode: r.address.postal_code,
      };
    }

    return info;
  }

  // ==========================================================================
  // Search Methods
  // ==========================================================================

  async searchSymbols(query: string): Promise<SearchResult[]> {
    // Use Polygon's reference tickers API with search parameter
    const upperQuery = query.toUpperCase();

    try {
      interface PolygonTickerSearchResponse {
        results?: Array<{
          ticker: string;
          name: string;
          market: string;
          locale: string;
          primary_exchange?: string;
          type?: string;
          active?: boolean;
          currency_name?: string;
        }>;
        status: string;
        count?: number;
      }

      const response = await this.fetch<PolygonTickerSearchResponse>(
        "v3/reference/tickers",
        {
          search: upperQuery,
          active: true,
          limit: 10,
          market: "stocks",
        },
        60000 // Cache for 1 minute
      );

      if (!response.results || response.results.length === 0) {
        return [];
      }

      return response.results.map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name,
        type: "stock",
        exchange: ticker.primary_exchange || "US",
        currency: ticker.currency_name || "USD",
        region: ticker.locale === "us" ? "United States" : ticker.locale,
        matchScore: ticker.ticker === upperQuery ? 1.0 : 0.8,
      }));
    } catch (error) {
      console.warn("Polygon search failed:", error);
      return [];
    }
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  clearCache(): void {
    this.cache.clear();
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimiter.getRemainingRequests(),
      reset: this.rateLimiter.getResetTime(),
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.fetch("v2/aggs/ticker/AAPL/prev", {}, 0);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Factory & Singleton
// ============================================================================

let polygonClientInstance: PolygonClient | null = null;

export function createPolygonClient(apiKey: string): PolygonClient {
  return new PolygonClient({ apiKey });
}

export function getPolygonClient(): PolygonClient | null {
  return polygonClientInstance;
}

export function initPolygonClient(apiKey: string): PolygonClient {
  polygonClientInstance = createPolygonClient(apiKey);
  return polygonClientInstance;
}

// ============================================================================
// Convenience Functions
// ============================================================================

export async function getQuote(symbol: string): Promise<StockQuote> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  if (!apiKey) {
    throw {
      message: "Polygon API key not configured",
      code: "NO_API_KEY",
      provider: "polygon",
    } as APIError;
  }

  const client = polygonClientInstance || initPolygonClient(apiKey);
  return client.getQuote(symbol);
}

export async function getHistoricalData(
  symbol: string,
  from: Date,
  to: Date,
  interval: "1min" | "5min" | "15min" | "30min" | "1hour" | "1day" = "1day"
): Promise<HistoricalData> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  if (!apiKey) {
    throw {
      message: "Polygon API key not configured",
      code: "NO_API_KEY",
      provider: "polygon",
    } as APIError;
  }

  const client = polygonClientInstance || initPolygonClient(apiKey);
  return client.getHistoricalData(symbol, from, to, interval);
}

export async function getCompanyInfo(symbol: string): Promise<CompanyInfo> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  if (!apiKey) {
    throw {
      message: "Polygon API key not configured",
      code: "NO_API_KEY",
      provider: "polygon",
    } as APIError;
  }

  const client = polygonClientInstance || initPolygonClient(apiKey);
  return client.getCompanyInfo(symbol);
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  if (!apiKey) {
    throw {
      message: "Polygon API key not configured",
      code: "NO_API_KEY",
      provider: "polygon",
    } as APIError;
  }

  const client = polygonClientInstance || initPolygonClient(apiKey);
  return client.searchSymbols(query);
}
