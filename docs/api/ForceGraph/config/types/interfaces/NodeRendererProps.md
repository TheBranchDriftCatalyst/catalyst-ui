[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / NodeRendererProps

# Interface: NodeRendererProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:74](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L74)

Props passed to custom node renderer components.

## Remarks

Custom node renderers receive these props to render nodes with consistent
sizing and behavior. The renderer can use the node's data to customize
appearance based on status, attributes, etc.

## Example

```typescript
const CustomNodeRenderer: React.FC<NodeRendererProps> = ({
  data,
  width,
  height,
  pad,
  imgSize,
  showLogo
}) => {
  const isActive = data.attributes?.status === 'active';

  return (
    <g>
      <rect
        width={width}
        height={height}
        fill={isActive ? 'green' : 'gray'}
        rx={4}
      />
      <text x={width/2} y={height/2} textAnchor="middle">
        {data.name}
      </text>
    </g>
  );
};
```

## Properties

### data

> **data**: [`NodeData`](../../../types/interfaces/NodeData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:76](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L76)

Node data including ID, kind, name, and attributes

---

### width

> **width**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:79](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L79)

Calculated node width in pixels

---

### height

> **height**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L82)

Calculated node height in pixels

---

### pad

> **pad**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:85](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L85)

Internal padding for node content

---

### imgSize

> **imgSize**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:88](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L88)

Size for icon/logo images

---

### showLogo?

> `optional` **showLogo**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:91](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L91)

Whether to display node type logo/icon
