[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / NodeData

# Interface: NodeData

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:110](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L110)

Represents a node in the force-directed graph.

## Remarks

Nodes are the primary visual elements in the graph. Each node has a unique ID,
a domain-specific kind (e.g., container, network), and optional position data
for D3 force simulation.

Position properties:

- `x`, `y`: Current computed position (managed by D3)
- `fx`, `fy`: Fixed position (when set, node becomes pinned)

## Example

```typescript
const node: NodeData = {
  id: "nginx-prod",
  name: "nginx-prod",
  kind: "container",
  attributes: {
    status: "running",
    image: "nginx:latest",
  },
};

// Pin node to specific position
node.fx = 100;
node.fy = 200;
```

## Properties

### id

> **id**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:112](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L112)

Unique node identifier

---

### name?

> `optional` **name**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:115](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L115)

Display name (lowercase) - legacy Docker format

---

### Name?

> `optional` **Name**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:118](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L118)

Display name (PascalCase) - legacy Docker format

---

### kind

> **kind**: [`NodeKind`](../type-aliases/NodeKind.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:121](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L121)

Domain-specific node type (e.g., container, network, image, volume)

---

### attributes?

> `optional` **attributes**: `object`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:124](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L124)

Domain-specific attributes (e.g., status, image, configuration)

#### Index Signature

\[`key`: `string`\]: `any`

Additional custom attributes

#### status?

> `optional` **status**: `string`

Node status (e.g., "running", "stopped" for containers)

#### image?

> `optional` **image**: `string`

Image reference (for container nodes)

---

### x?

> `optional` **x**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:136](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L136)

Current X position in force simulation

---

### y?

> `optional` **y**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:139](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L139)

Current Y position in force simulation

---

### fx?

> `optional` **fx**: `null` \| `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:142](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L142)

Fixed X position (null = not pinned, number = pinned)

---

### fy?

> `optional` **fy**: `null` \| `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:145](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L145)

Fixed Y position (null = not pinned, number = pinned)
