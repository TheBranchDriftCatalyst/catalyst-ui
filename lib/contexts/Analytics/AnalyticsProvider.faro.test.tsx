/**
 * The Faro sink wired to the real provider.
 *
 * These pin the stream mapping end to end -- which signals leave the device
 * and, more importantly, which one never does.
 */

import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import { faro } from "./sinks/faro";
import type { AnalyticsConfig, PerformanceMetric } from "./types";

const AUTHZ_CODE = "AUTHZ_CODE_LEAK";
const BEARER_TOKEN = "BEARER_TOKEN_LEAK";
const CALLBACK = `/callback?code=${AUTHZ_CODE}&state=xyz#access_token=${BEARER_TOKEN}`;

const okResponse = () => ({
  ok: true,
  status: 202,
  headers: { get: () => null },
  text: () => Promise.resolve(""),
});

describe("AnalyticsProvider with the faro sink", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let sink: ReturnType<typeof faro>;

  const config: AnalyticsConfig = { debug: false };

  const mount = () =>
    renderHook(() => useAnalytics(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AnalyticsProvider config={config} sinks={[sink]}>
          {children}
        </AnalyticsProvider>
      ),
    });

  const bodies = () =>
    (fetchMock.mock.calls as unknown as Array<[string, RequestInit]>).map(([, init]) =>
      String(init.body)
    );

  beforeEach(() => {
    storage.clear();
    fetchMock = vi.fn(() => Promise.resolve(okResponse()));
    vi.stubGlobal("fetch", fetchMock);
    sink = faro({ batchSize: 1 });
  });

  afterEach(() => {
    sink.dispose();
    vi.unstubAllGlobals();
    storage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("never puts a user journey step on the wire", () => {
    const { result } = mount();

    result.current.trackJourneyStep({ type: "click", target: "button#r1x-42.px-4" });
    result.current.trackJourneyStep({ type: "navigation", target: "/checkout" });
    result.current.trackJourneyStep({ type: "custom", target: "step" });
    sink.flush();

    // Journey is local-only by design: the target string is tagName+#id+.class
    // (not a unique selector, so it cannot drive replay), Radix ids churn per
    // mount so cardinality is unbounded, and the step carries click
    // coordinates.
    expect(fetchMock).not.toHaveBeenCalled();
    // ...but it is still collected locally, where the dashboard reads it.
    expect(result.current.getSession()?.journey).toHaveLength(3);

    // Proves the probe above is live rather than vacuously green.
    result.current.trackEvent("click");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("ships events, errors and web vitals", () => {
    const { result } = mount();

    result.current.trackEvent("cta_click", { id: "hero" });
    result.current.trackError(new Error("boom"));
    result.current.trackPerformance({ name: "LCP", value: 1200, rating: "good", timestamp: 1 });

    const parsed = bodies().map(body => JSON.parse(body));
    expect(parsed.flatMap(b => b.events ?? []).map(e => e.name)).toEqual(["cta_click"]);
    expect(parsed.flatMap(b => b.exceptions ?? []).map(e => e.value)).toEqual(["boom"]);
    expect(parsed.flatMap(b => b.measurements ?? []).map(m => m.values)).toEqual([{ lcp: 1200 }]);
  });

  it("ships the session as meta.session", () => {
    const { result } = mount();
    result.current.trackEvent("click");

    const sessionId = result.current.getSession()?.sessionId;
    expect(sessionId).toEqual(expect.any(String));
    expect(JSON.parse(bodies()[0]).meta.session.id).toBe(sessionId);
  });

  it("puts no OAuth code or token on the wire", () => {
    window.history.replaceState({}, "", CALLBACK);
    const { result } = mount();

    result.current.trackError(new Error(`fetch ${window.location.href} failed`), {
      referrer: window.location.href,
    });
    result.current.trackPageView(window.location.pathname);

    expect(bodies().length).toBeGreaterThan(0);
    for (const body of bodies()) {
      expect(body).not.toContain(AUTHZ_CODE);
      expect(body).not.toContain(BEARER_TOKEN);
    }
    // Non-vacuous: the route really did reach the collector.
    expect(bodies().join("")).toContain("/callback");
  });

  it("never puts web-vitals internals on the wire", () => {
    const { result } = mount();

    result.current.trackPerformance({
      name: "INP",
      value: 42,
      rating: "good",
      delta: 42,
      timestamp: Date.now(),
      id: "v5-1736-8829",
      navigationType: "navigate",
      entries: [{ startTime: 1, duration: 2, entryType: "event" }],
    } as unknown as PerformanceMetric);

    const body = bodies()[0];
    expect(body).not.toContain("entries");
    expect(body).not.toContain("navigationType");
    expect(body).not.toContain("v5-1736-8829");
    expect(JSON.parse(body).measurements[0].values).toEqual({ inp: 42 });
  });

  it("keeps collecting when the collector is down", () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("collector down")));
    const { result } = mount();

    expect(() => {
      result.current.trackEvent("click");
      result.current.trackError(new Error("boom"));
    }).not.toThrow();

    expect(result.current.getEvents()).toHaveLength(1);
    expect(result.current.getErrors()).toHaveLength(1);
  });
});
