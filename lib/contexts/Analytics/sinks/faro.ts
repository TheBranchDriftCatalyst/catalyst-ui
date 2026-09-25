import type {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsSink,
  ErrorEvent,
  PerformanceMetric,
} from "../types";
import { storage } from "../storage";
import { scrubUrl } from "../scrub";

/**
 * Configuration for the {@link faro} sink.
 *
 * @public
 */
export interface FaroSinkConfig {
  /**
   * Collector path. Relative and same-origin by default, so the beacon needs
   * no CORS preflight and no credentials handling; an absolute URL here gives
   * both back.
   */
  endpoint?: string;
  /**
   * Value for `meta.app.name`. Defaults to the page hostname, which is what
   * the collector turns into the `app` Loki label — see the note on
   * {@link faro}.
   */
  appName?: string;
  /** Value for `meta.app.version`. Omitted from the payload when unset. */
  appVersion?: string;
  /** Value for `meta.app.environment`. Omitted from the payload when unset. */
  environment?: string;
  /** Signals buffered before an early flush. Default 50. */
  batchSize?: number;
  /** Milliseconds a partial batch waits before going out. Default 2000. */
  flushInterval?: number;
}

/**
 * A {@link faro} sink, plus the two controls batching makes necessary.
 *
 * @public
 */
export interface FaroSink extends AnalyticsSink<FaroSinkConfig> {
  /** Send everything buffered right now. Safe to call when empty. */
  flush(): void;
  /**
   * Detach the unload listeners and drop the buffer without sending it.
   *
   * {@link AnalyticsSink} has no teardown hook, so the provider never calls
   * this — it is for tests and for consumers that build a sink themselves.
   */
  dispose(): void;
}

const DEFAULT_ENDPOINT = "/catalyst-rum/collect";
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_FLUSH_INTERVAL = 2000;

/**
 * Browsers cap in-flight `keepalive` bodies at ~64KB per origin. Over the cap
 * `fetch` rejects outright and the whole batch is lost, so an oversized body
 * gives up surviving unload rather than giving up entirely.
 */
const KEEPALIVE_BODY_LIMIT = 60_000;

/** Faro's wire format. Only the keys this sink produces are modelled. */
interface FaroMeta {
  app: { name: string; version?: string; environment?: string };
  page?: { url: string };
  session?: { id: string; attributes?: Record<string, string> };
}

interface FaroEvent {
  name: string;
  timestamp: string;
  domain: string;
  attributes?: Record<string, string>;
}

interface FaroStackFrame {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
}

interface FaroException {
  type: string;
  value: string;
  timestamp: string;
  stacktrace?: { frames: FaroStackFrame[] };
  context?: Record<string, string>;
}

interface FaroMeasurement {
  type: string;
  timestamp: string;
  values: Record<string, number>;
  context?: Record<string, string>;
}

interface FaroTransportBody {
  meta: FaroMeta;
  events?: FaroEvent[];
  exceptions?: FaroException[];
  measurements?: FaroMeasurement[];
}

/** Faro timestamps are ISO-8601 with milliseconds, always UTC. */
const iso = (ms: number): string => new Date(ms).toISOString();

const noop = () => {};

/** JSON that survives a cycle, because a thrown transport is a lost batch. */
const safeJson = (value: object): string => {
  const seen = new WeakSet<object>();
  try {
    return (
      JSON.stringify(value, (_key, entry) => {
        if (entry !== null && typeof entry === "object") {
          if (seen.has(entry)) return "[Circular]";
          seen.add(entry);
        }
        return entry;
      }) ?? ""
    );
  } catch {
    return String(value);
  }
};

/**
 * Coerce a map to `Record<string, string>`.
 *
 * Faro's `context` and `attributes` are string maps on the receiving end and
 * `values` is a number map. Those two rules are inverses, and both fail
 * silently: the collector answers 202 unconditionally, so a number left in an
 * attributes map is dropped during unmarshalling with nothing to see in the
 * browser. Everything context-shaped goes through here; `values` deliberately
 * does not.
 */
const stringifyValues = (input?: Record<string, unknown>): Record<string, string> | undefined => {
  if (!input) return undefined;

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    out[key] =
      typeof value === "string"
        ? value
        : value !== null && typeof value === "object"
          ? safeJson(value)
          : String(value);
  }
  return Object.keys(out).length ? out : undefined;
};

/** `TypeError: boom` -> `TypeError`. Safari omits this line; hence the default. */
const EXCEPTION_NAME = /^([A-Za-z_$][\w$]*(?:Error|Exception))\b/;

const exceptionType = (stack?: string): string => {
  const first = stack?.split("\n", 1)[0]?.trim();
  const match = first ? EXCEPTION_NAME.exec(first) : null;
  return match?.[1] ?? "Error";
};

/**
 * `    at handleClick (/assets/index.js:42:17)` and the anonymous form.
 *
 * Lines with no `:line:col` (`at new Promise (<anonymous>)`) never match and
 * are dropped rather than sent as a frame with no location.
 */
const STACK_FRAME = /^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?\s*$/;

const parseFrames = (stack?: string): FaroStackFrame[] | undefined => {
  if (!stack) return undefined;

  const frames: FaroStackFrame[] = [];
  for (const line of stack.split("\n")) {
    const match = STACK_FRAME.exec(line);
    if (!match) continue;
    frames.push({
      filename: match[2],
      // Faro's own default for a frame it cannot name.
      function: match[1] ?? "?",
      lineno: Number(match[3]),
      colno: Number(match[4]),
    });
  }
  return frames.length ? frames : undefined;
};

const byteLength = (text: string): number =>
  typeof TextEncoder === "function" ? new TextEncoder().encode(text).byteLength : text.length;

/** 20 chars, matching what Faro's own transport puts in `Idempotency-Key`. */
const requestId = (): string =>
  `${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 12)}`;

/**
 * Grafana Faro sink.
 *
 * Hand-builds a Faro `TransportBody` and POSTs it to a same-origin collector.
 * Deliberately dependency-free: `@grafana/faro-web-sdk` is ~50KB of
 * instrumentation this provider already does itself, and the wire format is a
 * few hundred bytes of JSON.
 *
 * ### Stream mapping
 *
 * | Provider signal | Faro bucket     |
 * |-----------------|-----------------|
 * | `performance`   | `measurements`  |
 * | `error`         | `exceptions`    |
 * | `event`         | `events`        |
 * | session         | `meta.session`  |
 * | `journeyStep`   | *nothing*       |
 *
 * ### Why journey steps never leave
 *
 * There is no `journeyStep` method, and that is the point. A step's `target`
 * is `tagName#id.firstClass`, which is not a unique selector, so it cannot
 * reconstruct a session — it is not replay data, it only looks like it. Radix
 * generates fresh ids on every mount, so shipping them means unbounded label
 * cardinality in the log store for data nobody can join on. And a step records
 * the click's x/y coordinates. Journey stays in localStorage, where the
 * in-app dashboard reads it.
 *
 * ### Why no `pageView`
 *
 * `trackPageView` also emits a derived `page_view` event, which this sink
 * already ships. Implementing both would double-count every navigation.
 *
 * ### `meta.app.name`
 *
 * Defaults to the page hostname. The collector maps it to the `app` Loki
 * label; get it wrong and the label is empty, which makes every app's data
 * land in one undifferentiated stream.
 *
 * ### Failure behaviour
 *
 * Every transport failure is swallowed — rejected beacon, synchronous throw,
 * no `fetch` at all. Analytics must never be able to break the app it
 * measures, and localStorage collection is unaffected either way because the
 * provider writes there before any sink runs.
 *
 * @public
 */
export function faro(config: FaroSinkConfig = {}): FaroSink {
  const endpoint = config.endpoint ?? DEFAULT_ENDPOINT;
  const batchSize = config.batchSize ?? DEFAULT_BATCH_SIZE;
  const flushInterval = config.flushInterval ?? DEFAULT_FLUSH_INTERVAL;

  let enabled = false;
  let unloading = false;
  let sessionAttributes: Record<string, string> | undefined;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let detach: (() => void) | null = null;

  let events: FaroEvent[] = [];
  let exceptions: FaroException[] = [];
  let measurements: FaroMeasurement[] = [];

  const buffered = () => events.length + exceptions.length + measurements.length;

  const buildMeta = (): FaroMeta => {
    const hasWindow = typeof window !== "undefined";
    const meta: FaroMeta = {
      app: {
        name: config.appName ?? (hasWindow ? window.location.hostname : "unknown"),
        ...(config.appVersion ? { version: config.appVersion } : {}),
        ...(config.environment ? { environment: config.environment } : {}),
      },
    };

    // Path only. The full href carries the OAuth `?code=` / `#access_token=`
    // on the Authentik callback route — same leak the error record has, same
    // fix. See ../scrub.
    if (hasWindow) meta.page = { url: scrubUrl(window.location.href) };

    const session = storage.getSession();
    if (session) {
      meta.session = {
        id: session.sessionId,
        ...(sessionAttributes ? { attributes: sessionAttributes } : {}),
      };
    }

    return meta;
  };

  const post = (body: FaroTransportBody) => {
    try {
      if (typeof fetch !== "function") return;

      const payload = JSON.stringify(body);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Idempotency-Key": requestId(),
      };
      if (body.meta.session?.id) headers["x-faro-session-id"] = body.meta.session.id;

      const request = fetch(endpoint, {
        method: "POST",
        // During unload there is no future in which to retry, so the beacon
        // takes its chances; otherwise it stays inside the keepalive budget.
        keepalive: unloading || byteLength(payload) <= KEEPALIVE_BODY_LIMIT,
        headers,
        body: payload,
      });

      // Drain the body (some browsers hold the connection otherwise) and
      // swallow both outcomes. An unhandled rejection from a telemetry beacon
      // is the analytics layer breaking the app it is supposed to watch.
      void Promise.resolve(request).then(response => {
        void Promise.resolve(response?.text?.()).then(noop, noop);
      }, noop);
    } catch {
      // `fetch` can throw synchronously (bad URL, blocked scheme). Silent.
    }
  };

  const flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (!buffered()) return;

    const body: FaroTransportBody = { meta: buildMeta() };
    if (events.length) body.events = events;
    if (exceptions.length) body.exceptions = exceptions;
    if (measurements.length) body.measurements = measurements;

    events = [];
    exceptions = [];
    measurements = [];

    post(body);
  };

  const schedule = () => {
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      flush();
    }, flushInterval);
  };

  const enqueue = (add: () => void) => {
    if (!enabled) return;
    add();
    if (buffered() >= batchSize) flush();
    else schedule();
  };

  return {
    id: "faro",
    label: "Grafana Faro",
    config,

    init(analyticsConfig: AnalyticsConfig) {
      enabled = true;
      sessionAttributes = stringifyValues(analyticsConfig.customDimensions);

      if (typeof window === "undefined" || detach) return;

      // `pagehide`, not `unload`: `unload` breaks bfcache and does not fire
      // reliably on mobile Safari. `visibilitychange` is the more reliably
      // delivered of the two on mobile, so both are wired — a duplicate send
      // is what `Idempotency-Key` is for.
      const handleHide = () => {
        unloading = true;
        flush();
      };
      const handleVisibility = () => {
        if (document.visibilityState === "hidden") handleHide();
        else unloading = false;
      };
      const handleShow = () => {
        unloading = false;
      };

      window.addEventListener("pagehide", handleHide);
      window.addEventListener("pageshow", handleShow);
      document.addEventListener("visibilitychange", handleVisibility);

      detach = () => {
        window.removeEventListener("pagehide", handleHide);
        window.removeEventListener("pageshow", handleShow);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    },

    event(event: AnalyticsEvent) {
      enqueue(() =>
        events.push({
          name: event.name,
          timestamp: iso(event.timestamp),
          domain: "browser",
          ...(stringifyValues(event.params) ? { attributes: stringifyValues(event.params) } : {}),
        })
      );
    },

    error(error: ErrorEvent) {
      enqueue(() => {
        const frames = parseFrames(error.stack);
        const context = stringifyValues({
          ...error.context,
          // Our own taxonomy ("react" / "error" / "unhandledrejection"), which
          // is a different axis from Faro's `type` (the exception class).
          kind: error.type,
          // Already reduced to a path at collection time.
          url: error.url,
          componentStack: error.componentStack,
        });

        exceptions.push({
          type: exceptionType(error.stack),
          value: error.message,
          timestamp: iso(error.timestamp),
          ...(frames ? { stacktrace: { frames } } : {}),
          ...(context ? { context } : {}),
        });
      });
    },

    performance(metric: PerformanceMetric) {
      enqueue(() => {
        // Explicit picks, never a spread: `trackPerformance` is handed
        // `{ ...webVitalsMetric, timestamp }`, so the object carries `entries`
        // (arrays of PerformanceEntry), `id` and `navigationType` on top of
        // the declared type. Spreading ships all of it.
        measurements.push({
          type: "web-vitals",
          timestamp: iso(metric.timestamp),
          values: { [metric.name.toLowerCase()]: metric.value },
          ...(metric.rating ? { context: { rating: metric.rating } } : {}),
        });
      });
    },

    // No `journeyStep` and no `pageView` — both omissions are load-bearing.
    // See the module doc before adding either.

    flush,

    dispose() {
      enabled = false;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      events = [];
      exceptions = [];
      measurements = [];
      detach?.();
      detach = null;
    },
  };
}
