# Analytics Tracking Document

## Overview

This document tracks all analytics events, metrics, and data points collected by the Catalyst UI Analytics Framework. Use this as a reference for understanding what data is being tracked and for what purpose.

**Last Updated:** 2025-10-18

---

## Standard Events

These events are automatically tracked by the framework:

### Page Views

**Event Name:** `page_view`

**Trigger:** Automatically when route changes or manually via `trackPageView()`

**Parameters:**

- `page_path` (string) - URL path of the page
- `page_title` (string, optional) - Page title

**Purpose:** Understand which pages users visit and navigation patterns

**Example:**

```tsx
analytics.trackPageView("/products", "Products Page");
```

---

### Exceptions

**Event Name:** `exception`

**Trigger:** Automatically when errors occur (global handler or error boundary)

**Parameters:**

- `description` (string) - Error message
- `fatal` (boolean) - Whether error is fatal
- Additional context from error

**Purpose:** Track and debug application errors

**Stored Data:**

- Error message
- Stack trace
- Component stack (React errors)
- User agent
- URL where error occurred
- Timestamp
- Error type (error, unhandledrejection, react)

---

### Web Vitals

**Event Name:** `web_vitals`

**Trigger:** Automatically when Web Vitals metrics are measured

**Parameters:**

- `metric_name` (string) - Name of the metric (LCP, FID, CLS, TTFB, INP)
- `metric_value` (number) - Value of the metric
- `metric_rating` (string) - Rating (good, needs-improvement, poor)

**Metrics Tracked:**

- **LCP (Largest Contentful Paint)** - Loading performance
- **INP (Interaction to Next Paint)** - Interactivity
- **FCP (First Contentful Paint)** - Initial render
- **CLS (Cumulative Layout Shift)** - Visual stability
- **TTFB (Time to First Byte)** - Server response time

**Purpose:** Monitor and optimize application performance

---

## Custom Events

### User Interactions

#### Click Events

**Event Name:** `click`

**Trigger:** Via `useEventTracking().trackClick()`

**Parameters:**

- `element` (string) - Name/ID of clicked element
- Additional custom data

**Purpose:** Track user interactions with UI elements

**Example:**

```tsx
const { trackClick } = useEventTracking();
trackClick("submit_button", { form: "checkout" });
```

---

#### Form Submissions

**Event Name:** `form_submit`

**Trigger:** Via `useEventTracking().trackFormSubmit()`

**Parameters:**

- `form_name` (string) - Name of the form
- `success` (boolean) - Whether submission succeeded
- Additional custom data

**Purpose:** Track form completion rates and abandonment

**Example:**

```tsx
const { trackFormSubmit } = useEventTracking();
trackFormSubmit("contact_form", true, { num_fields: 5 });
```

---

#### Search

**Event Name:** `search`

**Trigger:** Via `useEventTracking().trackSearch()`

**Parameters:**

- `search_term` (string) - Search query
- `results_count` (number, optional) - Number of results

**Purpose:** Understand what users are searching for

**Example:**

```tsx
const { trackSearch } = useEventTracking();
trackSearch("react components", 42);
```

---

#### Downloads

**Event Name:** `download`

**Trigger:** Via `useEventTracking().trackDownload()`

**Parameters:**

- `file_name` (string) - Name of downloaded file
- `file_type` (string, optional) - File extension/type

**Purpose:** Track resource downloads

**Example:**

```tsx
const { trackDownload } = useEventTracking();
trackDownload("analytics-report.json", "json");
```

---

#### Share

**Event Name:** `share`

**Trigger:** Via `useEventTracking().trackShare()`

**Parameters:**

- `content_type` (string) - Type of content shared
- `share_method` (string, optional) - How it was shared

**Purpose:** Track content sharing behavior

**Example:**

```tsx
const { trackShare } = useEventTracking();
trackShare("product", "twitter");
```

---

### Performance Events

#### API Calls

**Event Name:** `api_call`

**Trigger:** Via `useApiPerformance().trackApiCall()`

**Parameters:**

- `url` (string) - API endpoint
- `method` (string) - HTTP method
- `duration` (number) - Call duration in ms
- `success` (boolean) - Whether call succeeded
- `status_code` (number, optional) - HTTP status code

**Purpose:** Monitor API performance and reliability

**Example:**

```tsx
const { trackApiCall } = useApiPerformance();
const start = performance.now();
try {
  const response = await fetch("/api/data");
  trackApiCall("/api/data", "GET", start, true, response.status);
} catch (error) {
  trackApiCall("/api/data", "GET", start, false);
}
```

---

#### Component Render Time

**Event Name:** `component_render_{componentName}`

**Trigger:** Automatically via `useComponentPerformance()`

**Stored as Performance Metric:**

- `name` - Component render metric name
- `value` - Render time in milliseconds
- `rating` - Performance rating

**Purpose:** Identify slow-rendering components

**Example:**

```tsx
function ExpensiveComponent() {
  useComponentPerformance("ExpensiveComponent");
  return <div>...</div>;
}
```

---

## User Journey Events

These events track the user's path through the application when `enableUserJourney: true`.

### Journey Step Types

#### Pageview

- **Type:** `pageview`
- **Target:** Page path
- **Data:** Page title

#### Click

- **Type:** `click`
- **Target:** Element selector (tag#id.class)
- **Data:** Click coordinates (x, y)

#### Navigation

- **Type:** `navigation`
- **Target:** New pathname
- **Data:** None

#### Custom

- **Type:** `custom`
- **Target:** Custom identifier
- **Data:** Custom data object

**Example:**

```tsx
analytics.trackJourneyStep({
  type: "custom",
  target: "video_watched",
  data: { video_id: "intro", duration: 120 },
});
```

---

## Session Data

Tracked automatically for each user session:

- **Session ID** - Unique session identifier
- **Start Time** - When session began
- **Last Activity** - Last interaction timestamp
- **Page Views** - Number of pages viewed
- **Event Count** - Total events in session
- **Journey** - Array of journey steps

**Session Timeout:** 30 minutes of inactivity

---

## Data Storage

### LocalStorage Keys

All data is stored in localStorage with the prefix `catalyst-analytics:`

- `catalyst-analytics:events` - Event log (max 1000)
- `catalyst-analytics:errors` - Error log (max 100)
- `catalyst-analytics:metrics` - Performance metrics (max 500)
- `catalyst-analytics:session` - Current session info

### Rotation Policy

Data is automatically rotated when limits are reached:

- **Events:** Keep last 1000
- **Errors:** Keep last 100
- **Performance Metrics:** Keep last 500
- **Journey Steps:** Keep last 500 per session

---

## Data Export Format

Exported data structure (JSON):

```json
{
  "events": [
    {
      "name": "page_view",
      "params": { "page_path": "/home" },
      "timestamp": 1729267200000
    }
  ],
  "errors": [
    {
      "message": "Error message",
      "stack": "...",
      "type": "react",
      "userAgent": "...",
      "url": "...",
      "timestamp": 1729267200000
    }
  ],
  "metrics": [
    {
      "name": "LCP",
      "value": 1234.56,
      "rating": "good",
      "timestamp": 1729267200000
    }
  ],
  "session": {
    "sessionId": "1729267200000-abc123",
    "startTime": 1729267200000,
    "lastActivity": 1729267500000,
    "pageViews": 5,
    "eventCount": 23,
    "journey": [...]
  }
}
```

---

## Privacy & Compliance

### Data Collection Policy

**Personal Data Collected:**

- None directly - framework does not collect PII

**Non-Personal Data Collected:**

- Page paths (URLs)
- Event interactions
- Performance metrics
- Error logs (may contain code context)
- User agent strings
- Timestamps
- Session IDs (randomly generated, not tied to user identity)

### GDPR Compliance

To ensure GDPR compliance:

1. **Disclosure:** Inform users about analytics in your privacy policy
2. **Consent:** Obtain user consent before enabling GA4 tracking
3. **Right to Deletion:** Provide `analytics.clearData()` method for users
4. **Anonymization:** Don't track PII in custom events
5. **Data Export:** Users can export their data via dashboard

### Cookie Policy

**Cookies Used:**

- None by this framework directly
- Google Analytics may set cookies if GA4 enabled

**LocalStorage:**

- Used for storing analytics data locally
- No cross-domain tracking
- Data never leaves user's browser unless sent to GA4

---

## Monitoring Checklist

Use this checklist to ensure analytics is properly configured:

- [ ] GA4 Measurement ID configured (production only)
- [ ] AnalyticsProvider wraps entire app
- [ ] AnalyticsErrorBoundary catches errors
- [ ] Debug mode enabled in development
- [ ] Performance monitoring enabled
- [ ] Error tracking enabled
- [ ] User journey tracking configured appropriately
- [ ] Custom events implemented for key interactions
- [ ] Privacy policy updated
- [ ] GDPR consent mechanism in place (if EU users)
- [ ] Data export functionality tested
- [ ] Observability dashboard accessible

---

## Event Naming Conventions

Follow these conventions for custom events:

### Format

- Use `snake_case` (lowercase with underscores)
- Be descriptive but concise
- Use present tense verbs

### Categories

Prefix events by category:

- `user_*` - User actions (user_login, user_logout)
- `product_*` - Product interactions (product_view, product_add_to_cart)
- `checkout_*` - Checkout flow (checkout_start, checkout_complete)
- `content_*` - Content engagement (content_view, content_share)
- `error_*` - Error events (error_api_timeout, error_validation)
- `perf_*` - Performance events (perf_slow_render, perf_api_timeout)

### Examples

✅ **Good:**

```
page_view
user_login
product_added_to_cart
checkout_completed
search_performed
video_played
form_submitted
error_network_timeout
```

❌ **Bad:**

```
Click                    # Too generic
UserLogin               # CamelCase
product-view            # kebab-case
CHECKOUT_COMPLETE       # SCREAMING_SNAKE_CASE
user did login          # Spaces
```

---

## Analytics Metrics & KPIs

### Core Metrics

| Metric               | Description                  | Target  |
| -------------------- | ---------------------------- | ------- |
| **Bounce Rate**      | % users leaving after 1 page | < 40%   |
| **Session Duration** | Average session length       | > 2 min |
| **Pages/Session**    | Average pages per session    | > 3     |
| **Error Rate**       | Errors per 100 sessions      | < 5     |

### Performance Metrics

| Metric   | Good    | Needs Improvement | Poor     |
| -------- | ------- | ----------------- | -------- |
| **LCP**  | < 2.5s  | 2.5s - 4.0s       | > 4.0s   |
| **INP**  | < 200ms | 200ms - 500ms     | > 500ms  |
| **CLS**  | < 0.1   | 0.1 - 0.25        | > 0.25   |
| **TTFB** | < 800ms | 800ms - 1800ms    | > 1800ms |

---

## Changelog

### 2025-10-18 - Initial Implementation

- Added Google Analytics 4 integration
- Implemented error tracking with React Error Boundary
- Added Web Vitals performance monitoring
- Created user journey tracking
- Built observability dashboard
- Added data export functionality
- Created comprehensive hooks API
- Documented all tracking events

---

## Future Enhancements

Planned features for future releases:

- [ ] A/B testing framework integration
- [ ] Funnel analysis visualizations
- [ ] Heatmap generation from click data
- [ ] Custom dashboard widgets
- [ ] Integration with external monitoring services (Sentry, LogRocket)
- [ ] Real-time alerting for critical errors
- [ ] Performance budgets with automated alerts
- [ ] Conversion tracking utilities
- [ ] Event replay functionality
- [ ] Advanced segmentation capabilities

---

## Contact

For questions or suggestions about analytics tracking:

- File an issue: [GitHub Issues](https://github.com/TheBranchDriftCatalyst/catalyst-ui/issues)
- Documentation: `/docs/analytics/README.md`
- Live Dashboard: `/catalyst/observability`
