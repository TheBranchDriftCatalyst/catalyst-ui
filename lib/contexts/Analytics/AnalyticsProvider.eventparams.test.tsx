/**
 * Event params must be scrubbed before they reach a sink (TALOS-xfjl.22.7).
 *
 * `scrubErrorEvent` covered ErrorEvent only. Events went out untouched, and
 * `sinks/faro.ts` ships `event.params` verbatim as Faro attributes — so the
 * moment the Faro sink was registered, anything a caller put in params became
 * network egress.
 *
 * This is not hypothetical here. catalyst.talos00 sits behind Authentik, so
 * the OAuth callback route genuinely carries `?code=`; and `usePageTracking`
 * hands the provider whatever path string the consumer passes, which for any
 * normal reading of "current page" includes `location.search`.
 *
 * Every assertion below is made against the SERIALIZED payload, never a
 * single field. A secret that survives inside a nested object is still a
 * leak, and asserting on one field is how you write a test that passes while
 * the data escapes through the field next to it.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type { AnalyticsSink } from "./types";

const CODE = "SUPERSECRETCODE";
const TOKEN = "SUPERSECRETTOKEN";
const DIRTY = `https://catalyst.talos00/callback?code=${CODE}&state=x#access_token=${TOKEN}`;

function harness(sink: AnalyticsSink) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AnalyticsProvider config={{ enableErrorTracking: false }} sinks={[sink]}>
      {children}
    </AnalyticsProvider>
  );
  return renderHook(() => useAnalytics(), { wrapper });
}

describe("trackEvent params scrubbing", () => {
  let seen: unknown[];
  let sink: AnalyticsSink;

  beforeEach(() => {
    localStorage.clear();
    storage.clearAll?.();
    seen = [];
    sink = {
      name: "capture",
      event: (e: unknown) => {
        seen.push(e);
      },
    } as unknown as AnalyticsSink;
  });

  it("never lets an OAuth code or token reach a sink through params", () => {
    const { result } = harness(sink);
    act(() => {
      result.current.trackEvent("page_view", { page_path: DIRTY });
    });

    const wire = JSON.stringify(seen);
    expect(wire).not.toContain(CODE);
    expect(wire).not.toContain(TOKEN);
    // and the useful part survives
    expect(wire).toContain("/callback");
  });

  it("scrubs a secret nested arbitrarily deep inside params", () => {
    const { result } = harness(sink);
    act(() => {
      result.current.trackEvent("custom", {
        outer: { inner: { deeper: [`see ${DIRTY}`] } },
      });
    });

    const wire = JSON.stringify(seen);
    expect(wire).not.toContain(CODE);
    expect(wire).not.toContain(TOKEN);
  });

  it("never persists an unscrubbed param to localStorage either", () => {
    const { result } = harness(sink);
    act(() => {
      result.current.trackEvent("page_view", { page_path: DIRTY });
    });

    const persisted = JSON.stringify(storage.getEvents());
    expect(persisted).not.toContain(CODE);
    expect(persisted).not.toContain(TOKEN);
  });

  it("does not mutate the caller's params object", () => {
    const { result } = harness(sink);
    const mine = { page_path: DIRTY };
    act(() => {
      result.current.trackEvent("page_view", mine);
    });

    // The caller still holds their own data untouched.
    expect(mine.page_path).toBe(DIRTY);
  });

  it("leaves params without a URL completely alone", () => {
    const { result } = harness(sink);
    act(() => {
      result.current.trackEvent("custom", { count: 3, label: "checkout", ok: true });
    });

    expect(seen).toHaveLength(1);
    expect((seen[0] as { params?: unknown }).params).toEqual({
      count: 3,
      label: "checkout",
      ok: true,
    });
  });

  it("scrubs the page_path the provider derives in trackPageView", () => {
    const { result } = harness(sink);
    act(() => {
      result.current.trackPageView(DIRTY, "Callback");
    });

    const wire = JSON.stringify(seen);
    expect(wire).not.toContain(CODE);
    expect(wire).not.toContain(TOKEN);
  });
});
