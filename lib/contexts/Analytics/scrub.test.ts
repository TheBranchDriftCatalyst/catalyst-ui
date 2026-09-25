/**
 * Unit tests for the egress scrubber.
 *
 * `ErrorEvent.url` was `window.location.href` — the whole thing, query string
 * and fragment included. Behind Authentik that URL routinely carries an OAuth
 * `?code=` or `#access_token=`, so the moment a sink ships errors off the
 * device the record is a credential leak. These pin the reduction rule:
 * every absolute URL in an outbound error record collapses to its path.
 */

import { describe, expect, it } from "vitest";
import { scrubErrorEvent, scrubText, scrubUrl } from "./scrub";
import type { ErrorEvent } from "./types";

describe("scrubUrl", () => {
  it("drops the origin, query string and fragment", () => {
    expect(
      scrubUrl("https://catalyst.talos00/callback?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK")
    ).toBe("/callback");
  });

  it("keeps a path that has nothing to strip", () => {
    expect(scrubUrl("https://catalyst.talos00/dashboard/metrics")).toBe("/dashboard/metrics");
  });

  it("scrubs a relative href too", () => {
    expect(scrubUrl("/callback?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK")).toBe("/callback");
  });

  it("falls back to string surgery on an href URL refuses to parse", () => {
    // A malformed authority (`//[` is an unterminated IPv6 host) is the one
    // shape that actually makes `new URL` throw against a valid base -- free
    // text parses fine as a relative reference. The fallback must still cut
    // the query and fragment: failing to parse is no reason to ship a token.
    expect(scrubUrl("//[?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK")).toBe("//[");
  });

  it("strips the query off free text that happens to parse as a path", () => {
    expect(scrubUrl("not a url?code=AUTHZ_CODE_LEAK")).not.toContain("AUTHZ_CODE_LEAK");
  });

  it("passes an empty href through", () => {
    expect(scrubUrl("")).toBe("");
  });
});

describe("scrubText", () => {
  it("reduces an absolute URL embedded in free text", () => {
    expect(scrubText("failed to load https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK now")).toBe(
      "failed to load /cb now"
    );
  });

  it("reduces every frame of a stack, keeping line and column", () => {
    const stack = [
      "TypeError: boom",
      "    at handleClick (https://catalyst.talos00/assets/index.js:42:17)",
      "    at https://catalyst.talos00/callback?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK:1:1",
    ].join("\n");

    expect(scrubText(stack)).toBe(
      ["TypeError: boom", "    at handleClick (/assets/index.js:42:17)", "    at /callback"].join(
        "\n"
      )
    );
  });

  it("passes undefined through untouched", () => {
    expect(scrubText(undefined)).toBeUndefined();
  });
});

describe("scrubErrorEvent", () => {
  const base = (overrides: Partial<ErrorEvent> = {}): ErrorEvent => ({
    message: "boom",
    type: "react",
    userAgent: "test-agent",
    url: "https://catalyst.talos00/callback?code=AUTHZ_CODE_LEAK#access_token=BEARER_LEAK",
    timestamp: 1,
    ...overrides,
  });

  it("reduces url, message, stack and componentStack", () => {
    const scrubbed = scrubErrorEvent(
      base({
        message: "navigation to https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK failed",
        stack: "Error: x\n    at f (https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK:1:2)",
        componentStack: "\n    in Callback (at https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK)",
      })
    );

    expect(scrubbed.url).toBe("/callback");
    expect(JSON.stringify(scrubbed)).not.toContain("AUTHZ_CODE_LEAK");
    expect(JSON.stringify(scrubbed)).not.toContain("BEARER_LEAK");
  });

  it("reaches nested values inside context", () => {
    const scrubbed = scrubErrorEvent(
      base({
        context: {
          referrer: "https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK",
          nested: { deep: ["https://catalyst.talos00/cb#access_token=BEARER_LEAK"] },
          count: 3,
        },
      })
    );

    expect(JSON.stringify(scrubbed)).not.toContain("AUTHZ_CODE_LEAK");
    expect(JSON.stringify(scrubbed)).not.toContain("BEARER_LEAK");
    // Non-string values survive the walk unchanged.
    expect(scrubbed.context?.count).toBe(3);
    expect(scrubbed.context?.nested.deep[0]).toBe("/cb");
  });

  it("does not blow up on a circular context", () => {
    const cyclic: Record<string, unknown> = {
      url: "https://catalyst.talos00/cb?code=AUTHZ_CODE_LEAK",
    };
    cyclic.self = cyclic;

    const scrubbed = scrubErrorEvent(base({ context: cyclic }));

    expect(() => JSON.stringify(scrubbed)).not.toThrow();
    expect(JSON.stringify(scrubbed)).not.toContain("AUTHZ_CODE_LEAK");
  });

  it("leaves the caller's object alone", () => {
    const original = base();
    scrubErrorEvent(original);
    expect(original.url).toContain("AUTHZ_CODE_LEAK");
  });
});
