/**
 * API Response Types
 * Defines the structure of responses from external APIs (Polygon.io, Alpha Vantage)
 */

// ============================================================================
// Polygon.io API Types
// ============================================================================

export interface PolygonQuoteResponse {
  status: string;
  results?: {
    T: string; // Ticker
    p: number; // Price
    t: number; // Timestamp (ms)
    c?: number[]; // Conditions
    x?: number; // Exchange ID
  };
  error?: string;
}

export interface PolygonAggregateResponse {
  status: string;
  ticker: string;
  adjusted: boolean;
  queryCount: number;
  resultsCount: number;
  results?: Array<{
    v: number; // Volume
    vw: number; // Volume weighted average price
    o: number; // Open
    c: number; // Close
    h: number; // High
    l: number; // Low
    t: number; // Timestamp
    n: number; // Number of transactions
  }>;
  error?: string;
}

export interface PolygonTickerDetailsResponse {
  status: string;
  results?: {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name: string;
    cik?: string;
    composite_figi?: string;
    share_class_figi?: string;
    market_cap?: number;
    phone_number?: string;
    address?: {
      address1?: string;
      city?: string;
      state?: string;
      postal_code?: string;
    };
    description?: string;
    sic_code?: string;
    sic_description?: string;
    ticker_root?: string;
    homepage_url?: string;
    total_employees?: number;
    list_date?: string;
    branding?: {
      logo_url?: string;
      icon_url?: string;
    };
  };
  error?: string;
}

export interface PolygonSnapshotResponse {
  status: string;
  ticker?: {
    ticker: string;
    todaysChangePerc: number;
    todaysChange: number;
    updated: number;
    day: {
      o: number; // Open
      h: number; // High
      l: number; // Low
      c: number; // Close
      v: number; // Volume
      vw: number; // VWAP
    };
    min: {
      av: number; // Accumulated volume
      c: number; // Close
      h: number; // High
      l: number; // Low
      o: number; // Open
      v: number; // Volume
      vw: number; // VWAP
    };
    prevDay: {
      o: number;
      h: number;
      l: number;
      c: number;
      v: number;
      vw: number;
    };
  };
  error?: string;
}

// ============================================================================
// Alpha Vantage API Types
// ============================================================================

export interface AlphaVantageQuoteResponse {
  "Global Quote"?: {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
  "Error Message"?: string;
  Note?: string; // Rate limit warning
}

export interface AlphaVantageSearchResponse {
  bestMatches?: Array<{
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
  }>;
  "Error Message"?: string;
  Note?: string;
}

export interface AlphaVantageTimeSeriesResponse {
  "Meta Data"?: {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Interval"?: string;
    "5. Output Size"?: string;
    "6. Time Zone": string;
  };
  "Time Series (Daily)"?: Record<
    string,
    {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    }
  >;
  "Error Message"?: string;
  Note?: string;
}

// ============================================================================
// Generic API Types
// ============================================================================

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  provider: "polygon" | "alphaVantage" | "unknown";
}

export interface APIRateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface APIHealthCheck {
  provider: "polygon" | "alphaVantage";
  healthy: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}
