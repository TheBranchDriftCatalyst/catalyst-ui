/**
 * Centralized logging utility with environment-aware log levels
 *
 * Features:
 * - Structured logging with consistent format
 * - Log level filtering (debug, info, warn, error)
 * - Automatic environment detection (dev vs prod)
 * - Context injection for better debugging
 * - Type-safe logging methods
 *
 * Usage:
 * ```tsx
 * import { logger } from '@/catalyst-ui/utils/logger';
 *
 * logger.debug('ForceGraph', 'Node selected', { nodeId: 123 });
 * logger.info('ThemeProvider', 'Theme changed', { theme: 'dark' });
 * logger.warn('FormValidation', 'Invalid input', { field: 'email' });
 * logger.error('ApiService', 'Request failed', error);
 * ```
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
  /** Minimum log level to output (default: 'debug' in dev, 'warn' in prod) */
  minLevel?: LogLevel;
  /** Enable/disable logging globally (default: true in dev, false in prod) */
  enabled?: boolean;
  /** Custom prefix for all log messages */
  prefix?: string;
}

export interface LogContext {
  /** Component or module name */
  source?: string;
  /** Additional contextual data */
  data?: Record<string, unknown>;
  /** Stack trace (for errors) */
  stack?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "#9CA3AF", // gray-400
  info: "#3B82F6", // blue-500
  warn: "#F59E0B", // amber-500
  error: "#EF4444", // red-500
};

const LOG_EMOJIS: Record<LogLevel, string> = {
  debug: "🔍",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
};

/**
 * Color palette for logger names - vibrant, distinct colors
 *
 * @internal
 * Used to assign consistent colors to logger names for visual distinction in console output.
 * Colors are selected from Tailwind CSS palette for consistency with UI theme.
 */
const LOGGER_NAME_COLORS = [
  "#10B981", // emerald-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
  "#84CC16", // lime-500
  "#A855F7", // purple-500
  "#14B8A6", // teal-500
  "#EAB308", // yellow-500
  "#6366F1", // indigo-500
  "#22D3EE", // cyan-400
  "#FB923C", // orange-400
  "#A3E635", // lime-400
  "#C084FC", // purple-400
  "#2DD4BF", // teal-400
];

/**
 * Simple hash function to generate consistent color index from string
 *
 * @internal
 * Uses DJB2-like hash algorithm to map logger names to color palette indices.
 * Ensures the same logger name always gets the same color across sessions.
 *
 * @param str - Logger name to hash
 * @returns Index into LOGGER_NAME_COLORS array (0 to length-1)
 */
function hashStringToColorIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % LOGGER_NAME_COLORS.length;
}

/**
 * getLoggerColor - Get consistent color for a logger name
 *
 * Returns a color from the logger palette based on a hash of the logger name.
 * The same name always returns the same color, enabling visual consistency
 * across console output and UI components (like LoggerControl).
 *
 * @param loggerName - Name of the logger (e.g., "ForceGraph", "ThemeProvider")
 * @returns Hex color string from LOGGER_NAME_COLORS palette
 *
 * @example
 * ```tsx
 * const color = getLoggerColor("ForceGraph");
 * // Returns "#10B981" (always the same for "ForceGraph")
 *
 * // Use in UI components
 * <span style={{ color: getLoggerColor(loggerName) }}>
 *   {loggerName}
 * </span>
 * ```
 *
 * @see {@link LoggerControl} - UI component that displays logger names with colors
 */
export function getLoggerColor(loggerName: string): string {
  const index = hashStringToColorIndex(loggerName);
  return LOGGER_NAME_COLORS[index];
}

/**
 * Detect if running in development environment
 *
 * @internal
 * Checks Vite's import.meta.env.DEV flag to determine environment.
 * Used to automatically adjust log levels (debug in dev, warn in prod).
 *
 * @returns true if running in development mode, false otherwise
 */
function isDev(): boolean {
  return typeof import.meta !== "undefined" && import.meta.env?.DEV === true;
}

class Logger {
  private options: Required<LoggerOptions>;
  private globalMinLevel: LogLevel | null = null;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: options.minLevel ?? (isDev() ? "debug" : "warn"),
      enabled: options.enabled ?? isDev(),
      prefix: options.prefix ?? "[Catalyst]",
    };
  }

  /**
   * Configure logger options at runtime
   *
   * Allows dynamic adjustment of logger behavior without recreating the instance.
   * Useful for debugging or toggling logs in production.
   *
   * @param options - Partial logger options to merge with current config
   *
   * @example
   * ```tsx
   * // Enable debug logs in production temporarily
   * logger.configure({ minLevel: 'debug', enabled: true });
   *
   * // Change global prefix
   * logger.configure({ prefix: '[MyApp]' });
   * ```
   */
  configure(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Set global minimum log level (overrides instance minLevel)
   *
   * Provides a way to override all logger instances' min level from a central location.
   * Pass null to restore instance-level min level settings.
   *
   * @param level - Log level to set globally, or null to clear override
   *
   * @example
   * ```tsx
   * // Silence all logs below error level globally
   * logger.setGlobalMinLevel('error');
   *
   * // Restore instance-level settings
   * logger.setGlobalMinLevel(null);
   * ```
   */
  setGlobalMinLevel(level: LogLevel | null): void {
    this.globalMinLevel = level;
  }

  /**
   * Get current effective minimum log level
   *
   * Returns the global min level if set, otherwise returns the instance min level.
   * Used internally to determine which logs should be output.
   *
   * @returns The effective log level threshold
   */
  getEffectiveMinLevel(): LogLevel {
    return this.globalMinLevel ?? this.options.minLevel;
  }

  /**
   * Check if a log level should be output based on minimum level
   *
   * @internal
   * Compares log level priority against effective minimum level.
   * Returns false if logging is globally disabled.
   *
   * @param level - Log level to check
   * @returns true if the log should be output, false otherwise
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) return false;
    const effectiveMinLevel = this.getEffectiveMinLevel();
    return LOG_LEVELS[level] >= LOG_LEVELS[effectiveMinLevel];
  }

  /**
   * Core logging method with per-logger color coding
   *
   * @internal
   * Handles formatting and output for all log levels. Uses browser console styling
   * to colorize output with emoji indicators, timestamps, and logger-specific colors.
   *
   * Format: [emoji] [prefix] [source] message (timestamp)
   * Colors: level-based for emoji/message, hash-based for [source]
   *
   * @param level - Log level (debug, info, warn, error)
   * @param source - Logger name (e.g., component name)
   * @param message - Human-readable message
   * @param data - Additional context data to log
   */
  private log(level: LogLevel, source: string, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    const emoji = LOG_EMOJIS[level];
    const levelColor = LOG_COLORS[level];
    const loggerColor = getLoggerColor(source);

    // Use appropriate console method based on level
    const consoleMethod =
      level === "debug"
        ? console.debug
        : level === "info"
          ? console.info
          : level === "warn"
            ? console.warn
            : console.error;

    // Output with color styling in browsers that support it
    if (typeof window !== "undefined") {
      // Format: emoji + prefix + [source] + message + timestamp
      // Colors: level color for emoji/message, logger-specific color for [source]
      const sourceStr = source ? `[${source}]` : "";
      consoleMethod(
        `%c${emoji} ${this.options.prefix} %c${sourceStr}%c ${message} %c(${timestamp})`,
        `color: ${levelColor}; font-weight: bold;`, // emoji + prefix style
        `color: ${loggerColor}; font-weight: bold;`, // [source] style
        `color: ${levelColor}; font-weight: bold;`, // message style
        `color: ${levelColor}; font-weight: normal; opacity: 0.7;`, // timestamp style
        data ?? ""
      );
    } else {
      // Node.js fallback - no colors
      const sourceStr = source ? `[${source}]` : "";
      const formattedMessage = `${emoji} ${this.options.prefix} ${sourceStr} ${message} (${timestamp})`;
      consoleMethod(formattedMessage, data ?? "");
    }
  }

  /**
   * Debug-level logging (development only by default)
   *
   * Lowest priority log level, typically only shown in development.
   * Use for detailed diagnostic information during development.
   *
   * @param source - Logger name or component identifier
   * @param message - Human-readable debug message
   * @param data - Optional context data (objects, arrays, etc.)
   *
   * @example
   * ```tsx
   * logger.debug('ForceGraph', 'Node clicked', { nodeId: 42, timestamp: Date.now() });
   * logger.debug('ThemeProvider', 'Theme state updated', { theme: 'dark', variant: 'catalyst' });
   * ```
   */
  debug(source: string, message: string, data?: unknown): void {
    this.log("debug", source, message, data);
  }

  /**
   * Info-level logging
   *
   * General informational messages about normal application flow.
   * Use for lifecycle events, state changes, and important operations.
   *
   * @param source - Logger name or component identifier
   * @param message - Human-readable informational message
   * @param data - Optional context data
   *
   * @example
   * ```tsx
   * logger.info('AuthService', 'User logged in', { userId: '123', method: 'oauth' });
   * logger.info('DataLoader', 'Data fetched successfully', { recordCount: 150 });
   * ```
   */
  info(source: string, message: string, data?: unknown): void {
    this.log("info", source, message, data);
  }

  /**
   * Warning-level logging
   *
   * Indicates potentially problematic situations that should be reviewed.
   * Use for deprecated features, unexpected but recoverable conditions, or performance issues.
   *
   * @param source - Logger name or component identifier
   * @param message - Human-readable warning message
   * @param data - Optional context data about the warning
   *
   * @example
   * ```tsx
   * logger.warn('FormValidator', 'Validation slow', { fieldCount: 100, duration: 1500 });
   * logger.warn('ConfigLoader', 'Using default config', { reason: 'config file not found' });
   * ```
   */
  warn(source: string, message: string, data?: unknown): void {
    this.log("warn", source, message, data);
  }

  /**
   * Error-level logging
   *
   * Highest priority log level for error conditions that should always be logged.
   * Automatically extracts error details (message, stack, name) from Error objects.
   *
   * @param source - Logger name or component identifier
   * @param message - Human-readable error description
   * @param error - Error object or additional error data
   *
   * @example
   * ```tsx
   * try {
   *   await fetchData();
   * } catch (error) {
   *   logger.error('ApiService', 'Failed to fetch data', error);
   * }
   *
   * // With custom error data
   * logger.error('WebSocket', 'Connection lost', { code: 1006, retries: 3 });
   * ```
   */
  error(source: string, message: string, error?: unknown): void {
    const errorData =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : error;
    this.log("error", source, message, errorData);
  }

  /**
   * Create a scoped logger for a specific component/module
   *
   * Returns a ScopedLogger instance that automatically includes the source context.
   * Eliminates repetitive source string passing and enables per-logger control.
   *
   * @param source - Logger name (typically component or module name)
   * @returns ScopedLogger instance with automatic source context
   *
   * @example
   * ```tsx
   * // Instead of this:
   * logger.debug('ForceGraph', 'Rendering...');
   * logger.info('ForceGraph', 'Nodes loaded');
   *
   * // Use this:
   * const log = logger.scope('ForceGraph');
   * log.debug('Rendering...');
   * log.info('Nodes loaded');
   * ```
   *
   * @see {@link createLogger} - Convenience function for creating scoped loggers
   */
  scope(source: string): ScopedLogger {
    return new ScopedLogger(this, source);
  }
}

/**
 * ScopedLogger - Logger instance bound to a specific source/component
 *
 * Provides simplified logging API without requiring source parameter on every call.
 * Automatically registers with LoggerRegistry for runtime control via LoggerControl UI.
 *
 * @see {@link createLogger} - Primary way to create ScopedLogger instances
 * @see {@link LoggerRegistry} - Global registry for runtime logger control
 */
class ScopedLogger {
  private _enabled: boolean = true;
  private _minLevel: LogLevel = "debug";

  constructor(
    private logger: Logger,
    private source: string
  ) {
    // Register this logger in the global registry
    LoggerRegistry.register(this);
  }

  get name(): string {
    return this.source;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get minLevel(): LogLevel {
    return this._minLevel;
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
  }

  setMinLevel(level: LogLevel): void {
    this._minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this._enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this._minLevel];
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog("debug")) {
      this.logger.debug(this.source, message, data);
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog("info")) {
      this.logger.info(this.source, message, data);
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog("warn")) {
      this.logger.warn(this.source, message, data);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog("error")) {
      this.logger.error(this.source, message, error);
    }
  }
}

/**
 * LoggerRegistryClass - Global registry for runtime logger discovery and control
 *
 * Maintains a centralized map of all ScopedLogger instances in the application.
 * Enables runtime enable/disable of individual loggers or bulk operations.
 * Used by LoggerControl UI component for interactive logger management.
 *
 * @see {@link LoggerRegistry} - Singleton instance exported from this module
 */
class LoggerRegistryClass {
  private loggers: Map<string, ScopedLogger> = new Map();

  /**
   * Register a scoped logger in the global registry
   *
   * @internal
   * Called automatically when ScopedLogger is constructed.
   *
   * @param logger - ScopedLogger instance to register
   */
  register(logger: ScopedLogger): void {
    this.loggers.set(logger.name, logger);
  }

  /**
   * Get all registered loggers
   *
   * @returns Array of all ScopedLogger instances
   */
  getAll(): ScopedLogger[] {
    return Array.from(this.loggers.values());
  }

  /**
   * Get a specific logger by name
   *
   * @param name - Logger name to retrieve
   * @returns ScopedLogger instance or undefined if not found
   */
  get(name: string): ScopedLogger | undefined {
    return this.loggers.get(name);
  }

  /**
   * Enable a specific logger by name
   *
   * @param name - Logger name to enable
   */
  enable(name: string): void {
    this.loggers.get(name)?.setEnabled(true);
  }

  /**
   * Disable a specific logger by name
   *
   * @param name - Logger name to disable
   */
  disable(name: string): void {
    this.loggers.get(name)?.setEnabled(false);
  }

  /**
   * Enable all registered loggers
   */
  enableAll(): void {
    this.loggers.forEach(logger => logger.setEnabled(true));
  }

  /**
   * Disable all registered loggers
   */
  disableAll(): void {
    this.loggers.forEach(logger => logger.setEnabled(false));
  }

  /**
   * Get current enabled/disabled state of all loggers
   *
   * @returns Object mapping logger names to enabled state
   *
   * @example
   * ```tsx
   * const state = LoggerRegistry.getState();
   * // { "ForceGraph": true, "ThemeProvider": false }
   * ```
   */
  getState(): Record<string, boolean> {
    const state: Record<string, boolean> = {};
    this.loggers.forEach((logger, name) => {
      state[name] = logger.enabled;
    });
    return state;
  }

  /**
   * Restore logger enabled/disabled state from saved state object
   *
   * @param state - Object mapping logger names to enabled state
   *
   * @example
   * ```tsx
   * // Save state to localStorage
   * const state = LoggerRegistry.getState();
   * localStorage.setItem('loggerState', JSON.stringify(state));
   *
   * // Restore state
   * const savedState = JSON.parse(localStorage.getItem('loggerState'));
   * LoggerRegistry.setState(savedState);
   * ```
   */
  setState(state: Record<string, boolean>): void {
    Object.entries(state).forEach(([name, enabled]) => {
      this.loggers.get(name)?.setEnabled(enabled);
    });
  }
}

/**
 * LoggerRegistry - Singleton instance for global logger management
 *
 * Provides centralized access to all registered ScopedLogger instances.
 * Used by LoggerControl component for runtime logger control UI.
 *
 * @example
 * ```tsx
 * // Get all loggers
 * const allLoggers = LoggerRegistry.getAll();
 *
 * // Enable/disable specific logger
 * LoggerRegistry.disable('ForceGraph');
 * LoggerRegistry.enable('ThemeProvider');
 *
 * // Bulk operations
 * LoggerRegistry.disableAll();
 * LoggerRegistry.enableAll();
 *
 * // State persistence
 * const state = LoggerRegistry.getState();
 * localStorage.setItem('loggers', JSON.stringify(state));
 * ```
 */
export const LoggerRegistry = new LoggerRegistryClass();

/**
 * logger - Global logger instance
 *
 * Provides direct logging methods when you need to log without creating a scoped logger.
 * For most use cases, prefer {@link createLogger} for better organization.
 *
 * @example
 * ```tsx
 * // Direct logging (less common)
 * logger.debug('MyComponent', 'Debug message', { data: 123 });
 * logger.info('MyComponent', 'Info message');
 * logger.warn('MyComponent', 'Warning message');
 * logger.error('MyComponent', 'Error message', error);
 *
 * // Runtime configuration
 * logger.configure({ minLevel: 'info', enabled: true });
 * logger.setGlobalMinLevel('error'); // Override all loggers
 *
 * // Create scoped logger (preferred)
 * const log = logger.scope('MyComponent');
 * ```
 */
export const logger = new Logger();

/**
 * createLogger - Create a scoped logger for a component or module
 *
 * Primary interface for creating namespaced loggers. The returned ScopedLogger
 * automatically includes the source context in all log messages and registers
 * itself in the LoggerRegistry for runtime control.
 *
 * Benefits:
 * - No need to repeat source string on every log call
 * - Per-logger enable/disable via LoggerRegistry
 * - Consistent color coding in console output
 * - Integration with LoggerControl UI component
 *
 * @param source - Logger name (typically component or module name)
 * @returns ScopedLogger instance bound to the specified source
 *
 * @example
 * ```tsx
 * // At component module level
 * const log = createLogger('ForceGraph');
 *
 * function ForceGraph() {
 *   log.debug('Component mounting');
 *   log.info('Rendering graph', { nodeCount: 100 });
 *
 *   try {
 *     loadGraphData();
 *   } catch (error) {
 *     log.error('Failed to load data', error);
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Different log levels
 * const log = createLogger('ApiService');
 *
 * log.debug('Request details', { url, method, headers });
 * log.info('Request sent', { endpoint: '/api/users' });
 * log.warn('Slow response', { duration: 3000 });
 * log.error('Request failed', new Error('Network timeout'));
 * ```
 *
 * @note The logger is automatically registered in LoggerRegistry and can be
 * controlled via the LoggerControl component or programmatically.
 *
 * @see {@link ScopedLogger} - The returned logger type
 * @see {@link LoggerRegistry} - Global registry for logger control
 */
export function createLogger(source: string): ScopedLogger {
  return logger.scope(source);
}
