[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/utils/edgePathCalculations](../README.md) / calculateOrthogonalPath

# Function: calculateOrthogonalPath()

> **calculateOrthogonalPath**(`x1`, `y1`, `x2`, `y2`, `sourceNode`, `targetNode`, `allNodes`, `edgeIndex`, `_totalEdgesBetweenNodes`): `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/edgePathCalculations.ts:80](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/edgePathCalculations.ts#L80)

Calculate orthogonal path with collision avoidance
Tries multiple routing strategies and picks the best one based on priority

## Parameters

### x1

`number`

### y1

`number`

### x2

`number`

### y2

`number`

### sourceNode

`any`

### targetNode

`any`

### allNodes

`any`[] = `[]`

### edgeIndex

`number` = `0`

### \_totalEdgesBetweenNodes

`number` = `1`

## Returns

`string`
