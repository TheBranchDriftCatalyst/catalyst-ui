[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / createLogger

# Function: createLogger()

> **createLogger**(`source`): `ScopedLogger`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:692](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L692)

createLogger - Create a scoped logger for a component or module

Primary interface for creating namespaced loggers. The returned ScopedLogger
automatically includes the source context in all log messages and registers
itself in the LoggerRegistry for runtime control.

Benefits:

- No need to repeat source string on every log call
- Per-logger enable/disable via LoggerRegistry
- Consistent color coding in console output
- Integration with LoggerControl UI component

## Parameters

### source

`string`

Logger name (typically component or module name)

## Returns

`ScopedLogger`

ScopedLogger instance bound to the specified source

## Examples

```tsx
// At component module level
const log = createLogger("ForceGraph");

function ForceGraph() {
  log.debug("Component mounting");
  log.info("Rendering graph", { nodeCount: 100 });

  try {
    loadGraphData();
  } catch (error) {
    log.error("Failed to load data", error);
  }
}
```

```tsx
// Different log levels
const log = createLogger("ApiService");

log.debug("Request details", { url, method, headers });
log.info("Request sent", { endpoint: "/api/users" });
log.warn("Slow response", { duration: 3000 });
log.error("Request failed", new Error("Network timeout"));
```

## Note

The logger is automatically registered in LoggerRegistry and can be
controlled via the LoggerControl component or programmatically.

## See

- ScopedLogger - The returned logger type
- [LoggerRegistry](../variables/LoggerRegistry.md) - Global registry for logger control
