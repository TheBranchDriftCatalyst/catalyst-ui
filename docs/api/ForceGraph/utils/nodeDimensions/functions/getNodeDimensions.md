[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/nodeDimensions](../README.md) / getNodeDimensions

# Function: getNodeDimensions()

> **getNodeDimensions**(`node`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/nodeDimensions.ts:55](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/nodeDimensions.ts#L55)

Calculate dynamic dimensions for a node based on its content

Computes appropriate width and height for a node card based on:

- Name/label length (longer names = wider nodes)
- Presence of status indicator
- Number of visible attributes

**Sizing Strategy:**

- Width: Scales with name length (8px per character + 100px padding)
- Height: Base 60px + adjustments for status/attributes
- Constrained to min/max bounds for visual consistency

**Constraints:**

- Min width: 160px (prevents nodes from being too narrow)
- Max width: 280px (prevents excessively wide nodes)
- Min height: 60px (minimum comfortable size)
- Max height: 80px (keeps nodes compact)

**Usage:**

```typescript
const dimensions = getNodeDimensions(node);
const { width, height } = dimensions;

// Use for collision detection
const collisionRadius = Math.max(width, height) / 2;

// Use for edge endpoint calculations
const halfWidth = width / 2;
const rightEdge = node.x + halfWidth;
```

**Performance:**

- Time Complexity: O(1) - simple arithmetic calculations
- Called frequently during layout and rendering
- No caching needed (very fast)

## Parameters

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

The node data to calculate dimensions for

## Returns

`object`

Object containing width and height in pixels

### width

> **width**: `number`

### height

> **height**: `number`

## See

calculateEdgeEndpoints uses these dimensions for edge routing
