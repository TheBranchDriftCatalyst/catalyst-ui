[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [mermaid/types](../README.md) / ParsedEdge

# Interface: ParsedEdge

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:205](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L205)

Parsed edge from Mermaid flowchart

Represents a connection/link between two nodes.

## Examples

```typescript
const edge: ParsedEdge = {
  src: "A",
  dst: "B",
  type: "solid",
  bidirectional: false,
};
```

```typescript
const edge: ParsedEdge = {
  src: "client",
  dst: "server",
  type: "thick",
  label: "WebSocket",
  bidirectional: true,
};
```

## Properties

### src

> **src**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:206](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L206)

Source node ID

---

### dst

> **dst**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:207](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L207)

Destination node ID

---

### type

> **type**: [`EdgeType`](../type-aliases/EdgeType.md)

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:208](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L208)

Arrow style (solid, dotted, thick, etc.)

---

### label?

> `optional` **label**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:209](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L209)

Optional edge label

---

### bidirectional

> **bidirectional**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/mermaid/types.ts:210](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/mermaid/types.ts#L210)

True if edge has arrows on both ends (`<-->`)
