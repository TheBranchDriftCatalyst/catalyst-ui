import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, createLogger, getLoggerColor, LoggerRegistry, type LogLevel } from "./logger";

describe("logger utility", () => {
  // Spy on console methods
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create fresh spies for each test
    consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Reset logger to default state
    logger.configure({ enabled: true, minLevel: "debug" });
    logger.setGlobalMinLevel(null);
  });

  afterEach(() => {
    // Restore all spies
    vi.restoreAllMocks();
  });

  describe("Logger basic functionality", () => {
    it("should log debug messages", () => {
      logger.debug("TestSource", "Debug message", { foo: "bar" });

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).toContain("🔍");
      expect(call[0]).toContain("[Catalyst]");
      expect(call[0]).toContain("Debug message");
    });

    it("should log info messages", () => {
      logger.info("TestSource", "Info message", { foo: "bar" });

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain("ℹ️");
      expect(call[0]).toContain("[Catalyst]");
      expect(call[0]).toContain("Info message");
    });

    it("should log warn messages", () => {
      logger.warn("TestSource", "Warning message", { foo: "bar" });

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const call = consoleWarnSpy.mock.calls[0];
      expect(call[0]).toContain("⚠️");
      expect(call[0]).toContain("[Catalyst]");
      expect(call[0]).toContain("Warning message");
    });

    it("should log error messages", () => {
      logger.error("TestSource", "Error message", new Error("Test error"));

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toContain("❌");
      expect(call[0]).toContain("[Catalyst]");
      expect(call[0]).toContain("Error message");
    });

    it("should include source in log messages", () => {
      logger.info("ForceGraph", "Test message");

      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain("[ForceGraph]");
    });

    it("should include timestamp in log messages", () => {
      logger.info("TestSource", "Test message");

      const call = consoleInfoSpy.mock.calls[0];
      // Timestamp format: (HH:MM:SS)
      expect(call[0]).toMatch(/\(\d{2}:\d{2}:\d{2}\)/);
    });

    it("should handle data parameter", () => {
      const testData = { userId: 123, action: "click" };
      logger.info("TestSource", "User action", testData);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      // Data is passed as the last argument
      const lastArg = consoleInfoSpy.mock.calls[0][5];
      expect(lastArg).toEqual(testData);
    });

    it("should handle Error objects in error method", () => {
      const error = new Error("Test error");
      error.stack = "Error: Test error\n  at test.ts:1:1";

      logger.error("TestSource", "Operation failed", error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const errorData = consoleErrorSpy.mock.calls[0][5];
      expect(errorData).toHaveProperty("message", "Test error");
      expect(errorData).toHaveProperty("stack");
      expect(errorData).toHaveProperty("name", "Error");
    });

    it("should handle non-Error objects in error method", () => {
      const customError = { code: 500, message: "Server error" };

      logger.error("TestSource", "API failed", customError);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const errorData = consoleErrorSpy.mock.calls[0][5];
      expect(errorData).toEqual(customError);
    });
  });

  describe("Logger configuration", () => {
    it("should respect minLevel configuration", () => {
      logger.configure({ minLevel: "warn" });

      logger.debug("TestSource", "Debug message");
      logger.info("TestSource", "Info message");
      logger.warn("TestSource", "Warning message");
      logger.error("TestSource", "Error message");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should respect enabled configuration", () => {
      logger.configure({ enabled: false });

      logger.debug("TestSource", "Debug message");
      logger.info("TestSource", "Info message");
      logger.warn("TestSource", "Warning message");
      logger.error("TestSource", "Error message");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should allow runtime reconfiguration", () => {
      logger.configure({ enabled: false });
      logger.info("TestSource", "Message 1");
      expect(consoleInfoSpy).not.toHaveBeenCalled();

      logger.configure({ enabled: true });
      logger.info("TestSource", "Message 2");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    });

    it("should support custom prefix", () => {
      logger.configure({ prefix: "[CustomApp]" });
      logger.info("TestSource", "Test message");

      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain("[CustomApp]");
      expect(call[0]).not.toContain("[Catalyst]");
    });
  });

  describe("Global minimum level", () => {
    it("should set and get global minimum level", () => {
      logger.setGlobalMinLevel("error");
      expect(logger.getEffectiveMinLevel()).toBe("error");
    });

    it("should override instance minLevel when set", () => {
      logger.configure({ minLevel: "debug" });
      logger.setGlobalMinLevel("error");

      logger.debug("TestSource", "Debug");
      logger.info("TestSource", "Info");
      logger.warn("TestSource", "Warn");
      logger.error("TestSource", "Error");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should use instance minLevel when global is null", () => {
      logger.configure({ minLevel: "warn" });
      logger.setGlobalMinLevel(null);

      expect(logger.getEffectiveMinLevel()).toBe("warn");
    });
  });

  describe("ScopedLogger", () => {
    it("should create scoped logger via scope() method", () => {
      const scopedLog = logger.scope("TestComponent");

      expect(scopedLog.name).toBe("TestComponent");
      expect(scopedLog.enabled).toBe(true);
      expect(scopedLog.minLevel).toBe("debug");
    });

    it("should create scoped logger via createLogger() function", () => {
      const scopedLog = createLogger("AnotherComponent");

      expect(scopedLog.name).toBe("AnotherComponent");
    });

    it("should log with scoped source automatically", () => {
      const scopedLog = createLogger("ScopedTest");
      scopedLog.info("Test message");

      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain("[ScopedTest]");
    });

    it("should support all log levels", () => {
      const scopedLog = createLogger("LevelTest");

      scopedLog.debug("Debug");
      scopedLog.info("Info");
      scopedLog.warn("Warn");
      scopedLog.error("Error");

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should respect scoped logger enabled state", () => {
      const scopedLog = createLogger("EnableTest");
      scopedLog.setEnabled(false);

      scopedLog.debug("Debug");
      scopedLog.info("Info");
      scopedLog.warn("Warn");
      scopedLog.error("Error");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should respect scoped logger minLevel", () => {
      const scopedLog = createLogger("MinLevelTest");
      scopedLog.setMinLevel("error");

      scopedLog.debug("Debug");
      scopedLog.info("Info");
      scopedLog.warn("Warn");
      scopedLog.error("Error");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should allow changing enabled state at runtime", () => {
      const scopedLog = createLogger("RuntimeTest");

      scopedLog.info("Message 1");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);

      scopedLog.setEnabled(false);
      scopedLog.info("Message 2");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1); // No increase

      scopedLog.setEnabled(true);
      scopedLog.info("Message 3");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    });

    it("should allow changing minLevel at runtime", () => {
      const scopedLog = createLogger("RuntimeLevelTest");

      scopedLog.debug("Debug 1");
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);

      scopedLog.setMinLevel("error");
      scopedLog.debug("Debug 2");
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1); // No increase
    });
  });

  describe("LoggerRegistry", () => {
    it("should register scoped loggers automatically", () => {
      createLogger("Component1");
      createLogger("Component2");

      const allLoggers = LoggerRegistry.getAll();
      expect(allLoggers.length).toBeGreaterThanOrEqual(2);

      const names = allLoggers.map(l => l.name);
      expect(names).toContain("Component1");
      expect(names).toContain("Component2");
    });

    it("should retrieve logger by name", () => {
      const log = createLogger("RetrieveTest");
      const retrieved = LoggerRegistry.get("RetrieveTest");

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe("RetrieveTest");
      expect(retrieved).toBe(log);
    });

    it("should enable logger by name", () => {
      const log = createLogger("EnableByNameTest");
      log.setEnabled(false);

      LoggerRegistry.enable("EnableByNameTest");

      expect(log.enabled).toBe(true);
    });

    it("should disable logger by name", () => {
      const log = createLogger("DisableByNameTest");
      log.setEnabled(true);

      LoggerRegistry.disable("DisableByNameTest");

      expect(log.enabled).toBe(false);
    });

    it("should enable all loggers", () => {
      const log1 = createLogger("EnableAll1");
      const log2 = createLogger("EnableAll2");
      log1.setEnabled(false);
      log2.setEnabled(false);

      LoggerRegistry.enableAll();

      expect(log1.enabled).toBe(true);
      expect(log2.enabled).toBe(true);
    });

    it("should disable all loggers", () => {
      const log1 = createLogger("DisableAll1");
      const log2 = createLogger("DisableAll2");
      log1.setEnabled(true);
      log2.setEnabled(true);

      LoggerRegistry.disableAll();

      expect(log1.enabled).toBe(false);
      expect(log2.enabled).toBe(false);
    });

    it("should get state of all loggers", () => {
      const log1 = createLogger("StateTest1");
      const log2 = createLogger("StateTest2");
      log1.setEnabled(true);
      log2.setEnabled(false);

      const state = LoggerRegistry.getState();

      expect(state).toHaveProperty("StateTest1", true);
      expect(state).toHaveProperty("StateTest2", false);
    });

    it("should set state of all loggers", () => {
      const log1 = createLogger("SetStateTest1");
      const log2 = createLogger("SetStateTest2");

      const newState = {
        SetStateTest1: false,
        SetStateTest2: true,
      };

      LoggerRegistry.setState(newState);

      expect(log1.enabled).toBe(false);
      expect(log2.enabled).toBe(true);
    });

    it("should handle state setting for non-existent loggers gracefully", () => {
      const state = {
        NonExistentLogger: true,
      };

      // Should not throw
      expect(() => LoggerRegistry.setState(state)).not.toThrow();
    });
  });

  describe("getLoggerColor", () => {
    it("should return a color for a logger name", () => {
      const color = getLoggerColor("ForceGraph");

      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should return consistent color for same name", () => {
      const color1 = getLoggerColor("TestLogger");
      const color2 = getLoggerColor("TestLogger");
      const color3 = getLoggerColor("TestLogger");

      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
    });

    it("should return different colors for different names", () => {
      const colors = new Set([
        getLoggerColor("Logger1"),
        getLoggerColor("Logger2"),
        getLoggerColor("Logger3"),
        getLoggerColor("Logger4"),
        getLoggerColor("Logger5"),
      ]);

      // Should have at least some variety (not all the same)
      expect(colors.size).toBeGreaterThan(1);
    });

    it("should handle empty string", () => {
      const color = getLoggerColor("");

      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should handle special characters", () => {
      const color = getLoggerColor("Logger@#$%^&*()");

      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should handle unicode characters", () => {
      const color = getLoggerColor("日本語Logger");

      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe("Log level hierarchy", () => {
    const testCases: Array<{ minLevel: LogLevel; expectedCalls: number[] }> = [
      { minLevel: "debug", expectedCalls: [1, 1, 1, 1] }, // all should log
      { minLevel: "info", expectedCalls: [0, 1, 1, 1] }, // debug blocked
      { minLevel: "warn", expectedCalls: [0, 0, 1, 1] }, // debug, info blocked
      { minLevel: "error", expectedCalls: [0, 0, 0, 1] }, // only error
    ];

    testCases.forEach(({ minLevel, expectedCalls }) => {
      it(`should filter logs correctly with minLevel="${minLevel}"`, () => {
        logger.configure({ minLevel });

        logger.debug("Test", "Debug");
        logger.info("Test", "Info");
        logger.warn("Test", "Warn");
        logger.error("Test", "Error");

        expect(consoleDebugSpy).toHaveBeenCalledTimes(expectedCalls[0]);
        expect(consoleInfoSpy).toHaveBeenCalledTimes(expectedCalls[1]);
        expect(consoleWarnSpy).toHaveBeenCalledTimes(expectedCalls[2]);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(expectedCalls[3]);
      });
    });
  });

  describe("Integration scenarios", () => {
    it("should work with multiple scoped loggers independently", () => {
      const log1 = createLogger("Component1");
      const log2 = createLogger("Component2");

      log1.setMinLevel("warn");
      log2.setMinLevel("debug");

      log1.debug("Debug from log1");
      log2.debug("Debug from log2");

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).toContain("[Component2]");
    });

    it("should support toggling individual loggers via registry", () => {
      const log1 = createLogger("Toggle1");
      const log2 = createLogger("Toggle2");

      log1.info("Before toggle");
      log2.info("Before toggle");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(2);

      LoggerRegistry.disable("Toggle1");

      log1.info("After toggle");
      log2.info("After toggle");
      expect(consoleInfoSpy).toHaveBeenCalledTimes(3); // Only log2's message
    });

    it("should persist state through registry get/set", () => {
      const log1 = createLogger("Persist1");
      const log2 = createLogger("Persist2");

      log1.setEnabled(false);
      log2.setEnabled(true);

      // Get current state
      const state = LoggerRegistry.getState();

      // Change state
      log1.setEnabled(true);
      log2.setEnabled(false);

      // Restore original state
      LoggerRegistry.setState(state);

      expect(log1.enabled).toBe(false);
      expect(log2.enabled).toBe(true);
    });

    it("should handle complex filtering with both enabled and minLevel", () => {
      const log = createLogger("ComplexFilter");
      log.setMinLevel("warn");
      log.setEnabled(true);

      log.debug("Debug");
      log.info("Info");
      log.warn("Warn");

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      // Disable entirely
      log.setEnabled(false);
      log.warn("Warn 2");
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // No increase
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined data parameter", () => {
      logger.info("Test", "Message without data");

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      // Should pass empty string when no data
      const lastArg = consoleInfoSpy.mock.calls[0][5];
      expect(lastArg).toBe("");
    });

    it("should handle null error in error method", () => {
      logger.error("Test", "Error with null", null);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      // Logger converts null/undefined to empty string via ?? operator
      const errorData = consoleErrorSpy.mock.calls[0][5];
      expect(errorData).toBe("");
    });

    it("should handle very long logger names", () => {
      const longName = "A".repeat(1000);
      const color = getLoggerColor(longName);

      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should handle rapid successive calls", () => {
      for (let i = 0; i < 100; i++) {
        logger.info("Test", `Message ${i}`);
      }

      expect(consoleInfoSpy).toHaveBeenCalledTimes(100);
    });

    it("should handle switching between all log levels rapidly", () => {
      logger.debug("Test", "Debug");
      logger.info("Test", "Info");
      logger.warn("Test", "Warn");
      logger.error("Test", "Error");
      logger.debug("Test", "Debug 2");
      logger.info("Test", "Info 2");

      expect(consoleDebugSpy).toHaveBeenCalledTimes(2);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
