# Animation HOC Architecture

**Status:** 🟡 In Progress
**Started:** 2025-01-06
**Current Phase:** Phase 1 - Core AnimatedFlip Component

---

## Overview

Creating a library of reusable Higher-Order Components (HOCs) for animations. Extract animation logic from existing components into generic, composable primitives that work with any content type.

**Key Goals:**
- Generic animation components (not tied to specific content)
- Reusable across the component library
- Clean separation: animation logic vs content logic
- Type-safe and well-documented

---

## Phase 1: Core AnimatedFlip Component 🔄 IN PROGRESS

**Goal:** Extract flip animation from CodeFlipCard into reusable AnimatedFlip HOC
**Estimated Time:** 2-3 hours
**Status:** 🟡 In Progress
**Started:** 2025-01-06

### Tasks

#### 1.1 Create AnimatedFlip Component
- [ ] Create `lib/components/AnimationHOC/AnimatedFlip/AnimatedFlip.tsx`
- [ ] Extract all 3D transform logic from CodeFlipCard
- [ ] Props: `front`, `back`, `trigger`, `direction`, `duration`, `className`
- [ ] Zero content knowledge - pure animation wrapper
- [ ] Support both click and hover triggers
- [ ] Support horizontal and vertical flip directions
- **Impact:** Reusable flip animation for any content

#### 1.2 Create Type Definitions
- [ ] Create `lib/components/AnimationHOC/types.ts`
- [ ] Define `AnimationTrigger` type (`"click" | "hover"`)
- [ ] Define `FlipDirection` type (`"horizontal" | "vertical"`)
- [ ] Define shared animation prop interfaces
- **Impact:** Type-safe animation API

#### 1.3 Refactor CodeFlipCard
- [ ] Update `lib/components/CodeFlipCard/CodeFlipCard.tsx`
- [ ] Remove all animation logic (container, flipper, transforms)
- [ ] Import and use AnimatedFlip
- [ ] Pass front={children} and back={codeView} to AnimatedFlip
- [ ] Focus only on code processing and header composition
- **Impact:** CodeFlipCard becomes much simpler (~150 lines removed)

#### 1.4 Create Barrel Exports
- [ ] Create `lib/components/AnimationHOC/AnimatedFlip/index.ts`
- [ ] Create `lib/components/AnimationHOC/index.ts`
- [ ] Update `lib/components/index.ts` to export AnimationHOC
- **Impact:** Clean import paths

#### 1.5 Verify & Test
- [ ] Build passes with zero errors
- [ ] CodeFlipCard still works in kitchen sink app
- [ ] All flip trigger modes work (click, hover)
- [ ] All flip directions work (horizontal, vertical)
- **Impact:** No regressions

### Progress

**Files to Create:**
- [ ] `lib/components/AnimationHOC/AnimatedFlip/AnimatedFlip.tsx`
- [ ] `lib/components/AnimationHOC/AnimatedFlip/index.ts`
- [ ] `lib/components/AnimationHOC/types.ts`
- [ ] `lib/components/AnimationHOC/index.ts`

**Files to Modify:**
- [ ] `lib/components/CodeFlipCard/CodeFlipCard.tsx` - Use AnimatedFlip
- [ ] `lib/components/index.ts` - Export AnimationHOC

**Expected Results:**
- ✅ Generic AnimatedFlip HOC (works with any content)
- ✅ CodeFlipCard simplified by ~150 lines
- ✅ Reusable flip animation for future components
- ✅ Build successful

---

## Phase 2: Additional Animation HOCs ⏳ PENDING

**Goal:** Create additional animation primitives
**Estimated Time:** 3-4 hours
**Status:** ⏳ Pending

### Tasks

#### 2.1 Create AnimatedFade
- [ ] Create `lib/components/AnimationHOC/AnimatedFade/AnimatedFade.tsx`
- [ ] Support fade in/out with trigger
- [ ] Props: `children`, `trigger`, `duration`, `className`
- [ ] Useful for dialogs, tooltips, overlays
- **Impact:** Reusable fade animation

#### 2.2 Create AnimatedSlide
- [ ] Create `lib/components/AnimationHOC/AnimatedSlide/AnimatedSlide.tsx`
- [ ] Support slide from 4 directions (top, right, bottom, left)
- [ ] Props: `children`, `direction`, `trigger`, `duration`, `className`
- [ ] Useful for drawers, sheets, toasts
- **Impact:** Reusable slide animation

#### 2.3 Create AnimatedBounce
- [ ] Create `lib/components/AnimationHOC/AnimatedBounce/AnimatedBounce.tsx`
- [ ] Support bounce effect with intensity control
- [ ] Props: `children`, `trigger`, `intensity`, `duration`, `className`
- [ ] Useful for buttons, notifications
- **Impact:** Reusable bounce animation

#### 2.4 Export All Animations
- [ ] Update `lib/components/AnimationHOC/index.ts`
- [ ] Export all animation HOCs
- [ ] Export shared types
- **Impact:** Clean import paths

### Progress

**Files to Create:**
- [ ] `lib/components/AnimationHOC/AnimatedFade/AnimatedFade.tsx`
- [ ] `lib/components/AnimationHOC/AnimatedFade/index.ts`
- [ ] `lib/components/AnimationHOC/AnimatedSlide/AnimatedSlide.tsx`
- [ ] `lib/components/AnimationHOC/AnimatedSlide/index.ts`
- [ ] `lib/components/AnimationHOC/AnimatedBounce/AnimatedBounce.tsx`
- [ ] `lib/components/AnimationHOC/AnimatedBounce/index.ts`

**Files to Modify:**
- [ ] `lib/components/AnimationHOC/index.ts` - Export new animations
- [ ] `lib/components/AnimationHOC/types.ts` - Add new types

---

## Phase 3: Component Integration ⏳ PENDING

**Goal:** Refactor existing components to use animation HOCs
**Estimated Time:** 4-5 hours
**Status:** ⏳ Pending

### Tasks

#### 3.1 Audit Existing Components
- [ ] Review Dialog component (`lib/ui/dialog.tsx`)
- [ ] Review Toast component (`lib/ui/toast.tsx`)
- [ ] Review Sheet component (`lib/ui/sheet.tsx`)
- [ ] Review Dropdown Menu component (`lib/ui/dropdown-menu.tsx`)
- [ ] Review Hover Card component (`lib/ui/hover-card.tsx`)
- [ ] Document which animations each uses
- **Impact:** Understand integration points

#### 3.2 Refactor Dialog
- [ ] Use AnimatedFade for overlay
- [ ] Use AnimatedSlide (or Fade) for content
- [ ] Remove inline animation CSS
- **Impact:** Cleaner Dialog, reusable animations

#### 3.3 Refactor Toast
- [ ] Use AnimatedSlide for slide-in effect
- [ ] Remove inline animation CSS
- **Impact:** Cleaner Toast component

#### 3.4 Refactor Sheet
- [ ] Use AnimatedSlide for drawer effect
- [ ] Remove inline animation CSS
- **Impact:** Cleaner Sheet component

#### 3.5 Refactor Dropdown & HoverCard
- [ ] Use AnimatedFade for both
- [ ] Remove inline animation CSS
- **Impact:** Consistent animation behavior

### Progress

**Files to Modify:**
- [ ] `lib/ui/dialog.tsx`
- [ ] `lib/ui/toast.tsx`
- [ ] `lib/ui/sheet.tsx`
- [ ] `lib/ui/dropdown-menu.tsx`
- [ ] `lib/ui/hover-card.tsx`

**Expected Results:**
- ✅ All UI components use animation HOCs
- ✅ No inline animation CSS
- ✅ Consistent animation behavior
- ✅ Easier to modify animations globally

---

## Phase 4: Kitchen Sink & Demo ⏳ PENDING

**Goal:** Create comprehensive demo page and update kitchen sink app
**Estimated Time:** 2-3 hours
**Status:** ⏳ Pending

### Tasks

#### 4.1 Create AnimationsTab
- [ ] Create `app/tabs/AnimationsTab.tsx`
- [ ] Showcase all AnimationHOC components
- [ ] Interactive examples with controls
- [ ] Live demos with CodeFlipCard showing source
- **Impact:** Comprehensive animation showcase

#### 4.2 Create Demo Components
- [ ] Create `app/demos/AnimatedFlipDemo.tsx`
- [ ] Create `app/demos/AnimatedFadeDemo.tsx`
- [ ] Create `app/demos/AnimatedSlideDemo.tsx`
- [ ] Create `app/demos/AnimatedBounceDemo.tsx`
- **Impact:** Reusable demo components

#### 4.3 Update Navigation
- [ ] Add AnimationsTab to `app/App.tsx`
- [ ] Add route for animations page
- [ ] Update navigation menu
- **Impact:** Accessible demo page

#### 4.4 Update Overview
- [ ] Add Animations section to OverviewTab
- [ ] Highlight animation capabilities
- **Impact:** Better documentation

### Progress

**Files to Create:**
- [ ] `app/tabs/AnimationsTab.tsx`
- [ ] `app/demos/AnimatedFlipDemo.tsx`
- [ ] `app/demos/AnimatedFadeDemo.tsx`
- [ ] `app/demos/AnimatedSlideDemo.tsx`
- [ ] `app/demos/AnimatedBounceDemo.tsx`

**Files to Modify:**
- [ ] `app/App.tsx` - Add route
- [ ] `app/tabs/OverviewTab.tsx` - Add animations section

---

## Phase 5: Documentation ⏳ PENDING

**Goal:** Complete documentation and examples
**Estimated Time:** 1-2 hours
**Status:** ⏳ Pending

### Tasks

#### 5.1 Update CLAUDE.md
- [ ] Add AnimationHOC section
- [ ] Document all animation components
- [ ] Add usage examples
- [ ] Document props and types
- **Impact:** AI-friendly documentation

#### 5.2 Create Usage Examples
- [ ] Basic AnimatedFlip example
- [ ] AnimatedFade with Dialog example
- [ ] AnimatedSlide with Sheet example
- [ ] Custom animation composition example
- **Impact:** Clear usage patterns

#### 5.3 Document Component Integration
- [ ] List which components use which animations
- [ ] Document animation props and defaults
- [ ] Add troubleshooting section
- **Impact:** Easy maintenance

### Progress

**Files to Modify:**
- [ ] `CLAUDE.md` - Add AnimationHOC documentation
- [ ] This file - Update with final results

---

## Architecture Decisions

### Animation HOC Structure

```typescript
// Generic pattern for all animation HOCs
interface AnimationHOCProps {
  children: ReactNode;
  trigger?: AnimationTrigger;
  duration?: number;
  className?: string;
  // Animation-specific props
}
```

### Directory Structure

```
lib/components/AnimationHOC/
├── AnimatedFlip/
│   ├── AnimatedFlip.tsx
│   └── index.ts
├── AnimatedFade/
│   ├── AnimatedFade.tsx
│   └── index.ts
├── AnimatedSlide/
│   ├── AnimatedSlide.tsx
│   └── index.ts
├── AnimatedBounce/
│   ├── AnimatedBounce.tsx
│   └── index.ts
├── index.ts              (barrel export all)
└── types.ts              (shared types)
```

### Import Pattern

```typescript
// Users can import specific animations
import { AnimatedFlip, AnimatedFade } from '@/catalyst-ui/components/AnimationHOC';

// Or import types
import type { AnimationTrigger, FlipDirection } from '@/catalyst-ui/components/AnimationHOC';
```

---

## Testing Strategy

### Manual Testing Checklist
- [ ] All animation triggers work (click, hover)
- [ ] All animation directions work
- [ ] Animations work with different content types
- [ ] Build passes with zero errors
- [ ] No visual regressions in existing components

### Integration Testing
- [ ] CodeFlipCard works with new AnimatedFlip
- [ ] Dialog animations work correctly
- [ ] Toast animations work correctly
- [ ] Sheet drawer animations work correctly

---

## Issues & Notes

### Current Issues
- None yet

### Decisions Made
- Animation HOCs are content-agnostic
- Each animation type in separate file/directory
- Shared types in dedicated types.ts file
- Follow existing component patterns (forwardRef, etc.)

### Future Enhancements
- [ ] Animation presets (spring, ease, linear)
- [ ] Stagger animation support
- [ ] Animation orchestration
- [ ] Performance monitoring

---

## Rollback Plan

Each phase is independent and can be reverted. All changes will be committed per phase with descriptive messages.

**Rollback Commands:**
```bash
# Rollback specific phase
git revert <phase-commit-hash>

# Rollback all animation HOC changes
git revert <first-commit-hash>..HEAD
```

---

**Last Updated:** 2025-01-06
**Status:** 🟡 Phase 1 in progress

---

## Component Animation Matrix

| Component | Current Animation | Proposed HOC | Status |
|-----------|------------------|-------------|--------|
| CodeFlipCard | Inline 3D transform | AnimatedFlip | 🔄 In Progress |
| Dialog (overlay) | Radix Animation | AnimatedFade | ⏳ Pending |
| Dialog (content) | Radix Animation | AnimatedSlide/Fade | ⏳ Pending |
| Toast | Inline slide | AnimatedSlide | ⏳ Pending |
| Sheet | Radix Animation | AnimatedSlide | ⏳ Pending |
| Dropdown Menu | Radix Animation | AnimatedFade | ⏳ Pending |
| Hover Card | Radix Animation | AnimatedFade | ⏳ Pending |

**Note:** Radix UI components come with built-in animations. We'll evaluate if replacing them with our HOCs provides value.

---
