/**
 * Alpha Vantage API Client
 * Fallback provider for market data when Polygon.io is unavailable
 * Docs: https://www.alphavantage.co/documentation/
 */

import type {
  StockQuote,
  SearchResult,
  APIError,
  AlphaVantageQuoteResponse,
  AlphaVantageSearchResponse,
} from "../types";

// ============================================================================
// Configuration
// ============================================================================

const BASE_URL = "https://www.alphavantage.co/query";

interface AlphaVantageConfig {
  apiKey: string;
  timeout?: number;
}

// ============================================================================
// Alpha Vantage Client
// ============================================================================

export class AlphaVantageClient {
  private config: Required<AlphaVantageConfig>;
  private cache: Map<string, { data: any; expiresAt: number }>;

  constructor(config: AlphaVantageConfig) {
    this.config = {
      apiKey: config.apiKey,
      timeout: config.timeout || 10000,
    };
    this.cache = new Map();
  }

  // ==========================================================================
  // HTTP Request Utilities
  // ==========================================================================

  private async fetch<T>(params: Record<string, any>, cacheTTL: number = 0): Promise<T> {
    // Check cache first
    if (cacheTTL > 0) {
      const cacheKey = JSON.stringify(params);
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as T;
      }
    }

    // Build URL
    const url = new URL(BASE_URL);
    url.searchParams.append("apikey", this.config.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: APIError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: "HTTP_ERROR",
          status: response.status,
          provider: "alphaVantage",
        };
        throw error;
      }

      const data = await response.json();

      // Check for API errors
      if (data["Error Message"]) {
        const error: APIError = {
          message: data["Error Message"],
          code: "API_ERROR",
          provider: "alphaVantage",
        };
        throw error;
      }

      // Check for rate limit
      if (data["Note"]) {
        const error: APIError = {
          message: "API rate limit exceeded. Please wait a minute.",
          code: "RATE_LIMIT_EXCEEDED",
          status: 429,
          provider: "alphaVantage",
        };
        throw error;
      }

      // Cache successful response
      if (cacheTTL > 0) {
        const cacheKey = JSON.stringify(params);
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + cacheTTL,
        });
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const apiError: APIError = {
          message: "Request timeout",
          code: "TIMEOUT",
          provider: "alphaVantage",
        };
        throw apiError;
      }
      throw error;
    }
  }

  // ==========================================================================
  // Quote Methods
  // ==========================================================================

  async getQuote(symbol: string): Promise<StockQuote> {
    const response = await this.fetch<AlphaVantageQuoteResponse>(
      {
        function: "GLOBAL_QUOTE",
        symbol: symbol.toUpperCase(),
      },
      30000 // Cache for 30 seconds
    );

    if (!response["Global Quote"]) {
      throw {
        message: `Symbol ${symbol} not found`,
        code: "SYMBOL_NOT_FOUND",
        provider: "alphaVantage",
      } as APIError;
    }

    const data = response["Global Quote"];
    const price = parseFloat(data["05. price"]);
    const previousClose = parseFloat(data["08. previous close"]);
    const change = parseFloat(data["09. change"]);
    const changePercent = parseFloat(data["10. change percent"].replace("%", ""));

    const quote: StockQuote = {
      symbol: data["01. symbol"],
      price,
      open: parseFloat(data["02. open"]),
      high: parseFloat(data["03. high"]),
      low: parseFloat(data["04. low"]),
      close: price,
      previousClose,
      change,
      changePercent,
      volume: parseInt(data["06. volume"], 10),
      timestamp: new Date(data["07. latest trading day"]),
      provider: "alphaVantage",
    };

    return quote;
  }

  // ==========================================================================
  // Search Methods
  // ==========================================================================

  async searchSymbols(query: string): Promise<SearchResult[]> {
    const response = await this.fetch<AlphaVantageSearchResponse>(
      {
        function: "SYMBOL_SEARCH",
        keywords: query,
      },
      300000 // Cache for 5 minutes
    );

    if (!response.bestMatches || response.bestMatches.length === 0) {
      return [];
    }

    return response.bestMatches.map(match => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      type: match["3. type"].toLowerCase() as any, // "Equity" -> "stock"
      exchange: match["4. region"],
      currency: match["8. currency"],
      region: match["4. region"],
      matchScore: parseFloat(match["9. matchScore"]),
    }));
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  clearCache(): void {
    this.cache.clear();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.getQuote("AAPL");
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Factory & Singleton
// ============================================================================

let alphaVantageClientInstance: AlphaVantageClient | null = null;

export function createAlphaVantageClient(apiKey: string): AlphaVantageClient {
  return new AlphaVantageClient({ apiKey });
}

export function getAlphaVantageClient(): AlphaVantageClient | null {
  return alphaVantageClientInstance;
}

export function initAlphaVantageClient(apiKey: string): AlphaVantageClient {
  alphaVantageClientInstance = createAlphaVantageClient(apiKey);
  return alphaVantageClientInstance;
}

// ============================================================================
// Convenience Functions
// ============================================================================

export async function getQuote(symbol: string): Promise<StockQuote> {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw {
      message: "Alpha Vantage API key not configured",
      code: "NO_API_KEY",
      provider: "alphaVantage",
    } as APIError;
  }

  const client = alphaVantageClientInstance || initAlphaVantageClient(apiKey);
  return client.getQuote(symbol);
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw {
      message: "Alpha Vantage API key not configured",
      code: "NO_API_KEY",
      provider: "alphaVantage",
    } as APIError;
  }

  const client = alphaVantageClientInstance || initAlphaVantageClient(apiKey);
  return client.searchSymbols(query);
}
