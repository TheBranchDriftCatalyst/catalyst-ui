import { describe, expect, it } from "vitest";
import { venmo } from "../venmo";

describe("venmo adapter", () => {
  it("declares the expected shape", () => {
    const adapter = venmo({ handle: "djdaniels" });
    expect(adapter.id).toBe("venmo");
    expect(adapter.kind).toBe("link");
    expect(adapter.currencies).toEqual(["USD"]);
  });

  it("emits both a web href and a venmo:// uri", () => {
    const info = venmo({ handle: "djdaniels" }).getDisplay!({});
    expect(info.href).toContain("https://venmo.com/?");
    expect(info.href).toContain("txn=pay");
    expect(info.href).toContain("recipients=djdaniels");
    expect(info.uri).toContain("venmo://paycharge?");
  });

  it("formats amount to two decimal places", () => {
    const info = venmo({ handle: "djdaniels" }).getDisplay!({ amount: 5 });
    expect(info.href).toContain("amount=5.00");
    expect(info.uri).toContain("amount=5.00");
  });

  it("attaches the message as `note`", () => {
    const info = venmo({ handle: "djdaniels" }).getDisplay!({ message: "coffee" });
    expect(info.href).toContain("note=coffee");
  });

  it("returns hint with @-prefixed handle", () => {
    const info = venmo({ handle: "djdaniels" }).getDisplay!({});
    expect(info.hint).toBe("@djdaniels");
  });
});
