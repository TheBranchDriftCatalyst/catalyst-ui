/**
 * Behavior tests for the SimpleGrid component (issue CUI-76a).
 *
 * SimpleGrid was previously an empty 0-byte file with a typo in its name
 * (`SimpleGird.tsx`). We rewrote it as a small responsive CSS-grid wrapper
 * and these tests assert it actually renders children, forwards refs, merges
 * className, applies the requested column / gap classes, and accepts both
 * scalar and responsive `columns` configs.
 */

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createRef } from "react";

import { SimpleGrid } from "./SimpleGrid";

describe("SimpleGrid", () => {
  it("renders children inside a grid container", () => {
    const { getByText, container } = render(
      <SimpleGrid data-testid="grid">
        <span>one</span>
        <span>two</span>
      </SimpleGrid>
    );
    expect(getByText("one")).toBeTruthy();
    expect(getByText("two")).toBeTruthy();
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("grid");
  });

  it("applies the requested numeric column count and gap", () => {
    const { container } = render(<SimpleGrid columns={4} gap={6} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("grid-cols-4");
    expect(root.className).toContain("gap-6");
  });

  it("applies responsive column classes when given a breakpoint map", () => {
    const { container } = render(<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("grid-cols-1");
    expect(root.className).toContain("md:grid-cols-2");
    expect(root.className).toContain("lg:grid-cols-4");
  });

  it("falls back to a responsive default when no columns prop is given", () => {
    const { container } = render(<SimpleGrid />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("grid-cols-1");
    expect(root.className).toContain("sm:grid-cols-2");
    expect(root.className).toContain("lg:grid-cols-3");
    // default gap
    expect(root.className).toContain("gap-4");
  });

  it("merges caller-provided className", () => {
    const { container } = render(<SimpleGrid className="custom-cls" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-cls");
    expect(root.className).toContain("grid");
  });

  it("forwards refs to the underlying div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SimpleGrid ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards arbitrary HTML attributes", () => {
    const { container } = render(<SimpleGrid id="my-grid" role="list" />);
    const root = container.firstChild as HTMLElement;
    expect(root.id).toBe("my-grid");
    expect(root.getAttribute("role")).toBe("list");
  });
});
