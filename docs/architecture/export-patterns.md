# Export Patterns

This document defines the standardized export patterns used throughout the catalyst-ui codebase.

## Overview

Consistent export patterns improve:

- Developer experience (predictable imports)
- Tree-shaking (better dead code elimination)
- Refactoring (easier to reorganize code)
- Type safety (clearer type exports)

## Standard Patterns

### 1. Barrel Exports (index.ts)

All major modules use barrel exports via `index.ts` files to provide clean, centralized re-exports.

**Pattern:**

```typescript
// lib/components/index.ts
export * from "./Card";
export * from "./CodeBlock";
export * from "./ForceGraph";
// ... etc
```

**When to use:**

- Top-level directories (components, hooks, contexts, ui, effects, cards)
- Feature modules with multiple exports (ForceGraph, MermaidForceGraph)
- Shared utilities (utils/markdown, utils/mermaid)

**Benefits:**

- Single import point: `import { Card, CodeBlock } from "@/catalyst-ui/components"`
- Easier refactoring (change implementation, keep exports)
- Clearer public API surface

### 2. Named Exports (Preferred)

Use named exports for all components, hooks, and utilities.

**Pattern:**

```typescript
// Good
export const MyComponent = () => { ... };
export function useMyHook() { ... }
export const myUtility = () => { ... };

// Avoid default exports
export default MyComponent; // ❌
```

**Why named exports:**

- Better IDE autocomplete
- Easier to refactor (find all references)
- Prevents naming inconsistencies
- Better tree-shaking

**Exceptions:**

- Component files may use default exports if they're immediately re-exported as named in index.ts
- But prefer named exports consistently

### 3. Type Exports

Always export types explicitly.

**Pattern:**

```typescript
// Export type definitions
export type { GraphState } from "./state";
export type { GraphAction } from "./actions";

// Re-export types from dependencies for convenience
export type { GraphConnectionFilter, GraphFilters } from "../types/filterTypes";
```

### 4. Directory Structure

Each component/module follows this structure:

```
ComponentName/
├── index.ts              # Barrel export
├── ComponentName.tsx     # Main implementation
├── types.ts             # Type definitions (if complex)
├── utils.ts             # Component-specific utilities
└── ComponentName.stories.tsx  # Storybook stories
```

**index.ts pattern:**

```typescript
export * from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

## Module-Specific Patterns

### Components (`lib/components`)

```typescript
// lib/components/index.ts
export * from "./Breadcrumbs";
export * from "./Card";
export * from "./CodeBlock";
// ...
```

**Usage:**

```typescript
import { Card, CodeBlock, Breadcrumbs } from "@/catalyst-ui/components";
```

### Effects (`lib/effects`)

```typescript
// lib/effects/index.ts
export * from "./AnimatedFlip";
export * from "./AnimatedFade";
export * from "./types";
```

**Usage:**

```typescript
import { AnimatedFlip, AnimatedFade } from "@/catalyst-ui/effects";
import type { AnimationTrigger } from "@/catalyst-ui/effects";
```

### Hooks (`lib/hooks`)

```typescript
// lib/hooks/index.ts
export * from "./useAnimationTriggers";
export * from "./useControllableState";
// ...
```

**Usage:**

```typescript
import { useAnimationTriggers, useControllableState } from "@/catalyst-ui/hooks";
```

### Contexts (`lib/contexts`)

```typescript
// lib/contexts/index.ts
export * from "./Theme";
export * from "./Card";
```

**Note:** CatalystHeader is exported here for convenience but lives in `components/`

**Usage:**

```typescript
import { ThemeProvider, CardProvider } from "@/catalyst-ui/contexts";
```

### UI Primitives (`lib/ui`)

```typescript
// lib/ui/index.ts
export * from "./button";
export * from "./input";
export * from "./card";
// ...
```

**Usage:**

```typescript
import { Button, Input, Card } from "@/catalyst-ui/ui";
```

### Cards (`lib/cards`)

```typescript
// lib/cards/index.ts
export * from "./CreateAccountCard";
export * from "./MultiChoiceQuetion";
export * from "./CharacterSheetResume";
```

**Usage:**

```typescript
import { CreateAccountCard, MultiChoiceQuestion } from "@/catalyst-ui/cards";
```

## Main Entry Point

The main entry point `lib/catalyst.ts` uses namespace exports for top-level modules:

```typescript
export * as cards from "./cards";
export * as components from "./components";
export * from "./contexts";
export * from "./effects";
export * from "./hooks";
export * from "./ui";
export * as utils from "./utils";
```

**Usage by consumers:**

```typescript
// Option 1: Namespaced imports
import { components, hooks, ui } from "catalyst-ui";
const { Card } = components;
const { useLocalStorageState } = hooks;

// Option 2: Direct imports (preferred)
import { Card } from "catalyst-ui/components";
import { useLocalStorageState } from "catalyst-ui/hooks";
```

## Anti-Patterns to Avoid

### ❌ Default Exports

```typescript
// Avoid
export default function MyComponent() { ... }

// Prefer
export function MyComponent() { ... }
```

### ❌ Inline Exports

```typescript
// Avoid mixing in barrel files
export const MyComponent = () => { ... }; // Don't define here
export * from "./OtherComponent";

// Prefer separation
// index.ts (barrel only)
export * from "./MyComponent";
export * from "./OtherComponent";
```

### ❌ Circular Dependencies

```typescript
// Avoid
// ComponentA imports ComponentB
// ComponentB imports ComponentA

// Solution: Extract shared logic to a third module
```

### ❌ Deep Imports

```typescript
// Avoid
import { GraphContext } from "@/catalyst-ui/components/ForceGraph/context/GraphContext";

// Prefer barrel exports
import { GraphContext } from "@/catalyst-ui/components/ForceGraph";
```

## Phase 6 Improvements

Recent Phase 6 refactoring added:

1. **Component barrel export** (`lib/components/index.ts`)
   - Centralized re-exports for all components
   - Consistent with other module patterns

2. **ForceGraph context splitting**
   - Split GraphContext.tsx into focused modules:
     - `state.ts` - State types and defaults
     - `actions.ts` - Action definitions
     - `reducer.ts` - Reducer logic
     - `GraphContext.tsx` - Context and hooks
     - `index.ts` - Barrel exports

3. **Card index.ts standardization**
   - Added index.ts to CreateAccountCard and MultiChoiceQuetion
   - Ensures consistent directory-based exports

4. **Context cleanup**
   - Removed commented code from `lib/contexts/index.ts`
   - Added documentation for cross-directory exports

## Checklist for New Modules

When creating a new component/module:

- [ ] Create directory with component name
- [ ] Add `index.ts` barrel export
- [ ] Use named exports in implementation
- [ ] Export types explicitly
- [ ] Add to parent `index.ts` barrel
- [ ] Document any cross-directory exports
- [ ] Test imports work as expected

## References

- [Barrel Exports Pattern](https://basarat.gitbook.io/typescript/main-1/barrel)
- [Named vs Default Exports](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)
- Tree-shaking works best with named exports
