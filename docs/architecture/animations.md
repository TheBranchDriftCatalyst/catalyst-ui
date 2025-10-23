# Animation System Architecture

> **📍 Canonical Documentation**: This is the official architecture documentation for Catalyst UI's animation system.
>
> **Last Updated**: January 2025 (Phase 6 - Framer Motion Integration)

## Table of Contents

- [Overview](#overview)
- [Quick Decision Guide](#quick-decision-guide)
- [Unified Animate Component](#unified-animate-component)
- [Animation Approaches](#animation-approaches)
- [CSS-Based Animation HOCs](#css-based-animation-hocs)
- [Framer Motion System](#framer-motion-system)
- [Architecture History](#architecture-history)

---

## Overview

Catalyst UI provides a **unified animation interface** powered by two complementary systems:

1. **CSS-based animations** - Hardware-accelerated, minimal bundle size
2. **Framer Motion animations** - Advanced physics, orchestration, and gestures

The `Animate` component automatically selects the best implementation based on your use case, while direct APIs remain available for explicit control.

---

## Quick Decision Guide

### When to Use the Unified `Animate` Component

Use `<Animate />` for **90% of your animations**:

```tsx
import { Animate } from "@/catalyst-ui/effects";

// Auto-selects CSS for simple hover
<Animate variant="bounce" trigger="hover">
  <Button>Hover me</Button>
</Animate>

// Auto-selects Motion for directional fade
<Animate variant="fade" direction="up" duration={600}>
  <Hero>Welcome</Hero>
</Animate>
```

### When to Use Direct APIs

| Use CSS HOCs directly when...                       | Use Motion directly when...                        |
| --------------------------------------------------- | -------------------------------------------------- |
| Building performance-critical lists (100s of items) | Need complex animation sequences                   |
| Want guaranteed small bundle size                   | Using advanced Framer features (drag, whileInView) |
| Need progressive enhancement (works without JS)     | Building custom animation patterns                 |
| Explicit CSS-only requirement                       | Need precise orchestration control                 |

---

## Unified Animate Component

**Location**: `lib/effects/Animate/`

### Auto-Selection Logic

The `Animate` component intelligently chooses between CSS and Motion:

**Uses CSS when**:

- Simple hover/click interactions (`trigger="hover"`)
- No exit animations (`useExit={false}`)
- Better performance needed
- No directional effects

**Uses Motion when**:

- Exit animations needed (`useExit={true}`)
- Directional fades/slides specified
- Scale variants (zoom, spring, pop)
- Controlled reveals (`animateOnMount={false}`)

### Props

```typescript
interface AnimateProps {
  variant: "fade" | "flip" | "slide" | "bounce" | "scale" | "zoom" | "spring" | "pop";
  implementation?: "auto" | "css" | "motion"; // Default: "auto"
  direction?: "left" | "right" | "up" | "down" | "horizontal" | "vertical" | "none";
  trigger?: "click" | "hover"; // CSS mode only
  duration?: number; // Milliseconds (CSS) or seconds (Motion)
  delay?: number;
  animateOnMount?: boolean; // Motion mode
  useExit?: boolean; // Motion mode, requires AnimatePresence
  intensity?: number; // Scale factor for bounce/spring
  backContent?: ReactNode; // For flip animations
  isActive?: boolean; // Controlled state (CSS mode)
  onStateChange?: (active: boolean) => void; // CSS mode callback
}
```

### Examples

#### Auto-Selection (Recommended)

```tsx
// CSS auto-selected (hover interaction)
<Animate variant="bounce" trigger="hover" duration={300}>
  <Button>Click me</Button>
</Animate>

// Motion auto-selected (directional fade)
<Animate variant="fade" direction="up" duration={800}>
  <Hero>Entrance animation</Hero>
</Animate>

// Motion auto-selected (exit animation)
<AnimatePresence>
  {isVisible && (
    <Animate variant="slide" direction="left" useExit>
      <Sidebar />
    </Animate>
  )}
</AnimatePresence>
```

#### Force Implementation

```tsx
// Force CSS for guaranteed small bundle
<Animate variant="fade" implementation="css" trigger="hover">
  <Card>CSS-only fade</Card>
</Animate>

// Force Motion for advanced features
<Animate variant="zoom" implementation="motion" duration={500}>
  <Modal>Motion-powered modal</Modal>
</Animate>
```

---

## Animation Approaches

### 1. CSS-Based Animation HOCs

**Location**: `lib/effects/Animated*`

**Components**:

- `AnimatedFlip` - 3D flip animation (horizontal/vertical)
- `AnimatedFade` - Opacity fade in/out
- `AnimatedSlide` - Directional slide (top/right/bottom/left)
- `AnimatedBounce` - Spring-like scale bounce
- `AnimatedTilt` - 3D tilt effect

**Characteristics**:

- ✅ Hardware-accelerated CSS transitions
- ✅ Minimal runtime overhead
- ✅ Works without JavaScript (progressive enhancement)
- ✅ Small bundle impact (~2-5KB per component)
- ✅ Predictable, simple behavior
- ❌ Limited to CSS transition capabilities
- ❌ No complex sequencing or choreography
- ❌ No gesture recognition

**Example**:

```tsx
import { AnimatedFade } from "@/catalyst-ui/effects";

<AnimatedFade trigger="hover" duration={300} isVisible={isShown}>
  <Card>Hover to fade</Card>
</AnimatedFade>;
```

**Best for**:

- Interactive UI elements (buttons, cards, tooltips)
- Hover effects and micro-interactions
- Simple show/hide animations
- Performance-critical scenarios (large lists)
- Progressive enhancement requirements

---

### 2. Framer Motion System

**Location**: `lib/effects/Motion*` and `lib/effects/variants/*`

#### Motion HOCs

**Components**:

- `MotionFade` - Directional fade with spring/tween physics
- `MotionScale` - Scale animations (zoom, spring, pop variants)

**Example**:

```tsx
import { MotionFade } from "@/catalyst-ui/effects";

<MotionFade direction="up" duration={0.8} useExit>
  <Hero>Smooth entrance with exit</Hero>
</MotionFade>;
```

#### Motion Variants Library

**Location**: `lib/effects/variants/`

Pre-built animation variants for common patterns:

**Text Variants** (`text.ts`):

```tsx
import { textVariant } from "@/catalyst-ui/effects/variants";

<motion.h1 variants={textVariant(0.5)}>Animated Heading</motion.h1>;
```

**Fade Variants** (`fade.ts`):

```tsx
import { fadeIn, fadeOut } from "@/catalyst-ui/effects/variants";

// Directional fade from any edge
<motion.div variants={fadeIn("left", "spring", 0, 0.75)}>Content</motion.div>;
```

**Slide Variants** (`slide.ts`):

```tsx
import { slideIn } from "@/catalyst-ui/effects/variants";

// Slide from edge of screen
<motion.div variants={slideIn("left", "tween", 0, 0.5)}>Sidebar</motion.div>;
```

**Scale Variants** (`scale.ts`):

```tsx
import { zoomIn, springScale, popIn } from "@/catalyst-ui/effects/variants";

// Smooth zoom with fade
<motion.div variants={zoomIn(0, 0.6)}>Modal</motion.div>;
```

**Stagger Variants** (`stagger.ts`):

```tsx
import { staggerContainer, fadeIn } from "@/catalyst-ui/effects/variants";

// Sequential animation of children
<motion.div variants={staggerContainer(0.1)} initial="hidden" animate="show">
  {items.map((item, i) => (
    <motion.div key={i} variants={fadeIn("up", "spring", 0, 0.75)}>
      <Card>{item}</Card>
    </motion.div>
  ))}
</motion.div>;
```

#### Motion Context Provider

**Location**: `lib/contexts/Motion/`

Provides centralized motion configuration and accessibility support:

```tsx
import { MotionProvider } from "@/catalyst-ui/contexts/Motion";

<MotionProvider respectReducedMotion>
  <App />
</MotionProvider>;
```

The Motion context:

- Respects `prefers-reduced-motion` system setting
- Allows runtime enable/disable of animations
- Provides motion state to all Motion components

**Characteristics**:

- ✅ Powerful animation orchestration
- ✅ Enter/exit animations with AnimatePresence
- ✅ Scroll-triggered animations (whileInView)
- ✅ Gesture recognition (drag, pan, hover, tap)
- ✅ Spring physics and advanced easing
- ✅ Stagger children animations
- ❌ Larger bundle size (~30-35KB)
- ❌ Requires JavaScript runtime
- ❌ Slightly more overhead per component

**Best for**:

- Page entrance/exit animations
- Complex orchestrated sequences
- Gesture-based interactions
- Scroll-triggered reveals
- Advanced spring physics
- Staggered list animations

---

## CSS Keyframe Animations

**Location**: `lib/contexts/Theme/styles/catalyst.css`

Theme-specific continuous animations (Catalyst theme only):

**Available Keyframes**:

- `glow-pulse` - Subtle pulsing box-shadow (8s)
- `border-shimmer` - Gradient shimmer along borders (8s)
- `pulse-scale` - Fade + scale for pulsing elements (8s)
- `text-glow` - Text-shadow pulse for links (4s)
- `neon-glow` - Box shadow glow for buttons/icons
- `opacity-pulse` - Simple opacity fade (1 → 0.8 → 1)

**Usage**:

```tsx
<div style={{ animation: "glow-pulse 8s ease-in-out infinite" }}>Ultra-subtle box-shadow pulse</div>
```

**When to use**:

- Adding theme-specific visual polish
- Hover/focus effects
- Subtle background animations
- Enhancing cyberpunk aesthetic

**Note**: These are separate from animation HOCs and Motion components. Use for ambient effects only.

---

## Architecture History

### Phase 1-5: CSS Animation HOCs (Complete)

Built reusable animation HOCs:

- Phase 1: `AnimatedFlip` - 3D flip animation
- Phase 2: `AnimatedFade` - Opacity transitions
- Phase 3: `AnimatedSlide` - Directional sliding
- Phase 4: `AnimatedBounce` - Spring-like bounce
- Phase 5: `AnimatedTilt` - 3D tilt effect

### Phase 6: Framer Motion Integration (Complete)

Integrated Framer Motion as a first-class animation system:

**Created**:

1. Motion Context (`lib/contexts/Motion/`)
   - MotionProvider with accessibility support
   - useMotion hook for consuming context

2. Variants Library (`lib/effects/variants/`)
   - text.ts - Text entrance animations
   - fade.ts - Directional fade effects
   - slide.ts - Edge-based slide animations
   - scale.ts - Zoom, spring, pop effects
   - stagger.ts - Sequential animation orchestration

3. Motion HOCs (`lib/effects/Motion*`)
   - MotionFade - Directional fade with physics
   - MotionScale - Scale animations with smooth physics

4. **Unified Animate Component** (`lib/effects/Animate/`)
   - Single API that auto-selects CSS vs Motion
   - Smart defaults for 90% of use cases
   - Force implementation when needed

**Consolidated**:

- Moved duplicate variants from `ThreeJS/utils/motion.ts` to centralized library
- Updated ThreeJS file to re-export from centralized variants

**Updated**:

- Added MotionProvider to app context stack
- Updated AnimationsTab with stagger examples
- Created comprehensive documentation

### Folder Rename: `animation/` → `effects/`

In Phase 6 (October 2025), the `lib/animation/` folder was renamed to `lib/effects/` to better reflect the directory's purpose and align with the codebase's naming conventions.

**Impact**:

- All imports updated from `@/catalyst-ui/animation/*` to `@/catalyst-ui/effects/*`
- Documentation updated to use "effects" terminology
- Backward compatibility maintained through barrel exports

---

## Bundle Size Considerations

| Implementation        | Bundle Impact | Runtime  | Tree-Shakeable |
| --------------------- | ------------- | -------- | -------------- |
| CSS (via Animate)     | ~2-5KB        | Minimal  | ✅ Yes         |
| Motion (via Animate)  | ~35KB†        | Moderate | ✅ Yes         |
| Direct CSS HOCs       | ~2-5KB        | Minimal  | ✅ Yes         |
| Direct Motion HOCs    | ~35KB†        | Moderate | ✅ Yes         |
| motion.div + variants | ~30-35KB†     | Moderate | ✅ Yes         |

†Framer Motion is fully tree-shakeable and can be lazy-loaded

---

## Accessibility

All animation systems respect `prefers-reduced-motion`:

**CSS Mode**:

- Duration becomes 0ms (instant state change)
- Uses `@media (prefers-reduced-motion: reduce)` queries

**Motion Mode**:

- Checks MotionProvider context
- Renders without animation wrapper when disabled
- Respects system setting via `respectReducedMotion` prop

```tsx
<MotionProvider respectReducedMotion>
  <App>{/* All animations respect user's accessibility preferences */}</App>
</MotionProvider>
```

---

## Migration Guide

### From AnimatedFade

```tsx
// Before
<AnimatedFade trigger="hover" duration={300}>
  <Card />
</AnimatedFade>

// After (same API, now uses unified component)
<Animate variant="fade" trigger="hover" duration={300}>
  <Card />
</Animate>
```

### From Inline Motion

```tsx
// Before
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>

// After
<Animate variant="fade" direction="up" duration={600}>
  {content}
</Animate>
```

---

## Examples

See `app/tabs/AnimationsTab.tsx` for live interactive examples of:

- All animation variants
- CSS vs Motion comparison
- Stagger containers with different speeds
- Auto-selection demonstrations
- Unified Animate component usage

---

## Summary

**For Most Use Cases**:

- Use `<Animate />` with auto-selection
- Let the system choose the best implementation
- Override with `implementation` prop when needed

**For Explicit Control**:

- Use CSS HOCs for guaranteed performance
- Use Motion HOCs for advanced features
- Use `motion.div` + variants for custom patterns

**Performance**:

- CSS animations are preferred for interactive elements
- Motion animations shine for page transitions and complex sequences
- Both are tree-shakeable and production-ready

The unified API gives you the best of both worlds with smart defaults! 🎉
