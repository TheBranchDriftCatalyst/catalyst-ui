[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/types/filterTypes](../README.md) / GraphConnectionFilter

# Type Alias: GraphConnectionFilter

> **GraphConnectionFilter** = `"all"` \| `"connected"` \| `"orphaned"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L13)

Graph-level connection filter (domain-agnostic)
Filters nodes based on their connectivity in the graph:

- 'all': Show all nodes
- 'connected': Show only nodes with edges
- 'orphaned': Show only nodes without edges
