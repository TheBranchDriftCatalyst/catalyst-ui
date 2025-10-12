[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / GraphFilters

# Interface: GraphFilters

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:132](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L132)

Complete filter state for a ForceGraph instance.

## Remarks

This interface combines domain-agnostic filters (visibility, connectivity, search)
with domain-specific filters (status, running state, usage state).

**Domain-agnostic filters** (apply to any graph):

- `visibleNodes`: Which node types to show/hide
- `visibleEdges`: Which edge types to show/hide
- `connectionFilter`: Connectivity-based filtering (all/connected/orphaned)
- `searchQuery`: Text search across node names
- `showOrphanedOnly`: Quick filter for nodes without edges
- `excludedNodeIds`: Specific nodes to hide by ID
- `attributeFilterValues`: Generic attribute-based filters from config

**Domain-specific filters** (depend on graph domain, e.g., Docker):

- `statusFilter`: Resource status (e.g., "running", "stopped" for Docker containers)
- `showRunningOnly`: Docker-specific filter for running containers
- `showInUseOnly`: Docker-specific filter for in-use resources

## Example

```typescript
// Docker graph filters
const dockerFilters: GraphFilters = {
  // Domain-agnostic
  visibleNodes: { container: true, network: true, image: false, volume: true },
  visibleEdges: { derived_from: true, connected_to: true, mounted_into: true },
  connectionFilter: "connected",
  searchQuery: "",
  showOrphanedOnly: false,
  excludedNodeIds: ["old-container-id"],
  attributeFilterValues: { layer0: true }, // Hide infrastructure

  // Docker-specific
  statusFilter: "running",
  showRunningOnly: true,
  showInUseOnly: false,
};

// Custom domain filters (hypothetical Kubernetes graph)
const k8sFilters: GraphFilters = {
  // ... domain-agnostic filters ...
  statusFilter: "ready", // k8s-specific status
  showRunningOnly: false, // Not applicable to k8s
  showInUseOnly: false, // Not applicable to k8s
  attributeFilterValues: { namespace: "production" },
};
```

## Properties

### visibleNodes

> **visibleNodes**: `Record`\<[`NodeKind`](../../type-aliases/NodeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:136](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L136)

Visibility flags for each node type

---

### visibleEdges

> **visibleEdges**: `Record`\<[`EdgeKind`](../../type-aliases/EdgeKind.md), `boolean`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:139](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L139)

Visibility flags for each edge type

---

### connectionFilter

> **connectionFilter**: [`GraphConnectionFilter`](../type-aliases/GraphConnectionFilter.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:142](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L142)

Connectivity-based filter (all/connected/orphaned)

---

### searchQuery

> **searchQuery**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:145](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L145)

Text search query for filtering nodes by name

---

### showOrphanedOnly

> **showOrphanedOnly**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:148](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L148)

Quick toggle to show only orphaned nodes (nodes without edges)

---

### excludedNodeIds

> **excludedNodeIds**: `string`[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:151](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L151)

Array of specific node IDs to exclude from display

---

### attributeFilterValues?

> `optional` **attributeFilterValues**: `Record`\<`string`, `any`\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:168](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L168)

Generic attribute-based filter values from GraphConfig.attributeFilters

#### Remarks

Key is the filter name (e.g., "layer0"), value depends on filter type
(boolean, string, number, etc.)

#### Example

```typescript
attributeFilterValues: {
  layer0: true,           // Hide infrastructure (boolean filter)
  namespace: 'production' // Filter by namespace (select filter)
}
```

---

### statusFilter

> **statusFilter**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:188](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L188)

Domain-specific status filter value.

#### Remarks

For Docker: "all" | "running" | "stopped" | "in-use"
For other domains: Define your own status values in GraphConfig.statusFilterOptions

#### Example

```typescript
// Docker
statusFilter: "running";

// Kubernetes (hypothetical)
statusFilter: "ready";
```

---

### showRunningOnly

> **showRunningOnly**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:197](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L197)

Docker-specific: Show only running containers.

#### Remarks

This is specific to Docker container status. For non-Docker domains,
this filter may not apply or may need different semantics.

---

### showInUseOnly

> **showInUseOnly**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:206](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L206)

Docker-specific: Show only resources that are in use.

#### Remarks

For Docker, "in use" means networks/volumes with connected containers.
For other domains, define custom meaning or ignore this filter.
