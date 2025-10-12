[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / isContainerNode

# ~~Function: isContainerNode()~~

> **isContainerNode**(`node`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:419](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L419)

Type guard to check if a node is a container.

## Parameters

### node

[`NodeData`](../interfaces/NodeData.md)

Node to check

## Returns

`boolean`

true if node.kind === "container"

## Deprecated

Use domain-specific type guards from your graph config instead.
This function is Docker-specific and will be removed in future versions.

## Example

```typescript
if (isContainerNode(node)) {
  console.log(`Container: ${node.name}`);
}
```
