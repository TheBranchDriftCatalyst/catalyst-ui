[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / NodeID

# Type Alias: NodeID

> **NodeID** = `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L37)

Unique identifier for graph nodes.

## Remarks

Node IDs must be unique within a graph and are used for edge connections,
filtering, selection, and position persistence.

## Example

```typescript
const nodeId: NodeID = "container-nginx-prod";
```
