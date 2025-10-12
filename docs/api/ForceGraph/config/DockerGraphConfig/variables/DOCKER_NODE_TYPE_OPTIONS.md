[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / DOCKER_NODE_TYPE_OPTIONS

# Variable: DOCKER_NODE_TYPE_OPTIONS

> `const` **DOCKER_NODE_TYPE_OPTIONS**: [`NodeTypeOption`](../../../types/filterTypes/interfaces/NodeTypeOption.md)[]

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:590](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L590)

Docker node type options for UI components.

## Remarks

Pre-formatted array of node type options suitable for rendering in
filter checkboxes, legends, or other UI components. Each option includes
the kind, label, and color for visual consistency.

Derived from `dockerNodeTypes` configuration.

## Example

```typescript
import { DOCKER_NODE_TYPE_OPTIONS } from './config/DockerGraphConfig';

// Render as checkboxes
{DOCKER_NODE_TYPE_OPTIONS.map(opt => (
  <label key={opt.kind} style={{ color: opt.color }}>
    <input
      type="checkbox"
      checked={visibleNodes[opt.kind]}
      onChange={() => toggleNode(opt.kind)}
    />
    {opt.label}
  </label>
))}
```
