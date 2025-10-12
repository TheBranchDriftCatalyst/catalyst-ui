[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / getDockerNodeConfig

# Function: getDockerNodeConfig()

> **getDockerNodeConfig**(`kind`): [`NodeTypeConfig`](../../types/interfaces/NodeTypeConfig.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:515](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L515)

Get node type configuration for a Docker node kind.

## Parameters

### kind

Docker node kind (container, network, image, volume)

`"container"` | `"network"` | `"image"` | `"volume"`

## Returns

[`NodeTypeConfig`](../../types/interfaces/NodeTypeConfig.md)

NodeTypeConfig with label, color, and icon

## Remarks

Helper function for programmatic access to node configurations.
Useful when building custom renderers or dynamic UI elements.

## Example

```typescript
const containerConfig = getDockerNodeConfig("container");
console.log(containerConfig.label); // "Containers"
console.log(containerConfig.color); // "var(--primary)"
console.log(containerConfig.icon); // "📦"
```
