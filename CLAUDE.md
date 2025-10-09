# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

catalyst-ui is a React component library built with Vite and TypeScript. It uses Storybook for component development and testing, with Radix UI primitives and Tailwind CSS for styling. The library exports reusable UI components, cards, contexts, and hooks.

## Common Commands

### Development

```bash
yarn dev                    # Start all dev services (Storybook + preview via Foreman)
yarn dev:storybook         # Storybook only (port 6006)
yarn dev:preview           # Preview production build
```

### Building

```bash
yarn build                 # Build library (TypeScript + Vite)
yarn build:watch           # Build in watch mode
yarn build:storybook       # Build Storybook for deployment
```

### Testing

```bash
yarn dev:test              # Run Storybook test runner with coverage
```

The test runner uses snapshot testing via `test-runner.ts`. Snapshots are stored alongside stories.

### Linting

```bash
yarn lint                  # ESLint check
```

### Component Scaffolding

```bash
task new-component         # Interactive component creation (uses fzf for directory selection)
```

Creates both `.tsx` and `.stories.tsx` files from templates in `etc/templates/`.

## Architecture

### Library Structure

The library is organized under `lib/` with the following directories:

- **`cards/`** - Card-based UI components (CreateAccountCard, MultiChoiceQuestion)
- **`components/`** - General components:
  - **`effects/`** - Generic animation HOCs (AnimatedFlip, AnimatedFade, AnimatedSlide, AnimatedBounce)
  - CatalystHeader, NavigationHeader, ForceGraph, SimpleTable, SimpleGrid, Breadcrumbs
  - CodeFlipCard (uses AnimatedFlip for 3D flip animation)
- **`contexts/`** - React contexts (Theme, Debug, Header, Card)
- **`hooks/`** - Custom hooks (useDynamicImport, useLocalStorageState)
- **`ui/`** - Base UI primitives (button, input, form, table, dialog, etc. - Radix UI + Tailwind)

### Entry Point

`lib/catalyst.ts` is the main entry point that re-exports all public APIs:

- Components (via `components` namespace)
- Contexts (Theme, Debug, Header providers)
- Hooks
- UI primitives
- Utils
- Tailwind theme config (`catalystTwTheme`)
- Global CSS (`catalystCSS` as inline string)

### Build Configuration

**Vite (vite.config.ts):**

- Library mode with ES modules output
- Generates TypeScript declarations via `vite-plugin-dts`
- Builds all `.ts`, `.tsx`, `.css` files under `lib/` (excluding `.stories.tsx`)
- Code coverage instrumentation via `vite-plugin-istanbul`
- External: `react`, `react/jsx-runtime`
- Outputs to `dist/` with structure mirroring `lib/`

**TypeScript:**

- Path alias: `@/catalyst-ui/*` maps to `lib/*`
- Excludes story files from compilation
- Strict mode enabled

### Theming System

**Multi-theme support with CSS custom properties:**

Located in `lib/contexts/Theme/`:

- `ThemeProvider.tsx` - Context provider with localStorage persistence
- `ThemeContext.tsx` - Theme context definition
- `ChangeThemeDropdown.tsx` - Theme selector component
- `ToggleDarkMode.tsx` - Light/dark variant toggle
- `styles/` - Theme CSS files (catalyst, dracula, gold, laracon, nature, netflix, nord)

Themes are applied via className on `<html>`: `theme-{name} {variant}`

- Theme names: dracula, gold, laracon, nature, netflix, nord, catalyst
- Variants: `dark` or `light`

### Header System

**Dynamic header management:**

Located in `lib/components/CatalystHeader/`:

- `HeaderProvider.tsx` - Context for managing header components, breadcrumbs, and page titles
- Components can register/deregister themselves in the header dynamically
- `CatalystHeader.tsx` - Main header component that consumes the context

### Animation System

**Two complementary approaches:**

**1. Animation Effect HOCs** (`lib/effects/`)

> **Note**: The `effects/` directory was renamed from `animation/` in Phase 6 (Oct 2025).
> These docs may still reference "animation HOCs" but the folder is now `effects/`.
> See: `/docs/architecture/export-patterns.md` for details on the rename.

Generic Higher-Order Components for interactive animations:

- **`AnimatedFlip`** - 3D flip animation (horizontal/vertical)
  - Used in CodeFlipCard to show component source code
  - Controlled/uncontrolled modes via `isFlipped` prop
  - Example: `<AnimatedFlip front={<Card>...</Card>} back={<Code>...</Code>} />`

- **`AnimatedFade`** - Opacity-based fade in/out
  - Perfect for overlays, modals, tooltips
  - Controlled/uncontrolled modes via `isVisible` prop
  - Example: `<AnimatedFade isVisible={show}>{children}</AnimatedFade>`

- **`AnimatedSlide`** - Directional slide animations (top/right/bottom/left)
  - Great for drawers, sheets, notifications
  - Configurable distance and direction
  - Example: `<AnimatedSlide direction="left" distance={50}>{content}</AnimatedSlide>`

- **`AnimatedBounce`** - Spring-like scale animation
  - Adds playfulness to buttons, icons, cards
  - Configurable intensity (scale multiplier)
  - Example: `<AnimatedBounce trigger="hover" intensity={1.1}><Button /></AnimatedBounce>`

**Key Features:**

- Content-agnostic - works with any React components
- Controlled & uncontrolled modes for flexibility
- TypeScript first with full type safety
- Hardware-accelerated CSS transitions
- Consistent API across all HOCs

**Import:**

```typescript
import { AnimatedFlip, AnimatedFade, AnimatedSlide, AnimatedBounce } from "@/catalyst-ui/effects";
```

**2. CSS Keyframe Animations** (`lib/contexts/Theme/styles/catalyst.css`)

Theme-specific visual effects (Catalyst theme only):

- **`glow-pulse`** - Subtle pulsing box-shadow for cards/panels (8s)
- **`border-shimmer`** - Gradient shimmer along borders (8s)
- **`pulse-scale`** - Fade + scale effect for subtle pulsing elements (8s)
- **`text-glow`** - Text-shadow pulse for links (4s)
- **`neon-glow`** - Box shadow glow for buttons/icons
- **`opacity-pulse`** - Simple opacity fade (1 → 0.8 → 1)

**Usage:** Apply via inline styles or className

```tsx
<div style={{ animation: "glow-pulse 8s ease-in-out infinite" }}>Ultra-subtle box-shadow pulse</div>
```

**When to use each:**

| Use Animation HOCs when...             | Use CSS Animations when...          |
| -------------------------------------- | ----------------------------------- |
| Building custom interactive components | Adding theme-specific visual polish |
| Need state-driven animations           | Want hover/focus effects            |
| Require controlled behavior            | Applying subtle background effects  |
| Working without Radix primitives       | Enhancing cyberpunk aesthetic       |

**Note on Radix UI:** Dialog, Toast, Sheet, Dropdown, etc. use built-in Radix animations - don't replace them. Radix handles state management, accessibility, and focus trapping. Our HOCs are for **custom components**.

**Demo:** See `app/tabs/AnimationsTab.tsx` for live interactive examples

**Architecture Doc:** `docs/architecture/animation-hoc.md` - Complete implementation details

> **Historical Note**: This document was written when the folder was called `animation/`.
> Throughout the doc, "animation HOCs" and "effect HOCs" are used interchangeably to refer to the components in `lib/effects/`.

### Storybook Configuration

**`.storybook/main.ts`:**

- Stories located in `lib/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Addons: jest, themes, dark-mode, coverage, mock, docs
- Coverage addon configured with debug mode
- Test build disables docs addons for performance

**`.storybook/preview.tsx`:**

- Dark mode support via `storybook-dark-mode`
- Theme switching via `withThemeByClassName` decorator
- All theme variants available in Storybook
- Default theme: "catalyst"

### Form Handling

Uses React Hook Form + Zod for validation:

- Forms defined with `react-hook-form`
- Schema validation with `zod`
- Resolver via `@hookform/resolvers`

### Data Visualization

D3.js integration:

- `ForceGraph` component uses D3 for graph visualization
- Types from `@types/d3`

### Path Aliases

Import paths use `@/` prefix:

- `@/catalyst-ui/*` resolves to `lib/*`
- Configured in `tsconfig.json` paths and `vite-tsconfig-paths` plugin

## Important Notes

- **CSS Handling**: Vite config has `cssCodeSplit: true` - each component's CSS is split into separate files
- **Source Maps**: Enabled in build, with SOURCEMAP_ERROR warnings suppressed (known Vite issue with directives)
- **Playwright**: Auto-installs via `postinstall` hook for Storybook test runner
- **Process Management**: `Procfile.dev` defines multi-process dev environment (Storybook + preview)
- **Component Templates**: Use `task new-component` instead of manually creating files to ensure consistency
