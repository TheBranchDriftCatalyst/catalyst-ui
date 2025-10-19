# Analytics & Observability Framework

## Overview

The Catalyst UI Analytics Framework is a comprehensive, production-ready observability solution that provides:

- **Google Analytics 4 (GA4) Integration** - Industry-standard web analytics
- **Error Tracking** - Automatic error capture and reporting with React Error Boundaries
- **Performance Monitoring** - Web Vitals and custom performance metrics
- **User Journey Tracking** - Session recording and interaction tracking
- **Real-time Dashboard** - Live observability dashboard with data export

## Features

### ✅ Google Analytics 4

- Automatic page view tracking
- Custom event tracking
- E-commerce ready
- Privacy compliant
- Debug mode for development

### ✅ Error Tracking

- React Error Boundary integration
- Global error handler (window.onerror)
- Unhandled promise rejection tracking
- Component stack traces
- Custom error context

### ✅ Performance Monitoring

- Web Vitals (LCP, FID, CLS, TTFB, INP)
- Component render time tracking
- API call performance
- Custom performance marks
- Performance ratings (good/needs-improvement/poor)

### ✅ User Journey Tracking

- Session management
- Page view tracking
- Click tracking
- Navigation tracking
- Custom journey steps

### ✅ Data Management

- LocalStorage persistence
- Automatic data rotation (max 1000 events, 100 errors, 500 metrics)
- JSON export capabilities
- Data clearing utilities

## Quick Start

### 1. Installation

The analytics package is already installed and configured in `catalyst-ui`. Dependencies:

```json
{
  "react-ga4": "^2.1.0",
  "web-vitals": "^5.1.0"
}
```

### 2. Configuration

Configure analytics in your app's root component:

```tsx
import { AnalyticsProvider, AnalyticsErrorBoundary } from "@/catalyst-ui/contexts/Analytics";

function App() {
  return (
    <AnalyticsProvider
      config={{
        measurementId: "G-XXXXXXXXXX", // Your GA4 measurement ID
        debug: process.env.NODE_ENV === "development",
        enablePerformance: true,
        enableErrorTracking: true,
        enableUserJourney: true,
      }}
    >
      <AnalyticsErrorBoundary>{/* Your app */}</AnalyticsErrorBoundary>
    </AnalyticsProvider>
  );
}
```

### 3. Usage in Components

#### Track Custom Events

```tsx
import { useAnalytics } from "@/catalyst-ui/contexts/Analytics";

function MyComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.trackEvent("button_click", {
      button_name: "submit",
      section: "checkout",
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

#### Track Page Views

```tsx
import { usePageTracking } from "@/catalyst-ui/hooks/usePageTracking";

function MyPage() {
  usePageTracking("/products", "Products Page");

  return <div>Products</div>;
}
```

#### Track Events with Hooks

```tsx
import { useEventTracking } from "@/catalyst-ui/hooks/useEventTracking";

function SearchComponent() {
  const { trackSearch, trackClick } = useEventTracking();

  const handleSearch = (query: string) => {
    trackSearch(query, resultsCount);
  };

  return <input onChange={e => handleSearch(e.target.value)} />;
}
```

#### Track Component Performance

```tsx
import { useComponentPerformance } from "@/catalyst-ui/hooks/usePerformanceTracking";

function ExpensiveComponent() {
  useComponentPerformance("ExpensiveComponent");

  // Component will automatically track render time
  return <div>...</div>;
}
```

## API Reference

### AnalyticsProvider Props

| Prop       | Type              | Description                     |
| ---------- | ----------------- | ------------------------------- |
| `config`   | `AnalyticsConfig` | Configuration object (optional) |
| `children` | `ReactNode`       | Child components                |

### AnalyticsConfig

```typescript
interface AnalyticsConfig {
  measurementId?: string; // GA4 measurement ID
  debug?: boolean; // Enable debug logging
  enablePerformance?: boolean; // Track performance metrics
  enableErrorTracking?: boolean; // Track errors
  enableUserJourney?: boolean; // Track user journey
  customDimensions?: Record<string, string | number>;
}
```

### useAnalytics Hook

Returns an object with the following methods:

| Method                       | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `initialize(config)`         | Initialize analytics (usually done by provider) |
| `trackEvent(name, params)`   | Track custom event                              |
| `trackPageView(path, title)` | Track page view                                 |
| `trackError(error, context)` | Track error                                     |
| `trackPerformance(metric)`   | Track performance metric                        |
| `trackJourneyStep(step)`     | Track user journey step                         |
| `getSession()`               | Get current session info                        |
| `getEvents()`                | Get all tracked events                          |
| `getErrors()`                | Get all tracked errors                          |
| `getMetrics()`               | Get all performance metrics                     |
| `exportData()`               | Export all data as JSON string                  |
| `clearData()`                | Clear all stored data                           |
| `isInitialized`              | Boolean indicating initialization status        |

## Observability Dashboard

Access the real-time observability dashboard at `/catalyst/observability` in the app. Features:

- **Overview Stats** - Total events, errors, metrics, session duration
- **Event Log** - Chronological list of all tracked events
- **Error Log** - Detailed error reports with stack traces
- **Performance Metrics** - Web Vitals and custom metrics with ratings
- **User Journey** - Visualization of user interaction flow
- **Session Info** - Current session details
- **Data Export** - Export analytics data as JSON
- **Auto-refresh** - Real-time updates every 2 seconds

## Best Practices

### 1. Event Naming

Use descriptive, lowercase event names with underscores:

✅ Good:

```tsx
analytics.trackEvent("product_added_to_cart", { product_id: "123" });
analytics.trackEvent("checkout_completed", { order_total: 99.99 });
```

❌ Bad:

```tsx
analytics.trackEvent("Click", { btn: "submit" }); // Too generic
analytics.trackEvent("ProductAddedToCart", {}); // CamelCase
```

### 2. Error Context

Always provide context when tracking errors:

```tsx
try {
  await fetchData();
} catch (error) {
  analytics.trackError(error, {
    component: "DataFetcher",
    action: "fetchData",
    userId: currentUser.id,
  });
}
```

### 3. Performance Tracking

Track only meaningful performance metrics:

```tsx
// Good - tracks important operations
const { mark } = usePerformanceMark("data_processing");
mark("start");
await processLargeDataset();
mark("end");

// Avoid - tracking trivial operations
useComponentPerformance("TinyButton"); // Not useful
```

### 4. Privacy Compliance

Never track PII (Personally Identifiable Information):

❌ Avoid:

```tsx
analytics.trackEvent("user_login", {
  email: "user@example.com", // PII!
  password: "...", // NEVER!
});
```

✅ Instead:

```tsx
analytics.trackEvent("user_login", {
  user_id_hash: hashUserId(user.id),
  login_method: "email",
});
```

## Configuration for Production

### Google Analytics 4 Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to your app configuration:

```tsx
<AnalyticsProvider
  config={{
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    debug: false,
    enablePerformance: true,
    enableErrorTracking: true,
    enableUserJourney: false, // Disable in production if privacy-sensitive
  }}
>
```

4. Set environment variable:

```bash
# .env.production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Performance Optimization

For production, consider:

```tsx
<AnalyticsProvider
  config={{
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    debug: false,
    enablePerformance: true,      // Keep enabled
    enableErrorTracking: true,    // Keep enabled
    enableUserJourney: false,     // Disable if not needed (reduces overhead)
  }}
>
```

## Troubleshooting

### Events not showing in GA4

1. Check GA4 Measurement ID is correct
2. Enable debug mode: `config.debug = true`
3. Check browser console for analytics logs
4. Verify GA4 data stream is active
5. Wait up to 24 hours for data to appear in GA4

### Error tracking not working

1. Ensure `enableErrorTracking: true` in config
2. Check that `AnalyticsErrorBoundary` wraps your app
3. Verify errors are being caught (check console)
4. Check localStorage for stored errors: `catalyst-analytics:errors`

### Performance metrics missing

1. Verify `enablePerformance: true` in config
2. Check browser supports PerformanceObserver API
3. Ensure page has completed loading (metrics fire on load)
4. Check observability dashboard for local metrics

### LocalStorage full

If you see warnings about localStorage being full:

1. Increase rotation limits in `lib/contexts/Analytics/storage.ts`
2. Or implement custom storage backend (IndexedDB, etc.)
3. Or reduce tracking frequency

## Architecture

```
lib/contexts/Analytics/
├── types.ts              # TypeScript definitions
├── storage.ts            # LocalStorage persistence layer
├── AnalyticsContext.tsx  # React context definition
├── AnalyticsProvider.tsx # Main provider component
├── ErrorBoundary.tsx     # Error boundary component
└── index.ts             # Public exports

lib/hooks/
├── usePageTracking.ts       # Page view tracking hook
├── useEventTracking.ts      # Event tracking hooks
└── usePerformanceTracking.ts # Performance tracking hooks

app/tabs/
└── ObservabilityTab.tsx  # Dashboard UI
```

## Contributing

When adding new analytics features:

1. Update type definitions in `types.ts`
2. Add storage methods if needed in `storage.ts`
3. Update provider if new tracking methods needed
4. Add corresponding hooks in `lib/hooks/`
5. Update dashboard UI if new data types
6. Document in this README

## License

MIT - See LICENSE file in repository root.

## Support

For issues or questions:

- GitHub Issues: [catalyst-ui/issues](https://github.com/TheBranchDriftCatalyst/catalyst-ui/issues)
- Documentation: [docs/analytics/](.)
- Live Demo: Navigate to `/catalyst/observability` in the app
