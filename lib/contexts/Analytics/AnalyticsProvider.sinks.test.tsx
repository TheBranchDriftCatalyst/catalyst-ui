/**
 * Unit tests for the pluggable {@link AnalyticsSink} fan-out.
 *
 * Collection used to be three hardcoded destinations inlined at five call
 * sites: `storage` (unconditional), `ReactGA` (gated on `measurementId`) and
 * `console` (gated on `debug`). These cover the extracted contract:
 *
 * - localStorage stays unconditional, so the dashboard / Export / Clear keep
 *   reading exactly what they read before;
 * - a sink that throws neither breaks collection nor starves its peers;
 * - `react-ga4` is no longer in the provider's static import graph.
 *
 * The first and last tests in this file are order-sensitive on purpose — see
 * the comments on each.
 */

import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type { AnalyticsConfig, AnalyticsSink } from "./types";

const { reactGALoaded, reactGA } = vi.hoisted(() => ({
  reactGALoaded: vi.fn(),
  reactGA: {
    initialize: vi.fn(),
    event: vi.fn(),
    send: vi.fn(),
  },
}));

vi.mock("react-ga4", () => {
  reactGALoaded();
  return { default: reactGA };
});

type Recorded = { method: string; payload: unknown };

interface RecordingSink extends AnalyticsSink {
  calls: Recorded[];
  methods: string[];
}

/** A sink that records every call, optionally exploding on each one. */
const recordingSink = (id: string, opts: { throws?: boolean } = {}): RecordingSink => {
  const calls: Recorded[] = [];
  const record = (method: string) => (payload: unknown) => {
    calls.push({ method, payload });
    if (opts.throws) throw new Error(`${id} sink exploded in ${method}()`);
  };
  return {
    id,
    label: id,
    config: {},
    calls,
    get methods() {
      return calls.map(c => c.method);
    },
    init: record("init"),
    event: record("event"),
    pageView: record("pageView"),
    error: record("error"),
    performance: record("performance"),
    journeyStep: record("journeyStep"),
  };
};

const mount = (config: AnalyticsConfig, sinks?: AnalyticsSink[]) =>
  renderHook(() => useAnalytics(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AnalyticsProvider config={config} sinks={sinks}>
        {children}
      </AnalyticsProvider>
    ),
  });

describe("AnalyticsProvider sinks", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    storage.clear();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    storage.clear();
    warnSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  // MUST stay first: it asserts nothing in this file's static import graph has
  // reached for react-ga4 yet. The final test drives the same probe to 1,
  // proving this assertion is not vacuous.
  it("keeps react-ga4 out of the provider's static import graph", () => {
    expect(reactGALoaded).not.toHaveBeenCalled();
  });

  it("fans every track call out to the registered sinks", () => {
    const sink = recordingSink("recorder");
    const { result } = mount({ debug: false }, [sink]);

    expect(sink.methods).toEqual(["init"]);

    result.current.trackEvent("click", { id: "cta" });
    result.current.trackError(new Error("boom"), { scope: "test" });
    result.current.trackPerformance({ name: "LCP", value: 1200, timestamp: 7 });
    result.current.trackJourneyStep({ type: "custom", target: "step-0" });
    result.current.trackPageView("/pricing", "Pricing");

    // trackPageView also emits the derived `page_view` event, exactly as before.
    expect(sink.methods).toEqual([
      "init",
      "event",
      "error",
      "performance",
      "journeyStep",
      "pageView",
      "event",
    ]);

    const byMethod = (m: string) => sink.calls.filter(c => c.method === m).map(c => c.payload);

    expect(byMethod("init")[0]).toEqual({ debug: false });
    expect(byMethod("event")[0]).toMatchObject({ name: "click", params: { id: "cta" } });
    expect(byMethod("event")[1]).toMatchObject({
      name: "page_view",
      params: { page_path: "/pricing", page_title: "Pricing" },
    });
    expect(byMethod("pageView")[0]).toMatchObject({ path: "/pricing", title: "Pricing" });
    expect(byMethod("error")[0]).toMatchObject({
      message: "boom",
      type: "react",
      context: { scope: "test" },
    });
    expect(byMethod("performance")[0]).toMatchObject({ name: "LCP", value: 1200 });
    expect(byMethod("journeyStep")[0]).toMatchObject({ type: "custom", target: "step-0" });
  });

  it("keeps collecting and keeps peer sinks running when a sink throws", () => {
    const boom = recordingSink("boom", { throws: true });
    const healthy = recordingSink("healthy");
    const { result } = mount({ debug: false }, [boom, healthy]);

    expect(() => {
      result.current.trackEvent("click");
      result.current.trackError(new Error("kaboom"));
      result.current.trackPerformance({ name: "CLS", value: 0.01, timestamp: 8 });
      result.current.trackJourneyStep({ type: "custom", target: "step-0" });
      result.current.trackPageView("/home");
    }).not.toThrow();

    // The exploding sink was still offered every call...
    expect(boom.methods).toEqual([
      "init",
      "event",
      "error",
      "performance",
      "journeyStep",
      "pageView",
      "event",
    ]);
    // ...and it did not starve the sink registered after it.
    expect(healthy.methods).toEqual(boom.methods);

    // localStorage collection is untouched by the failures.
    expect(result.current.getEvents().map(e => e.name)).toEqual(["click", "page_view"]);
    expect(result.current.getErrors()).toHaveLength(1);
    expect(result.current.getMetrics()).toHaveLength(1);
    expect(result.current.getSession()?.journey).toHaveLength(1);
    expect(result.current.getSession()?.eventCount).toBe(2);
    expect(result.current.getSession()?.pageViews).toBe(1);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/sink "boom" threw in event\(\)/),
      expect.any(Error)
    );
  });

  it("survives a sink that throws from init() and still initializes", () => {
    const boom: AnalyticsSink = {
      id: "boom-init",
      label: "boom-init",
      config: {},
      init() {
        throw new Error("init exploded");
      },
    };
    const healthy = recordingSink("healthy");

    const { result } = mount({ debug: false }, [boom, healthy]);

    expect(result.current.isInitialized).toBe(true);
    expect(healthy.methods).toEqual(["init"]);

    result.current.trackEvent("click");
    expect(healthy.methods).toEqual(["init", "event"]);
    expect(result.current.getEvents()).toHaveLength(1);
  });

  it("writes to localStorage unconditionally when no sinks are registered", () => {
    // `debug: true` plus an explicit empty registry: collection must still be
    // complete, but the default console sink must be gone.
    const { result } = mount({ debug: true }, []);

    result.current.trackEvent("click");
    result.current.trackPageView("/home");
    result.current.trackError(new Error("boom"));
    result.current.trackPerformance({ name: "TTFB", value: 12, timestamp: 9 });
    result.current.trackJourneyStep({ type: "custom", target: "step-0" });

    expect(result.current.getEvents().map(e => e.name)).toEqual(["click", "page_view"]);
    expect(result.current.getErrors()).toHaveLength(1);
    expect(result.current.getMetrics()).toHaveLength(1);
    expect(result.current.getSession()?.journey).toHaveLength(1);
    expect(JSON.parse(result.current.exportData())).toMatchObject({
      events: expect.any(Array),
      errors: expect.any(Array),
      metrics: expect.any(Array),
    });

    // An empty registry really is empty — the built-in console sink is a
    // default, not a floor.
    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("keeps the legacy debug console output for consumers passing only { children, config }", () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AnalyticsProvider config={{ debug: true }}>{children}</AnalyticsProvider>
      ),
    });

    result.current.trackEvent("click", { id: "cta" });
    expect(logSpy).toHaveBeenCalledWith(
      "Event tracked:",
      expect.objectContaining({ name: "click" })
    );

    result.current.trackPerformance({ name: "LCP", value: 1200, timestamp: 7 });
    expect(logSpy).toHaveBeenCalledWith(
      "Performance metric tracked:",
      expect.objectContaining({ name: "LCP" })
    );

    result.current.trackJourneyStep({ type: "custom", target: "step-0" });
    expect(logSpy).toHaveBeenCalledWith(
      "Journey step tracked:",
      expect.objectContaining({ target: "step-0" })
    );

    result.current.trackError(new Error("boom"));
    expect(errorSpy).toHaveBeenCalledWith(
      "Error tracked:",
      expect.objectContaining({ message: "boom" })
    );

    // Still no GA4 — there is no measurementId.
    expect(reactGALoaded).not.toHaveBeenCalled();
    expect(result.current.getEvents()).toHaveLength(1);
  });

  // MUST stay last: this is the only test that lets react-ga4 load, and it is
  // what proves the `reactGALoaded` probe used above actually fires.
  it("loads react-ga4 lazily, only once a measurementId is configured", async () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AnalyticsProvider config={{ measurementId: "G-TEST123" }}>{children}</AnalyticsProvider>
      ),
    });

    await vi.waitFor(() => expect(reactGALoaded).toHaveBeenCalledTimes(1));
    await vi.waitFor(() =>
      expect(reactGA.initialize).toHaveBeenCalledWith("G-TEST123", expect.anything())
    );

    result.current.trackEvent("purchase", { value: 3 });
    await vi.waitFor(() => expect(reactGA.event).toHaveBeenCalledWith("purchase", { value: 3 }));
  });
});
