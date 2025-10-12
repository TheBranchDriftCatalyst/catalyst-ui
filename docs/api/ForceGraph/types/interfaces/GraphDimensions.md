[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / GraphDimensions

# Interface: GraphDimensions

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:248](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L248)

Dimensions for the graph canvas.

## Remarks

Controls the SVG viewBox size and force simulation boundaries.
Typically matched to the container element dimensions for responsive layouts.

## Example

```typescript
const dimensions: GraphDimensions = {
  width: 1200,
  height: 800,
};
```

## Properties

### width

> **width**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:250](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L250)

Canvas width in pixels

---

### height

> **height**: `number`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:253](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L253)

Canvas height in pixels
