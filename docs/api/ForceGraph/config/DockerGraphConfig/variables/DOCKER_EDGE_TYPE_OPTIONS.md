[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DOCKER_EDGE_TYPE_OPTIONS

# Variable: DOCKER_EDGE_TYPE_OPTIONS

> `const` **DOCKER_EDGE_TYPE_OPTIONS**: [`EdgeTypeOption`](../../../types/filterTypes/interfaces/EdgeTypeOption.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:625](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L625)

Docker edge type options for UI components.

## Remarks

Pre-formatted array of edge type options suitable for rendering in
filter checkboxes, legends, or other UI components. Each option includes
the kind and label.

Derived from `dockerEdgeTypes` configuration.

## Example

```typescript
import { DOCKER_EDGE_TYPE_OPTIONS } from './config/DockerGraphConfig';

// Render as checkboxes
{DOCKER_EDGE_TYPE_OPTIONS.map(opt => (
  <label key={opt.kind}>
    <input
      type="checkbox"
      checked={visibleEdges[opt.kind]}
      onChange={() => toggleEdge(opt.kind)}
    />
    {opt.label}
  </label>
))}
```
