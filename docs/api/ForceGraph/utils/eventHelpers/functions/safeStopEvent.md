[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/eventHelpers](../README.md) / safeStopEvent

# Function: safeStopEvent()

> **safeStopEvent**(`event`): `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/eventHelpers.ts:150](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/eventHelpers.ts#L150)

Combines stopPropagation and preventDefault for complete event control

Convenience function that both stops event bubbling AND prevents default
browser behavior. Use this when you want total control over event handling.

**What It Does:**

1. Stops event from bubbling to parent elements
2. Prevents browser's default handling

**When to Use:**

- Custom drag-and-drop implementations
- Preventing all default behaviors
- Isolating event handling to specific elements
- Node/edge interaction handlers

**Example Use Cases:**

- Dragging nodes without text selection
- Custom context menus without browser menu
- Click handlers that shouldn't trigger parent actions

## Parameters

### event

`any`

D3 drag event or any event with sourceEvent property

## Returns

`void`

## Example

```typescript
const dragBehavior = d3.drag().on("drag", (event, d) => {
  safeStopEvent(event); // Complete event isolation
  d.x = event.x;
  d.y = event.y;
  updateVisualization();
});
```

## See

- [safeStopPropagation](safeStopPropagation.md) for just stopping bubbling
- [safePreventDefault](safePreventDefault.md) for just preventing defaults
