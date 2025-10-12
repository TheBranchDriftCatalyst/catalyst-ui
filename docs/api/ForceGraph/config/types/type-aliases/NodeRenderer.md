[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / NodeRenderer

# Type Alias: NodeRenderer

> **NodeRenderer** = `React.FC`\<[`NodeRendererProps`](../interfaces/NodeRendererProps.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:115](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L115)

Custom node renderer component type.

## Remarks

Node renderers are React functional components that receive NodeRendererProps
and return SVG elements to render the node. They allow complete customization
of node appearance while maintaining consistent sizing and layout.

## Example

```typescript
const CircleNodeRenderer: NodeRenderer = ({ data, width, height }) => {
  const radius = Math.min(width, height) / 2;
  return (
    <circle
      r={radius}
      fill={data.attributes?.color || 'blue'}
    />
  );
};
```
