[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / EdgeData

# Interface: EdgeData

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:171](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L171)

Represents an edge (link) between two nodes in the graph.

## Remarks

Edges define relationships between nodes. Each edge has source/destination IDs,
a domain-specific kind (e.g., derived_from, connected_to), and references to
the actual node objects for D3 force simulation.

## Example

```typescript
const edge: EdgeData = {
  id: "edge-1",
  src: "nginx-prod",
  dst: "bridge-network",
  kind: "connected_to",
  attributes: {
    ip: "172.17.0.2",
  },
  source: nginxNode,
  target: bridgeNode,
};
```

## Properties

### id?

> `optional` **id**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:173](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L173)

Optional unique edge identifier

---

### src

> **src**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:176](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L176)

Source node ID

---

### dst

> **dst**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:179](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L179)

Destination node ID

---

### kind

> **kind**: [`EdgeKind`](../type-aliases/EdgeKind.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:182](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L182)

Domain-specific edge type (e.g., derived_from, connected_to, mounted_into)

---

### attributes?

> `optional` **attributes**: `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:185](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L185)

Domain-specific attributes (e.g., IP address, mount target)

#### Index Signature

\[`key`: `string`\]: `any`

Additional custom attributes

#### ip?

> `optional` **ip**: `string`

IP address for network connections

#### target?

> `optional` **target**: `string`

Mount target path for volume mounts

---

### source

> **source**: [`NodeData`](NodeData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:197](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L197)

Reference to source node object (required by D3)

---

### target

> **target**: [`NodeData`](NodeData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:200](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L200)

Reference to target node object (required by D3)
