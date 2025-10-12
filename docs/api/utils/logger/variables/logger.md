[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / logger

# Variable: logger

> `const` **logger**: `Logger`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:640](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L640)

logger - Global logger instance

Provides direct logging methods when you need to log without creating a scoped logger.
For most use cases, prefer [createLogger](../functions/createLogger.md) for better organization.

## Example

```tsx
// Direct logging (less common)
logger.debug("MyComponent", "Debug message", { data: 123 });
logger.info("MyComponent", "Info message");
logger.warn("MyComponent", "Warning message");
logger.error("MyComponent", "Error message", error);

// Runtime configuration
logger.configure({ minLevel: "info", enabled: true });
logger.setGlobalMinLevel("error"); // Override all loggers

// Create scoped logger (preferred)
const log = logger.scope("MyComponent");
```
