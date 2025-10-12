[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/edgePathCalculations](../README.md) / getOrthogonalPathMidpoint

# Function: getOrthogonalPathMidpoint()

> **getOrthogonalPathMidpoint**(`pathString`): `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/edgePathCalculations.ts:414](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/edgePathCalculations.ts#L414)

Calculate true midpoint of orthogonal path for label positioning

Finds the point that is exactly halfway along the path's total length,
accounting for all segments. This is more accurate than simple (x1+x2)/2
for multi-segment orthogonal paths.

**Algorithm:**

1. Parse SVG path commands (M, L) into coordinate points
2. Calculate length of each segment
3. Find segment containing the 50% length mark
4. Interpolate exact position within that segment

**Why This Matters:**

- Orthogonal paths have multiple segments
- Simple midpoint doesn't account for path shape
- This ensures labels appear centered on the actual path
- Works correctly for all routing strategies

**Usage:**

```typescript
const path = calculateOrthogonalPath(x1, y1, x2, y2, source, target, nodes);
const midpoint = getOrthogonalPathMidpoint(path);

// Position label at midpoint
<text x={midpoint.x} y={midpoint.y} textAnchor="middle">
  Edge Label
</text>

// Or position marker/icon
<circle cx={midpoint.x} cy={midpoint.y} r={4} />
```

**Edge Cases:**

- Empty path: Returns {x: 0, y: 0}
- Single segment: Returns geometric midpoint
- Zero-length segments: Skipped in calculation

**Performance:**

- Time Complexity: O(s) where s = number of segments
- Typical: 3-5 segments, very fast
- No heavy calculations, just parsing and arithmetic

## Parameters

### pathString

`string`

SVG path string from [calculateOrthogonalPath](calculateOrthogonalPath.md)

## Returns

`object`

Object with x, y coordinates of the path's true midpoint

### x

> **x**: `number` = `0`

### y

> **y**: `number` = `0`

## See

[calculateOrthogonalPath](calculateOrthogonalPath.md) generates the paths this function analyzes
