[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/edgePathCalculations](../README.md) / calculateEdgeEndpoints

# Function: calculateEdgeEndpoints()

> **calculateEdgeEndpoints**(`sourceX`, `sourceY`, `targetX`, `targetY`, `sourceNode`, `targetNode`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/edgePathCalculations.ts:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/edgePathCalculations.ts#L12)

Calculate edge endpoints using 4-handle system (top, bottom, left, right)
Finds the closest handle on each node to connect to the other node

## Parameters

### sourceX

`number`

### sourceY

`number`

### targetX

`number`

### targetY

`number`

### sourceNode

`any`

### targetNode

`any`

## Returns

`object`

### x1

> **x1**: `any` = `sourceHandle.x`

### y1

> **y1**: `any` = `sourceHandle.y`

### x2

> **x2**: `any` = `targetHandle.x`

### y2

> **y2**: `any` = `targetHandle.y`
