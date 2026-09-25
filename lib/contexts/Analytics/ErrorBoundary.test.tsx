/**
 * Unit tests for how AnalyticsErrorBoundary records what it catches.
 *
 * The boundary's `analytics` prop is documented as "optional, will use storage
 * directly if not provided" — either/or. The implementation did both: it built
 * and stored its own scrubbed record *and*, when the prop was present, called
 * `analytics.trackError`, which stores a second one. Every caught React error
 * therefore appeared twice in the dashboard and twice in Export, while only one
 * of the two copies ever reached a sink.
 *
 * It was latent while `app/App.tsx` rendered the boundary with no `analytics`
 * prop, but the sink fan-out made the asymmetry worse rather than better: the
 * duplicate is the copy sinks cannot see.
 */

import type { ReactNode } from "react";
import { render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { AnalyticsErrorBoundary } from "./ErrorBoundary";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type { AnalyticsConfig, AnalyticsSink, ErrorEvent } from "./types";

// No error tracking: a global listener would add records of its own and blur
// the very count under test.
const config: AnalyticsConfig = { debug: false };

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

const Boom = (): ReactNode => {
  throw new Error("render boom");
};

/** Renders the boundary wired to the surrounding provider, as a consumer would. */
const Wired = ({ children }: { children: ReactNode }) => {
  const analytics = useAnalytics();
  return (
    <AnalyticsErrorBoundary analytics={analytics} fallback={() => <div>failed</div>}>
      {children}
    </AnalyticsErrorBoundary>
  );
};

/** Mounts just the provider, for the cases that call `trackError` directly. */
const mountHook = (sinks: AnalyticsSink[]) =>
  renderHook(() => useAnalytics(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <AnalyticsProvider config={config} sinks={sinks}>
        {children}
      </AnalyticsProvider>
    ),
  });

describe("AnalyticsErrorBoundary error recording", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    storage.clear();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    storage.clear();
    errorSpy.mockRestore();
  });

  it("records a caught error exactly once when wired to an analytics context", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );

    expect(storage.getErrors()).toHaveLength(1);
    expect(errors).toHaveLength(1);
  });

  it("routes the wired record through the provider so sinks see it", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );

    const [stored] = storage.getErrors();
    expect(stored.message).toBe("render boom");
    expect(stored.type).toBe("react");
    // The sink sees the same record that was persisted, not a second variant.
    expect(errors[0]).toEqual(stored);
  });

  it("lands the component stack on the record's own field, not inside context", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );

    const [stored] = storage.getErrors();

    // The field, specifically. `trackError(error, context)` has no
    // componentStack parameter, so delegation can only hand it over as a
    // context key — and both readers this repo ships (`sinks/faro.ts` and the
    // Observability tab's "Component Stack" disclosure) read
    // `ErrorEvent.componentStack`. A stack that survives only inside `context`
    // is invisible to every one of them, which is why asserting on the
    // serialized record ("does the word appear anywhere") is not enough: that
    // is true of the broken shape too.
    expect(errors[0].componentStack).toBeTruthy();
    expect(errors[0].componentStack).toContain("Boom");
    expect(stored.componentStack).toBe(errors[0].componentStack);

    // Lifted, not copied: one stack per record, so nothing downstream has to
    // pick between two sources of the same truth.
    expect(errors[0].context?.componentStack).toBeUndefined();
  });

  it("puts the stack on the same field whether the boundary is wired or not", () => {
    const { sink } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );
    const [wired] = storage.getErrors();

    storage.clear();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <AnalyticsErrorBoundary fallback={() => <div>failed</div>}>
          <Boom />
        </AnalyticsErrorBoundary>
      </AnalyticsProvider>
    );
    const [unwired] = storage.getErrors();

    // The wired path is the one a library consumer is meant to use, so it must
    // not be the degraded one. Same field, same shape, either way.
    expect(unwired.componentStack).toBeTruthy();
    expect(wired.componentStack).toBeTruthy();
  });

  it("still records once on its own when no analytics context is passed", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <AnalyticsErrorBoundary fallback={() => <div>failed</div>}>
          <Boom />
        </AnalyticsErrorBoundary>
      </AnalyticsProvider>
    );

    expect(storage.getErrors()).toHaveLength(1);
    // Unwired, the boundary is the only writer — nothing reaches the fan-out.
    expect(errors).toHaveLength(0);
  });

  it("calls onError once per caught error, wired or not", () => {
    const onError = vi.fn();

    render(
      <AnalyticsProvider config={config} sinks={[]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );

    render(
      <AnalyticsProvider config={config} sinks={[]}>
        <AnalyticsErrorBoundary onError={onError} fallback={() => <div>failed</div>}>
          <Boom />
        </AnalyticsErrorBoundary>
      </AnalyticsProvider>
    );

    expect(onError).toHaveBeenCalledTimes(1);
  });
});

/**
 * The other half of the lift contract.
 *
 * `trackError(error, context)` has no `componentStack` parameter, so a
 * boundary that has one can only hand it over inside `context`, and the
 * provider lifts it back onto `ErrorEvent.componentStack`. A lift is a *move*,
 * and a move carries two obligations — the key must leave `context`, and
 * everything else in `context` must stay. The suite above pins only the first.
 *
 * The second is the one that regresses silently, because every assertion we
 * already own is satisfied by dropping the caller's remaining keys: the
 * fan-out tests ask which sink *methods* fired, and the PII tests ask whether
 * secrets are ABSENT from the serialized record — which a stripped `context`
 * satisfies trivially. So the whole diagnostic payload could stop reaching
 * Grafana and nothing would go red. That is the same failure this ticket is
 * about — data collected, stored, and invisible downstream — reintroduced one
 * layer up, which is why it gets assertions of its own rather than a comment.
 */
describe("trackError context lifting", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    storage.clear();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    storage.clear();
    errorSpy.mockRestore();
  });

  it("keeps the caller's other context keys when it lifts the stack out", () => {
    const { sink, errors } = collectingSink();
    const { result } = mountHook([sink]);

    result.current.trackError(new Error("boom"), {
      componentStack: "at Boom",
      scope: "test",
      attempt: 2,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].componentStack).toBe("at Boom");

    // The siblings are the whole reason a caller passes `context` at all, and
    // unlike the stack they have nowhere else on the record to go. Asserted
    // with toEqual, not toMatchObject: "context still has scope" stays true
    // while keys quietly vanish around it.
    expect(errors[0].context).toEqual({ scope: "test", attempt: 2 });

    // ...and the persisted copy is the same record, so Export and the
    // Observability tab see it too.
    expect(storage.getErrors()[0].context).toEqual({ scope: "test", attempt: 2 });
  });

  it("leaves no empty context behind when the stack was the only key", () => {
    const { sink, errors } = collectingSink();
    const { result } = mountHook([sink]);

    result.current.trackError(new Error("boom"), { componentStack: "at Boom" });

    expect(errors[0].componentStack).toBe("at Boom");
    // `{}` and "no context" carry the same information; the record should not
    // claim a context it does not have.
    expect(errors[0].context).toBeUndefined();
  });

  it("passes a context through untouched when it carries no stack", () => {
    const { sink, errors } = collectingSink();
    const { result } = mountHook([sink]);

    result.current.trackError(new Error("boom"), { scope: "test" });

    expect(errors[0].context).toEqual({ scope: "test" });
    expect(errors[0].componentStack).toBeUndefined();
  });

  it("preserves the marker the global error handler attaches", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={{ debug: false, enableErrorTracking: true }} sinks={[sink]}>
        <div />
      </AnalyticsProvider>
    );

    window.dispatchEvent(new ErrorEvent("error", { message: "global boom" }));

    expect(errors).toHaveLength(1);
    // `context.type` is how a triager tells a window-level error from a React
    // one; the record's own `type` is "react" for both, so dropping the marker
    // makes the two indistinguishable.
    expect(errors[0].context).toEqual({ type: "global" });
    expect(errors[0].type).toBe("react");
  });

  it("preserves the marker the unhandled-rejection handler attaches", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={{ debug: false, enableErrorTracking: true }} sinks={[sink]}>
        <div />
      </AnalyticsProvider>
    );

    window.dispatchEvent(
      new PromiseRejectionEvent("unhandledrejection", {
        promise: Promise.reject(new Error("rejected")).catch(() => undefined) as Promise<never>,
        reason: new Error("rejected"),
      })
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].context).toEqual({ type: "unhandled_rejection" });
  });

  it("records the delegating boundary with a lifted stack and no leftover context", () => {
    const { sink, errors } = collectingSink();

    render(
      <AnalyticsProvider config={config} sinks={[sink]}>
        <Wired>
          <Boom />
        </Wired>
      </AnalyticsProvider>
    );

    // The real delegation path, not a synthetic context: the boundary passes
    // `{ componentStack }` and nothing else.
    expect(errors[0].componentStack).toContain("Boom");
    expect(errors[0].context).toBeUndefined();
  });
});
