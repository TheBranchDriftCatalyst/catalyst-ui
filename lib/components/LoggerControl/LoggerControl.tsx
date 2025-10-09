import React from "react";
import { LogLevel, getLoggerColor } from "@/catalyst-ui/utils/logger";
import { useLoggerControl } from "@/catalyst-ui/hooks/useLoggerControl";

const LOG_LEVEL_CONFIG: Record<
  LogLevel,
  { label: string; emoji: string; color: string; description: string }
> = {
  debug: {
    label: "Debug",
    emoji: "🔍",
    color: "bg-gray-500/20 border-gray-500 text-gray-400",
    description: "Shows all logs (debug, info, warn, error)",
  },
  info: {
    label: "Info",
    emoji: "ℹ️",
    color: "bg-blue-500/20 border-blue-500 text-blue-400",
    description: "Shows info, warn, and error logs",
  },
  warn: {
    label: "Warn",
    emoji: "⚠️",
    color: "bg-amber-500/20 border-amber-500 text-amber-400",
    description: "Shows warn and error logs",
  },
  error: {
    label: "Error",
    emoji: "❌",
    color: "bg-red-500/20 border-red-500 text-red-400",
    description: "Shows only error logs",
  },
};

export interface LoggerControlProps {
  className?: string;
}

export const LoggerControl: React.FC<LoggerControlProps> = ({ className = "" }) => {
  const { logLevel, setLevel, loggers, toggleLogger, setLoggerLevel, enableAll, disableAll } =
    useLoggerControl();

  const levels: LogLevel[] = ["debug", "info", "warn", "error"];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Log Level Selector */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground/80">Log Level (Cascading)</h4>
        <p className="text-xs text-foreground/60 mb-3">
          Each level includes more severe levels above it
        </p>
        <div className="grid grid-cols-2 gap-2">
          {levels.map(level => {
            const config = LOG_LEVEL_CONFIG[level];
            const isActive = logLevel === level;
            return (
              <button
                key={level}
                onClick={() => setLevel(level)}
                className={`
                  relative px-3 py-2 rounded-lg border-2 transition-all duration-200
                  ${isActive ? config.color : "bg-background/30 border-border/30 text-foreground/50"}
                  ${isActive ? "scale-105 shadow-lg" : "hover:border-border/60 hover:text-foreground/70"}
                `}
                title={config.description}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {config.label}
                  </span>
                </div>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-foreground/50 italic mt-2">
          Current: {LOG_LEVEL_CONFIG[logLevel].description}
        </p>
      </div>

      {/* Active Loggers List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80">
            Active Loggers ({loggers.filter(l => l.enabled).length}/{loggers.length})
          </h4>
          <div className="flex gap-1">
            <button
              onClick={enableAll}
              className="px-2 py-1 text-xs rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
              title="Enable all loggers"
            >
              All
            </button>
            <button
              onClick={disableAll}
              className="px-2 py-1 text-xs rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Disable all loggers"
            >
              None
            </button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {loggers.length === 0 ? (
            <p className="text-xs text-foreground/40 italic py-2">
              No loggers registered yet. Loggers appear when components initialize.
            </p>
          ) : (
            loggers.map(log => {
              const loggerColor = getLoggerColor(log.name);
              return (
                <div
                  key={log.name}
                  className={`
                  w-full px-2 py-1.5 rounded text-xs font-mono transition-all
                  ${
                    log.enabled
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-background/30 border border-border/20"
                  }
                `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => toggleLogger(log.name)}
                      className="flex-1 text-left font-semibold"
                      style={{ color: log.enabled ? loggerColor : undefined }}
                    >
                      {log.name}
                    </button>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        log.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-500"
                      }`}
                    >
                      {log.enabled ? "ON" : "OFF"}
                    </span>
                  </div>
                  {log.enabled && (
                    <div className="flex gap-0.5 mt-1">
                      {levels.map(level => {
                        const config = LOG_LEVEL_CONFIG[level];
                        const isActive = log.minLevel === level;
                        return (
                          <button
                            key={level}
                            onClick={() => setLoggerLevel(log.name, level)}
                            className={`
                            flex-1 px-1 py-0.5 text-[10px] rounded transition-all
                            ${isActive ? config.color : "bg-background/50 text-foreground/40 hover:text-foreground/60"}
                          `}
                            title={`${config.label}: ${config.description}`}
                          >
                            {config.emoji}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
