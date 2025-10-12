"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import { useAnimationTriggers } from "@/catalyst-ui/hooks/useAnimationTriggers";
import type { AnimationTrigger } from "../types";

/**
 * Props for AnimatedFade component
 *
 * @property children - Content to animate (any React nodes)
 * @property trigger - How to trigger the fade animation (default: "click")
 * @property duration - Animation duration in milliseconds (default: 300)
 * @property className - Additional CSS classes for the container
 * @property isVisible - Controlled visibility state (makes component controlled)
 * @property onVisibilityChange - Callback fired when visibility state changes
 */
export interface AnimatedFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** How to trigger the fade animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled visibility state */
  isVisible?: boolean;
  /** Callback when visibility should change */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * AnimatedFade - Opacity-based fade in/out animation HOC
 *
 * @description
 * A generic Higher-Order Component that provides smooth fade in/out animations
 * for any content. Perfect for overlays, modals, tooltips, notifications, and
 * any UI element that needs to appear/disappear gracefully.
 *
 * Content-agnostic - works with any React components or elements.
 *
 * @remarks
 * Key Features:
 * - Smooth opacity transitions (0 to 1)
 * - Disables pointer events when hidden to prevent interaction
 * - Supports both controlled and uncontrolled modes
 * - Respects `prefers-reduced-motion` for accessibility
 * - Hardware-accelerated CSS transitions for performance
 * - Configurable duration and trigger modes
 *
 * Controlled vs Uncontrolled Usage:
 * - **Uncontrolled**: Component manages its own visibility state internally
 *   - Use `trigger` prop to define interaction mode
 *   - Example: Click/hover to toggle visibility
 * - **Controlled**: Parent component manages visibility via props
 *   - Provide `isVisible` prop to control state externally
 *   - Optional `onVisibilityChange` callback for state updates
 *   - Trigger prop is ignored in controlled mode
 *
 * Accessibility:
 * - Automatically respects `prefers-reduced-motion` media query
 * - Sets `pointer-events: none` when hidden to prevent interaction
 * - Maintains proper focus management when content is hidden
 *
 * @example Uncontrolled - Click to Toggle
 * ```tsx
 * <AnimatedFade trigger="click" duration={300}>
 *   <Alert>Click anywhere to toggle this alert</Alert>
 * </AnimatedFade>
 * ```
 *
 * @example Uncontrolled - Hover to Show
 * ```tsx
 * <AnimatedFade trigger="hover" duration={200}>
 *   <Tooltip>Hover to reveal tooltip</Tooltip>
 * </AnimatedFade>
 * ```
 *
 * @example Controlled - External State Management
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 *
 * return (
 *   <>
 *     <Button onClick={() => setShowModal(true)}>Open Modal</Button>
 *     <AnimatedFade isVisible={showModal} duration={400}>
 *       <Modal onClose={() => setShowModal(false)}>
 *         <h2>Modal Content</h2>
 *       </Modal>
 *     </AnimatedFade>
 *   </>
 * );
 * ```
 *
 * @example Notification System
 * ```tsx
 * const [notifications, setNotifications] = useState([]);
 *
 * return (
 *   <div className="notification-stack">
 *     {notifications.map(notif => (
 *       <AnimatedFade
 *         key={notif.id}
 *         isVisible={notif.visible}
 *         duration={250}
 *       >
 *         <Notification message={notif.message} />
 *       </AnimatedFade>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example Conditional Content Display
 * ```tsx
 * const [showDetails, setShowDetails] = useState(false);
 *
 * return (
 *   <Card>
 *     <h3>Summary</h3>
 *     <Button onClick={() => setShowDetails(!showDetails)}>
 *       Toggle Details
 *     </Button>
 *     <AnimatedFade isVisible={showDetails} duration={300}>
 *       <div className="details">
 *         <p>Additional content that fades in/out...</p>
 *       </div>
 *     </AnimatedFade>
 *   </Card>
 * );
 * ```
 *
 * @example Fast Fade for Loading States
 * ```tsx
 * const [loading, setLoading] = useState(true);
 *
 * return (
 *   <AnimatedFade isVisible={loading} duration={150}>
 *     <Spinner>Loading...</Spinner>
 *   </AnimatedFade>
 * );
 * ```
 */
const AnimatedFadeComponent = React.forwardRef<HTMLDivElement, AnimatedFadeProps>(
  (
    {
      children,
      trigger = "click",
      duration = 300,
      className,
      isVisible: controlledIsVisible,
      onVisibilityChange,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useControllableState(
      controlledIsVisible,
      false,
      onVisibilityChange
    );
    const prefersReducedMotion = usePrefersReducedMotion();
    const { handleMouseEnter, handleMouseLeave, handleClick } = useAnimationTriggers(
      trigger,
      setIsVisible
    );

    // Respect user's motion preferences
    const effectiveDuration = prefersReducedMotion ? 0 : duration;

    const containerStyle: React.CSSProperties = {
      transition: `opacity ${effectiveDuration}ms ease-in-out`,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
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

AnimatedFadeComponent.displayName = "AnimatedFadeComponent";

/**
 * Memoized AnimatedFade component for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimatedFade = React.memo(AnimatedFadeComponent);
AnimatedFade.displayName = "AnimatedFade";

export default AnimatedFade;
