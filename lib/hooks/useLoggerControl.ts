import { useState, useEffect } from "react";
import { logger, LogLevel, LoggerRegistry } from "@/catalyst-ui/utils/logger";
import { useLocalStorageState } from "./useLocalStorageState";

export interface LoggerInfo {
  name: string;
  enabled: boolean;
  minLevel: LogLevel;
}

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
