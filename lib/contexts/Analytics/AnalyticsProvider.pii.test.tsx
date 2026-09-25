/**
 * Adversarial PII tests for the error record that leaves the device.
 *
 * `trackError` (AnalyticsProvider) and `componentDidCatch`
 * (AnalyticsErrorBoundary) both stamped `url: window.location.href` — the full
 * URL, query string and fragment included. These apps sit behind Authentik, so
 * that href routinely carries an OAuth `?code=` or an implicit-flow
 * `#access_token=`. While the record only ever reached localStorage that was
 * merely bad; with a network sink registered it is credential egress.
 *
 * Every assertion here runs against the SERIALIZED payload, not the object:
 * a secret that survives in some field nobody thought to check is exactly the
 * failure mode being defended against, and `toContain` on the JSON catches it
 * wherever it hides.
 */

import type { ReactNode } from "react";
import { render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { AnalyticsErrorBoundary } from "./ErrorBoundary";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type { AnalyticsConfig, AnalyticsSink, ErrorEvent } from "./types";

/** An OAuth callback URL of the shape Authentik actually hands back. */
const AUTHZ_CODE = "AUTHZ_CODE_LEAK";
const BEARER_TOKEN = "BEARER_TOKEN_LEAK";
const CALLBACK = `/callback?code=${AUTHZ_CODE}&state=xyz#access_token=${BEARER_TOKEN}`;

/** Collects everything handed to `error`, so we can serialize it. */
const collectingSink = () => {
  const errors: ErrorEvent[] = [];
  const sink: AnalyticsSink = {
    id: "collector",
    label: "collector",
    config: {},
    error: (error: ErrorEvent) => {
      errors.push(error);
    },
  };
  return { sink, errors };
};

const mount = (config: AnalyticsConfig, sinks: AnalyticsSink[]) =>
  renderHook(() => useAnalytics(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AnalyticsProvider config={config} sinks={sinks}>
        {children}
      </AnalyticsProvider>
    ),
  });

describe("AnalyticsProvider PII scrubbing", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    storage.clear();
    window.history.replaceState({}, "", CALLBACK);
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    storage.clear();
    window.history.replaceState({}, "", "/");
    errorSpy.mockRestore();
  });

  it("never lets the OAuth code or token reach a sink", () => {
    // Guard the fixture itself: if jsdom did not take the URL the test proves
    // nothing, so fail loudly here rather than passing vacuously.
    expect(window.location.href).toContain(AUTHZ_CODE);
    expect(window.location.href).toContain(BEARER_TOKEN);

    const { sink, errors } = collectingSink();
    const { result } = mount({ debug: false }, [sink]);

    result.current.trackError(new Error("boom"));

    expect(errors).toHaveLength(1);
    const serialized = JSON.stringify(errors[0]);
    expect(serialized).not.toContain(AUTHZ_CODE);
    expect(serialized).not.toContain(BEARER_TOKEN);
    // ...and the route is still there, so the scrub did not just blank it out.
    expect(errors[0].url).toBe("/callback");
  });

  it("scrubs a URL the caller smuggled in through the message or context", () => {
    const { sink, errors } = collectingSink();
    const { result } = mount({ debug: false }, [sink]);

    result.current.trackError(new Error(`fetch ${window.location.href} failed`), {
      referrer: window.location.href,
      nested: { href: window.location.href },
    });

    const serialized = JSON.stringify(errors[0]);
    expect(serialized).not.toContain(AUTHZ_CODE);
    expect(serialized).not.toContain(BEARER_TOKEN);
  });

  it("scrubs the global error handler path", () => {
    const { sink, errors } = collectingSink();
    mount({ debug: false, enableErrorTracking: true }, [sink]);

    window.dispatchEvent(new ErrorEvent("error", { message: "global boom" }));

    expect(errors.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(errors);
    expect(serialized).not.toContain(AUTHZ_CODE);
    expect(serialized).not.toContain(BEARER_TOKEN);
  });

  it("never persists the OAuth code or token to localStorage", () => {
    const { result } = mount({ debug: false }, []);

    result.current.trackError(new Error("boom"));

    const exported = result.current.exportData();
    expect(exported).not.toContain(AUTHZ_CODE);
    expect(exported).not.toContain(BEARER_TOKEN);
    expect(result.current.getErrors()[0]?.url).toBe("/callback");
  });

  it("scrubs the error boundary's own record", () => {
    const Boom = (): ReactNode => {
      throw new Error("render boom");
    };

    render(
      <AnalyticsErrorBoundary fallback={() => <div>failed</div>}>
        <Boom />
      </AnalyticsErrorBoundary>
    );

    const errors = storage.getErrors();
    expect(errors).toHaveLength(1);
    const serialized = JSON.stringify(errors[0]);
    expect(serialized).not.toContain(AUTHZ_CODE);
    expect(serialized).not.toContain(BEARER_TOKEN);
    expect(errors[0].url).toBe("/callback");
  });
});
