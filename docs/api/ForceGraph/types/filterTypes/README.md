[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/types/filterTypes

# ForceGraph/types/filterTypes

Filter system types for the ForceGraph component.

This module defines the filter data structures and UI option types that enable
interactive filtering of graph nodes and edges. The filter system supports both
domain-agnostic filters (connectivity, search) and domain-specific filters
(status, custom attributes).

## Example

```typescript
import { GraphFilters, GraphConnectionFilter } from "./filterTypes";

// Create filter state
const filters: GraphFilters = {
  visibleNodes: { container: true, network: true, image: false, volume: true },
  visibleEdges: { derived_from: true, connected_to: true, mounted_into: true },
  connectionFilter: "connected",
  searchQuery: "nginx",
  showOrphanedOnly: false,
  excludedNodeIds: [],
  statusFilter: "running",
  showRunningOnly: true,
  showInUseOnly: false,
};
```

## Interfaces

- [GraphFilters](interfaces/GraphFilters.md)
- [FilterPanelProps](interfaces/FilterPanelProps.md)
- [NodeTypeOption](interfaces/NodeTypeOption.md)
- [EdgeTypeOption](interfaces/EdgeTypeOption.md)

## Type Aliases

- [GraphConnectionFilter](type-aliases/GraphConnectionFilter.md)

## Variables

- [GRAPH_CONNECTION_FILTER_OPTIONS](variables/GRAPH_CONNECTION_FILTER_OPTIONS.md)
