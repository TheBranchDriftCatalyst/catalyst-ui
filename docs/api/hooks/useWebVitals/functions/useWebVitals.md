[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useWebVitals](../README.md) / useWebVitals

# Function: useWebVitals()

> **useWebVitals**(`options`): [`UseWebVitalsReturn`](../interfaces/UseWebVitalsReturn.md)

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L46)

Hook for monitoring Core Web Vitals

Collects LCP, INP, CLS, FCP, TTFB metrics using Google's web-vitals library.

## Parameters

### options

[`UseWebVitalsOptions`](../interfaces/UseWebVitalsOptions.md) = `{}`

Configuration options

## Returns

[`UseWebVitalsReturn`](../interfaces/UseWebVitalsReturn.md)

Object containing metrics Map, latest metric, aggregate rating, and clear function

## Example

```tsx
const { metrics, latestMetric, aggregateRating } = useWebVitals({
  enableConsoleLog: true,
  onMetric: metric => {
    // Send to analytics
    analytics.track("web-vital", metric);
  },
});
```
