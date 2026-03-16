import { useCallback } from "react";
import type { AnimationTrigger } from "@/catalyst-ui/effects/types";

/**
 * useAnimationTriggers - Shared trigger handling for animation HOCs
 *
 * Provides consistent event handlers for hover, click, and manual triggers
 * across all animation components. Eliminates duplication of trigger logic.
 *
 * @param trigger - How the animation should be triggered
 * @param setState - Function to update animation state
 * @returns Object containing event handlers for mouse events and clicks
 *
 * @example
 * ```tsx
 * const [isVisible, setIsVisible] = useControllableState(props.isVisible, false);
 * const { handleMouseEnter, handleMouseLeave, handleClick } = useAnimationTriggers(
 *   'hover',
 *   setIsVisible
 * );
 *
 * return (
 *   <div
 *     onMouseEnter={handleMouseEnter}
 *     onMouseLeave={handleMouseLeave}
 *     onClick={handleClick}
 *   >
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useAnimationTriggers(
  trigger: AnimationTrigger,
  setState: (value: boolean | ((prev: boolean) => boolean)) => void
) {
  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setState(true);
    }
  }, [trigger, setState]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") {
      setState(false);
    }
  }, [trigger, setState]);

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      setState(prev => !prev);
    }
  }, [trigger, setState]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (trigger === "click" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        setState(prev => !prev);
      }
    },
    [trigger, setState]
  );

  const handleFocus = useCallback(() => {
    if (trigger === "focus") {
      setState(true);
    }
  }, [trigger, setState]);

  const handleBlur = useCallback(() => {
    if (trigger === "focus") {
      setState(false);
    }
  }, [trigger, setState]);

  /** Props to spread on the animated wrapper for full a11y support */
  const triggerProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...(trigger === "click" ? { tabIndex: 0, role: "button" as const } : {}),
    ...(trigger === "focus" ? { tabIndex: 0 } : {}),
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleKeyDown,
    handleFocus,
    handleBlur,
    triggerProps,
  };
}
