[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DockerGraphConfig

# Variable: DockerGraphConfig

> `const` **DockerGraphConfig**: [`GraphConfig`](../../types/interfaces/GraphConfig.md)\<[`DockerNodeKind`](../type-aliases/DockerNodeKind.md), [`DockerEdgeKind`](../type-aliases/DockerEdgeKind.md)\>

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:484](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L484)

Complete Docker graph configuration.

## Remarks

This is the primary export of this module - a production-ready GraphConfig
for Docker infrastructure visualization. It combines all Docker-specific
node types, edge types, filters, and styling into a single configuration object.

**Configuration includes:**

- 4 node types: container, network, image, volume
- 3 edge types: derived_from, connected_to, mounted_into
- 1 attribute filter: layer0 (hide infrastructure)
- 3 quick filters: Orphaned, Running, Minimal
- Status filter options: all, running, stopped, in-use
- Graph title: "DOCKER GRAPH"

**Usage:**
Pass this config to the `<ForceGraph>` component's `config` prop.

## Examples

```typescript
import { ForceGraph } from '@/catalyst-ui/components';
import { DockerGraphConfig } from './config/DockerGraphConfig';

function DockerVisualization() {
  const data = fetchDockerData(); // Your data loading logic

  return (
    <ForceGraph
      data={data}
      config={DockerGraphConfig}
      storageKey="docker-graph"
    />
  );
}
```

```typescript
// Extend the config with custom settings
import { DockerGraphConfig } from "./config/DockerGraphConfig";

const customConfig: GraphConfig = {
  ...DockerGraphConfig,
  title: "Production Docker Infrastructure",
  quickFilters: [
    ...DockerGraphConfig.quickFilters!,
    {
      label: "Production",
      icon: "🚀",
      action: () => ({ searchQuery: "prod" }),
    },
  ],
};
```
