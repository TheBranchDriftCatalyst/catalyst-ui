# Framer Motion Integration Plan

## Overview

Integrate Framer Motion as a first-class animation provider in catalyst-ui alongside the existing animation HOC system.

## Current State

### Existing Animation Systems

1. **Animation HOCs** (`lib/effects/`)
   - `AnimatedFlip`, `AnimatedFade`, `AnimatedSlide`, `AnimatedBounce`
   - Wrapper components for interactive animations
   - Use CSS transitions with hardware acceleration
   - Great for: Interactive elements, toggles, hover effects

2. **CSS Keyframe Animations** (`lib/contexts/Theme/styles/`)
   - Theme-specific visual effects
   - Continuous animations (glows, borders, gradients)
   - Great for: Background effects, ambient motion

3. **Framer Motion** (Currently ad-hoc)
   - Used in WelcomeTab and some components
   - Variants defined inline or in utility files
   - Not standardized across library

## Proposed Integration

### 1. Motion Provider System

Create a centralized Motion context provider:

```
lib/contexts/Motion/
├── MotionProvider.tsx       # Context provider with prefers-reduced-motion
├── MotionContext.tsx         # Context definition
├── variants/                 # Standard motion variants
│   ├── text.ts              # Text entrance animations
│   ├── fade.ts              # Fade variants
│   ├── slide.ts             # Slide variants
│   ├── scale.ts             # Scale/zoom variants
│   ├── stagger.ts           # Stagger container variants
│   └── index.ts             # Barrel export
└── hooks/
    ├── useMotionValue.ts    # Re-export framer hooks
    ├── useAnimation.ts
    └── useInView.ts
```

### 2. Standard Variant Library

Provide pre-built variants for common patterns:

**Text Variants** (`variants/text.ts`):

- `textFadeIn` - Simple fade in
- `textSlideUp` - Fade + slide from bottom
- `textGradient` - Animated gradient text

**Page Variants** (`variants/page.ts`):

- `pageEnter` - Page transition entrance
- `pageExit` - Page transition exit
- `heroEnter` - Hero section reveal

**Card Variants** (`variants/card.ts`):

- `cardHover` - Hover scale + glow
- `cardTap` - Tap feedback
- `cardReveal` - Entrance animation

**List Variants** (`variants/list.ts`):

- `listContainer` - Stagger children
- `listItem` - Individual item animation

### 3. Motion-Aware Components

Update UI primitives to support motion props:

```tsx
// Button with built-in motion
<Button motion whileHover="scale" whileTap="tap">
  Click me
</Button>

// Card with entrance animation
<Card motion initial="hidden" animate="visible" variants={cardReveal}>
  {content}
</Card>
```

### 4. Accessibility Integration

Respect `prefers-reduced-motion`:

```tsx
<MotionProvider respectReducedMotion>
  <App />
</MotionProvider>

// Automatically disables animations when user prefers reduced motion
// Falls back to instant transitions
```

### 5. Performance Optimization

- Lazy load Framer Motion (code splitting)
- Provide static fallbacks for SSR
- Use `will-change` hints appropriately
- Batch animations with `AnimatePresence`

## Migration Strategy

### Phase 1: Foundation (Current)

- ✅ Add Framer Motion dependency
- ✅ Create utility variants in ThreeJS components
- ⏳ Document current usage patterns

### Phase 2: Standardization

- Create Motion context provider
- Build variant library
- Add accessibility layer
- Update documentation

### Phase 3: Component Integration

- Update UI primitives with motion props
- Add motion variants to Cards, Buttons, Dialogs
- Provide migration guide for existing components

### Phase 4: Developer Experience

- Create Storybook addon for motion testing
- Add VS Code snippets for common variants
- Document performance best practices

## Benefits

1. **Consistency**: Standardized animations across all components
2. **Performance**: Optimized motion with will-change and GPU acceleration
3. **Accessibility**: First-class reduced-motion support
4. **Developer Experience**: Pre-built variants reduce boilerplate
5. **Type Safety**: TypeScript types for all variants
6. **Flexibility**: Can still use custom animations when needed

## Compatibility

- Works alongside existing animation HOCs
- CSS keyframes remain for theme effects
- Graceful degradation for non-motion scenarios
- No breaking changes to existing API

## Example Usage

### Before (Ad-hoc)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>
```

### After (Standardized)

```tsx
<motion.div variants={fadeIn("up")} initial="hidden" animate="show">
  {content}
</motion.div>

// Or with Motion-aware component
<Card motion variants={cardReveal}>
  {content}
</Card>
```

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Reduced Motion Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Next Steps

1. Create Motion context provider
2. Build variant library with TypeScript types
3. Update 3-5 key components as proof of concept
4. Gather feedback and iterate
5. Roll out to remaining components

## Notes

- Motion variants from WelcomeTab (`lib/components/ThreeJS/utils/motion.ts`) serve as starting point
- Consider animation duration constants (fast: 0.2s, normal: 0.3s, slow: 0.6s)
- Add storybook controls for testing different variants
- Document when to use Motion vs CSS vs HOCs
