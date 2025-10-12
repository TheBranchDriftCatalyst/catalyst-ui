[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / GraphConfig

# Interface: GraphConfig\<TNodeKind, TEdgeKind\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:435](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L435)

Complete graph configuration object.

## Remarks

This is the main configuration interface for customizing a ForceGraph instance.
It defines node/edge types, filters, styling, and layout behavior.

The configuration is type-safe with generic type parameters for node and edge kinds,
allowing for domain-specific type checking.

## Example

```typescript
// Docker graph configuration
const dockerConfig: GraphConfig<DockerNodeKind, DockerEdgeKind> = {
  nodeTypes: {
    container: { label: "Containers", color: "var(--primary)", icon: "📦" },
    network: { label: "Networks", color: "var(--neon-yellow)", icon: "🌐" },
    image: { label: "Images", color: "var(--neon-red)", icon: "💿" },
    volume: { label: "Volumes", color: "var(--neon-purple)", icon: "💾" },
  },
  edgeTypes: {
    derived_from: { label: "Derived From", color: "var(--neon-red)" },
    connected_to: { label: "Connected To", color: "var(--primary)" },
    mounted_into: { label: "Mounted Into", color: "var(--neon-yellow)" },
  },
  attributeFilters: [layer0Filter],
  quickFilters: [orphanedFilter, runningFilter],
  title: "DOCKER GRAPH",
  statusFilterOptions: [
    { value: "all", label: "All Status" },
    { value: "running", label: "Running" },
    { value: "stopped", label: "Stopped" },
  ],
};
```

## Type Parameters

### TNodeKind

`TNodeKind` _extends_ `string` = `string`

Union type of node kind strings (e.g., "container" | "network")

### TEdgeKind

`TEdgeKind` _extends_ `string` = `string`

Union type of edge kind strings (e.g., "connected_to" | "mounted_into")

## Properties

### nodeTypes

> **nodeTypes**: `Record`\<`TNodeKind`, [`NodeTypeConfig`](NodeTypeConfig.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:443](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L443)

Node type configurations mapped by node kind.

#### Remarks

Each key should match a possible value of TNodeKind. Every node in your
graph data must have a kind that exists in this mapping.

---

### edgeTypes

> **edgeTypes**: `Record`\<`TEdgeKind`, [`EdgeTypeConfig`](EdgeTypeConfig.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:452](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L452)

Edge type configurations mapped by edge kind.

#### Remarks

Each key should match a possible value of TEdgeKind. Every edge in your
graph data must have a kind that exists in this mapping.

---

### attributeFilters?

> `optional` **attributeFilters**: [`AttributeFilter`](AttributeFilter.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:462](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L462)

Custom attribute-based filters.

#### Remarks

These filters are rendered in the filter panel and allow users to filter
nodes based on custom logic. Each filter generates a UI control based on
its `type` field.

---

### quickFilters?

> `optional` **quickFilters**: [`QuickFilter`](QuickFilter.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:471](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L471)

Quick filter preset buttons.

#### Remarks

These buttons appear in the filter panel and provide one-click shortcuts
to common filter combinations.

---

### title?

> `optional` **title**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:479](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L479)

Graph title displayed in the header.

#### Remarks

Defaults to "FORCE GRAPH" if not provided.

---

### defaultNodeRenderer?

> `optional` **defaultNodeRenderer**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:489](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L489)

Default node renderer used as fallback.

#### Remarks

If a node type doesn't have a custom renderer defined in NodeTypeConfig,
this renderer will be used. If not provided, the built-in default renderer
is used.

---

### getNodeDimensions()?

> `optional` **getNodeDimensions**: (`node`) => `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:512](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L512)

Custom function to calculate node dimensions.

#### Parameters

##### node

[`NodeData`](../../../types/interfaces/NodeData.md)

Node to calculate dimensions for

#### Returns

`object`

Object with width and height in pixels

##### width

> **width**: `number`

##### height

> **height**: `number`

#### Remarks

By default, nodes have fixed dimensions. This function allows dynamic sizing
based on node data (e.g., larger nodes for important entities).

#### Example

```typescript
getNodeDimensions: node => {
  const nameLength = (node.name || "").length;
  return {
    width: Math.max(120, nameLength * 8),
    height: 80,
  };
};
```

---

### statusFilterOptions?

> `optional` **statusFilterOptions**: [`FilterOption`](FilterOption.md)\<`any`\>[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:532](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L532)

Domain-specific status filter options for UI.

#### Remarks

These options populate the status filter dropdown in the filter panel.
Values are domain-specific:

- Docker: "all" | "running" | "stopped" | "in-use"
- Kubernetes (hypothetical): "all" | "ready" | "pending" | "failed"

#### Example

```typescript
statusFilterOptions: [
  { value: "all", label: "All Status" },
  { value: "running", label: "Running" },
  { value: "stopped", label: "Stopped" },
];
```

---

### customFilterOptions?

> `optional` **customFilterOptions**: `Record`\<`string`, [`FilterOption`](FilterOption.md)\<`any`\>[]\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:557](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L557)

Additional custom filter options for domain-specific filters.

#### Remarks

Use this for any other domain-specific filter dropdowns beyond status.
Each key represents a filter name, and the value is an array of options.

#### Example

```typescript
customFilterOptions: {
  namespace: [
    { value: 'all', label: 'All Namespaces' },
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' }
  ],
  priority: [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'low', label: 'Low' }
  ]
}
```
