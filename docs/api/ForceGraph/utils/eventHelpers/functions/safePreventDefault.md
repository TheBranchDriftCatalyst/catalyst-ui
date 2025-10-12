[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/eventHelpers](../README.md) / safePreventDefault

# Function: safePreventDefault()

> **safePreventDefault**(`event`): `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/eventHelpers.ts:102](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/eventHelpers.ts#L102)

Safely prevent default behavior of a D3 drag event

Stops the browser's default handling of the event (e.g., text selection,
context menu, link navigation). Essential for custom drag interactions.

**Why It's Safe:**

- Gracefully handles missing sourceEvent
- Won't throw if preventDefault doesn't exist
- Logs errors only in development
- Silent failure in production

**Common Use:**

```typescript
const dragBehavior = d3.drag().on("start", event => {
  safePreventDefault(event); // Prevent text selection
});
```

## Parameters

### event

`any`

D3 drag event or any event with sourceEvent property

## Returns

`void`

## See

[safeStopEvent](safeStopEvent.md) to also stop propagation
