[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DOCKER_STATUS_FILTER_OPTIONS

# ~~Variable: DOCKER_STATUS_FILTER_OPTIONS~~

> `const` **DOCKER_STATUS_FILTER_OPTIONS**: [`FilterOption`](../../types/interfaces/FilterOption.md)\<`"all"` \| `"running"` \| `"stopped"` \| `"in-use"`\>[] = `dockerStatusFilterOptions`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:561](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L561)

Docker status filter options (legacy export).

## Deprecated

Use `DockerGraphConfig.statusFilterOptions` instead.
This export is maintained for backwards compatibility.

## Remarks

Provides the same array of FilterOption objects as
`DockerGraphConfig.statusFilterOptions`. Prefer using the config
property for consistency.

## Example

```typescript
// Deprecated
import { DOCKER_STATUS_FILTER_OPTIONS } from "./config/DockerGraphConfig";

// Preferred
import { DockerGraphConfig } from "./config/DockerGraphConfig";
const options = DockerGraphConfig.statusFilterOptions;
```
