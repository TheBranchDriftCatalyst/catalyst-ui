[**Catalyst UI API Documentation v1.3.0**](../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../README.md) / [components/ForceGraph/config/types](../README.md) / AttributeFilterPredicate

# Type Alias: AttributeFilterPredicate()\<T\>

> **AttributeFilterPredicate**\<`T`\> = (`value`, `node`, `filter?`) => `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L46)

Attribute filter predicate function

## Type Parameters

### T

`T` = `any`

## Parameters

### value

`T`

The filter value

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

The node being filtered

### filter?

[`AttributeFilter`](../interfaces/AttributeFilter.md)

The filter configuration (for accessing patterns, etc.)

## Returns

`boolean`
