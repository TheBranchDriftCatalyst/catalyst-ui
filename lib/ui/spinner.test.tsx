import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders with the default aria-label 'Loading'", () => {
    const { getByRole } = render(<Spinner />);
    expect(getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("honors a custom label", () => {
    const { getByRole } = render(<Spinner label="Saving…" />);
    expect(getByRole("status")).toHaveAttribute("aria-label", "Saving…");
  });

  it("applies size classes deterministically", () => {
    // SVG className is an SVGAnimatedString, not a plain string — read
    // getAttribute so the assertion works against a real DOMTokenList shape.
    const { rerender, getByRole } = render(<Spinner size="sm" />);
    expect(getByRole("status").getAttribute("class")).toMatch(/h-4/);
    rerender(<Spinner size="lg" />);
    expect(getByRole("status").getAttribute("class")).toMatch(/h-12/);
  });

  it("fill=true wraps the glyph in a centering block", () => {
    const { container } = render(<Spinner fill />);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toMatch(/h-full/);
    expect(wrapper.className).toMatch(/w-full/);
  });

  it("fill=false renders the glyph inline (no wrapper block)", () => {
    const { container } = render(<Spinner />);
    // With fill=false the top-level node is the SVG itself, not a wrapping div.
    expect(container.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });
});
