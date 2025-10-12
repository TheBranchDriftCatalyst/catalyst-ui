[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ForceGraph/types](../README.md) / ForceGraphProps

# Interface: ForceGraphProps

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:392](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L392)

Props for the main ForceGraph component wrapper.

## Remarks

This is the high-level ForceGraph component that includes the graph renderer,
filter panel, and state management. It wraps ReactD3Graph and provides a
complete interactive graph experience.

The `storageKey` enables both position persistence AND independent filter state
when rendering multiple graphs on the same page.

## Example

```typescript
import { ForceGraph } from '@/catalyst-ui/components';
import { DockerGraphConfig } from './config/DockerGraphConfig';

function MyGraph() {
  return (
    <ForceGraph
      data={dockerGraphData}
      config={DockerGraphConfig}
      storageKey="docker-graph"
    />
  );
}
```

## Properties

### data

> **data**: [`GraphData`](GraphData.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:394](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L394)

Graph data to render

---

### config?

> `optional` **config**: `any`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:397](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L397)

Graph configuration (styling, renderers, filters, etc.) - using any to avoid circular import

---

### storageKey?

> `optional` **storageKey**: `string`

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/types/index.ts:400](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/types/index.ts#L400)

localStorage key for persisting positions and filter state
