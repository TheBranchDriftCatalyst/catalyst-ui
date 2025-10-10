/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  🌆 SYNTHWAVE PLUGIN LOGGER 🌆                               ║
 * ║                                                               ║
 * ║  ⚡ Neon-styled console output for Vite build plugins ⚡      ║
 * ║  DRY logging utilities with cyberpunk aesthetic              ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

/**
 * 🎨 ANSI color codes for terminal output
 *
 * These escape sequences create that sweet synthwave glow
 * in your terminal. Works in most modern terminals.
 */
const COLORS = {
  // Neon colors for that cyberpunk vibe 🌃
  neonPink: "\x1b[95m",
  neonCyan: "\x1b[96m",
  neonPurple: "\x1b[35m",
  neonYellow: "\x1b[93m",
  neonGreen: "\x1b[92m",

  // Accent colors
  electricBlue: "\x1b[94m",
  hotMagenta: "\x1b[91m",

  // Standard colors
  white: "\x1b[97m",
  gray: "\x1b[90m",

  // Text styling
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Reset to default
  reset: "\x1b[0m",
} as const;

/**
 * 🎯 Log level icons with synthwave flair
 */
const ICONS = {
  info: "⚡",
  success: "✨",
  warn: "🌆",
  error: "🔥",
  debug: "🔍",
} as const;

/**
 * 🌃 Plugin logger class
 *
 * Creates styled console output for Vite plugins with consistent
 * branding and that sweet cyberpunk aesthetic.
 *
 * @example
 * ```ts
 * const logger = createPluginLogger("my-plugin");
 * logger.info("Build started");
 * logger.success("Compiled 42 files");
 * logger.warn("Detected duplicate entries");
 * logger.error("Build failed");
 * ```
 */
export class PluginLogger {
  private pluginName: string;

  constructor(pluginName: string) {
    this.pluginName = pluginName;
  }

  /**
   * 🎨 Format the plugin name with neon styling
   */
  private formatPluginName(): string {
    return `${COLORS.bold}${COLORS.neonCyan}[${this.pluginName}]${COLORS.reset}`;
  }

  /**
   * ⚡ Info message - general plugin activity
   */
  info(message: string, ...args: any[]): void {
    console.info(
      `${this.formatPluginName()} ${COLORS.neonPurple}${ICONS.info}${COLORS.reset} ${COLORS.white}${message}${COLORS.reset}`,
      ...args
    );
  }

  /**
   * ✨ Success message - completed operations
   */
  success(message: string, ...args: any[]): void {
    console.info(
      `${this.formatPluginName()} ${COLORS.neonGreen}${ICONS.success}${COLORS.reset} ${COLORS.neonGreen}${message}${COLORS.reset}`,
      ...args
    );
  }

  /**
   * 🌆 Warning message - potential issues
   */
  warn(message: string, ...args: any[]): void {
    console.warn(
      `${this.formatPluginName()} ${COLORS.neonYellow}${ICONS.warn}${COLORS.reset} ${COLORS.neonYellow}${message}${COLORS.reset}`,
      ...args
    );
  }

  /**
   * 🔥 Error message - critical failures
   */
  error(message: string, ...args: any[]): void {
    console.error(
      `${this.formatPluginName()} ${COLORS.hotMagenta}${ICONS.error}${COLORS.reset} ${COLORS.hotMagenta}${message}${COLORS.reset}`,
      ...args
    );
  }

  /**
   * 🔍 Debug message - detailed diagnostics
   */
  debug(message: string, ...args: any[]): void {
    console.debug(
      `${this.formatPluginName()} ${COLORS.gray}${ICONS.debug}${COLORS.reset} ${COLORS.dim}${message}${COLORS.reset}`,
      ...args
    );
  }

  /**
   * 📊 Stats message - display metrics with formatting
   *
   * @example
   * logger.stats({ files: 42, entries: 128, time: "1.2s" });
   * // Output: [plugin] ⚡ files: 42 | entries: 128 | time: 1.2s
   */
  stats(metrics: Record<string, string | number>): void {
    const formatted = Object.entries(metrics)
      .map(([key, value]) => {
        return `${COLORS.neonCyan}${key}${COLORS.reset}: ${COLORS.neonPink}${value}${COLORS.reset}`;
      })
      .join(` ${COLORS.gray}|${COLORS.reset} `);

    console.info(
      `${this.formatPluginName()} ${COLORS.neonPurple}${ICONS.info}${COLORS.reset} ${formatted}`
    );
  }
}

/**
 * 🎯 Factory function to create a plugin logger
 *
 * @param pluginName - Name of the Vite plugin (e.g., "vite-plugin-tabs-manifest")
 * @returns {PluginLogger} Logger instance with synthwave styling
 *
 * @example
 * ```ts
 * const logger = createPluginLogger("vite-plugin-my-cool-feature");
 * logger.info("Starting build process...");
 * ```
 */
export function createPluginLogger(pluginName: string): PluginLogger {
  return new PluginLogger(pluginName);
}

/**
 * 🌃 Export for inline usage without creating a logger instance
 *
 * Useful for one-off messages or quick debugging
 */
export const logger = {
  /**
   * Quick info message without plugin context
   */
  info: (message: string, ...args: any[]) => {
    console.info(`${COLORS.neonPurple}⚡${COLORS.reset} ${message}`, ...args);
  },

  /**
   * Quick success message without plugin context
   */
  success: (message: string, ...args: any[]) => {
    console.info(`${COLORS.neonGreen}✨${COLORS.reset} ${message}`, ...args);
  },

  /**
   * Quick warning message without plugin context
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(`${COLORS.neonYellow}🌆${COLORS.reset} ${message}`, ...args);
  },

  /**
   * Quick error message without plugin context
   */
  error: (message: string, ...args: any[]) => {
    console.error(`${COLORS.hotMagenta}🔥${COLORS.reset} ${message}`, ...args);
  },
};
