[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/filterPredicates](../README.md) / matchesStatusFilter

# Function: matchesStatusFilter()

> **matchesStatusFilter**(`node`, `filter`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L87)

Check if a node matches the status filter

**Domain-Specific Filter** - Currently optimized for Docker container status.
This function maps status filter values to actual node status values.

**Status Mappings:**

- `"all"` → matches all nodes
- `"running"` → status === "running"
- `"stopped"` → status === "stopped" OR "exited"
- `"in-use"` → status === "in-use" OR "running"

**Note:** This is domain-specific and may need customization for other use cases.
Consider using [matchesAttributeFilters](matchesAttributeFilters.md) for generic filtering.

## Parameters

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

Node to check

### filter

`string`

Filter value ("all", "running", "stopped", "in-use")

## Returns

`boolean`

true if node matches filter

## Example

```typescript
// Filter for running containers
const runningNodes = nodes.filter(n => matchesStatusFilter(n, "running"));
```

## See

[matchesAttributeFilters](matchesAttributeFilters.md) for generic attribute filtering
