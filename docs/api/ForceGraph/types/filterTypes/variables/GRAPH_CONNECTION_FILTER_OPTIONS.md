[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/types/filterTypes](../README.md) / GRAPH_CONNECTION_FILTER_OPTIONS

# Variable: GRAPH_CONNECTION_FILTER_OPTIONS

> `const` **GRAPH_CONNECTION_FILTER_OPTIONS**: [`FilterOption`](../../../config/types/interfaces/FilterOption.md)\<[`GraphConnectionFilter`](../type-aliases/GraphConnectionFilter.md)\>[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/filterTypes.ts:76](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/filterTypes.ts#L76)

UI filter options for graph connection states.

## Remarks

These options are domain-agnostic and can be used in any graph domain.
They represent structural properties of the graph itself, not domain semantics.

Used by filter UI components like dropdowns or radio groups.

## Example

```typescript
import { GRAPH_CONNECTION_FILTER_OPTIONS } from './filterTypes';

// Render in a select dropdown
<select>
  {GRAPH_CONNECTION_FILTER_OPTIONS.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
```
