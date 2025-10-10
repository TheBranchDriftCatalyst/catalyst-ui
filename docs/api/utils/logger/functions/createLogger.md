[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / createLogger

# Function: createLogger()

> **createLogger**(`source`): `ScopedLogger`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:374](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L374)

Create a scoped logger for a component

## Parameters

### source

`string`

## Returns

`ScopedLogger`

## Example

```tsx
const log = createLogger("ForceGraph");
log.debug("Rendering graph", { nodeCount: 100 });
log.error("Failed to load data", error);
```
