/**
 * Egress scrubbing for analytics records.
 *
 * The provider stamps every error with the page it happened on. That used to
 * be `window.location.href` — the whole thing, query string and fragment
 * included. These apps sit behind Authentik, so that href routinely carries an
 * OAuth `?code=` on the callback route and, for implicit flows, an
 * `#access_token=` fragment. While the record only ever reached localStorage
 * that was merely untidy; the moment a network sink is registered it is
 * credential egress, and the collector operator gets to read tokens for a
 * user they are not.
 *
 * ### The rule
 *
 * Any absolute URL anywhere in an outbound error record collapses to its
 * path. `https://app/callback?code=X#access_token=Y` becomes `/callback`.
 * Path is what makes an error triageable ("errors on /checkout"); origin is
 * constant per deployment, and query plus fragment are where the secrets are.
 *
 * ### Why scrub at collection, not at the sink
 *
 * Scrubbing here means the invariant holds for every sink — including ones
 * this repo never sees — and for localStorage and the Export button, which a
 * user can hand to anyone. A sink-side scrub would have to be reimplemented,
 * correctly, in every sink, and would be one forgetful third-party sink away
 * from leaking. The record is scrubbed before it is stored, so there is no
 * moment at which the unscrubbed form exists anywhere but the local variable
 * that built it.
 *
 * ### What this does not promise
 *
 * Fields the *application* fills in are the application's own business. The
 * URL reduction below is applied to them as defense in depth, but a secret
 * the caller hand-writes into an error message in some format we cannot
 * recognise will pass through. The guarantee is over provider-derived fields.
 *
 * @module
 */

import type { ErrorEvent } from "./types";

/**
 * An absolute http(s) URL embedded in free text.
 *
 * `)` is excluded along with the quote/bracket/whitespace set because stack
 * frames wrap the URL in parentheses (`at fn (https://host/x.js:1:2)`) and a
 * captured trailing paren would survive into the scrubbed path.
 */
const ABSOLUTE_URL = /https?:\/\/[^\s"'`<>\\)]+/gi;

/** Depth past which a context object is replaced rather than walked. */
const MAX_DEPTH = 6;

/**
 * Reduce a URL to its path, dropping origin, query string and fragment.
 *
 * Accepts relative hrefs too — the base below only exists to satisfy `URL`
 * and is discarded with the rest of the origin.
 *
 * @public
 */
export function scrubUrl(href: string): string {
  if (!href) return href;

  try {
    return new URL(href, "http://scrubbed.invalid").pathname;
  } catch {
    // Not URL-shaped. Still cut at the first `?` or `#`: failing to parse is
    // no reason to ship the part of the string most likely to hold a secret.
    return href.split(/[?#]/, 1)[0] ?? "";
  }
}

/**
 * Rewrite every absolute URL inside a string to its path.
 *
 * Used on stacks and messages: a stack frame from an inline script carries the
 * document URL as its filename, which on the OAuth callback route is the
 * credential-bearing href.
 *
 * @public
 */
export function scrubText<T extends string | undefined>(text: T): T {
  if (typeof text !== "string") return text;
  return text.replace(ABSOLUTE_URL, match => scrubUrl(match)) as T;
}

/**
 * Walk an arbitrary value, scrubbing every string it contains.
 *
 * Cycles and over-deep branches are replaced with a marker rather than
 * returned as-is: handing back the original object would let an unscrubbed
 * string escape through the very field the depth guard was protecting, and a
 * cycle would blow up `JSON.stringify` in the transport later.
 */
function scrubValue(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (typeof value === "string") return scrubText(value);
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  if (depth >= MAX_DEPTH) return "[Truncated]";

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map(entry => scrubValue(entry, seen, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    out[key] = scrubValue(entry, seen, depth + 1);
  }
  return out;
}

/**
 * Return a copy of an arbitrary params/attributes bag safe to hand to a sink.
 *
 * Same reduction as {@link scrubErrorEvent}'s `context` walk, exposed for the
 * event path. `sinks/faro.ts` ships `event.params` verbatim as Faro
 * attributes, so without this an event was a straight hole in the guarantee
 * the module header makes.
 *
 * The concrete case that forced it: `trackPageView` derives
 * `params.page_path` from whatever path string it is handed, and
 * `usePageTracking` lets a consumer pass `location.pathname +
 * location.search`. These apps sit behind Authentik, so that is an OAuth
 * `?code=` on the callback route.
 *
 * The input is never mutated — callers keep their own object.
 *
 * @public
 */
export function scrubParams<T extends Record<string, unknown> | undefined>(params: T): T {
  if (!params) return params;
  return scrubValue(params, new WeakSet(), 0) as T;
}

/**
 * Return a copy of an error record safe to hand to a sink.
 *
 * Every string is reduced, `context` included and to arbitrary depth, so a
 * secret cannot survive by hiding in a field no one thought to check. The
 * input is never mutated — callers may still hold the raw error.
 *
 * @public
 */
export function scrubErrorEvent(event: ErrorEvent): ErrorEvent {
  return {
    ...event,
    message: scrubText(event.message),
    stack: scrubText(event.stack),
    componentStack: scrubText(event.componentStack),
    url: scrubUrl(event.url),
    context: event.context
      ? (scrubValue(event.context, new WeakSet(), 0) as ErrorEvent["context"])
      : event.context,
  };
}
