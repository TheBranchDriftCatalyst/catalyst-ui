[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useWebVitals](../README.md) / WebVitalMetric

# Interface: WebVitalMetric

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L15)

WebVitalMetric - Individual Core Web Vital measurement

## Properties

### name

> **name**: `"LCP"` \| `"INP"` \| `"CLS"` \| `"FCP"` \| `"TTFB"`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L16)

The metric type (LCP, INP, CLS, FCP, or TTFB)

---

### value

> **value**: `number`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:17](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L17)

The measured value in milliseconds (or unitless for CLS)

---

### rating

> **rating**: `"good"` \| `"needs-improvement"` \| `"poor"`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L18)

Performance classification based on Google's thresholds

---

### delta

> **delta**: `number`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L19)

Change since last measurement

---

### id

> **id**: `string`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L20)

Unique identifier for this measurement instance
