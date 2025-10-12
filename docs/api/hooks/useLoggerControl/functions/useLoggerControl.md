[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [hooks/useLoggerControl](../README.md) / useLoggerControl

# Function: useLoggerControl()

> **useLoggerControl**(): `object`

Defined in: [workspace/catalyst-ui/lib/hooks/useLoggerControl.ts:145](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/hooks/useLoggerControl.ts#L145)

useLoggerControl - Manages runtime logger configuration with persistence

This hook provides a comprehensive interface for controlling the library's logging
system at runtime. It manages global log levels, individual logger states, and
persists all settings to localStorage for consistent behavior across sessions.

The hook automatically discovers new loggers as they're created and restores their
saved state. It polls the LoggerRegistry every 2 seconds to detect new loggers.

All logger states are persisted to localStorage with the keys:

- `catalyst-ui.logger.global-level` - Global minimum log level
- `catalyst-ui.logger.states` - Per-logger enabled/level configuration

## Returns

`object`

Object with logger state and control functions

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

## Examples

```tsx
// Basic usage in a debug panel
function LoggerControlPanel() {
  const { logLevel, setLevel, loggers, toggleLogger, setLoggerLevel, enableAll, disableAll } =
    useLoggerControl();

  return (
    <div>
      <h3>Global Log Level</h3>
      <select value={logLevel} onChange={e => setLevel(e.target.value as LogLevel)}>
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
      </select>

      <h3>Individual Loggers</h3>
      {loggers.map(log => (
        <div key={log.name}>
          <label>
            <input type="checkbox" checked={log.enabled} onChange={() => toggleLogger(log.name)} />
            {log.name}
          </label>
          <select
            value={log.minLevel}
            onChange={e => setLoggerLevel(log.name, e.target.value as LogLevel)}
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>
      ))}

      <button onClick={enableAll}>Enable All</button>
      <button onClick={disableAll}>Disable All</button>
    </div>
  );
}
```

```tsx
// Programmatic control for debugging specific features
function DebugToggle() {
  const { toggleLogger, setLoggerLevel } = useLoggerControl();

  const enableAnimationDebug = () => {
    toggleLogger("AnimatedFlip");
    toggleLogger("AnimatedFade");
    setLoggerLevel("AnimatedFlip", "debug");
    setLoggerLevel("AnimatedFade", "debug");
  };

  return <button onClick={enableAnimationDebug}>Debug Animations</button>;
}
```

```tsx
// Integration with debug panel in Storybook
function StorybookLoggerAddon() {
  const { loggers, logLevel, setLevel } = useLoggerControl();

  useEffect(() => {
    // Expose to Storybook's addons panel
    channel.emit("loggers-updated", { loggers, logLevel });
  }, [loggers, logLevel]);

  return (
    <div>
      <p>Active Loggers: {loggers.filter(l => l.enabled).length}</p>
      <button onClick={() => setLevel("debug")}>Enable Debug</button>
    </div>
  );
}
```

## Note

The hook polls for new loggers every 2 seconds. This is necessary because
loggers may be created lazily when components mount. The polling interval can be
adjusted in the useEffect if needed.

## Note

Settings persist across page reloads via localStorage. Clearing browser
storage will reset all loggers to their default state.

## See

- [useLocalStorageState](../../useLocalStorageState/functions/useLocalStorageState.md) for persistence mechanism
- [LoggerRegistry](../../../utils/logger/variables/LoggerRegistry.md) for the underlying logger management system
