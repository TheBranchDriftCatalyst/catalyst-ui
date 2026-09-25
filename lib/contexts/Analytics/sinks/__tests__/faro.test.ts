/**
 * Unit tests for the Grafana Faro sink.
 *
 * The sink is dependency-free: it hand-builds a Faro `TransportBody` and POSTs
 * it to a same-origin collector. Everything asserted here is a property of
 * that wire format, and each one has a silent failure mode behind it -- the
 * collector answers 202 unconditionally, so a malformed body looks healthy
 * while the line never lands.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { faro } from "../faro";
import { storage } from "../../storage";
import type { ErrorEvent, PerformanceMetric } from "../../types";

type FetchCall = [string, RequestInit];

const okResponse = () => ({
  ok: true,
  status: 202,
  headers: { get: () => null },
  text: () => Promise.resolve(""),
});

describe("faro sink", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let disposers: Array<() => void>;

  const bodyOf = (call: FetchCall) => JSON.parse(String(call[1].body));
  const calls = () => fetchMock.mock.calls as unknown as FetchCall[];

  /** Build + init a sink, registering its teardown for this test. */
  const start = (config: Parameters<typeof faro>[0] = {}) => {
    const sink = faro({ batchSize: 1, ...config });
    disposers.push(() => sink.dispose());
    sink.init!({ debug: false });
    return sink;
  };

  beforeEach(() => {
    storage.clear();
    disposers = [];
    fetchMock = vi.fn(() => Promise.resolve(okResponse()));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    disposers.forEach(dispose => dispose());
    vi.unstubAllGlobals();
    storage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("declares the expected shape", () => {
    const sink = faro();
    expect(sink.id).toBe("faro");
    expect(sink.label).toBe("Grafana Faro");
    // User journey is deliberately not shipped -- see the module doc.
    expect(sink.journeyStep).toBeUndefined();
    // Page views arrive as the derived `page_view` event; a `pageView` method
    // would ship every navigation twice.
    expect(sink.pageView).toBeUndefined();
  });

  it("stays inert until init", () => {
    const sink = faro({ batchSize: 1 });
    disposers.push(() => sink.dispose());

    sink.event!({ name: "too-early", timestamp: 1 });
    sink.flush();
    expect(fetchMock).not.toHaveBeenCalled();

    sink.init!({ debug: false });
    sink.event!({ name: "now", timestamp: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("posts to the same-origin collector with a keepalive beacon", () => {
    const sink = start();
    sink.event!({ name: "click", timestamp: 1 });

    const [url, init] = calls()[0];
    expect(url).toBe("/catalyst-rum/collect");
    expect(init.method).toBe("POST");
    expect(init.keepalive).toBe(true);
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["Idempotency-Key"]).toEqual(expect.any(String));
    // Same-origin by construction: no mode/credentials, nothing to preflight.
    expect(init.mode).toBeUndefined();
    expect(init.credentials).toBeUndefined();
  });

  it("honours a custom endpoint", () => {
    const sink = start({ endpoint: "/other/collect" });
    sink.event!({ name: "click", timestamp: 1 });
    expect(calls()[0][0]).toBe("/other/collect");
  });

  it("stamps meta.app.name with the page hostname", () => {
    const sink = start();
    sink.event!({ name: "click", timestamp: 1 });
    // Without this the Loki `app` label is empty and nothing is queryable
    // per-app.
    expect(bodyOf(calls()[0]).meta.app.name).toBe(window.location.hostname);
  });

  it("scrubs the page URL it puts in meta", () => {
    window.history.replaceState({}, "", "/callback?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK");
    const sink = start();
    sink.event!({ name: "click", timestamp: 1 });

    const raw = String(calls()[0][1].body);
    expect(raw).not.toContain("AUTHZ_CODE_LEAK");
    expect(raw).not.toContain("BEARER_LEAK");
    expect(bodyOf(calls()[0]).meta.page.url).toBe("/callback");
  });

  it("carries the live session id in meta and in the header", () => {
    storage.setSession({
      sessionId: "session-42",
      startTime: 1,
      lastActivity: 1,
      pageViews: 0,
      eventCount: 0,
      journey: [],
    });

    const sink = start();
    sink.event!({ name: "click", timestamp: 1 });

    const [, init] = calls()[0];
    expect(bodyOf(calls()[0]).meta.session).toEqual({ id: "session-42" });
    expect((init.headers as Record<string, string>)["x-faro-session-id"]).toBe("session-42");
  });

  it("maps a web-vitals metric to a measurement, dropping the SDK internals", () => {
    const sink = start();

    // What `trackPerformance` actually receives: the whole web-vitals Metric
    // spread, which is wider than PerformanceMetric.
    const metric = {
      name: "LCP",
      value: 1200,
      rating: "good",
      delta: 1200,
      timestamp: Date.UTC(2026, 0, 2, 3, 4, 5),
      id: "v5-1736-8829",
      navigationType: "navigate",
      entries: [{ startTime: 1, duration: 2, entryType: "largest-contentful-paint" }],
    } as unknown as PerformanceMetric;

    sink.performance!(metric);

    const body = bodyOf(calls()[0]);
    expect(body.measurements).toEqual([
      {
        type: "web-vitals",
        timestamp: "2026-01-02T03:04:05.000Z",
        values: { lcp: 1200 },
        context: { rating: "good" },
      },
    ]);

    // Spreading the metric would have shipped PerformanceEntry arrays.
    const raw = String(calls()[0][1].body);
    expect(raw).not.toContain("navigationType");
    expect(raw).not.toContain("entries");
    expect(raw).not.toContain("v5-1736-8829");
    expect(raw).not.toContain("largest-contentful-paint");
  });

  it("keeps measurement values numeric and context values stringy", () => {
    const sink = start();
    sink.performance!({ name: "CLS", value: 0.05, rating: "good", timestamp: 1 });

    const measurement = bodyOf(calls()[0]).measurements[0];
    // These two rules are inverses and both fail silently behind the 202.
    expect(typeof measurement.values.cls).toBe("number");
    expect(typeof measurement.context.rating).toBe("string");
  });

  it("maps an error to a Faro exception with parsed frames", () => {
    const sink = start();
    const error: ErrorEvent = {
      message: "cannot read x",
      stack: [
        "TypeError: cannot read x",
        "    at handleClick (/assets/index.js:42:17)",
        "    at new Promise (<anonymous>)",
        "    at /assets/index.js:9:3",
      ].join("\n"),
      type: "react",
      userAgent: "test-agent",
      url: "/checkout",
      timestamp: Date.UTC(2026, 0, 2, 3, 4, 5),
      context: { scope: "cart" },
    };

    sink.error!(error);

    const exception = bodyOf(calls()[0]).exceptions[0];
    // `type` is the exception class, `value` the message -- there is no
    // `message` key on a Faro exception and one would be silently dropped.
    expect(exception.type).toBe("TypeError");
    expect(exception.value).toBe("cannot read x");
    expect(exception.message).toBeUndefined();
    expect(exception.timestamp).toBe("2026-01-02T03:04:05.000Z");
    expect(exception.stacktrace.frames).toEqual([
      { filename: "/assets/index.js", function: "handleClick", lineno: 42, colno: 17 },
      { filename: "/assets/index.js", function: "?", lineno: 9, colno: 3 },
    ]);
    expect(exception.context).toMatchObject({ scope: "cart", kind: "react", url: "/checkout" });
  });

  it("omits stacktrace entirely when the error carries no stack", () => {
    const sink = start();
    sink.error!({
      message: "boom",
      type: "react",
      userAgent: "test-agent",
      url: "/",
      timestamp: 1,
    });

    expect(bodyOf(calls()[0]).exceptions[0].stacktrace).toBeUndefined();
  });

  it("omits stacktrace entirely when no line of the stack parses as a frame", () => {
    const sink = start();
    // The case above exits `parseFrames` at its `if (!stack)` guard, so it
    // never reaches the empty-list check and cannot pin it. Here every line is
    // location-less, so the frame list is built and comes out empty -- and an
    // empty array is truthy, so returning it instead of `undefined` ships
    // `stacktrace: { frames: [] }`. The collector answers 202 either way.
    sink.error!({
      message: "boom",
      stack: ["Error: boom", "    at new Promise (<anonymous>)", "    at <anonymous>"].join("\n"),
      type: "react",
      userAgent: "test-agent",
      url: "/",
      timestamp: 1,
    });

    expect(bodyOf(calls()[0]).exceptions[0].stacktrace).toBeUndefined();
  });

  it("stringifies every event attribute", () => {
    const sink = start();
    sink.event!({
      name: "purchase",
      params: { value: 3, ok: true, cart: { items: 2 }, skip: undefined },
      timestamp: 1,
    });

    const event = bodyOf(calls()[0]).events[0];
    expect(event.name).toBe("purchase");
    expect(event.domain).toBe("browser");
    // The collector unmarshals attributes into map[string]string; a raw number
    // is dropped without a word behind the blanket 202.
    expect(event.attributes).toEqual({ value: "3", ok: "true", cart: '{"items":2}' });
  });

  it("batches a window of signals into a single POST", () => {
    const sink = start({ batchSize: 100 });

    sink.event!({ name: "a", timestamp: 1 });
    sink.event!({ name: "b", timestamp: 2 });
    sink.performance!({ name: "TTFB", value: 12, timestamp: 3 });
    sink.error!({ message: "boom", type: "react", userAgent: "t", url: "/", timestamp: 4 });
    expect(fetchMock).not.toHaveBeenCalled();

    sink.flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = bodyOf(calls()[0]);
    expect(body.events).toHaveLength(2);
    expect(body.measurements).toHaveLength(1);
    expect(body.exceptions).toHaveLength(1);
    // `traces` is an object in this format, not an array -- omit it entirely
    // rather than sending an empty one of the wrong shape.
    expect(body.traces).toBeUndefined();
    expect(body.logs).toBeUndefined();
  });

  it("flushes on its own once the batch fills", () => {
    const sink = start({ batchSize: 2 });
    sink.event!({ name: "a", timestamp: 1 });
    expect(fetchMock).not.toHaveBeenCalled();
    sink.event!({ name: "b", timestamp: 2 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("flushes on the batch interval", async () => {
    vi.useFakeTimers();
    try {
      const sink = start({ batchSize: 100, flushInterval: 50 });
      sink.event!({ name: "a", timestamp: 1 });
      expect(fetchMock).not.toHaveBeenCalled();
      vi.advanceTimersByTime(50);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("flushes what is buffered when the page goes away", () => {
    const sink = start({ batchSize: 100 });
    sink.event!({ name: "a", timestamp: 1 });
    expect(fetchMock).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("pagehide"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(calls()[0][1].keepalive).toBe(true);
  });

  it("sends nothing when there is nothing buffered", () => {
    const sink = start();
    sink.flush();
    sink.flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stops listening once disposed", () => {
    const sink = faro({ batchSize: 100 });
    sink.init!({ debug: false });
    sink.event!({ name: "a", timestamp: 1 });
    sink.dispose();

    window.dispatchEvent(new Event("pagehide"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("detaches its unload listeners on dispose", () => {
    // The assertion above is over-determined: `dispose` also drops the buffer,
    // so a still-attached `pagehide` handler would flush nothing and the test
    // would pass anyway. Count the detach itself, or "stops listening" is only
    // ever proving "stopped buffering".
    const windowRemove = vi.spyOn(window, "removeEventListener");
    const documentRemove = vi.spyOn(document, "removeEventListener");
    try {
      const sink = faro({ batchSize: 100 });
      sink.init!({ debug: false });
      sink.dispose();

      const removed = [...windowRemove.mock.calls, ...documentRemove.mock.calls].map(call =>
        String(call[0])
      );
      expect(removed).toEqual(expect.arrayContaining(["pagehide", "pageshow", "visibilitychange"]));
    } finally {
      windowRemove.mockRestore();
      documentRemove.mockRestore();
    }
  });

  it("drops the buffer on dispose rather than sending it later", () => {
    const sink = start({ batchSize: 100 });
    sink.event!({ name: "a", timestamp: 1 });
    sink.dispose();

    // Re-arming the sink must not resurrect what dispose threw away.
    sink.init!({ debug: false });
    sink.flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows a rejected beacon", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("collector down")));
    const sink = start();

    expect(() => sink.event!({ name: "a", timestamp: 1 })).not.toThrow();
    // An unhandled rejection here would fail the run outright.
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("swallows a fetch that throws synchronously", () => {
    fetchMock.mockImplementation(() => {
      throw new TypeError("Failed to fetch");
    });
    const sink = start();

    expect(() => sink.event!({ name: "a", timestamp: 1 })).not.toThrow();
  });

  it("drops keepalive rather than exceeding the browser's beacon budget", () => {
    const sink = start({ batchSize: 100 });
    // The per-origin keepalive quota is ~64KB; over it fetch rejects outright
    // and the whole batch is lost.
    sink.event!({ name: "big", params: { blob: "x".repeat(70_000) }, timestamp: 1 });
    sink.flush();

    expect(calls()[0][1].keepalive).toBe(false);
  });
});
