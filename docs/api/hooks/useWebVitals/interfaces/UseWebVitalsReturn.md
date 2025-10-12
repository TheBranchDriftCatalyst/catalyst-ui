[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useWebVitals](../README.md) / UseWebVitalsReturn

# Interface: UseWebVitalsReturn

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:44](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L44)

UseWebVitalsReturn - Return value from the useWebVitals hook

## Properties

### metrics

> **metrics**: `Map`\<`string`, [`WebVitalMetric`](WebVitalMetric.md)\>

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:45](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L45)

Map of all collected metrics, keyed by metric name

---

### latestMetric

> **latestMetric**: `null` \| [`WebVitalMetric`](WebVitalMetric.md)

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L46)

Most recently collected metric (null if none yet)

---

### aggregateRating

> **aggregateRating**: `"good"` \| `"needs-improvement"` \| `"poor"`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:47](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L47)

Overall performance rating (worst metric wins)

---

### clear()

> **clear**: () => `void`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:48](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L48)

Function to reset all collected metrics

#### Returns

`void`
