[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [ForceGraph/config/DockerGraphConfig](../README.md) / getDockerEdgeConfig

# Function: getDockerEdgeConfig()

> **getDockerEdgeConfig**(`kind`): [`EdgeTypeConfig`](../../types/interfaces/EdgeTypeConfig.md)

Defined in: [workspace/catalyst-ui/lib/components/ForceGraph/config/DockerGraphConfig.ts:536](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/ForceGraph/config/DockerGraphConfig.ts#L536)

Get edge type configuration for a Docker edge kind.

## Parameters

### kind

Docker edge kind (derived_from, connected_to, mounted_into)

`"derived_from"` | `"connected_to"` | `"mounted_into"`

## Returns

[`EdgeTypeConfig`](../../types/interfaces/EdgeTypeConfig.md)

EdgeTypeConfig with label and color

## Remarks

Helper function for programmatic access to edge configurations.
Useful when rendering custom edge styles or tooltips.

## Example

```typescript
const connectionConfig = getDockerEdgeConfig("connected_to");
console.log(connectionConfig.label); // "Connected To"
console.log(connectionConfig.color); // "var(--primary)"
```
