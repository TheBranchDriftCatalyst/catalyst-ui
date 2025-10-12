[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/eventHelpers](../README.md) / safeStopPropagation

# Function: safeStopPropagation()

> **safeStopPropagation**(`event`): `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/eventHelpers.ts:67](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/eventHelpers.ts#L67)

Safely stop propagation of a D3 drag event

Prevents the event from bubbling up to parent elements, which could
trigger unwanted behaviors like zooming when dragging a node.

**Why It's Safe:**

- Handles undefined/null events gracefully
- Handles missing sourceEvent property
- Logs errors only in development
- Never throws exceptions

**Common Use:**

```typescript
const dragBehavior = d3.drag().on("drag", event => {
  safeStopPropagation(event); // Prevent zoom from triggering
  // ... update node position
});
```

**Performance:**

- Negligible overhead
- Try-catch only triggers on actual errors
- Development logging doesn't affect production

## Parameters

### event

`any`

D3 drag event or any event with sourceEvent property

## Returns

`void`

## Example

```typescript
// In node drag handler
function onNodeDrag(event: any, node: NodeData) {
  safeStopPropagation(event); // Prevent pan/zoom
  node.x = event.x;
  node.y = event.y;
}
```

## See

[safeStopEvent](safeStopEvent.md) to also prevent default behavior
