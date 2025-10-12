[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/utils/filterPredicates](../README.md) / matchesSearchQuery

# Function: matchesSearchQuery()

> **matchesSearchQuery**(`node`, `query`): `boolean`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/utils/filterPredicates.ts:193](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/utils/filterPredicates.ts#L193)

Check if a node matches the search query

Performs case-insensitive substring matching on node name and ID.

**Searched Fields:**

- `node.name` (primary display name)
- `node.Name` (alternative name field)
- `node.id` (unique identifier)

**Matching:**

- Case-insensitive
- Substring match (not exact match)
- Empty query matches all nodes

**Performance:**

- Time Complexity: O(1) per node
- Very fast string operations

## Parameters

### node

[`NodeData`](../../../types/interfaces/NodeData.md)

Node to check

### query

`string`

Search string (trimmed and lowercased automatically)

## Returns

`boolean`

true if query matches node name or ID

## Example

```typescript
// Search for nodes containing "docker"
const results = nodes.filter(n => matchesSearchQuery(n, "docker"));

// Case-insensitive: matches "Docker", "DOCKER", "docker"
const matches = matchesSearchQuery(node, "DOCKER"); // true
```
