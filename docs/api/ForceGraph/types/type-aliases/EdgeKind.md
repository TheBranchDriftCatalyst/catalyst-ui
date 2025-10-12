[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / EdgeKind

# ~~Type Alias: EdgeKind~~

> **EdgeKind** = `"derived_from"` \| `"connected_to"` \| `"mounted_into"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:79](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L79)

Edge kinds - Domain-specific type

NOTE: This is currently set to Docker types for backwards compatibility.
For new code, import DockerEdgeKind from config/DockerGraphConfig instead.
In the future, this could be made fully generic via type parameters.

## Deprecated

Import domain-specific types from your graph config instead

## Example

```typescript
// Deprecated usage
const kind: EdgeKind = "connected_to";

// Preferred usage
import { DockerEdgeKind } from "./config/DockerGraphConfig";
const kind: DockerEdgeKind = "connected_to";
```
