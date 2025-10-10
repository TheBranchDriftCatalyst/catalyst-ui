[**Catalyst UI API Documentation v1.3.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLoggerControl](../README.md) / useLoggerControl

# Function: useLoggerControl()

> **useLoggerControl**(): `object`

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:11](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L11)

## Returns

`object`

### logLevel

> **logLevel**: [`LogLevel`](../../../utils/logger/type-aliases/LogLevel.md)

### setLevel()

> **setLevel**: (`level`) => `void`

#### Parameters

##### level

[`LogLevel`](../../../utils/logger/type-aliases/LogLevel.md)

#### Returns

`void`

### loggers

> **loggers**: [`LoggerInfo`](../interfaces/LoggerInfo.md)[]

### toggleLogger()

> **toggleLogger**: (`name`) => `void`

#### Parameters

##### name

`string`

#### Returns

`void`

### setLoggerLevel()

> **setLoggerLevel**: (`name`, `level`) => `void`

#### Parameters

##### name

`string`

##### level

[`LogLevel`](../../../utils/logger/type-aliases/LogLevel.md)

#### Returns

`void`

### enableAll()

> **enableAll**: () => `void`

#### Returns

`void`

### disableAll()

> **disableAll**: () => `void`

#### Returns

`void`

### refreshLoggers()

> **refreshLoggers**: () => `void`

#### Returns

`void`
