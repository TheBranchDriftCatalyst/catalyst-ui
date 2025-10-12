[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / GraphConnectionFilter

# Type Alias: GraphConnectionFilter

> **GraphConnectionFilter** = `"all"` \| `"connected"` \| `"orphaned"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:53](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L53)

Graph-level connection filter for node connectivity.

## Remarks

This is a domain-agnostic filter that applies to any graph structure.
It filters nodes based solely on their connectivity (whether they have edges).

- `all`: Display all nodes regardless of connectivity
- `connected`: Show only nodes that have at least one edge
- `orphaned`: Show only nodes without any edges

## Example

```typescript
// Show only orphaned nodes (useful for finding unused resources)
const filter: GraphConnectionFilter = "orphaned";

// Show only connected nodes (hide standalone entities)
const filter: GraphConnectionFilter = "connected";
```
