[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / LoggerRegistry

# Variable: LoggerRegistry

> `const` **LoggerRegistry**: `LoggerRegistryClass`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:616](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L616)

LoggerRegistry - Singleton instance for global logger management

Provides centralized access to all registered ScopedLogger instances.
Used by LoggerControl component for runtime logger control UI.

## Example

```tsx
// Get all loggers
const allLoggers = LoggerRegistry.getAll();

// Enable/disable specific logger
LoggerRegistry.disable("ForceGraph");
LoggerRegistry.enable("ThemeProvider");

// Bulk operations
LoggerRegistry.disableAll();
LoggerRegistry.enableAll();

// State persistence
const state = LoggerRegistry.getState();
localStorage.setItem("loggers", JSON.stringify(state));
```
