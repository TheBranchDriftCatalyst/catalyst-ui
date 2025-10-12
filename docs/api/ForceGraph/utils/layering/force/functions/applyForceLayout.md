[**Catalyst UI API Documentation v1.4.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [ForceGraph/utils/layering/force](../README.md) / applyForceLayout

# Function: applyForceLayout()

> **applyForceLayout**(`nodes`, `edges`, `dimensions`, `options`): `Simulation`\<`any`, `undefined`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layering/force.ts:185](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layering/force.ts#L185)

Create and configure a D3 force simulation

This function creates a dynamic layout where node positions are continuously
updated by the simulation. The returned simulation object should be managed
by the caller (e.g., stopped when component unmounts).

**Usage:**

```typescript
const simulation = applyForceLayout(
  nodes,
  edges,
  { width: 800, height: 600 },
  {
    chargeStrength: -200, // Stronger repulsion
    linkStrength: 0.2, // Stronger attraction
    collisionRadius: 80, // Larger collision radius
  }
);

// The simulation will automatically update node.x and node.y
simulation.on("tick", () => {
  // Re-render graph with updated positions
  updateVisualization();
});

// Stop simulation when done
simulation.stop();
```

**Behavior:**

- Releases any fixed positions (node.fx, node.fy)
- Creates forces: link, charge, collision, center
- Returns live simulation object that updates node positions
- Simulation runs until alpha (energy) decays to alphaMin

## Parameters

### nodes

[`NodeData`](../../../../types/interfaces/NodeData.md)[]

Array of nodes to layout (will be mutated with x, y coordinates)

### edges

[`EdgeData`](../../../../types/interfaces/EdgeData.md)[]

Array of edges defining graph connectivity

### dimensions

[`LayoutDimensions`](../../../layouts/interfaces/LayoutDimensions.md)

Viewport dimensions for centering

### options

[`ForceLayoutOptions`](../interfaces/ForceLayoutOptions.md) = `{}`

Optional force parameters to customize behavior

## Returns

`Simulation`\<`any`, `undefined`\>

D3 simulation object (can be stopped, restarted, or configured further)

## See

- [ForceLayoutOptions](../interfaces/ForceLayoutOptions.md) for configuration details
- [Simulation API](https://github.com/d3/d3-force#simulation|D3)
