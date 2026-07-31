import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LabeledStat } from "./labeled-stat";

describe("LabeledStat", () => {
  it("renders the label + value pair", () => {
    render(<LabeledStat label="Rows" value="12,441" />);
    expect(screen.getByText("Rows")).toBeInTheDocument();
    expect(screen.getByText("12,441")).toBeInTheDocument();
  });

  it("accepts ReactNode values (not just strings)", () => {
    render(<LabeledStat label="Status" value={<span data-testid="pill">OK</span>} />);
    expect(screen.getByTestId("pill")).toBeInTheDocument();
  });

  it("mono variant applies font-mono to the value", () => {
    render(<LabeledStat label="X" value="Y" />);
    expect(screen.getByText("Y").className).toMatch(/font-mono/);
  });

  it("text variant omits font-mono", () => {
    render(<LabeledStat label="X" value="Y" variant="text" />);
    expect(screen.getByText("Y").className).not.toMatch(/font-mono/);
  });

  it("align='right' adds text-right to the wrapper", () => {
    const { container } = render(<LabeledStat label="X" value="Y" align="right" />);
    expect(container.firstElementChild!.className).toMatch(/text-right/);
  });
});
