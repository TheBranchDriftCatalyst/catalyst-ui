import { useState, useEffect } from "react";
import { logger, LogLevel, LoggerRegistry } from "@/catalyst-ui/utils/logger";
import { useLocalStorageState } from "./useLocalStorageState";

/**
 * LoggerInfo - Metadata about a registered logger instance
 *
 * @property name - Unique identifier for the logger (namespace)
 * @property enabled - Whether the logger is currently active
 * @property minLevel - Minimum log level that will be output (debug/info/warn/error)
 */
export interface LoggerInfo {
  name: string;
  enabled: boolean;
  minLevel: LogLevel;
}

/**
 * useLoggerControl - Manages runtime logger configuration with persistence
 *
 * This hook provides a comprehensive interface for controlling the library's logging
 * system at runtime. It manages global log levels, individual logger states, and
 * persists all settings to localStorage for consistent behavior across sessions.
 *
 * The hook automatically discovers new loggers as they're created and restores their
 * saved state. It polls the LoggerRegistry every 2 seconds to detect new loggers.
 *
 * All logger states are persisted to localStorage with the keys:
 * - `catalyst-ui.logger.global-level` - Global minimum log level
 * - `catalyst-ui.logger.states` - Per-logger enabled/level configuration
 *
 * @returns Object with logger state and control functions
 *
 * @example
 * ```tsx
 * // Basic usage in a debug panel
 * function LoggerControlPanel() {
 *   const {
 *     logLevel,
 *     setLevel,
 *     loggers,
 *     toggleLogger,
 *     setLoggerLevel,
 *     enableAll,
 *     disableAll,
 *   } = useLoggerControl();
 *
 *   return (
 *     <div>
 *       <h3>Global Log Level</h3>
 *       <select value={logLevel} onChange={(e) => setLevel(e.target.value as LogLevel)}>
 *         <option value="debug">Debug</option>
 *         <option value="info">Info</option>
 *         <option value="warn">Warn</option>
 *         <option value="error">Error</option>
 *       </select>
 *
 *       <h3>Individual Loggers</h3>
 *       {loggers.map((log) => (
 *         <div key={log.name}>
 *           <label>
 *             <input
 *               type="checkbox"
 *               checked={log.enabled}
 *               onChange={() => toggleLogger(log.name)}
 *             />
 *             {log.name}
 *           </label>
 *           <select
 *             value={log.minLevel}
 *             onChange={(e) => setLoggerLevel(log.name, e.target.value as LogLevel)}
 *           >
 *             <option value="debug">Debug</option>
 *             <option value="info">Info</option>
 *             <option value="warn">Warn</option>
 *             <option value="error">Error</option>
 *           </select>
 *         </div>
 *       ))}
 *
 *       <button onClick={enableAll}>Enable All</button>
 *       <button onClick={disableAll}>Disable All</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Programmatic control for debugging specific features
 * function DebugToggle() {
 *   const { toggleLogger, setLoggerLevel } = useLoggerControl();
 *
 *   const enableAnimationDebug = () => {
 *     toggleLogger("AnimatedFlip");
 *     toggleLogger("AnimatedFade");
 *     setLoggerLevel("AnimatedFlip", "debug");
 *     setLoggerLevel("AnimatedFade", "debug");
 *   };
 *
 *   return <button onClick={enableAnimationDebug}>Debug Animations</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with debug panel in Storybook
 * function StorybookLoggerAddon() {
 *   const { loggers, logLevel, setLevel } = useLoggerControl();
 *
 *   useEffect(() => {
 *     // Expose to Storybook's addons panel
 *     channel.emit('loggers-updated', { loggers, logLevel });
 *   }, [loggers, logLevel]);
 *
 *   return (
 *     <div>
 *       <p>Active Loggers: {loggers.filter(l => l.enabled).length}</p>
 *       <button onClick={() => setLevel('debug')}>Enable Debug</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns Object containing:
 * - `logLevel` - Current global log level
 * - `setLevel` - Function to set global log level
 * - `loggers` - Array of all registered loggers with their current state
 * - `toggleLogger` - Function to enable/disable a specific logger by name
 * - `setLoggerLevel` - Function to set minimum level for a specific logger
 * - `enableAll` - Function to enable all registered loggers
 * - `disableAll` - Function to disable all registered loggers
 * - `refreshLoggers` - Function to manually refresh the loggers list (usually automatic)
 *
 * @note The hook polls for new loggers every 2 seconds. This is necessary because
 * loggers may be created lazily when components mount. The polling interval can be
 * adjusted in the useEffect if needed.
 *
 * @note Settings persist across page reloads via localStorage. Clearing browser
 * storage will reset all loggers to their default state.
 *
 * @see {@link useLocalStorageState} for persistence mechanism
 * @see {@link LoggerRegistry} for the underlying logger management system
 */
export function useLoggerControl() {
  const [logLevel, setLogLevel] = useLocalStorageState<LogLevel>(
    "catalyst-ui.logger.global-level",
    "debug"
  );
  const [loggerStates, setLoggerStates] = useLocalStorageState<
    Record<string, { enabled: boolean; minLevel: LogLevel }>
  >("catalyst-ui.logger.states", {});
  const [loggers, setLoggers] = useState<LoggerInfo[]>([]);

  // Sync log level with global logger
  useEffect(() => {
    logger.setGlobalMinLevel(logLevel);
  }, [logLevel]);

  // Refresh loggers list and sync with localStorage
  const refreshLoggers = () => {
    const allLoggers = LoggerRegistry.getAll();
    const updatedLoggers = allLoggers.map(log => ({
      name: log.name,
      enabled: log.enabled,
      minLevel: log.minLevel,
    }));
    setLoggers(updatedLoggers);

    // Save states to localStorage
    const states: Record<string, { enabled: boolean; minLevel: LogLevel }> = {};
    updatedLoggers.forEach(log => {
      states[log.name] = { enabled: log.enabled, minLevel: log.minLevel };
    });
    setLoggerStates(states);
  };

  // Initial load: restore logger states from localStorage
  useEffect(() => {
    const allLoggers = LoggerRegistry.getAll();
    allLoggers.forEach(log => {
      const state = loggerStates[log.name];
      if (state) {
        log.setEnabled(state.enabled);
        log.setMinLevel(state.minLevel);
      }
    });
    refreshLoggers();

    // Refresh periodically to catch new loggers
    const interval = setInterval(refreshLoggers, 2000);
    return () => clearInterval(interval);
  }, []);

  // Restore state for newly discovered loggers
  useEffect(() => {
    const allLoggers = LoggerRegistry.getAll();
    allLoggers.forEach(log => {
      const state = loggerStates[log.name];
      if (state) {
        if (log.enabled !== state.enabled) log.setEnabled(state.enabled);
        if (log.minLevel !== state.minLevel) log.setMinLevel(state.minLevel);
      }
    });
  }, [loggers.length]); // Run when new loggers are discovered

  const setLevel = (level: LogLevel) => {
    setLogLevel(level);
  };

  const toggleLogger = (name: string) => {
    const log = LoggerRegistry.get(name);
    if (log) {
      const newState = !log.enabled;
      log.setEnabled(newState);
      setLoggerStates(prev => ({
        ...prev,
        [name]: { enabled: newState, minLevel: log.minLevel },
      }));
      refreshLoggers();
    }
  };

  const setLoggerLevel = (name: string, level: LogLevel) => {
    const log = LoggerRegistry.get(name);
    if (log) {
      log.setMinLevel(level);
      setLoggerStates(prev => ({
        ...prev,
        [name]: { enabled: log.enabled, minLevel: level },
      }));
      refreshLoggers();
    }
  };

  const enableAll = () => {
    LoggerRegistry.enableAll();
    const states: Record<string, { enabled: boolean; minLevel: LogLevel }> = {};
    LoggerRegistry.getAll().forEach(log => {
      states[log.name] = { enabled: true, minLevel: log.minLevel };
    });
    setLoggerStates(states);
    refreshLoggers();
  };

  const disableAll = () => {
    LoggerRegistry.disableAll();
    const states: Record<string, { enabled: boolean; minLevel: LogLevel }> = {};
    LoggerRegistry.getAll().forEach(log => {
      states[log.name] = { enabled: false, minLevel: log.minLevel };
    });
    setLoggerStates(states);
    refreshLoggers();
  };

  return {
    logLevel,
    setLevel,
    loggers,
    toggleLogger,
    setLoggerLevel,
    enableAll,
    disableAll,
    refreshLoggers,
  };
}
