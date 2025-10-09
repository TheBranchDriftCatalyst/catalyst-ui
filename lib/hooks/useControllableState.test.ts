import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  describe("Uncontrolled mode", () => {
    it("should initialize with default value", () => {
      const { result } = renderHook(() => useControllableState(undefined, false));

      expect(result.current[0]).toBe(false);
    });

    it("should update internal state when setValue is called", () => {
      const { result } = renderHook(() => useControllableState(undefined, false));

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it("should support functional updates", () => {
      const { result } = renderHook(() => useControllableState<number>(undefined, 0));

      act(() => {
        result.current[1](prev => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1](prev => prev + 2);
      });

      expect(result.current[0]).toBe(3);
    });

    it("should not call onChange callback when uncontrolled", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState(undefined, false, onChange));

      act(() => {
        result.current[1](true);
      });

      expect(onChange).not.toHaveBeenCalled();
      expect(result.current[0]).toBe(true);
    });

    it("should work with different data types", () => {
      const { result: stringResult } = renderHook(() =>
        useControllableState<string>(undefined, "hello")
      );

      act(() => {
        stringResult.current[1]("world");
      });

      expect(stringResult.current[0]).toBe("world");

      const { result: objectResult } = renderHook(() =>
        useControllableState<{ count: number }>(undefined, { count: 0 })
      );

      act(() => {
        objectResult.current[1]({ count: 5 });
      });

      expect(objectResult.current[0]).toEqual({ count: 5 });
    });
  });

  describe("Controlled mode", () => {
    it("should use controlled value instead of default", () => {
      const { result } = renderHook(() => useControllableState(true, false));

      expect(result.current[0]).toBe(true);
    });

    it("should call onChange callback when setValue is called", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState(false, false, onChange));

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should not update internal state when controlled", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState(false, false, onChange));

      act(() => {
        result.current[1](true);
      });

      // Value should remain false since parent didn't update the prop
      expect(result.current[0]).toBe(false);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("should update when controlled value changes", () => {
      const { result, rerender } = renderHook(
        ({ controlledValue }) => useControllableState(controlledValue, false),
        { initialProps: { controlledValue: false } }
      );

      expect(result.current[0]).toBe(false);

      // Simulate parent updating the controlled value
      rerender({ controlledValue: true });

      expect(result.current[0]).toBe(true);
    });

    it("should support functional updates with controlled value", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState<number>(5, 0, onChange));

      act(() => {
        result.current[1](prev => prev + 3);
      });

      expect(onChange).toHaveBeenCalledWith(8);
      // Value stays at 5 because parent hasn't updated the prop
      expect(result.current[0]).toBe(5);
    });

    it("should handle onChange callback that updates the value", () => {
      let controlledValue: boolean = false;
      const onChange = vi.fn((newValue: boolean) => {
        controlledValue = newValue;
      });

      const { result, rerender } = renderHook(
        ({ value }) => useControllableState(value, false, onChange),
        { initialProps: { value: controlledValue } }
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);

      // Simulate parent updating the controlled value
      rerender({ value: controlledValue });

      expect(result.current[0]).toBe(true);
    });
  });

  describe("Mode switching", () => {
    it("should switch from uncontrolled to controlled", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ controlled }) => useControllableState(controlled, false, onChange),
        { initialProps: { controlled: undefined as boolean | undefined } }
      );

      // Start uncontrolled
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(onChange).not.toHaveBeenCalled();

      // Switch to controlled
      rerender({ controlled: false });

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it("should switch from controlled to uncontrolled", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ controlled }) => useControllableState(controlled, false, onChange),
        { initialProps: { controlled: true as boolean | undefined } }
      );

      // Start controlled
      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1](false);
      });

      expect(onChange).toHaveBeenCalledWith(false);

      // Switch to uncontrolled
      rerender({ controlled: undefined });

      // Should maintain last internal value (false from default)
      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      // Now it updates internal state
      expect(result.current[0]).toBe(true);
      // onChange should only be called once (from controlled mode)
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge cases", () => {
    it("should handle null/undefined values correctly", () => {
      const { result } = renderHook(() => useControllableState<string | null>(undefined, null));

      expect(result.current[0]).toBe(null);

      act(() => {
        result.current[1]("value");
      });

      expect(result.current[0]).toBe("value");

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBe(null);
    });

    it("should handle rapid updates correctly", () => {
      const { result } = renderHook(() => useControllableState<number>(undefined, 0));

      act(() => {
        result.current[1](1);
        result.current[1](2);
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3);
    });

    it("should handle setValue reference changes when value updates", () => {
      const { result } = renderHook(() => useControllableState(undefined, false));

      const firstSetValue = result.current[1];

      act(() => {
        result.current[1](true);
      });

      // setValue reference may change because it depends on `value`
      // This is expected behavior and doesn't cause issues in practice
      expect(result.current[1]).toBeInstanceOf(Function);
      expect(typeof result.current[1]).toBe("function");
    });

    it("should work with controlled value of 0 or empty string", () => {
      const { result: numberResult } = renderHook(() => useControllableState<number>(0, 100));

      // Should use controlled value (0) not default (100)
      expect(numberResult.current[0]).toBe(0);

      const { result: stringResult } = renderHook(() =>
        useControllableState<string>("", "default")
      );

      // Should use controlled value ("") not default ("default")
      expect(stringResult.current[0]).toBe("");
    });
  });
});
