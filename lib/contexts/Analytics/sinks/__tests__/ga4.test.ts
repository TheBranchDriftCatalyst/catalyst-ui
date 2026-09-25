/**
 * The first test here is order-sensitive on purpose: it asserts that nothing
 * has pulled `react-ga4` into the module graph yet. The "imports it" test that
 * follows proves the probe is live, so the first assertion is not vacuous.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { ga4 } from "../ga4";
import type { AnalyticsEvent, ErrorEvent, PerformanceMetric } from "../../types";

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

describe("ga4 sink", () => {
  beforeEach(() => {
    reactGA.initialize.mockClear();
    reactGA.event.mockClear();
    reactGA.send.mockClear();
  });

  it("never imports react-ga4 when no measurementId is configured", async () => {
    const sink = ga4();
    await sink.init!({ debug: false });

    sink.event!({ name: "click", timestamp: 1 });
    sink.pageView!({ path: "/home", timestamp: 1 });
    await Promise.resolve();

    expect(reactGALoaded).not.toHaveBeenCalled();
    expect(reactGA.initialize).not.toHaveBeenCalled();
    expect(reactGA.event).not.toHaveBeenCalled();
    expect(reactGA.send).not.toHaveBeenCalled();
  });

  it("imports and initializes react-ga4 once a measurementId is configured", async () => {
    const sink = ga4();
    await sink.init!({
      measurementId: "G-TEST123",
      debug: true,
      customDimensions: { tier: "pro" },
    });

    expect(reactGALoaded).toHaveBeenCalledTimes(1);
    expect(reactGA.initialize).toHaveBeenCalledWith("G-TEST123", {
      gaOptions: { debug_mode: true, tier: "pro" },
    });
  });

  it("declares the expected shape", () => {
    const sink = ga4();
    expect(sink.id).toBe("ga4");
    expect(sink.label).toBe("Google Analytics 4");
    // GA4 has no journey concept — journey steps stay local.
    expect(sink.journeyStep).toBeUndefined();
  });

  it("forwards events, page views, errors and web vitals", async () => {
    const sink = ga4();
    await sink.init!({ measurementId: "G-TEST123" });

    const event: AnalyticsEvent = { name: "purchase", params: { value: 3 }, timestamp: 1 };
    sink.event!(event);
    await vi.waitFor(() => expect(reactGA.event).toHaveBeenCalledWith("purchase", { value: 3 }));

    sink.pageView!({ path: "/pricing", title: "Pricing", timestamp: 2 });
    await vi.waitFor(() =>
      expect(reactGA.send).toHaveBeenCalledWith({
        hitType: "pageview",
        page: "/pricing",
        title: "Pricing",
      })
    );

    const errorEvent: ErrorEvent = {
      message: "boom",
      type: "react",
      userAgent: "test",
      url: "http://localhost/",
      timestamp: 3,
      context: { type: "global" },
    };
    sink.error!(errorEvent);
    await vi.waitFor(() =>
      expect(reactGA.event).toHaveBeenCalledWith("exception", {
        description: "boom",
        fatal: false,
        type: "global",
      })
    );

    const metric: PerformanceMetric = { name: "LCP", value: 1200, rating: "good", timestamp: 4 };
    sink.performance!(metric);
    await vi.waitFor(() =>
      expect(reactGA.event).toHaveBeenCalledWith("web_vitals", {
        metric_name: "LCP",
        metric_value: 1200,
        metric_rating: "good",
      })
    );
  });

  it("prefers an explicit measurementId on the sink config over the provider config", async () => {
    const sink = ga4({ measurementId: "G-SINKWINS" });
    await sink.init!({ measurementId: "G-PROVIDER" });
    expect(reactGA.initialize).toHaveBeenCalledWith("G-SINKWINS", expect.anything());
  });
});
