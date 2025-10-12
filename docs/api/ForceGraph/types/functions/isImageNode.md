[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / isImageNode

# ~~Function: isImageNode()~~

> **isImageNode**(`node`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:459](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L459)

Type guard to check if a node is an image.

## Parameters

### node

[`NodeData`](../interfaces/NodeData.md)

Node to check

## Returns

`boolean`

true if node.kind === "image"

## Deprecated

Use domain-specific type guards from your graph config instead.
This function is Docker-specific and will be removed in future versions.

## Example

```typescript
if (isImageNode(node)) {
  console.log(`Image: ${node.name}`);
}
```
