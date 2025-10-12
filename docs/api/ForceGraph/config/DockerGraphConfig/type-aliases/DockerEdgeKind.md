[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DockerEdgeKind

# Type Alias: DockerEdgeKind

> **DockerEdgeKind** = keyof _typeof_ `DockerNodeEdgeTypes.edges`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:200](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L200)

Union type of Docker edge kinds.

## Remarks

Extracted from `DockerNodeEdgeTypes.edges` to ensure type safety.
This type represents all possible relationships between Docker resources.

**Values:**

- `derived_from`: Image derivation (child image → parent image)
- `connected_to`: Network connection (container → network)
- `mounted_into`: Volume mount (volume → container)

## Example

```typescript
const edgeKind: DockerEdgeKind = "connected_to";

// Type-safe edge creation
const edge: EdgeData = {
  src: "nginx-prod",
  dst: "bridge-net",
  kind: "connected_to" as DockerEdgeKind,
  source: containerNode,
  target: networkNode,
};
```
