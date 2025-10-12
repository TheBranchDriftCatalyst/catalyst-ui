[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / ForceGraph/config/DockerGraphConfig

# ForceGraph/config/DockerGraphConfig

Docker-specific graph configuration for ForceGraph.

This module provides a complete, production-ready graph configuration for
visualizing Docker infrastructure (containers, networks, images, volumes).
It serves as both a usable default config and a reference implementation
for creating custom domain-specific configs.

## Remarks

**Key Design Principles:**

- Single source of truth: `DockerNodeEdgeTypes` const defines all metadata
- Type-safe: All types derived from const (no string literals scattered)
- Composable: Individual exports allow granular imports
- Extensible: Easy to fork and customize for your own domains

**What's included:**

- Node types: container, network, image, volume
- Edge types: derived_from, connected_to, mounted_into
- Status filters: all, running, stopped, in-use
- Quick filters: Orphaned, Running, Minimal presets
- Attribute filters: layer0 (hide infrastructure)

## Examples

```typescript
import { ForceGraph } from '@/catalyst-ui/components';
import { DockerGraphConfig } from './config/DockerGraphConfig';

function MyDockerGraph() {
  return (
    <ForceGraph
      data={dockerData}
      config={DockerGraphConfig}
      storageKey="docker-graph"
    />
  );
}
```

```typescript
// Customize by extending the base config
import { DockerGraphConfig } from "./config/DockerGraphConfig";

const customConfig: GraphConfig = {
  ...DockerGraphConfig,
  title: "My Custom Docker Graph",
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

## Type Aliases

- [DockerNodeKind](type-aliases/DockerNodeKind.md)
- [DockerEdgeKind](type-aliases/DockerEdgeKind.md)
- [DockerStatusFilter](type-aliases/DockerStatusFilter.md)

## Variables

- [DockerGraphConfig](variables/DockerGraphConfig.md)
- [~~DOCKER_STATUS_FILTER_OPTIONS~~](variables/DOCKER_STATUS_FILTER_OPTIONS.md)
- [DOCKER_NODE_TYPE_OPTIONS](variables/DOCKER_NODE_TYPE_OPTIONS.md)
- [DOCKER_EDGE_TYPE_OPTIONS](variables/DOCKER_EDGE_TYPE_OPTIONS.md)

## Functions

- [getDockerNodeConfig](functions/getDockerNodeConfig.md)
- [getDockerEdgeConfig](functions/getDockerEdgeConfig.md)
