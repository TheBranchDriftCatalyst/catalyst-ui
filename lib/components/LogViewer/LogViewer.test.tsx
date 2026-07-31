import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogViewer, type LogViewerLine } from "./LogViewer";

const seed: LogViewerLine[] = [
  { id: 1, ts: "2026-07-31T20:00:00Z", level: "info", message: "boot" },
  { id: 2, ts: "2026-07-31T20:00:01Z", level: "error", message: "boom", attrs: { code: "23505" } },
];

describe("LogViewer", () => {
  it("renders the empty state when logs is empty", () => {
    render(<LogViewer logs={[]} emptyText="nothing yet" />);
    expect(screen.getByText("nothing yet")).toBeInTheDocument();
  });

  it("renders one row per log line with message + level chip", () => {
    render(<LogViewer logs={seed} />);
    expect(screen.getByText("boot")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
    // The [level] chip is rendered inline; grep by the bracketed literal.
    expect(screen.getByText("[info]")).toBeInTheDocument();
    expect(screen.getByText("[error]")).toBeInTheDocument();
  });

  it("renders attrs as k=v tail on the line", () => {
    render(<LogViewer logs={seed} />);
    expect(screen.getByText(/code=23505/)).toBeInTheDocument();
  });

  it("applies the default error palette (text-red-400) to error lines", () => {
    render(<LogViewer logs={seed} />);
    expect(screen.getByText("[error]").className).toMatch(/text-red-400/);
  });

  it("honors custom levelColors override for unknown levels", () => {
    render(
      <LogViewer
        logs={[{ id: 1, ts: "x", level: "trace", message: "hi" }]}
        levelColors={{ trace: "text-cyan-500" }}
      />
    );
    expect(screen.getByText("[trace]").className).toMatch(/text-cyan-500/);
  });

  it("honors a custom formatTs", () => {
    render(
      <LogViewer
        logs={[{ id: 1, ts: "123", level: "info", message: "x" }]}
        formatTs={t => `T=${t}`}
      />
    );
    expect(screen.getByText(/T=123/)).toBeInTheDocument();
  });

  it("hides the Jump-to-latest button while pinned at bottom", () => {
    render(<LogViewer logs={seed} />);
    // Initially pinned (default state) — no button visible.
    expect(screen.queryByRole("button", { name: /Jump to latest/i })).toBeNull();
  });

  it("surfaces the Jump-to-latest button once the user scrolls up", () => {
    const { container } = render(<LogViewer logs={seed} />);
    const scroller = container.querySelector('[role="log"]') as HTMLDivElement;
    // Force a "user scrolled up" state by making the distance > 40 and firing scroll.
    Object.defineProperty(scroller, "scrollHeight", { value: 500, configurable: true });
    Object.defineProperty(scroller, "clientHeight", { value: 200, configurable: true });
    Object.defineProperty(scroller, "scrollTop", { value: 100, configurable: true });
    fireEvent.scroll(scroller);
    expect(screen.getByRole("button", { name: /Jump to latest/i })).toBeInTheDocument();
  });
});
