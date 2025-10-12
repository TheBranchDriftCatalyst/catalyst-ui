[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / ExtractNodeKind

# Type Alias: ExtractNodeKind\<T\>

> **ExtractNodeKind**\<`T`\> = `T` _extends_ [`GraphConfig`](../interfaces/GraphConfig.md)\<infer K, `any`\> ? `K` : `never`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:573](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L573)

Utility type to extract node kind union from a GraphConfig.

## Type Parameters

### T

`T` _extends_ [`GraphConfig`](../interfaces/GraphConfig.md)\<`any`, `any`\>

## Remarks

This type helper extracts the node kind type parameter from a GraphConfig type.
Useful for creating type-safe node data based on a config.

## Example

```typescript
type MyNodeKind = ExtractNodeKind<typeof MyGraphConfig>;
// MyNodeKind = "server" | "database" | "service"
```
