[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DockerNodeKind

# Type Alias: DockerNodeKind

> **DockerNodeKind** = keyof _typeof_ `DockerNodeEdgeTypes.nodes`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:172](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L172)

Union type of Docker node kinds.

## Remarks

Extracted from `DockerNodeEdgeTypes.nodes` to ensure type safety.
This type represents all possible node types in a Docker infrastructure graph.

**Values:**

- `container`: Docker containers (running or stopped)
- `network`: Docker networks (bridge, host, overlay, etc.)
- `image`: Docker images (base images, derived images)
- `volume`: Docker volumes (persistent storage)

## Example

```typescript
const nodeKind: DockerNodeKind = "container";

// Type-safe node creation
const node: NodeData = {
  id: "nginx-prod",
  kind: "container" as DockerNodeKind,
  name: "nginx-prod",
  attributes: { status: "running" },
};
```
