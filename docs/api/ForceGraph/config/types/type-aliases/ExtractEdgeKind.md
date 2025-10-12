[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / ExtractEdgeKind

# Type Alias: ExtractEdgeKind\<T\>

> **ExtractEdgeKind**\<`T`\> = `T` _extends_ [`GraphConfig`](../interfaces/GraphConfig.md)\<`any`, infer K\> ? `K` : `never`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:589](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L589)

Utility type to extract edge kind union from a GraphConfig.

## Type Parameters

### T

`T` _extends_ [`GraphConfig`](../interfaces/GraphConfig.md)\<`any`, `any`\>

## Remarks

This type helper extracts the edge kind type parameter from a GraphConfig type.
Useful for creating type-safe edge data based on a config.

## Example

```typescript
type MyEdgeKind = ExtractEdgeKind<typeof MyGraphConfig>;
// MyEdgeKind = "connects_to" | "depends_on"
```
