[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/utils/filterPredicates

# ForceGraph/utils/filterPredicates

Graph filter predicate functions

Pure, testable functions for filtering graph nodes based on various criteria.
Extracted from useGraphFilters hook for better performance and testability.

**Filter Categories:**

- **Graph-level**: Connection status (orphaned/connected)
- **Domain-specific**: Status, attributes (e.g., Docker container states)
- **Generic**: Search queries, custom attribute filters

**Design Principles:**

- Pure functions (no side effects)
- Composable (can be combined)
- Type-safe (TypeScript first)
- Fast (O(1) or O(n) operations only)

## Functions

- [isOrphanedNode](functions/isOrphanedNode.md)
- [matchesStatusFilter](functions/matchesStatusFilter.md)
- [matchesConnectionFilter](functions/matchesConnectionFilter.md)
- [matchesSearchQuery](functions/matchesSearchQuery.md)
- [matchesAttributeFilters](functions/matchesAttributeFilters.md)
- [matchesRunningOnly](functions/matchesRunningOnly.md)
- [matchesInUseOnly](functions/matchesInUseOnly.md)
