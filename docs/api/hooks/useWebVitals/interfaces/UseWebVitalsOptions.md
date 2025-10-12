[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useWebVitals](../README.md) / UseWebVitalsOptions

# Interface: UseWebVitalsOptions

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L30)

UseWebVitalsOptions - Configuration for the useWebVitals hook

## Properties

### enableConsoleLog?

> `optional` **enableConsoleLog**: `boolean`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L31)

Log metrics to console (default: false)

---

### enableDetailedLog?

> `optional` **enableDetailedLog**: `boolean`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L32)

Show detailed metric breakdown in logs (default: false)

---

### onMetric()?

> `optional` **onMetric**: (`metric`) => `void`

Defined in: [workspace/catalyst-ui/lib/hooks/useWebVitals.ts:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useWebVitals.ts#L33)

Callback invoked when each metric is collected

#### Parameters

##### metric

[`WebVitalMetric`](WebVitalMetric.md)

#### Returns

`void`
