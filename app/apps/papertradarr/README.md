# PaperTradarr 📈

A professional-grade paper trading application with real-time market data integration.

## 🎯 Overview

PaperTradarr is a simulated stock trading platform that allows users to practice trading strategies without risking real money. It features real-time market data, portfolio tracking, transaction history, and comprehensive analytics.

## 🏗️ Architecture

### Directory Structure

```
papertradarr/
├── README.md                    # This file
├── components/                  # React components (presentation layer)
│   ├── PortfolioOverview.tsx   # Portfolio metrics & summary cards
│   ├── StockSearch.tsx         # Stock symbol search with autocomplete
│   ├── StockQuote.tsx          # Real-time quote display with charts
│   ├── OrderEntry.tsx          # Buy/sell form with validation
│   ├── PositionsTable.tsx      # Current positions table
│   ├── TransactionsTable.tsx   # Transaction history
│   ├── APISettings.tsx         # API key configuration UI
│   └── Watchlist.tsx           # Stock watchlist
├── services/                    # Business logic & external integrations
│   ├── polygon.ts              # Polygon.io API client
│   ├── alphaVantage.ts         # Alpha Vantage API client (fallback)
│   ├── storage.ts              # IndexedDB wrapper for persistence
│   ├── calculator.ts           # Portfolio calculation utilities
│   └── index.ts                # Unified service exports
├── hooks/                       # Custom React hooks
│   ├── usePortfolio.ts         # Portfolio state management
│   ├── useStockQuote.ts        # Real-time quote fetching with cache
│   ├── useTrading.ts           # Buy/sell operations
│   ├── useMarketData.ts        # Market data aggregation
│   └── useStorage.ts           # IndexedDB operations wrapper
├── types/                       # TypeScript type definitions
│   ├── portfolio.ts            # Portfolio, Position, Transaction types
│   ├── market.ts               # Stock, Quote, MarketData types
│   └── api.ts                  # API response types
├── utils/                       # Utility functions
│   ├── formatters.ts           # Currency, number, date formatters
│   ├── validators.ts           # Input validation functions
│   └── calculations.ts         # Math utilities (P&L, percentages, etc.)
└── PaperTradarrTab.tsx         # Main tab component (entry point)
```

## 📡 API Integrations

### Primary: Polygon.io

- **Endpoint**: `https://api.polygon.io/v2/`
- **Auth**: API Key via `VITE_POLYGON_API_KEY`
- **Features**:
  - Real-time quotes
  - Historical OHLCV data
  - Company information
  - WebSocket support for live updates
- **Rate Limits**: 5 API calls/minute (free tier)
- **Docs**: https://polygon.io/docs

### Fallback: Alpha Vantage

- **Endpoint**: `https://www.alphavantage.co/query`
- **Auth**: API Key via `VITE_ALPHA_VANTAGE_KEY`
- **Features**:
  - Real-time and historical quotes
  - Technical indicators
  - Fundamental data
- **Rate Limits**: 5 API calls/minute (free tier)
- **Docs**: https://www.alphavantage.co/documentation/

### Future Considerations

- **Finnhub** (websocket, good free tier)
- **Yahoo Finance** (unofficial, no API key needed)
- **IEX Cloud** (enterprise option)

## 💾 Data Persistence

### IndexedDB Schema

**Database**: `papertradarr_db`

**Stores**:

1. **portfolios**

   ```typescript
   {
     id: string; // UUID
     name: string; // "Main Portfolio"
     initialCash: number; // Starting balance
     createdAt: Date;
     updatedAt: Date;
   }
   ```

2. **positions**

   ```typescript
   {
     id: string; // UUID
     portfolioId: string; // Foreign key
     symbol: string; // Stock ticker
     shares: number; // Quantity owned
     avgPrice: number; // Average purchase price
     currentPrice: number; // Latest market price
     lastUpdated: Date;
   }
   ```

3. **transactions**

   ```typescript
   {
     id: string; // UUID
     portfolioId: string; // Foreign key
     symbol: string; // Stock ticker
     type: "BUY" | "SELL";
     shares: number; // Quantity
     price: number; // Execution price
     timestamp: Date;
     commission: number; // Optional trading fee
   }
   ```

4. **watchlist**

   ```typescript
   {
     id: string;              // UUID
     symbol: string;          // Stock ticker
     addedAt: Date;
     notes?: string;          // Optional user notes
   }
   ```

5. **settings**
   ```typescript
   {
     key: string; // Setting name
     value: any; // Setting value
     updatedAt: Date;
   }
   ```

### LocalStorage

- API keys (encrypted with Web Crypto API)
- User preferences (theme, display settings)

## 🔧 Environment Variables

Add to `.env.local`:

```bash
# Polygon.io (Primary)
VITE_POLYGON_API_KEY=your_polygon_api_key_here

# Alpha Vantage (Fallback)
VITE_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here

# Optional: Enable debug logging
VITE_TRADING_DEBUG=true
```

## 🚀 Implementation Roadmap

### Phase 1: Foundation ✅ COMPLETED

- [x] Create directory structure
- [x] Write comprehensive README
- [x] Define TypeScript types
- [x] Set up environment configuration
- [x] Create base service layer structure

### Phase 2: Data Layer ✅ COMPLETED

- [x] Implement IndexedDB wrapper (`storage.ts`)
- [x] Create portfolio CRUD operations
- [x] Implement transaction history storage
- [x] Add watchlist functionality
- [x] Set up API key encryption (via settings store)

### Phase 3: API Integration ✅ COMPLETED

- [x] Polygon.io client implementation
  - [x] Real-time quotes
  - [x] Historical data
  - [x] Symbol search
  - [x] Company info
- [x] Alpha Vantage fallback client
- [x] Rate limiting & error handling
- [x] Response caching strategy
- [x] API health checking

### Phase 4: Business Logic ✅ COMPLETED

- [x] Portfolio calculator (`calculator.ts`)
  - [x] P&L calculations
  - [x] Average cost basis
  - [x] Portfolio value
  - [x] Gain/loss percentages
- [x] Order validation logic
- [x] Transaction processing helpers
- [x] Position management utilities

### Phase 5: Custom Hooks 🪝

- [ ] `usePortfolio` - Portfolio state management
- [ ] `useStockQuote` - Real-time quotes with caching
- [ ] `useTrading` - Buy/sell operations with validation
- [ ] `useMarketData` - Market data aggregation
- [ ] `useStorage` - IndexedDB wrapper hook

### Phase 6: UI Components 🎨

- [ ] `PortfolioOverview` - Metrics dashboard
- [ ] `StockSearch` - Symbol search with autocomplete
- [ ] `StockQuote` - Real-time quote card
- [ ] `OrderEntry` - Trading form
- [ ] `PositionsTable` - Current holdings
- [ ] `TransactionsTable` - Trade history
- [ ] `APISettings` - API key management
- [ ] `Watchlist` - Stock watchlist

### Phase 7: Main Tab Integration 🔗

- [ ] Create `PaperTradarrTab.tsx`
- [ ] Integrate all components
- [ ] Add to tab manifest
- [ ] Test end-to-end flow

### Phase 8: Polish & Features ✨

- [ ] Add loading states & skeletons
- [ ] Error boundaries & toast notifications
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Add charting (lightweight-charts)
- [ ] WebSocket real-time updates
- [ ] Export portfolio to CSV
- [ ] Performance analytics dashboard

## 🎯 Key Features

### Core Features

- ✅ Real-time stock quotes
- ✅ Buy/sell order execution
- ✅ Portfolio tracking with P&L
- ✅ Transaction history
- ✅ Multiple portfolio support
- ✅ Persistent storage (IndexedDB)
- ✅ API key management

### Advanced Features (Future)

- 📊 Interactive charts (candlestick, line)
- 📈 Technical indicators
- 🔔 Price alerts
- 📱 Mobile-responsive design
- 🌐 WebSocket real-time updates
- 📤 Export/import portfolios
- 📊 Performance analytics
- 🤖 Paper trading competitions

## 🧪 Testing Strategy

### Unit Tests

- Service layer functions
- Calculator utilities
- Validators and formatters
- Custom hooks (with React Testing Library)

### Integration Tests

- API client error handling
- IndexedDB operations
- Component interactions
- Trading flow (search → quote → order → execute)

### E2E Tests (Storybook)

- Complete trading scenarios
- Portfolio management flows
- API fallback behavior

## 📝 Code Standards

### TypeScript

- Strict mode enabled
- No implicit any
- Explicit return types on public APIs
- Interface over type for objects

### React

- Functional components only
- Custom hooks for logic reuse
- Memoization where appropriate (`useMemo`, `useCallback`)
- Error boundaries for component failures

### Naming Conventions

- Components: PascalCase (`StockQuote.tsx`)
- Hooks: camelCase with `use` prefix (`usePortfolio.ts`)
- Services: camelCase (`polygon.ts`)
- Types: PascalCase (`Position`, `Transaction`)
- Utils: camelCase (`formatCurrency`)

## 🔐 Security Considerations

- API keys stored in localStorage with Web Crypto API encryption
- No sensitive data in localStorage (only encrypted keys)
- Rate limiting to prevent API abuse
- Input sanitization for all user inputs
- CORS handling for API requests

## 📚 References

### Documentation

- [Polygon.io API Docs](https://polygon.io/docs)
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)
- [IndexedDB MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Libraries

- React Hook Form (for order entry)
- Zod (for validation)
- lightweight-charts (for stock charts)
- date-fns (for date formatting)

## 🤝 Contributing

When adding new features:

1. Update this README with implementation status
2. Add TypeScript types to `types/`
3. Write unit tests for new utilities
4. Update environment variables section if needed
5. Follow existing code patterns and naming conventions

## 📈 Performance Goals

- Initial load: < 1s
- Quote refresh: < 500ms
- Order execution: < 200ms
- IndexedDB operations: < 100ms
- API response cache hit: < 50ms

---

**Status**: 🚧 Service Layer Complete - Ready for Hooks & UI
**Version**: 0.2.0
**Last Updated**: 2025-10-22
**Completion**: Phases 1-4 ✅ (Types, Storage, APIs, Calculator)
