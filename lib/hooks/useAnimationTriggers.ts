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

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
}
