import { describe, expect, it } from "vitest";
import { kofi } from "../kofi";

describe("kofi adapter", () => {
  it("declares the expected shape", () => {
    const adapter = kofi({ handle: "djdaniels" });
    expect(adapter.id).toBe("kofi");
    expect(adapter.kind).toBe("link");
    expect(adapter.supportsAmount).toBe(false);
  });

  it("returns the ko-fi.com URL", () => {
    const info = kofi({ handle: "djdaniels" }).getDisplay!({});
    expect(info.href).toBe("https://ko-fi.com/djdaniels");
    expect(info.hint).toBe("ko-fi.com/djdaniels");
  });

  it("url-encodes the handle", () => {
    const info = kofi({ handle: "user/name" }).getDisplay!({});
    expect(info.href).toBe("https://ko-fi.com/user%2Fname");
  });
});
