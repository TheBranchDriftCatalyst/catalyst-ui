[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/utils/edgePathCalculations

# ForceGraph/utils/edgePathCalculations

Edge path calculation utilities

Pure functions for calculating smart edge routing in graph visualizations.
Handles node-to-node connections with collision avoidance, orthogonal routing,
and proper anchor point selection.

**Features:**

- 4-handle anchor system (top, bottom, left, right) for natural connections
- Orthogonal (right-angle) path routing with collision avoidance
- Multiple routing strategies with automatic selection
- Support for parallel edges with automatic spacing
- Path midpoint calculation for label placement

## Functions

- [calculateEdgeEndpoints](functions/calculateEdgeEndpoints.md)
- [calculateOrthogonalPath](functions/calculateOrthogonalPath.md)
- [getOrthogonalPathMidpoint](functions/getOrthogonalPathMidpoint.md)
