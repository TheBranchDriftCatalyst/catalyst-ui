import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAnimationTriggers } from "./useAnimationTriggers";
import type { AnimationTrigger } from "@/catalyst-ui/effects/types";

describe("useAnimationTriggers", () => {
  describe("Hover trigger", () => {
    it("should call setState(true) on mouse enter when trigger is hover", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      result.current.handleMouseEnter();

      expect(setState).toHaveBeenCalledWith(true);
      expect(setState).toHaveBeenCalledTimes(1);
    });

    it("should call setState(false) on mouse leave when trigger is hover", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      result.current.handleMouseLeave();

      expect(setState).toHaveBeenCalledWith(false);
      expect(setState).toHaveBeenCalledTimes(1);
    });

    it("should not call setState on click when trigger is hover", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      result.current.handleClick();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should handle rapid mouse enter/leave events", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      result.current.handleMouseEnter();
      result.current.handleMouseLeave();
      result.current.handleMouseEnter();
      result.current.handleMouseLeave();

      expect(setState).toHaveBeenCalledTimes(4);
      expect(setState).toHaveBeenNthCalledWith(1, true);
      expect(setState).toHaveBeenNthCalledWith(2, false);
      expect(setState).toHaveBeenNthCalledWith(3, true);
      expect(setState).toHaveBeenNthCalledWith(4, false);
    });
  });

  describe("Click trigger", () => {
    it("should call setState with toggle function on click when trigger is click", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("click", setState));

      result.current.handleClick();

      expect(setState).toHaveBeenCalledTimes(1);
      // Verify it's a function
      const toggleFn = setState.mock.calls[0][0];
      expect(typeof toggleFn).toBe("function");

      // Verify the toggle function works correctly
      expect(toggleFn(false)).toBe(true);
      expect(toggleFn(true)).toBe(false);
    });

    it("should not call setState on mouse enter when trigger is click", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("click", setState));

      result.current.handleMouseEnter();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should not call setState on mouse leave when trigger is click", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("click", setState));

      result.current.handleMouseLeave();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should handle multiple clicks correctly", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("click", setState));

      result.current.handleClick();
      result.current.handleClick();
      result.current.handleClick();

      expect(setState).toHaveBeenCalledTimes(3);
      // Each call should be a toggle function
      setState.mock.calls.forEach(call => {
        expect(typeof call[0]).toBe("function");
      });
    });
  });

  describe("Manual trigger", () => {
    it("should not call setState on mouse enter when trigger is manual", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("manual", setState));

      result.current.handleMouseEnter();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should not call setState on mouse leave when trigger is manual", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("manual", setState));

      result.current.handleMouseLeave();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should not call setState on click when trigger is manual", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("manual", setState));

      result.current.handleClick();

      expect(setState).not.toHaveBeenCalled();
    });

    it("should not respond to any events when manual", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("manual", setState));

      result.current.handleMouseEnter();
      result.current.handleMouseLeave();
      result.current.handleClick();
      result.current.handleMouseEnter();
      result.current.handleClick();

      expect(setState).not.toHaveBeenCalled();
    });
  });

  describe("Handler reference stability", () => {
    it("should maintain stable references when trigger doesn't change", () => {
      const setState = vi.fn();
      const { result, rerender } = renderHook(
        ({ trigger, setState }) => useAnimationTriggers(trigger, setState),
        { initialProps: { trigger: "hover" as AnimationTrigger, setState } }
      );

      const firstHandlers = {
        enter: result.current.handleMouseEnter,
        leave: result.current.handleMouseLeave,
        click: result.current.handleClick,
      };

      rerender({ trigger: "hover", setState });

      // References should remain stable
      expect(result.current.handleMouseEnter).toBe(firstHandlers.enter);
      expect(result.current.handleMouseLeave).toBe(firstHandlers.leave);
      expect(result.current.handleClick).toBe(firstHandlers.click);
    });

    it("should update references when trigger changes", () => {
      const setState = vi.fn();
      const { result, rerender } = renderHook(
        ({ trigger }) => useAnimationTriggers(trigger, setState),
        { initialProps: { trigger: "hover" as AnimationTrigger } }
      );

      const hoverHandlers = {
        enter: result.current.handleMouseEnter,
        leave: result.current.handleMouseLeave,
        click: result.current.handleClick,
      };

      // Change trigger
      rerender({ trigger: "click" });

      // References will change because dependencies changed
      expect(result.current.handleMouseEnter).not.toBe(hoverHandlers.enter);
      expect(result.current.handleMouseLeave).not.toBe(hoverHandlers.leave);
      expect(result.current.handleClick).not.toBe(hoverHandlers.click);
    });

    it("should update references when setState changes", () => {
      const setState1 = vi.fn();
      const setState2 = vi.fn();
      const { result, rerender } = renderHook(
        ({ setState }) => useAnimationTriggers("hover", setState),
        { initialProps: { setState: setState1 } }
      );

      const firstHandlers = result.current.handleMouseEnter;

      rerender({ setState: setState2 });

      // References will change because setState changed
      expect(result.current.handleMouseEnter).not.toBe(firstHandlers);
    });
  });

  describe("Integration scenarios", () => {
    it("should work correctly with state management", () => {
      let state = false;
      const setState = vi.fn((value: boolean | ((prev: boolean) => boolean)) => {
        state = typeof value === "function" ? value(state) : value;
      });

      const { result } = renderHook(() => useAnimationTriggers("click", setState));

      result.current.handleClick();
      expect(state).toBe(true);

      result.current.handleClick();
      expect(state).toBe(false);

      result.current.handleClick();
      expect(state).toBe(true);
    });

    it("should handle switching between different triggers", () => {
      const setState = vi.fn();
      const { result, rerender } = renderHook(
        ({ trigger }) => useAnimationTriggers(trigger, setState),
        { initialProps: { trigger: "hover" as AnimationTrigger } }
      );

      // Test hover
      result.current.handleMouseEnter();
      expect(setState).toHaveBeenCalledWith(true);
      setState.mockClear();

      // Switch to click
      rerender({ trigger: "click" });

      result.current.handleMouseEnter();
      expect(setState).not.toHaveBeenCalled();

      result.current.handleClick();
      expect(setState).toHaveBeenCalled();
      expect(typeof setState.mock.calls[0][0]).toBe("function");
      setState.mockClear();

      // Switch to manual
      rerender({ trigger: "manual" });

      result.current.handleMouseEnter();
      result.current.handleMouseLeave();
      result.current.handleClick();
      expect(setState).not.toHaveBeenCalled();
    });

    it("should work with different setState implementations", () => {
      const setStates = [vi.fn(), vi.fn(), vi.fn()];
      const { result, rerender } = renderHook(
        ({ setState }) => useAnimationTriggers("hover", setState),
        { initialProps: { setState: setStates[0] } }
      );

      result.current.handleMouseEnter();
      expect(setStates[0]).toHaveBeenCalledWith(true);

      rerender({ setState: setStates[1] });
      result.current.handleMouseLeave();
      expect(setStates[1]).toHaveBeenCalledWith(false);

      rerender({ setState: setStates[2] });
      result.current.handleMouseEnter();
      expect(setStates[2]).toHaveBeenCalledWith(true);
    });
  });

  describe("Return value structure", () => {
    it("should return an object with three handler functions", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      expect(result.current).toHaveProperty("handleMouseEnter");
      expect(result.current).toHaveProperty("handleMouseLeave");
      expect(result.current).toHaveProperty("handleClick");

      expect(typeof result.current.handleMouseEnter).toBe("function");
      expect(typeof result.current.handleMouseLeave).toBe("function");
      expect(typeof result.current.handleClick).toBe("function");
    });

    it("should return functions that can be called multiple times", () => {
      const setState = vi.fn();
      const { result } = renderHook(() => useAnimationTriggers("hover", setState));

      const { handleMouseEnter, handleMouseLeave, handleClick } = result.current;

      handleMouseEnter();
      handleMouseEnter();
      handleMouseLeave();
      handleMouseLeave();
      handleClick();
      handleClick();

      // Only hover triggers should have been called (4 times)
      // Click triggers should not have been called (trigger is hover)
      expect(setState).toHaveBeenCalledTimes(4);
    });
  });
});
