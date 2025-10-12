[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [utils/logger](../README.md) / LoggerOptions

# Interface: LoggerOptions

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:24](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L24)

## Properties

### minLevel?

> `optional` **minLevel**: [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L26)

Minimum log level to output (default: 'debug' in dev, 'warn' in prod)

---

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L28)

Enable/disable logging globally (default: true in dev, false in prod)

---

### prefix?

> `optional` **prefix**: `string`

Defined in: [workspace/catalyst-ui/lib/utils/logger.ts:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils/logger.ts#L30)

Custom prefix for all log messages
