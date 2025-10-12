[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/edgePathCalculations](../README.md) / calculateOrthogonalPath

# Function: calculateOrthogonalPath()

> **calculateOrthogonalPath**(`x1`, `y1`, `x2`, `y2`, `sourceNode`, `targetNode`, `allNodes`, `edgeIndex`, `_totalEdgesBetweenNodes`): `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/edgePathCalculations.ts:224](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/edgePathCalculations.ts#L224)

Calculate orthogonal (right-angle) path with intelligent collision avoidance

Creates aesthetically pleasing paths that route around obstacles using only
horizontal and vertical line segments. Tests multiple routing strategies and
selects the best collision-free path.

**Routing Strategies (in priority order):**

1. **Horizontal-first**: Go horizontal, then vertical, then horizontal
   - Priority 1 if horizontal distance > vertical distance
2. **Vertical-first**: Go vertical, then horizontal, then vertical
   - Priority 1 if vertical distance > horizontal distance
3. **Compact detours**: 4-segment paths with small offsets
   - Priority 3 (fallback)
4. **Tight detours**: Guaranteed fallback with fixed offsets
   - Priority 4 (always works)

**Collision Detection:**

- Samples 15 points along each line segment
- Checks if any point intersects node bounding boxes
- Adds 8px padding around nodes for visual clearance
- Only checks nodes other than source/target

**Parallel Edge Handling:**

- Uses edgeIndex to offset paths when multiple edges exist
- Alternates offset direction (even indices right/up, odd left/down)
- Spacing: 15px per parallel edge
- Prevents overlapping parallel connections

**Usage:**

```typescript
// Simple usage
const path = calculateOrthogonalPath(x1, y1, x2, y2, source, target, allNodes);

// With parallel edge support
const path = calculateOrthogonalPath(
  x1, y1, x2, y2,
  source, target, allNodes,
  edgeIndex  // 0 for first edge, 1 for second, etc.
);

// Render path
<path d={path} stroke="black" fill="none" />
```

**Performance:**

- Time Complexity: O(r × s × n) where:
  - r = routing strategies tested (typically 4-6)
  - s = sample points per segment (15)
  - n = number of nodes
- Typical: ~360-540 point checks per edge
- Consider simplifying for graphs with >1000 nodes

**Visual Quality:**

- Smooth 90-degree turns (no diagonal segments)
- Avoids overlapping nodes
- Minimal path length when possible
- Consistent parallel edge spacing

## Parameters

### x1

`number`

X coordinate of path start (source anchor)

### y1

`number`

Y coordinate of path start

### x2

`number`

X coordinate of path end (target anchor)

### y2

`number`

Y coordinate of path end

### sourceNode

`any`

Source node (excluded from collision detection)

### targetNode

`any`

Target node (excluded from collision detection)

### allNodes

`any`[] = `[]`

All nodes in graph (for collision detection)

### edgeIndex

`number` = `0`

Index for parallel edge offset (0 for first edge)

### \_totalEdgesBetweenNodes

`number` = `1`

Reserved for future use

## Returns

`string`

SVG path string (e.g., "M 10 20 L 30 20 L 30 50 L 60 50")

## See

- [calculateEdgeEndpoints](calculateEdgeEndpoints.md) for generating x1, y1, x2, y2
- [getOrthogonalPathMidpoint](getOrthogonalPathMidpoint.md) for finding path center for labels
