[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/types](../README.md) / AttributeFilterPredicate

# Type Alias: AttributeFilterPredicate()\<T\>

> **AttributeFilterPredicate**\<`T`\> = (`value`, `node`, `filter?`) => `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/types.ts:214](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/types.ts#L214)

Predicate function for attribute-based filtering.

## Type Parameters

### T

`T` = `any`

## Parameters

### value

`T`

Current filter value (type depends on filter.type)

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

Node being evaluated

### filter?

[`AttributeFilter`](../interfaces/AttributeFilter.md)

Filter configuration (for accessing patterns, options, etc.)

## Returns

`boolean`

true to keep the node, false to filter it out

## Remarks

Attribute filter predicates receive the current filter value, the node being
filtered, and the filter configuration. They return true to keep the node,
false to filter it out.

## Example

```typescript
// Boolean filter: Hide nodes matching patterns
const hideInfrastructure: AttributeFilterPredicate<boolean> = (enabled, node, filter) => {
  if (!enabled) return true; // Keep all if disabled
  const name = node.name?.toLowerCase() || "";
  const isInfra = filter?.patterns?.some(p => name.includes(p));
  return !isInfra; // Hide infrastructure nodes
};

// Select filter: Match specific attribute value
const namespaceFilter: AttributeFilterPredicate<string> = (namespace, node) => {
  if (namespace === "all") return true;
  return node.attributes?.namespace === namespace;
};
```
