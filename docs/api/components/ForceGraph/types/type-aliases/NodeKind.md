[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/ForceGraph/types](../README.md) / NodeKind

# ~~Type Alias: NodeKind~~

> **NodeKind** = `"container"` \| `"network"` \| `"image"` \| `"volume"`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L14)

Node kinds - Domain-specific type

NOTE: This is currently set to Docker types for backwards compatibility.
For new code, import DockerNodeKind from config/DockerGraphConfig instead.
In the future, this could be made fully generic via type parameters.

## Deprecated

Import domain-specific types from your graph config instead
