import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MonetizationProvider } from "./MonetizationProvider";
import { useMonetization } from "./useMonetization";
import { bitcoin } from "./adapters/bitcoin";
import { paypal } from "./adapters/paypal";
import type { MonetizationAdapter } from "./types";

describe("MonetizationProvider + useMonetization", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("throws when useMonetization is called outside the provider", () => {
    expect(() => renderHook(() => useMonetization())).toThrow(
      /must be used inside <MonetizationProvider>/
    );
  });

  it("exposes registered providers in order", () => {
    const providers = [bitcoin({ address: "bc1q..." }), paypal({ handle: "u" })];
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={providers}>{children}</MonetizationProvider>
      ),
    });
    expect(result.current.providers).toHaveLength(2);
    expect(result.current.providers[0].id).toBe("bitcoin");
    expect(result.current.providers[1].id).toBe("paypal");
  });

  it("looks providers up by id", () => {
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[bitcoin({ address: "bc1q..." })]}>
          {children}
        </MonetizationProvider>
      ),
    });
    expect(result.current.getProvider("bitcoin")?.label).toBe("Bitcoin");
    expect(result.current.getProvider("unknown")).toBeUndefined();
  });

  it("defaults currency to USD", () => {
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[]}>{children}</MonetizationProvider>
      ),
    });
    expect(result.current.defaultCurrency).toBe("USD");
  });

  it("respects a custom defaultCurrency", () => {
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[]} defaultCurrency="EUR">
          {children}
        </MonetizationProvider>
      ),
    });
    expect(result.current.defaultCurrency).toBe("EUR");
  });

  it("warns on duplicate provider ids", () => {
    renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[bitcoin({ address: "a" }), bitcoin({ address: "b" })]}>
          {children}
        </MonetizationProvider>
      ),
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/duplicate provider id "bitcoin"/));
  });

  it("initiate() throws for unknown providers", async () => {
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[]}>{children}</MonetizationProvider>
      ),
    });
    await expect(result.current.initiate("nope", {})).rejects.toThrow(/unknown provider id/);
  });

  it("initiate() throws when the provider does not implement it", async () => {
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[bitcoin({ address: "bc1q..." })]}>
          {children}
        </MonetizationProvider>
      ),
    });
    await expect(result.current.initiate("bitcoin", {})).rejects.toThrow(
      /does not implement initiate/
    );
  });

  it("initiate() forwards the call and merges defaultCurrency", async () => {
    const asyncAdapter: MonetizationAdapter = {
      id: "async",
      label: "Async",
      kind: "sdk-checkout",
      supportsAmount: true,
      config: {},
      initiate: vi.fn(async ctx => ({
        status: "pending" as const,
        sessionId: `s-${ctx.currency}`,
      })),
    };
    const { result } = renderHook(() => useMonetization(), {
      wrapper: ({ children }) => (
        <MonetizationProvider providers={[asyncAdapter]} defaultCurrency="EUR">
          {children}
        </MonetizationProvider>
      ),
    });
    const intent = await result.current.initiate("async", { amount: 42 });
    expect(intent.sessionId).toBe("s-EUR");
    expect(asyncAdapter.initiate).toHaveBeenCalledWith({ currency: "EUR", amount: 42 });
  });
});
