[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DockerStatusFilter

# Type Alias: DockerStatusFilter

> **DockerStatusFilter** = keyof _typeof_ `DockerNodeEdgeTypes.statusFilters`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:230](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L230)

Union type of Docker status filter values.

## Remarks

Extracted from `DockerNodeEdgeTypes.statusFilters` to ensure type safety.
These status values are specific to Docker container/resource states.

**Values:**

- `all`: Show all resources regardless of status
- `running`: Show only running containers
- `stopped`: Show only stopped containers
- `in-use`: Show only resources being used by containers (networks, volumes)

**Note:** This is Docker-specific. Other domains (e.g., Kubernetes) would
define their own status values like "ready", "pending", "failed".

## Example

```typescript
const status: DockerStatusFilter = "running";

// Type-safe filter state
const filters: GraphFilters = {
  statusFilter: "running",
  showRunningOnly: true,
  // ... other filters
};
```
