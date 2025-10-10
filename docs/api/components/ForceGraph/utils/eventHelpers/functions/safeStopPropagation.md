[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/eventHelpers](../README.md) / safeStopPropagation

# Function: safeStopPropagation()

> **safeStopPropagation**(`event`): `void`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/eventHelpers.ts:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/eventHelpers.ts#L13)

Safely stop propagation of a D3 drag event
Prevents the event from bubbling up, which could interfere with zoom/pan

## Parameters

### event

`any`

D3 drag event or any event with sourceEvent

## Returns

`void`
