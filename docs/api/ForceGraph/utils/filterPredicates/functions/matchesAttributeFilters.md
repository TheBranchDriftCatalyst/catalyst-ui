[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/filterPredicates](../README.md) / matchesAttributeFilters

# Function: matchesAttributeFilters()

> **matchesAttributeFilters**(`node`, `filters`, `config?`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:252](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L252)

Check if a node matches custom attribute filters from config

Applies all configured attribute filters using their custom predicate functions.
This is the generic filter system that works with any node attribute.

**How It Works:**

1. Checks if config has attributeFilters defined
2. For each filter, calls its predicate function with:
   - Current filter value (from UI state)
   - Node data
   - Filter configuration
3. All predicates must return true for node to pass

**Filter Configuration:**

```typescript
attributeFilters: [
  {
    name: "minConnections",
    label: "Minimum Connections",
    type: "number",
    defaultValue: 0,
    predicate: (value, node, filter) => {
      const connections = countEdges(node.id);
      return connections >= value;
    },
  },
];
```

**Performance:**

- Time Complexity: O(f) where f = number of filters
- Each predicate should be O(1) for best performance
- Called once per node during filtering

## Parameters

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

Node to check

### filters

[`GraphFilters`](../../../types/filterTypes/interfaces/GraphFilters.md)

Current filter state (includes attributeFilterValues)

### config?

[`GraphConfig`](../../../config/types/interfaces/GraphConfig.md)\<`any`, `any`\>

Graph configuration with attributeFilters definitions

## Returns

`boolean`

true if node passes all attribute filters

## Example

```typescript
const filtered = nodes.filter(node => matchesAttributeFilters(node, currentFilters, graphConfig));
```
