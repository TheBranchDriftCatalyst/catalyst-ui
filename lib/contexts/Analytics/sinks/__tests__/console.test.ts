import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { consoleSink } from "../console";
import type { AnalyticsEvent, ErrorEvent, PerformanceMetric, UserJourneyStep } from "../../types";

const event: AnalyticsEvent = { name: "click", params: { id: "cta" }, timestamp: 1 };
const errorEvent: ErrorEvent = {
  message: "boom",
  type: "react",
  userAgent: "test",
  url: "http://localhost/",
  timestamp: 2,
};
const metric: PerformanceMetric = { name: "LCP", value: 1200, rating: "good", timestamp: 3 };
const step: UserJourneyStep = { type: "custom", target: "step-0", timestamp: 4 };

describe("console sink", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("declares the expected shape", () => {
    const sink = consoleSink();
    expect(sink.id).toBe("console");
    expect(sink.label).toBe("Console");
    // Page views already reach the console through the `page_view` event the
    // provider emits, so mirroring them here would double-log.
    expect(sink.pageView).toBeUndefined();
  });

  it("stays silent before init()", () => {
    const sink = consoleSink();
    sink.event!(event);
    sink.error!(errorEvent);
    sink.performance!(metric);
    sink.journeyStep!(step);
    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("stays silent when debug is false", () => {
    const sink = consoleSink();
    sink.init!({ debug: false });
    sink.event!(event);
    sink.performance!(metric);
    sink.journeyStep!(step);
    sink.error!(errorEvent);
    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs with the legacy messages when debug is true", () => {
    const sink = consoleSink();
    sink.init!({ debug: true });

    sink.event!(event);
    expect(logSpy).toHaveBeenCalledWith("Event tracked:", event);

    sink.performance!(metric);
    expect(logSpy).toHaveBeenCalledWith("Performance metric tracked:", metric);

    sink.journeyStep!(step);
    expect(logSpy).toHaveBeenCalledWith("Journey step tracked:", step);

    sink.error!(errorEvent);
    expect(errorSpy).toHaveBeenCalledWith("Error tracked:", errorEvent);
  });

  it("honours an explicit enabled override regardless of debug", () => {
    const forcedOn = consoleSink({ enabled: true });
    forcedOn.init!({ debug: false });
    forcedOn.event!(event);
    expect(logSpy).toHaveBeenCalledWith("Event tracked:", event);

    logSpy.mockClear();

    const forcedOff = consoleSink({ enabled: false });
    forcedOff.init!({ debug: true });
    forcedOff.event!(event);
    expect(logSpy).not.toHaveBeenCalled();
  });
});
