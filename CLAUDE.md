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
- **`components/`** - General components (CatalystHeader, NavigationHeader, ForceGraph, SimpleTable, SimpleGrid, Breadcrumbs)
- **`contexts/`** - React contexts (Theme, Debug, Header)
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
