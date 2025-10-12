[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/utils/eventHelpers

# ForceGraph/utils/eventHelpers

Event handling utilities for D3 graph interactions

Provides safe, error-tolerant methods for controlling event behavior
in D3 drag/zoom interactions. Prevents common issues like event bubbling
interfering with pan/zoom controls.

**Problem Solved:**
D3 events have a nested structure (event.sourceEvent) that can fail
in various ways. These utilities handle errors gracefully and provide
consistent behavior across different D3 event types.

**Use Cases:**

- Node dragging without triggering pan
- Click events without triggering zoom
- Preventing default browser behaviors
- Safe event handling in React components

## See

- [Drag Documentation](https://github.com/d3/d3-drag|D3)
- [Zoom Documentation](https://github.com/d3/d3-zoom|D3)

## Functions

- [safeStopPropagation](functions/safeStopPropagation.md)
- [safePreventDefault](functions/safePreventDefault.md)
- [safeStopEvent](functions/safeStopEvent.md)
