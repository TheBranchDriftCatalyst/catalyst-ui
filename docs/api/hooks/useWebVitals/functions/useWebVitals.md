[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useWebVitals](../README.md) / useWebVitals

# Function: useWebVitals()

> **useWebVitals**(`options`): [`UseWebVitalsReturn`](../interfaces/UseWebVitalsReturn.md)

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:158](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L158)

useWebVitals - Monitors Core Web Vitals performance metrics in development

This hook collects and tracks the five Core Web Vitals metrics (LCP, INP, CLS, FCP, TTFB)
using Google's official web-vitals library. It provides real-time performance monitoring
with automatic rating classification (good/needs-improvement/poor).

The hook only operates in development mode (DEV) to avoid impacting production performance.
It can log metrics to the console and/or send them to custom analytics endpoints.

**Core Web Vitals tracked:**

- **LCP** (Largest Contentful Paint) - Loading performance
- **INP** (Interaction to Next Paint) - Interactivity/responsiveness
- **CLS** (Cumulative Layout Shift) - Visual stability
- **FCP** (First Contentful Paint) - Initial paint time
- **TTFB** (Time to First Byte) - Server response time

## Parameters

### options

[`UseWebVitalsOptions`](../interfaces/UseWebVitalsOptions.md) = `{}`

Configuration options for logging and callbacks

## Returns

[`UseWebVitalsReturn`](../interfaces/UseWebVitalsReturn.md)

Object containing metrics state and control functions

## Examples

```tsx
// Basic usage with console logging
function PerformanceMonitor() {
  const { metrics, latestMetric, aggregateRating } = useWebVitals({
    enableConsoleLog: true,
  });

  return (
    <div>
      <h3>Performance: {aggregateRating}</h3>
      {latestMetric && (
        <p>
          Latest: {latestMetric.name} = {latestMetric.value.toFixed(2)}
        </p>
      )}
      <p>Total metrics collected: {metrics.size}</p>
    </div>
  );
}
```

```tsx
// Send metrics to analytics service
function AnalyticsIntegration() {
  const { metrics, aggregateRating } = useWebVitals({
    onMetric: metric => {
      // Send to your analytics platform
      analytics.track("web-vital", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    },
  });

  return <div>Overall Rating: {aggregateRating}</div>;
}
```

```tsx
// Display all metrics with detailed breakdown
function DetailedMetrics() {
  const { metrics, clear } = useWebVitals({
    enableConsoleLog: true,
    enableDetailedLog: true,
  });

  return (
    <div>
      <h3>All Metrics</h3>
      <ul>
        {Array.from(metrics.values()).map(metric => (
          <li key={metric.id}>
            <strong>{metric.name}:</strong> {metric.value.toFixed(2)}ms
            <span className={`rating-${metric.rating}`}>{metric.rating}</span>
          </li>
        ))}
      </ul>
      <button onClick={clear}>Clear Metrics</button>
    </div>
  );
}
```

## Note

This hook only runs in development mode. In production builds, it will no-op
and return empty/default values to avoid performance overhead.

## Note

The aggregateRating uses the "worst rating wins" strategy - if any metric is
"poor", the aggregate is "poor". If any is "needs-improvement", aggregate is
"needs-improvement". Only if all are "good" is the aggregate "good".

## See

- https://web.dev/vitals/ - Google's Web Vitals documentation
- https://github.com/GoogleChrome/web-vitals - Official web-vitals library
