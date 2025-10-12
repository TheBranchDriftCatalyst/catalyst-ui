/**
 * @file Animation Effect Types
 * @description Shared type definitions for all animation effect HOCs (Higher-Order Components)
 *
 * These types enable consistent behavior across AnimatedFlip, AnimatedFade,
 * AnimatedSlide, and AnimatedBounce components.
 */

/**
 * AnimationTrigger - Defines how animations are triggered
 *
 * @remarks
 * All animation HOCs support these trigger modes for controlling when
 * animations execute. Each HOC respects the trigger mode while providing
 * component-specific animation behavior.
 *
 * @property click - Animation triggers on click/tap interaction
 * @property hover - Animation triggers when mouse enters element (desktop only)
 *
 * @example Hover Trigger
 * ```tsx
 * <AnimatedBounce trigger="hover">
 *   <Button>Bounce on hover</Button>
 * </AnimatedBounce>
 * ```
 *
 * @example Click Trigger
 * ```tsx
 * <AnimatedFade trigger="click">
 *   <div>Toggle visibility on click</div>
 * </AnimatedFade>
 * ```
 *
 * @example Controlled Mode (No Trigger)
 * ```tsx
 * // When using controlled props (isVisible, isFlipped, isBouncing),
 * // the trigger prop is ignored and animation is controlled by state
 * const [show, setShow] = useState(false);
 * <AnimatedSlide isVisible={show} trigger="click">
 *   <Panel>Controlled by external state</Panel>
 * </AnimatedSlide>
 * ```
 */
export type AnimationTrigger = "click" | "hover";

/**
 * FlipDirection - Defines the rotation axis for 3D flip animations
 *
 * @remarks
 * Used exclusively by AnimatedFlip to control the flip transformation axis.
 * Affects the rotateX/rotateY CSS transform applied during animation.
 *
 * @property horizontal - Rotates around Y-axis (left-to-right flip like a book page)
 * @property vertical - Rotates around X-axis (top-to-bottom flip like a calendar)
 *
 * @example Horizontal Flip (Book Page)
 * ```tsx
 * <AnimatedFlip
 *   front={<Card>Front</Card>}
 *   back={<Card>Back</Card>}
 *   direction="horizontal" // Default - flips left to right
 * />
 * ```
 *
 * @example Vertical Flip (Calendar)
 * ```tsx
 * <AnimatedFlip
 *   front={<Card>Front</Card>}
 *   back={<Card>Back</Card>}
 *   direction="vertical" // Flips top to bottom
 * />
 * ```
 */
export type FlipDirection = "horizontal" | "vertical";

/**
 * SlideDirection - Defines the entry direction for slide animations
 *
 * @remarks
 * Used exclusively by AnimatedSlide to control which direction content
 * slides in from. The content will slide FROM the specified direction
 * INTO the visible area.
 *
 * @property top - Content slides down from above the container
 * @property right - Content slides left from right side of container
 * @property bottom - Content slides up from below the container
 * @property left - Content slides right from left side of container
 *
 * @example Slide from Left (Right Drawer)
 * ```tsx
 * <AnimatedSlide direction="left" distance={300}>
 *   <Drawer>Slides in from left edge</Drawer>
 * </AnimatedSlide>
 * ```
 *
 * @example Slide from Top (Notification)
 * ```tsx
 * <AnimatedSlide direction="top" distance={100}>
 *   <Alert>Slides down from top</Alert>
 * </AnimatedSlide>
 * ```
 *
 * @example Slide from Bottom (Sheet)
 * ```tsx
 * <AnimatedSlide direction="bottom" distance={400}>
 *   <Sheet>Slides up from bottom</Sheet>
 * </AnimatedSlide>
 * ```
 */
export type SlideDirection = "top" | "right" | "bottom" | "left";
