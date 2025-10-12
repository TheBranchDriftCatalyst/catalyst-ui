[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / isVolumeNode

# ~~Function: isVolumeNode()~~

> **isVolumeNode**(`node`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:479](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L479)

Type guard to check if a node is a volume.

## Parameters

### node

[`NodeData`](../interfaces/NodeData.md)

Node to check

## Returns

`boolean`

true if node.kind === "volume"

## Deprecated

Use domain-specific type guards from your graph config instead.
This function is Docker-specific and will be removed in future versions.

## Example

```typescript
if (isVolumeNode(node)) {
  console.log(`Volume: ${node.name}`);
}
```
