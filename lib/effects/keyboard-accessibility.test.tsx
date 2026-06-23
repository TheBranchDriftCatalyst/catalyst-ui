/**
 * Keyboard Accessibility Tests for Animation HOCs (CUI-10d)
 *
 * Validates that animation HOCs are reachable via Tab and operable via
 * Enter/Space (click trigger) or focus events (focus trigger), and that
 * aria-expanded/aria-hidden are wired correctly.
 *
 * These tests drive the components through real user events instead of
 * inspecting implementation details — i.e. we type Tab/Enter/Space and
 * assert visible/a11y state changed accordingly.
 */

import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnimatedFlip } from "./AnimatedFlip";
import { AnimatedFade } from "./AnimatedFade";
import { AnimatedSlide } from "./AnimatedSlide";
import { AnimatedBounce } from "./AnimatedBounce";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard/CodeFlipCard";

describe("Animation HOC keyboard accessibility (CUI-10d)", () => {
  describe("AnimatedFlip (uncontrolled, click trigger)", () => {
    it("is focusable via Tab and exposes role=button", async () => {
      const user = userEvent.setup();
      render(
        <AnimatedFlip
          front={<div data-testid="front">Front</div>}
          back={<div data-testid="back">Back</div>}
          trigger="click"
        />
      );

      // Container should be the focusable element with role=button
      const container = screen.getByRole("button");
      expect(container).toBeInTheDocument();

      await user.tab();
      expect(container).toHaveFocus();
    });

    it("toggles via Enter key when focused", async () => {
      const user = userEvent.setup();
      render(<AnimatedFlip front={<div>Front</div>} back={<div>Back</div>} trigger="click" />);

      const container = screen.getByRole("button");
      expect(container).toHaveAttribute("aria-expanded", "false");

      await user.tab();
      expect(container).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(container).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Enter}");
      expect(container).toHaveAttribute("aria-expanded", "false");
    });

    it("toggles via Space key when focused", async () => {
      const user = userEvent.setup();
      render(<AnimatedFlip front={<div>Front</div>} back={<div>Back</div>} trigger="click" />);

      const container = screen.getByRole("button");
      expect(container).toHaveAttribute("aria-expanded", "false");

      await user.tab();
      await user.keyboard(" ");
      expect(container).toHaveAttribute("aria-expanded", "true");
    });

    it("sets aria-hidden on the inactive face", () => {
      const { rerender } = render(
        <AnimatedFlip
          front={<div data-testid="front">Front</div>}
          back={<div data-testid="back">Back</div>}
          isFlipped={false}
        />
      );

      // Front face's parent div should have aria-hidden=false when not flipped
      const frontParent = screen.getByTestId("front").parentElement;
      const backParent = screen.getByTestId("back").parentElement;
      expect(frontParent).toHaveAttribute("aria-hidden", "false");
      expect(backParent).toHaveAttribute("aria-hidden", "true");

      rerender(
        <AnimatedFlip
          front={<div data-testid="front">Front</div>}
          back={<div data-testid="back">Back</div>}
          isFlipped={true}
        />
      );

      expect(screen.getByTestId("front").parentElement).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByTestId("back").parentElement).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("AnimatedFade (uncontrolled)", () => {
    it("toggles via Enter when trigger=click", async () => {
      const user = userEvent.setup();
      render(
        <AnimatedFade trigger="click">
          <div data-testid="fade-content">Hello</div>
        </AnimatedFade>
      );

      // Initially hidden (aria-hidden=true) — testing-library hides these from
      // role queries unless { hidden: true } is set. We pass it so we can
      // verify the keyboard interaction still flips aria-hidden to false.
      const container = screen.getByRole("button", { hidden: true });
      expect(container).toHaveAttribute("aria-hidden", "true");

      await user.tab();
      expect(container).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(container).toHaveAttribute("aria-hidden", "false");
    });

    it("shows on focus when trigger=focus", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button data-testid="before">Before</button>
          <AnimatedFade trigger="focus">
            <div>Fade content</div>
          </AnimatedFade>
        </>
      );

      const fadeWrapper = screen.getByText("Fade content").closest("[tabindex]") as HTMLElement;
      expect(fadeWrapper).toHaveAttribute("aria-hidden", "true");

      await user.tab(); // focus the before button
      await user.tab(); // focus the fade wrapper
      expect(fadeWrapper).toHaveFocus();
      expect(fadeWrapper).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("AnimatedSlide (uncontrolled)", () => {
    it("toggles via Space when trigger=click and aria-hidden reflects state", async () => {
      const user = userEvent.setup();
      render(
        <AnimatedSlide trigger="click" direction="left">
          <div>Slide content</div>
        </AnimatedSlide>
      );

      const container = screen.getByRole("button", { hidden: true });
      expect(container).toHaveAttribute("aria-hidden", "true");

      await user.tab();
      await user.keyboard(" ");
      expect(container).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("AnimatedBounce (uncontrolled, click trigger)", () => {
    it("is focusable and triggers via Enter", async () => {
      const user = userEvent.setup();
      render(
        <AnimatedBounce trigger="click" duration={50}>
          <span>Bounce target</span>
        </AnimatedBounce>
      );

      const container = screen.getByRole("button");

      await user.tab();
      expect(container).toHaveFocus();

      // Before keypress: not scaled
      expect(container.style.transform).toBe("scale(1)");

      await user.keyboard("{Enter}");
      // Immediately after Enter, should be scaled up
      expect(container.style.transform).not.toBe("scale(1)");
    });

    it("does not add tabIndex when trigger=hover", () => {
      render(
        <AnimatedBounce trigger="hover">
          <span>Hover bounce</span>
        </AnimatedBounce>
      );

      // No role=button, no tabindex — hover-only is not keyboard interactive
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("CodeFlipCard keyboard accessibility", () => {
    const sourceCode = `export const Foo = () => <div>Foo</div>;`;

    it("is focusable via Tab and dismissable with Escape", async () => {
      const user = userEvent.setup();
      render(
        <CodeFlipCard sourceCode={sourceCode} fileName="Foo.tsx">
          <div>Front rendering</div>
        </CodeFlipCard>
      );

      // The wrapper is a role=button with aria-expanded
      const wrapper = screen
        .getAllByRole("button")
        .find(el => el.getAttribute("aria-expanded") !== null) as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveAttribute("aria-expanded", "false");

      // Tab to the wrapper (first focusable)
      await user.tab();
      // The first tabbable could be the wrapper itself
      expect(wrapper).toHaveFocus();

      // Press Enter while wrapper is directly focused — should flip
      await user.keyboard("{Enter}");
      expect(wrapper).toHaveAttribute("aria-expanded", "true");

      // Press Escape — should unflip
      await user.keyboard("{Escape}");
      expect(wrapper).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("prefers-reduced-motion preservation", () => {
    it("AnimatedFlip still toggles via keyboard with reduced motion", async () => {
      // setup.ts mocks matchMedia → matches: false by default.
      // Override to simulate prefers-reduced-motion: reduce
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = ((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })) as typeof window.matchMedia;

      try {
        const user = userEvent.setup();
        render(
          <AnimatedFlip
            front={<div>Front</div>}
            back={<div>Back</div>}
            trigger="click"
            duration={500}
          />
        );

        const container = screen.getByRole("button");
        expect(container).toHaveAttribute("aria-expanded", "false");

        await user.tab();
        await user.keyboard("{Enter}");

        // Keyboard interaction still toggles state regardless of motion preference
        expect(container).toHaveAttribute("aria-expanded", "true");
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });
  });
});
