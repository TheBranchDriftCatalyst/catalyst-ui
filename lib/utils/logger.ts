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
 * Detect if running in development environment
 */
function isDev(): boolean {
  return typeof import.meta !== "undefined" && import.meta.env?.DEV === true;
}

class Logger {
  private options: Required<LoggerOptions>;

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
   * Check if a log level should be output based on minimum level
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.options.minLevel];
  }

  /**
   * Format log message with consistent structure
   */
  private format(level: LogLevel, source: string, message: string): string {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    const emoji = LOG_EMOJIS[level];
    const sourceStr = source ? `[${source}]` : "";
    return `${emoji} ${this.options.prefix} ${sourceStr} ${message} (${timestamp})`;
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, source: string, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.format(level, source, message);
    const color = LOG_COLORS[level];

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
      consoleMethod(`%c${formattedMessage}`, `color: ${color}; font-weight: bold;`, data ?? "");
    } else {
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
  constructor(
    private logger: Logger,
    private source: string
  ) {}

  debug(message: string, data?: unknown): void {
    this.logger.debug(this.source, message, data);
  }

  info(message: string, data?: unknown): void {
    this.logger.info(this.source, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.logger.warn(this.source, message, data);
  }

  error(message: string, error?: unknown): void {
    this.logger.error(this.source, message, error);
  }
}

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
