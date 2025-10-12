[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / isNetworkNode

# ~~Function: isNetworkNode()~~

> **isNetworkNode**(`node`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:439](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L439)

Type guard to check if a node is a network.

## Parameters

### node

[`NodeData`](../interfaces/NodeData.md)

Node to check

## Returns

`boolean`

true if node.kind === "network"

## Deprecated

Use domain-specific type guards from your graph config instead.
This function is Docker-specific and will be removed in future versions.

## Example

```typescript
if (isNetworkNode(node)) {
  console.log(`Network: ${node.name}`);
}
```
