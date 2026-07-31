import { describe, expect, it } from "vitest";
import { paypal } from "../paypal";

describe("paypal adapter", () => {
  it("declares the expected shape", () => {
    const adapter = paypal({ handle: "djdaniels" });
    expect(adapter.id).toBe("paypal");
    expect(adapter.kind).toBe("link");
    expect(adapter.supportsAmount).toBe(true);
  });

  it("returns a bare paypal.me URL when no amount", () => {
    const info = paypal({ handle: "djdaniels" }).getDisplay!({});
    expect(info.href).toBe("https://paypal.me/djdaniels");
  });

  it("appends amount + currency when provided", () => {
    const info = paypal({ handle: "djdaniels" }).getDisplay!({ amount: 20, currency: "USD" });
    expect(info.href).toBe("https://paypal.me/djdaniels/20USD");
  });

  it("defaults currency to USD when omitted", () => {
    const info = paypal({ handle: "djdaniels" }).getDisplay!({ amount: 5 });
    expect(info.href).toBe("https://paypal.me/djdaniels/5USD");
  });

  it("uppercases the currency code", () => {
    const info = paypal({ handle: "djdaniels" }).getDisplay!({ amount: 10, currency: "eur" });
    expect(info.href).toBe("https://paypal.me/djdaniels/10EUR");
  });

  it("url-encodes the handle", () => {
    const info = paypal({ handle: "user name" }).getDisplay!({});
    expect(info.href).toBe("https://paypal.me/user%20name");
  });
});
