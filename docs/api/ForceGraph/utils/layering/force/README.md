[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / ForceGraph/utils/layering/force

# ForceGraph/utils/layering/force

Force-Directed Layout using D3 force simulation

Implements a physics-based layout algorithm that simulates attractive and
repulsive forces between nodes to achieve natural, aesthetically pleasing
graph arrangements.

**Algorithm Overview:**

- Nodes repel each other (charge force)
- Edges pull connected nodes together (link force)
- Nodes avoid overlapping (collision force)
- Graph is centered in viewport (center force)

**Performance Characteristics:**

- Time Complexity: O(n²) per iteration (can be optimized with Barnes-Hut to O(n log n))
- Space Complexity: O(n + e) where n = nodes, e = edges
- Typical iterations: 100-300 depending on alphaDecay
- Best for: General graphs with <500 nodes

## See

[Force Documentation](https://github.com/d3/d3-force|D3)

## Interfaces

- [ForceLayoutOptions](interfaces/ForceLayoutOptions.md)

## Variables

- [ForceLayoutConfig](variables/ForceLayoutConfig.md)

## Functions

- [applyForceLayout](functions/applyForceLayout.md)
