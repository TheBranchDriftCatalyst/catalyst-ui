[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/layouts](../README.md) / LayoutKind

# Type Alias: LayoutKind

> **LayoutKind** = `"force"` \| `"structured"` \| `"community"` \| `"dagre"` \| `"elk"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/layouts.ts:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/layouts.ts#L26)

Available layout algorithms for the force graph

Each layout type is optimized for different graph structures:

- `force`: Standard physics-based simulation, good for general graphs
- `structured`: Organizes nodes by type into vertical columns
- `community`: Detects and groups related nodes automatically
- `dagre`: Hierarchical layered layout (used by Mermaid.js)
- `elk`: Advanced Eclipse Layout Kernel with multiple algorithms

## See

- [applyForceLayout](../../layering/force/functions/applyForceLayout.md) for physics-based layout
- [applyStructuredLayout](../../../../components/ForceGraph/utils/layering/structured/functions/applyStructuredLayout.md) for column-based layout
- [applyCommunityLayout](../../../../components/ForceGraph/utils/layering/community/functions/applyCommunityLayout.md) for community detection layout
- [applyDagreLayout](../../../../components/ForceGraph/utils/layering/dagre/functions/applyDagreLayout.md) for Mermaid-style hierarchical layout
- [applyELKLayout](../../../../components/ForceGraph/utils/layering/elk/functions/applyELKLayout.md) for advanced ELK algorithms
