[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLoggerControl](../README.md) / LoggerInfo

# Interface: LoggerInfo

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L12)

LoggerInfo - Metadata about a registered logger instance

## Properties

### name

> **name**: `string`

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:13](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L13)

Unique identifier for the logger (namespace)

---

### enabled

> **enabled**: `boolean`

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L14)

Whether the logger is currently active

---

### minLevel

> **minLevel**: [`LogLevel`](../../../utils/logger/type-aliases/LogLevel.md)

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:15](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L15)

Minimum log level that will be output (debug/info/warn/error)
