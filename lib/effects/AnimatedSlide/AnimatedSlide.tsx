"use client";

import * as React from "react";
import { useControllableState } from "@/catalyst-ui/hooks/useControllableState";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";
import { useAnimationTriggers } from "@/catalyst-ui/hooks/useAnimationTriggers";
import type { AnimationTrigger, SlideDirection } from "../types";

/**
 * Props for AnimatedSlide component
 *
 * @property children - Content to animate (any React nodes)
 * @property direction - Direction to slide from (default: "bottom")
 * @property trigger - How to trigger the slide animation (default: "click")
 * @property duration - Animation duration in milliseconds (default: 400)
 * @property distance - Distance to slide in pixels (default: 50)
 * @property className - Additional CSS classes for the container
 * @property isVisible - Controlled visibility state (makes component controlled)
 * @property onVisibilityChange - Callback fired when visibility state changes
 */
export interface AnimatedSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to animate */
  children: React.ReactNode;
  /** Direction to slide from */
  direction?: SlideDirection;
  /** How to trigger the slide animation */
  trigger?: AnimationTrigger;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Distance to slide in pixels */
  distance?: number;
  /** Additional class names for the container */
  className?: string;
  /** Controlled visibility state */
  isVisible?: boolean;
  /** Callback when visibility should change */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * AnimatedSlide - Directional slide animation HOC
 *
 * @description
 * A generic Higher-Order Component that provides smooth slide-in animations
 * from any direction (top, right, bottom, left). Perfect for drawers, side
 * panels, sheets, notifications, dropdowns, and any UI element that should
 * enter/exit from a specific edge.
 *
 * Content-agnostic - works with any React components or elements.
 *
 * @remarks
 * Key Features:
 * - Configurable slide direction (top/right/bottom/left)
 * - Adjustable slide distance in pixels
 * - Combines slide with fade for polished transitions
 * - Supports both controlled and uncontrolled modes
 * - Respects `prefers-reduced-motion` for accessibility
 * - Hardware-accelerated CSS transforms for performance
 * - Disables pointer events when hidden
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
 * - Transform is set to translate(0, 0) when motion is reduced
 *
 * Direction Behavior:
 * - **"top"**: Content slides DOWN from above the container
 * - **"right"**: Content slides LEFT from the right side
 * - **"bottom"**: Content slides UP from below the container
 * - **"left"**: Content slides RIGHT from the left side
 *
 * @example Uncontrolled - Click to Toggle Drawer
 * ```tsx
 * <AnimatedSlide direction="left" distance={300} trigger="click">
 *   <Drawer>
 *     <h2>Navigation</h2>
 *     <nav>...</nav>
 *   </Drawer>
 * </AnimatedSlide>
 * ```
 *
 * @example Uncontrolled - Hover to Show Tooltip
 * ```tsx
 * <div className="relative">
 *   <Button>Hover me</Button>
 *   <AnimatedSlide direction="top" distance={100} trigger="hover">
 *     <Tooltip>Slides down from above</Tooltip>
 *   </AnimatedSlide>
 * </div>
 * ```
 *
 * @example Controlled - Mobile Menu
 * ```tsx
 * const [menuOpen, setMenuOpen] = useState(false);
 *
 * return (
 *   <>
 *     <Button onClick={() => setMenuOpen(true)}>
 *       Open Menu
 *     </Button>
 *     <AnimatedSlide
 *       direction="right"
 *       distance={320}
 *       isVisible={menuOpen}
 *       duration={350}
 *     >
 *       <MobileMenu onClose={() => setMenuOpen(false)} />
 *     </AnimatedSlide>
 *   </>
 * );
 * ```
 *
 * @example Bottom Sheet (Modal Alternative)
 * ```tsx
 * const [showSheet, setShowSheet] = useState(false);
 *
 * return (
 *   <>
 *     <Button onClick={() => setShowSheet(true)}>
 *       Show Actions
 *     </Button>
 *     <AnimatedSlide
 *       direction="bottom"
 *       distance={400}
 *       isVisible={showSheet}
 *       duration={300}
 *     >
 *       <Sheet>
 *         <h3>Actions</h3>
 *         <Button onClick={() => setShowSheet(false)}>Close</Button>
 *       </Sheet>
 *     </AnimatedSlide>
 *   </>
 * );
 * ```
 *
 * @example Notification from Top
 * ```tsx
 * const [showNotif, setShowNotif] = useState(false);
 *
 * useEffect(() => {
 *   if (showNotif) {
 *     const timer = setTimeout(() => setShowNotif(false), 3000);
 *     return () => clearTimeout(timer);
 *   }
 * }, [showNotif]);
 *
 * return (
 *   <AnimatedSlide
 *     direction="top"
 *     distance={80}
 *     isVisible={showNotif}
 *     duration={250}
 *   >
 *     <Alert>Action completed successfully!</Alert>
 *   </AnimatedSlide>
 * );
 * ```
 *
 * @example Dropdown Panel
 * ```tsx
 * <div className="relative">
 *   <AnimatedSlide direction="top" distance={60} trigger="click">
 *     <DropdownPanel>
 *       <MenuItem>Profile</MenuItem>
 *       <MenuItem>Settings</MenuItem>
 *       <MenuItem>Logout</MenuItem>
 *     </DropdownPanel>
 *   </AnimatedSlide>
 * </div>
 * ```
 *
 * @example Sidebar with Custom Distance
 * ```tsx
 * const [sidebarOpen, setSidebarOpen] = useState(false);
 *
 * return (
 *   <AnimatedSlide
 *     direction="left"
 *     distance={280}
 *     isVisible={sidebarOpen}
 *     duration={400}
 *   >
 *     <Sidebar width={280}>
 *       <h2>Settings</h2>
 *       <nav>...</nav>
 *     </Sidebar>
 *   </AnimatedSlide>
 * );
 * ```
 */
const AnimatedSlideComponent = React.forwardRef<HTMLDivElement, AnimatedSlideProps>(
  (
    {
      children,
      direction = "bottom",
      trigger = "click",
      duration = 400,
      distance = 50,
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

    // Calculate transform based on direction
    const getTransform = (): string => {
      if (isVisible) return "translate(0, 0)";

      switch (direction) {
        case "top":
          return `translate(0, -${distance}px)`;
        case "right":
          return `translate(${distance}px, 0)`;
        case "bottom":
          return `translate(0, ${distance}px)`;
        case "left":
          return `translate(-${distance}px, 0)`;
        default:
          return "translate(0, 0)";
      }
    };

    const containerStyle: React.CSSProperties = {
      transition: `transform ${effectiveDuration}ms ease-in-out, opacity ${effectiveDuration}ms ease-in-out`,
      transform: getTransform(),
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

AnimatedSlideComponent.displayName = "AnimatedSlideComponent";

/**
 * Memoized AnimatedSlide component for performance optimization
 * Prevents unnecessary re-renders when props haven't changed
 */
export const AnimatedSlide = React.memo(AnimatedSlideComponent);
AnimatedSlide.displayName = "AnimatedSlide";

export default AnimatedSlide;
