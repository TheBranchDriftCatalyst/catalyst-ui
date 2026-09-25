/**
 * Unit tests for the AnalyticsProvider session counters.
 *
 * `eventCount` / `pageViews` were derived from `sessionRef.current` — a ref
 * assigned once in `initializeSession` and never re-read — so every increment
 * used the same mount-time base and both counters were pinned at
 * `<value at mount> + 1`. Meanwhile `journey` kept growing correctly because
 * `storage.addJourneyStep` re-reads localStorage on every append. That is the
 * "Total Events 9 / 1 page views / User Journey (34 steps)" asymmetry.
 */

import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type { AnalyticsConfig, SessionInfo } from "./types";

// No measurementId (keeps GA4 out of it), and no journey/error/performance
// tracking so nothing registers global listeners that outlive the test.
const config: AnalyticsConfig = { debug: false };

const wrapper = ({ children }: { children: ReactNode }) => (
  <AnalyticsProvider config={config}>{children}</AnalyticsProvider>
);

const mount = () => renderHook(() => useAnalytics(), { wrapper });

describe("AnalyticsProvider session counters", () => {
  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  it("counts every trackEvent call", () => {
    const { result } = mount();

    for (let i = 0; i < 5; i++) {
      result.current.trackEvent(`event-${i}`);
    }

    expect(result.current.getSession()?.eventCount).toBe(5);
    expect(result.current.getEvents()).toHaveLength(5);
  });

  it("continues counting events from the persisted total after a remount", () => {
    const first = mount();
    first.result.current.trackEvent("a");
    first.result.current.trackEvent("b");
    first.result.current.trackEvent("c");
    expect(first.result.current.getSession()?.eventCount).toBe(3);
    const sessionId = first.result.current.getSession()?.sessionId;
    first.unmount();

    const second = mount();
    second.result.current.trackEvent("d");
    second.result.current.trackEvent("e");

    const session = second.result.current.getSession();
    // Same session window, so the counter resumes rather than restarting.
    expect(session?.sessionId).toBe(sessionId);
    expect(session?.eventCount).toBe(5);
  });

  it("counts every trackPageView call", () => {
    const { result } = mount();

    result.current.trackPageView("/one");
    result.current.trackPageView("/two");
    result.current.trackPageView("/three");
    result.current.trackPageView("/four");

    const session = result.current.getSession();
    expect(session?.pageViews).toBe(4);
    // Each page view also emits a `page_view` event.
    expect(session?.eventCount).toBe(4);
  });

  it("continues counting page views from the persisted total after a remount", () => {
    const first = mount();
    first.result.current.trackPageView("/one");
    first.result.current.trackPageView("/two");
    expect(first.result.current.getSession()?.pageViews).toBe(2);
    first.unmount();

    const second = mount();
    second.result.current.trackPageView("/three");
    second.result.current.trackPageView("/four");

    const session = second.result.current.getSession();
    expect(session?.pageViews).toBe(4);
    expect(session?.eventCount).toBe(4);
  });

  it("keeps eventCount in step with the journey it records", () => {
    const { result } = mount();

    for (let i = 0; i < 6; i++) {
      result.current.trackEvent(`event-${i}`);
      result.current.trackJourneyStep({ type: "custom", target: `step-${i}` });
    }

    const session = result.current.getSession();
    expect(session?.journey).toHaveLength(6);
    expect(session?.eventCount).toBe(session?.journey.length);
  });

  it("starts a fresh count when the previous session has expired", () => {
    const stale: SessionInfo = {
      sessionId: "stale-session",
      startTime: Date.now() - 60 * 60 * 1000,
      lastActivity: Date.now() - 31 * 60 * 1000,
      pageViews: 4,
      eventCount: 9,
      journey: [],
    };
    storage.setSession(stale);

    const { result } = mount();
    result.current.trackEvent("a");
    result.current.trackEvent("b");

    const session = result.current.getSession();
    expect(session?.sessionId).not.toBe("stale-session");
    expect(session?.eventCount).toBe(2);
    expect(session?.pageViews).toBe(0);
  });
});
