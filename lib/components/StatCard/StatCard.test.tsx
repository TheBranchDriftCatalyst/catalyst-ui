import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders name + value", () => {
    render(<StatCard name="Total time" value="13h 42m" />);
    expect(screen.getByText("Total time")).toBeInTheDocument();
    expect(screen.getByText("13h 42m")).toBeInTheDocument();
  });

  it("renders the optional subtitle when provided", () => {
    render(<StatCard name="X" value="Y" subtitle="+34% vs last week" />);
    expect(screen.getByText("+34% vs last week")).toBeInTheDocument();
  });

  it("omits the icon square entirely when no icon is passed", () => {
    const { container } = render(<StatCard name="X" value="Y" />);
    // Icon square uses `h-12 w-12` — a distinctive fingerprint no other
    // element in the tile shares. Its absence proves the branch didn't fire.
    expect(container.querySelector(".h-12.w-12")).toBeNull();
  });

  it("renders the icon slot when provided", () => {
    render(<StatCard name="X" value="Y" icon={<svg data-testid="glyph" />} />);
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("attaches a title tooltip on string/number values so long text is discoverable", () => {
    const { container } = render(<StatCard name="X" value="a-very-long-repo-name" />);
    const valueEl = container.querySelector('[title="a-very-long-repo-name"]');
    expect(valueEl).toBeTruthy();
  });

  it("omits the title tooltip for non-string values (they can be complex nodes)", () => {
    const { container } = render(<StatCard name="X" value={<span>nested</span>} />);
    const valueEl = container.querySelector("p.truncate");
    expect(valueEl?.getAttribute("title")).toBeNull();
  });
});
