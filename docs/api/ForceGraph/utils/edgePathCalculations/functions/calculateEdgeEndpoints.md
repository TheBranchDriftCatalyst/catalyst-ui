[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/edgePathCalculations](../README.md) / calculateEdgeEndpoints

# Function: calculateEdgeEndpoints()

> **calculateEdgeEndpoints**(`sourceX`, `sourceY`, `targetX`, `targetY`, `sourceNode`, `targetNode`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/edgePathCalculations.ts:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/edgePathCalculations.ts#L87)

Calculate optimal edge endpoints using 4-handle anchor system

Each node has 4 potential connection points (handles) at its edges:
top, bottom, left, and right. This function selects the pair of handles
that minimizes the distance between source and target nodes, creating
more natural-looking connections.

**Algorithm:**

1. Calculate all 4 handle positions for both nodes (based on dimensions)
2. For source node: find handle closest to target node center
3. For target node: find handle closest to source node center
4. Return selected handle coordinates

**Benefits:**

- Edges connect at node edges (not centers)
- Connections adapt to node orientation
- Reduces edge crossing visual clutter
- Works with dynamic node dimensions

**Usage:**

```typescript
const endpoints = calculateEdgeEndpoints(
  sourceNode.x,
  sourceNode.y,
  targetNode.x,
  targetNode.y,
  sourceNode,
  targetNode
);

// Use endpoints for straight line
const path = `M ${endpoints.x1} ${endpoints.y1} L ${endpoints.x2} ${endpoints.y2}`;

// Or pass to orthogonal router
const orthoPath = calculateOrthogonalPath(
  endpoints.x1,
  endpoints.y1,
  endpoints.x2,
  endpoints.y2,
  sourceNode,
  targetNode,
  allNodes
);
```

**Performance:**

- Time Complexity: O(1) - constant time calculations
- Called once per edge per render frame

## Parameters

### sourceX

`number`

X coordinate of source node center

### sourceY

`number`

Y coordinate of source node center

### targetX

`number`

X coordinate of target node center

### targetY

`number`

Y coordinate of target node center

### sourceNode

`any`

Source node data (for dimension calculation)

### targetNode

`any`

Target node data (for dimension calculation)

## Returns

`object`

Object with x1, y1 (source anchor) and x2, y2 (target anchor)

### x1

> **x1**: `any` = `sourceHandle.x`

### y1

> **y1**: `any` = `sourceHandle.y`

### x2

> **x2**: `any` = `targetHandle.x`

### y2

> **y2**: `any` = `targetHandle.y`

## See

- [getNodeDimensions](../../nodeDimensions/functions/getNodeDimensions.md) for node dimension calculation
- [calculateOrthogonalPath](calculateOrthogonalPath.md) for routing between endpoints
