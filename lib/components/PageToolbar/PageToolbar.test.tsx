import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageToolbar } from "./PageToolbar";

describe("PageToolbar", () => {
  it("renders the title as an h1", () => {
    render(<PageToolbar title="Overview" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Overview");
  });

  it("renders the subtitle when provided", () => {
    render(<PageToolbar title="X" subtitle="descriptive tagline" />);
    expect(screen.getByText("descriptive tagline")).toBeInTheDocument();
  });

  it("renders the actions slot content", () => {
    render(
      <PageToolbar title="X">
        <button data-testid="action">Run</button>
      </PageToolbar>
    );
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });

  it("omits the actions container when no children are passed", () => {
    const { container } = render(<PageToolbar title="X" />);
    // Only the title-column div remains
    expect(container.firstElementChild!.childElementCount).toBe(1);
  });
});
