# Performance Monitoring & Development Tools

**Date:** October 7, 2025
**Status:** ✅ Implemented

This document covers the performance monitoring and development utilities integrated into catalyst-ui. These tools help identify performance bottlenecks, monitor Core Web Vitals, and optimize React rendering.

---

## Table of Contents

1. [Overview](#overview)
2. [Tools Included](#tools-included)
3. [Quick Start](#quick-start)
4. [DevModeProvider](#devmodeprovider)
5. [useWebVitals Hook](#usewebvitals-hook)
6. [PerformanceProfiler Component](#performanceprofiler-component)
7. [react-scan Integration](#react-scan-integration)
8. [Configuration](#configuration)
9. [Production Builds](#production-builds)
10. [Examples](#examples)

---

## Overview

catalyst-ui includes a comprehensive suite of performance monitoring tools designed for **development environments only**. These tools help you:

- **Visualize render performance** with react-scan
- **Monitor Core Web Vitals** (LCP, INP, CLS, FCP, TTFB) in real-time
- **Profile component render times** with React Profiler API
- **Identify unnecessary re-renders** and optimization opportunities

All tools are:

- ✅ **Development-only** (automatically stripped in production builds)
- ✅ **Zero-impact on production** bundle size
- ✅ **Easy to integrate** with a single provider
- ✅ **Highly configurable** via DevModeProvider config

---

## Tools Included

### 1. react-scan (19.4k ⭐)

**Visual render performance analysis**

- Highlights components as they re-render with colored overlays
- Shows render count and duration
- Helps identify unnecessary re-renders
- Works in Storybook and app development mode

**GitHub:** [github.com/aidenybai/react-scan](https://github.com/aidenybai/react-scan)

### 2. web-vitals (Google)

**Core Web Vitals monitoring**

- Tracks LCP (Largest Contentful Paint)
- Tracks INP (Interaction to Next Paint)
- Tracks CLS (Cumulative Layout Shift)
- Tracks FCP (First Contentful Paint)
- Tracks TTFB (Time to First Byte)
- Console logging with emoji indicators (✅ good, ⚠️ needs improvement, ❌ poor)

**NPM:** [npmjs.com/package/web-vitals](https://www.npmjs.com/package/web-vitals)

### 3. React Profiler API

**Programmatic performance measurement**

- Measures actual render duration
- Compares against base duration (theoretical minimum)
- Identifies slow components with configurable thresholds
- Integrates with React DevTools for flame graphs

**Docs:** [react.dev/reference/react/Profiler](https://react.dev/reference/react/Profiler)

---

## Quick Start

### In Your App

```tsx
// app/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DevModeProvider } from "@/catalyst-ui/contexts/DevMode";

// Initialize react-scan (development only)
if (import.meta.env.DEV) {
  import("react-scan").then(mod => {
    mod.scan({
      enabled: true,
      log: false, // Set to true to log all renders
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {import.meta.env.DEV ? (
      <DevModeProvider
        config={{
          enableWebVitals: true,
          webVitalsReporting: "console",
          enableReactScan: true,
        }}
      >
        <App />
      </DevModeProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
```

### In Storybook

**Already configured!** react-scan is automatically enabled in Storybook development mode.

See `.storybook/preview.tsx` for the integration.

---

## DevModeProvider

**Central orchestrator for all dev tools**

### Features

- Manages react-scan initialization and toggling
- Integrates web-vitals monitoring
- Provides unified API via `useDevMode()` hook
- Context-based state management

### Usage

```tsx
import { DevModeProvider } from "@/catalyst-ui/contexts/DevMode";

function App() {
  return (
    <DevModeProvider
      config={{
        // Enable/disable dev mode entirely
        enabled: true,

        // react-scan options
        enableReactScan: true,
        reactScanEnabled: true,
        logRenders: false, // Log all renders to console

        // web-vitals options
        enableWebVitals: true,
        webVitalsReporting: "console", // 'console' | 'callback' | 'none'
        onWebVital: metric => {
          // Custom callback for analytics
          analytics.track("web-vital", metric);
        },

        // Profiler options
        enableProfiler: true,
        profilerSampleRate: 1, // 0.0 to 1.0

        // Debug features
        showFPS: false,
        showRenderCount: false,
      }}
    >
      <YourApp />
    </DevModeProvider>
  );
}
```

### useDevMode() Hook

Access dev mode utilities from any component:

```tsx
import { useDevMode } from "@/catalyst-ui/contexts/DevMode";

function PerformancePanel() {
  const {
    config,
    updateConfig,
    isEnabled,
    vitals,
    latestVital,
    toggleReactScan,
    startProfiling,
    stopProfiling,
    isProfiling,
  } = useDevMode();

  return (
    <div>
      <button onClick={toggleReactScan}>
        {config.reactScanEnabled ? "Disable" : "Enable"} React Scan
      </button>

      <div>
        <h3>Core Web Vitals</h3>
        <p>LCP: {vitals.get("LCP")?.value}ms</p>
        <p>INP: {vitals.get("INP")?.value}ms</p>
        <p>CLS: {vitals.get("CLS")?.value}</p>
      </div>

      <button onClick={isProfiling ? stopProfiling : startProfiling}>
        {isProfiling ? "Stop" : "Start"} Profiling
      </button>
    </div>
  );
}
```

---

## useWebVitals Hook

**Standalone hook for Core Web Vitals monitoring**

Can be used independently of DevModeProvider.

### Features

- Automatic collection of all Core Web Vitals
- Flexible reporting (console, callbacks, or both)
- Map-based storage for easy metric access
- Dynamic import (won't bloat production bundle)

### Usage

```tsx
import { useWebVitals } from "@/catalyst-ui/hooks/useWebVitals";

function App() {
  const { metrics, latestMetric, clear } = useWebVitals({
    // Enable console logging with emojis
    enableConsoleLog: true,

    // Enable detailed logging with attribution data
    enableDetailedLog: true,

    // Custom callback for analytics
    onMetric: metric => {
      // Send to analytics service
      analytics.track("web-vital", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    },
  });

  return (
    <div>
      <h2>Core Web Vitals</h2>
      <p>
        LCP: {metrics.get("LCP")?.value}ms ({metrics.get("LCP")?.rating})
      </p>
      <p>
        INP: {metrics.get("INP")?.value}ms ({metrics.get("INP")?.rating})
      </p>
      <p>
        CLS: {metrics.get("CLS")?.value} ({metrics.get("CLS")?.rating})
      </p>

      <button onClick={clear}>Clear Metrics</button>
    </div>
  );
}
```

### Console Output Example

```
✅ LCP: 1230 (good)
⚠️ INP: 210 (needs-improvement)
✅ CLS: 0.05 (good)
```

### Detailed Console Output

```
✅ Web Vital: LCP
Value: 1230.5
Rating: good
Delta: 12.3
ID: v3-1234567890
Attribution: { element: '<img>', url: '/hero.jpg', ... }
```

---

## PerformanceProfiler Component

**Wrapper around React's built-in Profiler API**

### Features

- Measures render duration
- Identifies slow renders with configurable thresholds
- Console logging with performance hints
- Works with React DevTools Profiler

### Usage

```tsx
import { PerformanceProfiler } from "@/catalyst-ui/components/PerformanceProfiler";

// Basic usage with logging
function App() {
  return (
    <PerformanceProfiler id="app-root" enableLogging>
      <ExpensiveComponent />
    </PerformanceProfiler>
  );
}

// Only log renders slower than 16ms (60fps threshold)
function DataTable({ data }) {
  return (
    <PerformanceProfiler id="data-table" enableLogging slowRenderThreshold={16}>
      <Table data={data} />
    </PerformanceProfiler>
  );
}

// Custom callback for analytics
function CheckoutFlow() {
  return (
    <PerformanceProfiler
      id="checkout"
      onRender={(id, phase, actualDuration, baseDuration) => {
        if (actualDuration > 100) {
          analytics.track("slow-render", {
            component: id,
            phase,
            duration: actualDuration,
          });
        }
      }}
    >
      <CheckoutForm />
    </PerformanceProfiler>
  );
}
```

### Console Output Example

```
🐌 Profiler: data-table (Update)
Actual Duration: 23.45ms
Base Duration: 12.30ms
Start Time: 1234.56ms
Commit Time: 1258.01ms
⚠️ Render took 91% longer than expected. Consider memoization or optimization.
```

### Performance Emoji Key

- ✅ **< 8ms** - Excellent (120fps+)
- ⚠️ **8-16ms** - Good (60-120fps)
- 🐌 **> 16ms** - Needs optimization (< 60fps)

---

## react-scan Integration

### How It Works

react-scan is automatically initialized in development mode for both:

- **Storybook** (`.storybook/preview.tsx`)
- **App** (`app/main.tsx`)

### Visual Indicators

When enabled, react-scan shows:

- **Colored overlays** on re-rendering components
- **Render count** in component corners
- **Render duration** overlay

### Toggling react-scan

```tsx
// Via DevModeProvider
import { useDevMode } from "@/catalyst-ui/contexts/DevMode";

function DebugPanel() {
  const { toggleReactScan, config } = useDevMode();

  return (
    <button onClick={toggleReactScan}>
      {config.reactScanEnabled ? "Hide" : "Show"} Render Highlights
    </button>
  );
}
```

### Manual Control

```tsx
// Without DevModeProvider (direct API)
if (import.meta.env.DEV) {
  import("react-scan").then(mod => {
    const scan = mod.scan;

    // Enable
    scan({ enabled: true, log: true });

    // Disable
    scan({ enabled: false });
  });
}
```

---

## Configuration

### DevModeConfig Interface

```typescript
interface DevModeConfig {
  // General
  enabled?: boolean; // Master switch for all dev tools

  // react-scan
  enableReactScan?: boolean; // Load react-scan library
  reactScanEnabled?: boolean; // Show visual overlays
  logRenders?: boolean; // Console log all renders

  // web-vitals
  enableWebVitals?: boolean; // Collect Core Web Vitals
  webVitalsReporting?: "console" | "callback" | "none";
  onWebVital?: (metric: Metric) => void; // Custom callback

  // Profiler
  enableProfiler?: boolean; // Enable React Profiler
  profilerSampleRate?: number; // 0.0 to 1.0 (future feature)

  // Debug features (future)
  showFPS?: boolean;
  showRenderCount?: boolean;
}
```

---

## Production Builds

### Automatic Stripping

All dev mode code is automatically excluded from production builds:

```tsx
// This entire block is removed in production builds
if (import.meta.env.DEV) {
  import("react-scan").then(mod => {
    mod.scan({ enabled: true });
  });
}
```

### Bundle Size Impact

- **Development:** +~150KB (react-scan + web-vitals)
- **Production:** **+0KB** (completely removed via tree-shaking)

### Verification

Build the app and check bundle size:

```bash
yarn build:app
```

Inspect `dist/app/assets/` - you'll see no references to `react-scan` or dev mode code.

---

## Examples

### Complete Dev Mode Setup

```tsx
// app/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DevModeProvider } from "@/catalyst-ui/contexts/DevMode";

if (import.meta.env.DEV) {
  import("react-scan").then(mod => {
    mod.scan({ enabled: true, log: false });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {import.meta.env.DEV ? (
      <DevModeProvider
        config={{
          enableWebVitals: true,
          webVitalsReporting: "console",
          enableReactScan: true,
          onWebVital: metric => {
            // Send to analytics in dev (for testing)
            console.log("[Analytics Test]", metric.name, metric.value);
          },
        }}
      >
        <App />
      </DevModeProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
```

### Performance Dashboard Component

```tsx
import { useDevMode } from "@/catalyst-ui/contexts/DevMode";
import { Card } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";

function PerformanceDashboard() {
  const {
    config,
    vitals,
    latestVital,
    toggleReactScan,
    isProfiling,
    startProfiling,
    stopProfiling,
  } = useDevMode();

  if (!import.meta.env.DEV) return null; // Hide in production

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm">
      <h3 className="font-semibold mb-2">Performance Tools</h3>

      <div className="space-y-2">
        <Button
          onClick={toggleReactScan}
          variant={config.reactScanEnabled ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {config.reactScanEnabled ? "🟢" : "⚪"} React Scan
        </Button>

        <Button
          onClick={isProfiling ? stopProfiling : startProfiling}
          variant={isProfiling ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {isProfiling ? "🔴 Stop" : "⚪ Start"} Profiling
        </Button>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <h4 className="font-semibold">Core Web Vitals</h4>
        {["LCP", "INP", "CLS", "FCP", "TTFB"].map(name => {
          const metric = vitals.get(name);
          if (!metric) return null;

          const emoji =
            metric.rating === "good" ? "✅" : metric.rating === "needs-improvement" ? "⚠️" : "❌";

          return (
            <div key={name} className="flex justify-between">
              <span>
                {emoji} {name}:
              </span>
              <span>{metric.value.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {latestVital && (
        <div className="mt-2 text-xs text-muted-foreground">
          Latest: {latestVital.name} = {latestVital.value.toFixed(2)}
        </div>
      )}
    </Card>
  );
}

export default PerformanceDashboard;
```

### Profiling Expensive Components

```tsx
import { PerformanceProfiler } from "@/catalyst-ui/components/PerformanceProfiler";

function ExpensiveDataTable({ data }) {
  return (
    <PerformanceProfiler
      id="data-table"
      enableLogging={import.meta.env.DEV}
      slowRenderThreshold={16}
      onRender={(id, phase, actualDuration) => {
        if (actualDuration > 50) {
          console.warn(`🐌 ${id} took ${actualDuration.toFixed(2)}ms to render!`);
        }
      }}
    >
      <table>
        {data.map(row => (
          <TableRow key={row.id} data={row} />
        ))}
      </table>
    </PerformanceProfiler>
  );
}
```

---

## Best Practices

### 1. Use DevModeProvider Only in Development

```tsx
// ✅ Good
{import.meta.env.DEV ? (
  <DevModeProvider config={...}>
    <App />
  </DevModeProvider>
) : (
  <App />
)}

// ❌ Bad (provider will be in production bundle)
<DevModeProvider config={...}>
  <App />
</DevModeProvider>
```

### 2. Profile Specific Components, Not Everything

```tsx
// ✅ Good - profile known expensive components
<PerformanceProfiler id="large-table">
  <DataTable data={largeDataset} />
</PerformanceProfiler>

// ❌ Bad - too broad, noisy data
<PerformanceProfiler id="entire-app">
  <App />
</PerformanceProfiler>
```

### 3. Set Appropriate Thresholds

```tsx
// ✅ Good - 60fps threshold for animations
<PerformanceProfiler id="animation" slowRenderThreshold={16}>
  <AnimatedComponent />
</PerformanceProfiler>

// ✅ Good - higher threshold for data-heavy components
<PerformanceProfiler id="chart" slowRenderThreshold={50}>
  <D3Chart data={bigDataset} />
</PerformanceProfiler>
```

### 4. Send Vitals to Analytics

```tsx
const { metrics } = useWebVitals({
  onMetric: metric => {
    // Only send poor/needs-improvement to reduce noise
    if (metric.rating !== "good") {
      analytics.track("web-vital", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  },
});
```

---

## Troubleshooting

### react-scan Not Showing

1. Check that you're in development mode (`import.meta.env.DEV`)
2. Verify react-scan is imported and initialized
3. Check browser console for errors
4. Try toggling via `useDevMode().toggleReactScan()`

### Web Vitals Not Logging

1. Ensure `webVitalsReporting` is set to `'console'`
2. Check that the page has finished loading (some metrics require user interaction)
3. Verify `enableWebVitals: true` in config
4. Open browser console and look for emoji indicators

### Profiler Not Logging

1. Verify `enableLogging: true` on PerformanceProfiler
2. Check `slowRenderThreshold` - might be too high
3. Ensure component is actually re-rendering
4. Look for performance warnings in React DevTools

---

## Resources

### Documentation

- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Web Vitals](https://web.dev/articles/vitals)
- [react-scan GitHub](https://github.com/aidenybai/react-scan)

### Related Docs

- [LIGHTHOUSE_OPTIMIZATIONS.md](./LIGHTHOUSE_OPTIMIZATIONS.md) - Build-time optimizations
- [architecture/animation-hoc.md](./architecture/animation-hoc.md) - Animation performance

### Core Web Vitals Thresholds

| Metric | Good    | Needs Improvement | Poor     |
| ------ | ------- | ----------------- | -------- |
| LCP    | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s   |
| INP    | ≤ 200ms | 200ms - 500ms     | > 500ms  |
| CLS    | ≤ 0.1   | 0.1 - 0.25        | > 0.25   |
| FCP    | ≤ 1.8s  | 1.8s - 3.0s       | > 3.0s   |
| TTFB   | ≤ 800ms | 800ms - 1800ms    | > 1800ms |

---

## Future Enhancements

### Planned Features

- [ ] FPS counter overlay
- [ ] Render count badges
- [ ] Memory usage tracking
- [ ] Network waterfall visualization
- [ ] Component tree flamegraph
- [ ] Customizable profiler sampling rate
- [ ] Export performance data to JSON
- [ ] Integration with Lighthouse CI

### Contributions

Want to add a feature? Check out:

- `lib/contexts/DevMode/` - DevMode context
- `lib/hooks/useWebVitals.ts` - Web Vitals hook
- `lib/components/PerformanceProfiler/` - Profiler component
- `app/main.tsx` - App integration example

---

**Last Updated:** October 7, 2025
**Version:** 1.0.0
