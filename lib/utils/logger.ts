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
 * Get consistent color for a logger name
 * Exported so UI components can use the same colors as console output
 */
export function getLoggerColor(loggerName: string): string {
  const index = hashStringToColorIndex(loggerName);
  return LOGGER_NAME_COLORS[index];
}

/**
 * Detect if running in development environment
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
   */
  configure(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Set global minimum log level (overrides instance minLevel)
   */
  setGlobalMinLevel(level: LogLevel | null): void {
    this.globalMinLevel = level;
  }

  /**
   * Get current effective minimum log level
   */
  getEffectiveMinLevel(): LogLevel {
    return this.globalMinLevel ?? this.options.minLevel;
  }

  /**
   * Check if a log level should be output based on minimum level
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) return false;
    const effectiveMinLevel = this.getEffectiveMinLevel();
    return LOG_LEVELS[level] >= LOG_LEVELS[effectiveMinLevel];
  }

  /**
   * Core logging method with per-logger color coding
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
   * Use for detailed debugging information
   */
  debug(source: string, message: string, data?: unknown): void {
    this.log("debug", source, message, data);
  }

  /**
   * Info-level logging
   * Use for general informational messages
   */
  info(source: string, message: string, data?: unknown): void {
    this.log("info", source, message, data);
  }

  /**
   * Warning-level logging
   * Use for potentially problematic situations
   */
  warn(source: string, message: string, data?: unknown): void {
    this.log("warn", source, message, data);
  }

  /**
   * Error-level logging
   * Use for error conditions that should always be logged
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
   * This eliminates the need to pass source string repeatedly
   */
  scope(source: string): ScopedLogger {
    return new ScopedLogger(this, source);
  }
}

/**
 * Scoped logger that automatically includes source context
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
 * Global logger registry for discovery and control
 */
class LoggerRegistryClass {
  private loggers: Map<string, ScopedLogger> = new Map();

  register(logger: ScopedLogger): void {
    this.loggers.set(logger.name, logger);
  }

  getAll(): ScopedLogger[] {
    return Array.from(this.loggers.values());
  }

  get(name: string): ScopedLogger | undefined {
    return this.loggers.get(name);
  }

  enable(name: string): void {
    this.loggers.get(name)?.setEnabled(true);
  }

  disable(name: string): void {
    this.loggers.get(name)?.setEnabled(false);
  }

  enableAll(): void {
    this.loggers.forEach(logger => logger.setEnabled(true));
  }

  disableAll(): void {
    this.loggers.forEach(logger => logger.setEnabled(false));
  }

  getState(): Record<string, boolean> {
    const state: Record<string, boolean> = {};
    this.loggers.forEach((logger, name) => {
      state[name] = logger.enabled;
    });
    return state;
  }

  setState(state: Record<string, boolean>): void {
    Object.entries(state).forEach(([name, enabled]) => {
      this.loggers.get(name)?.setEnabled(enabled);
    });
  }
}

export const LoggerRegistry = new LoggerRegistryClass();

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Create a scoped logger for a component
 *
 * @example
 * ```tsx
 * const log = createLogger('ForceGraph');
 * log.debug('Rendering graph', { nodeCount: 100 });
 * log.error('Failed to load data', error);
 * ```
 */
export function createLogger(source: string): ScopedLogger {
  return logger.scope(source);
}
