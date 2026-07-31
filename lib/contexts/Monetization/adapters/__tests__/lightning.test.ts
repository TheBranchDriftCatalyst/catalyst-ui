import { describe, expect, it } from "vitest";
import { lightning } from "../lightning";

describe("lightning adapter", () => {
  const lnurl = "LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0F4X5CQZQ";

  it("declares the expected shape", () => {
    const adapter = lightning({ lnurl });
    expect(adapter.id).toBe("lightning");
    expect(adapter.kind).toBe("crypto-address");
    expect(adapter.supportsAmount).toBe(false);
    expect(adapter.currencies).toEqual(["BTC", "SATS"]);
  });

  it("wraps the LNURL in a lightning: URI", () => {
    const info = lightning({ lnurl }).getDisplay!({});
    expect(info.uri).toBe(`lightning:${lnurl}`);
    expect(info.qrValue).toBe(info.uri);
    expect(info.address).toBe(lnurl);
  });

  it("returns a scan-with-wallet hint", () => {
    const info = lightning({ lnurl }).getDisplay!({});
    expect(info.hint).toMatch(/lightning wallet/i);
  });
});
