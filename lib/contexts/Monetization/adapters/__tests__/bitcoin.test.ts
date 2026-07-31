import { describe, expect, it } from "vitest";
import { bitcoin } from "../bitcoin";

describe("bitcoin adapter", () => {
  const address = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  it("declares the expected shape", () => {
    const adapter = bitcoin({ address });
    expect(adapter.id).toBe("bitcoin");
    expect(adapter.kind).toBe("crypto-address");
    expect(adapter.supportsAmount).toBe(true);
    expect(adapter.currencies).toEqual(["BTC"]);
  });

  it("returns the raw address in DisplayInfo", () => {
    const info = bitcoin({ address }).getDisplay!({});
    expect(info.address).toBe(address);
  });

  it("produces a bare bitcoin: URI when no amount / label", () => {
    const info = bitcoin({ address }).getDisplay!({});
    expect(info.uri).toBe(`bitcoin:${address}`);
    expect(info.qrValue).toBe(info.uri);
  });

  it("includes amount when currency is BTC", () => {
    const info = bitcoin({ address }).getDisplay!({ amount: 0.001, currency: "BTC" });
    expect(info.uri).toBe(`bitcoin:${address}?amount=0.001`);
  });

  it("defaults currency to BTC when omitted", () => {
    const info = bitcoin({ address }).getDisplay!({ amount: 0.5 });
    expect(info.uri).toContain("amount=0.5");
  });

  it("omits amount when currency is a fiat code", () => {
    const info = bitcoin({ address }).getDisplay!({ amount: 20, currency: "USD" });
    expect(info.uri).toBe(`bitcoin:${address}`);
  });

  it("bakes label into the URI when configured", () => {
    const info = bitcoin({ address, label: "Support DJ" }).getDisplay!({});
    expect(info.uri).toContain("label=Support+DJ");
  });

  it("passes the message through as BIP-21 param", () => {
    const info = bitcoin({ address }).getDisplay!({ message: "thanks" });
    expect(info.uri).toContain("message=thanks");
  });
});
