"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import { useAnimationTriggers } from "@/catalyst-ui/hooks/useAnimationTriggers";
import type { AnimationTrigger } from "../types";

/**
 * Props for AnimatedBounce component
 *
 * @property children - Content to animate (any React nodes)
 * @property trigger - How to trigger the bounce animation (default: "hover")
 * @property duration - Animation duration in milliseconds (default: 500)
 * @property intensity - Bounce intensity as scale multiplier (default: 1.1)
 * @property className - Additional CSS classes for the container
 * @property isBouncing - Controlled bounce state (makes component controlled)
 * @property onBounceChange - Callback fired when bounce state changes
 */
export interface AnimatedBounceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** How to trigger the bounce animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Bounce intensity (scale multiplier) */
  intensity?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled bounce state */
  isBouncing?: boolean;
  /** Callback when bounce state should change */
  onBounceChange?: (isBouncing: boolean) => void;
}

/**
 * AnimatedBounce - Spring-like scale animation HOC
 *
 * @description
 * A generic Higher-Order Component that provides playful spring-like bounce
 * animations using scale transforms. Perfect for buttons, icons, cards, badges,
 * and any UI element that benefits from tactile feedback or attention-grabbing
 * visual polish.
 *
 * Content-agnostic - works with any React components or elements.
 *
 * @remarks
 * Key Features:
 * - Spring-like scale animation using cubic-bezier easing
 * - Configurable bounce intensity (scale multiplier)
 * - Auto-reset on click trigger for one-shot effects
 * - Supports both controlled and uncontrolled modes
 * - Respects `prefers-reduced-motion` for accessibility
 * - Hardware-accelerated CSS transforms for performance
 * - Inline-block display for proper scaling
 *
 * Controlled vs Uncontrolled Usage:
 * - **Uncontrolled**: Component manages its own bounce state internally
 *   - Use `trigger` prop to define interaction mode
 *   - Click trigger auto-resets after animation completes
 *   - Hover trigger maintains bounce while hovering
 * - **Controlled**: Parent component manages bounce via props
 *   - Provide `isBouncing` prop to control state externally
 *   - Optional `onBounceChange` callback for state updates
 *   - Trigger prop is ignored in controlled mode
 *
 * Accessibility:
 * - Automatically respects `prefers-reduced-motion` media query
 * - Duration set to 0ms when motion is reduced (instant state change)
 * - Maintains interactivity without distracting animation
 *
 * Bounce Intensity Guide:
 * - **1.05**: Subtle micro-interaction (icon hover)
 * - **1.1**: Default moderate bounce (button hover)
 * - **1.15**: Noticeable emphasis (card selection)
 * - **1.2+**: Strong attention-grabbing (success feedback)
 *
 * Animation Easing:
 * Uses cubic-bezier(0.68, -0.55, 0.265, 1.55) for spring-like overshoot
 * effect, creating a natural bouncing motion that feels responsive and playful.
 *
 * @example Uncontrolled - Hover Bounce on Button
 * ```tsx
 * <AnimatedBounce trigger="hover" intensity={1.1} duration={500}>
 *   <Button>Hover for bounce feedback</Button>
 * </AnimatedBounce>
 * ```
 *
 * @example Uncontrolled - Click Bounce on Icon
 * ```tsx
 * <AnimatedBounce trigger="click" intensity={1.2} duration={400}>
 *   <Icon name="heart" onClick={handleLike} />
 * </AnimatedBounce>
 * ```
 *
 * @example Controlled - Success Celebration
 * ```tsx
 * const [celebrating, setCelebrating] = useState(false);
 *
 * const handleSuccess = () => {
 *   setCelebrating(true);
 *   setTimeout(() => setCelebrating(false), 600);
 * };
 *
 * return (
 *   <AnimatedBounce isBouncing={celebrating} intensity={1.3} duration={600}>
 *     <Badge>Success!</Badge>
 *   </AnimatedBounce>
 * );
 * ```
 *
 * @example Card Selection Feedback
 * ```tsx
 * const [selected, setSelected] = useState<string | null>(null);
 *
 * return (
 *   <div className="grid">
 *     {cards.map(card => (
 *       <AnimatedBounce
 *         key={card.id}
 *         isBouncing={selected === card.id}
 *         intensity={1.15}
 *         duration={500}
 *       >
 *         <Card onClick={() => setSelected(card.id)}>
 *           {card.content}
 *         </Card>
 *       </AnimatedBounce>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example Subtle Icon Hover
 * ```tsx
 * <div className="toolbar">
 *   <AnimatedBounce trigger="hover" intensity={1.05} duration={300}>
 *     <IconButton icon="settings" />
 *   </AnimatedBounce>
 *   <AnimatedBounce trigger="hover" intensity={1.05} duration={300}>
 *     <IconButton icon="notifications" />
 *   </AnimatedBounce>
 * </div>
 * ```
 *
 * @example Loading Dots Animation
 * ```tsx
 * const [active, setActive] = useState(0);
 *
 * useEffect(() => {
 *   const interval = setInterval(() => {
 *     setActive(prev => (prev + 1) % 3);
 *   }, 400);
 *   return () => clearInterval(interval);
 * }, []);
 *
 * return (
 *   <div className="flex gap-2">
 *     {[0, 1, 2].map(i => (
 *       <AnimatedBounce
 *         key={i}
 *         isBouncing={active === i}
 *         intensity={1.4}
 *         duration={400}
 *       >
 *         <div className="w-3 h-3 rounded-full bg-primary" />
 *       </AnimatedBounce>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example Menu Item Hover
 * ```tsx
 * <Menu>
 *   {items.map(item => (
 *     <AnimatedBounce key={item.id} trigger="hover" intensity={1.08}>
 *       <MenuItem>{item.label}</MenuItem>
 *     </AnimatedBounce>
 *   ))}
 * </Menu>
 * ```
 *
 * @example Strong Feedback for Primary Actions
 * ```tsx
 * <AnimatedBounce trigger="hover" intensity={1.2} duration={500}>
 *   <Button variant="primary" size="lg">
 *     Get Started
 *   </Button>
 * </AnimatedBounce>
 * ```
 */
const AnimatedBounceComponent = React.forwardRef<HTMLDivElement, AnimatedBounceProps>(
  (
    {
      children,
      trigger = "hover",
      duration = 500,
      intensity = 1.1,
      className,
      isBouncing: controlledIsBouncing,
      onBounceChange,
      ...props
    },
    ref
  ) => {
    const [isBouncing, setIsBouncing] = useControllableState(
      controlledIsBouncing,
      false,
      onBounceChange
    );
    const prefersReducedMotion = usePrefersReducedMotion();
    const { handleMouseEnter, handleMouseLeave } = useAnimationTriggers(trigger, setIsBouncing);

    // Respect user's motion preferences
    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    // Custom click handler with auto-reset for bounce effect
    const handleClick = () => {
      if (trigger === "click") {
        setIsBouncing(true);
        // Auto-reset after animation completes
        setTimeout(() => {
          setIsBouncing(false);
        }, effectiveDuration);
      }
    };

    // Bounce animation using cubic-bezier for spring-like effect
    const containerStyle: React.CSSProperties = {
      transition: `transform ${effectiveDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
      transform: isBouncing ? `scale(${intensity})` : "scale(1)",
      display: "inline-block",
    };

    const containerProps = {
      ref,
      className,
      style: containerStyle,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      ...props,
    };

    return <div {...containerProps}>{children}</div>;
  }
);

AnimatedBounceComponent.displayName = "AnimatedBounceComponent";

/**
 * Memoized AnimatedBounce component for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimatedBounce = React.memo(AnimatedBounceComponent);
AnimatedBounce.displayName = "AnimatedBounce";

export default AnimatedBounce;
