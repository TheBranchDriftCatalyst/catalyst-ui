/**
 * Unit tests for the listeners `initialize()` attaches to the global DOM.
 *
 * `setupUserJourneyTracking` builds a `click` handler on `document` and a
 * `popstate` handler on `window`, and returns the teardown for both. The call
 * site threw that teardown away, and the unmount effect only ever removed the
 * *error* listeners — so the journey handlers survived for the lifetime of the
 * page. Two consequences, both observable here:
 *
 * - an unmounted provider keeps recording journey steps forever, into whatever
 *   session happens to be current;
 * - React 19 StrictMode runs mount effects twice, so the provider attached a
 *   second handler on the second pass and every click produced two steps.
 *
 * The listeners are counted rather than inferred: a spy over
 * add/removeEventListener is the only way to tell "attached once" from
 * "attached twice and half-removed", and DOM listener identity is per-closure,
 * so a duplicate is not deduplicated by the platform.
 */

import { StrictMode } from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "./AnalyticsProvider";
import { useAnalytics } from "./AnalyticsContext";
import { storage } from "./storage";
import type {
  AnalyticsConfig,
  AnalyticsContextValue,
  AnalyticsSink,
  UserJourneyStep,
} from "./types";

const config: AnalyticsConfig = { debug: false, enableUserJourney: true };

/** Collects every journey step that reaches the fan-out. */
const collectingSink = () => {
  const steps: UserJourneyStep[] = [];
  const sink: AnalyticsSink = {
    id: "collector",
    label: "collector",
    config: {},
    journeyStep: (step: UserJourneyStep) => {
      steps.push(step);
    },
  };
  return { sink, steps };
};

type Registration = { target: "document" | "window"; type: string; listener: unknown };

/** Live registrations, as a multiset — identical types with different closures both count. */
const registrations: Registration[] = [];

const countOf = (target: Registration["target"], type: string) =>
  registrations.filter(r => r.target === target && r.type === type).length;

const spies: Array<{ mockRestore: () => void }> = [];

/** Wrap one target's add/remove so every registration is tracked and still real. */
const trackListeners = (target: EventTarget, name: Registration["target"]) => {
  const realAdd = target.addEventListener.bind(target);
  const realRemove = target.removeEventListener.bind(target);

  spies.push(
    vi.spyOn(target, "addEventListener").mockImplementation(((
      type: string,
      listener: unknown,
      options?: unknown
    ) => {
      registrations.push({ target: name, type, listener });
      return realAdd(type, listener as EventListener, options as AddEventListenerOptions);
    }) as typeof target.addEventListener)
  );

  spies.push(
    vi.spyOn(target, "removeEventListener").mockImplementation(((
      type: string,
      listener: unknown,
      options?: unknown
    ) => {
      const index = registrations.findIndex(
        r => r.target === name && r.type === type && r.listener === listener
      );
      if (index !== -1) registrations.splice(index, 1);
      return realRemove(type, listener as EventListener, options as EventListenerOptions);
    }) as typeof target.removeEventListener)
  );
};

const click = () => document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));

const mount = (sinks: AnalyticsSink[] = [], strict = false) => {
  const tree = (
    <AnalyticsProvider config={config} sinks={sinks}>
      <div>child</div>
    </AnalyticsProvider>
  );
  return render(strict ? <StrictMode>{tree}</StrictMode> : tree);
};

describe("AnalyticsProvider journey listeners", () => {
  beforeEach(() => {
    storage.clear();
    registrations.length = 0;
    trackListeners(document, "document");
    trackListeners(window, "window");
  });

  afterEach(() => {
    spies.splice(0).forEach(spy => spy.mockRestore());
    storage.clear();
  });

  it("attaches exactly one document click listener while mounted and none after unmount", () => {
    expect(countOf("document", "click")).toBe(0);

    const first = mount();
    expect(countOf("document", "click")).toBe(1);
    first.unmount();
    expect(countOf("document", "click")).toBe(0);

    // Twice, because a leak that is merely *replaced* on the second mount
    // would still read as 1 if we only ever looked once.
    const second = mount();
    expect(countOf("document", "click")).toBe(1);
    second.unmount();
    expect(countOf("document", "click")).toBe(0);
  });

  it("removes the popstate listener on unmount too", () => {
    const view = mount();
    expect(countOf("window", "popstate")).toBe(1);
    view.unmount();
    expect(countOf("window", "popstate")).toBe(0);
  });

  it("stops recording journey steps once unmounted", () => {
    const { sink, steps } = collectingSink();
    const view = mount([sink]);

    click();
    expect(steps).toHaveLength(1);

    view.unmount();
    click();
    expect(steps).toHaveLength(1);
  });

  it("attaches one click listener under StrictMode, not one per effect pass", () => {
    const { sink, steps } = collectingSink();
    const view = mount([sink], true);

    expect(countOf("document", "click")).toBe(1);

    click();
    expect(steps).toHaveLength(1);

    view.unmount();
    expect(countOf("document", "click")).toBe(0);
  });

  it("still removes the global error listeners on unmount", () => {
    const errorConfig: AnalyticsConfig = { debug: false, enableErrorTracking: true };
    const view = render(
      <AnalyticsProvider config={errorConfig} sinks={[]}>
        <div>child</div>
      </AnalyticsProvider>
    );

    expect(countOf("window", "error")).toBe(1);
    expect(countOf("window", "unhandledrejection")).toBe(1);

    view.unmount();
    expect(countOf("window", "error")).toBe(0);
    expect(countOf("window", "unhandledrejection")).toBe(0);
  });

  it("leaves nothing attached after a provider that never enabled journey tracking", () => {
    const view = render(
      <AnalyticsProvider config={{ debug: false }} sinks={[]}>
        <div>child</div>
      </AnalyticsProvider>
    );

    expect(countOf("document", "click")).toBe(0);
    view.unmount();
    expect(countOf("document", "click")).toBe(0);
  });

  it("ignores a second initialize() issued in the same render cycle", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const api: { current: AnalyticsContextValue | null } = { current: null };

    const Capture = () => {
      api.current = useAnalytics();
      return null;
    };

    // No `config` prop, so nothing auto-initializes and the two calls below are
    // the only ones — both made through the *same* render's closure.
    const view = render(
      <AnalyticsProvider sinks={[]}>
        <Capture />
      </AnalyticsProvider>
    );

    act(() => {
      api.current!.initialize(config);
      api.current!.initialize(config);
    });

    // This is the case the guard has to be a ref for. `setIsInitialized(true)`
    // is queued, not applied, so a guard reading the `isInitialized` state
    // still sees `false` on the second call and re-runs the whole of
    // `initialize`: a second click listener, a second session, a second
    // `init()` on every sink. A ref is updated in place, so the second call
    // sees what the first did.
    expect(countOf("document", "click")).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith("Analytics already initialized");

    view.unmount();
    expect(countOf("document", "click")).toBe(0);
    warnSpy.mockRestore();
  });
});
