# Design Token Documentation System

> **Status**: ✅ This document describes the CURRENT, working design token system.
>
> **Future Enhancement**: See [Design Tokens Auto-Generation RFC](../features/design-tokens-autogen.md) for a planned feature that will generate tokens JSON for production builds. That RFC is a proposal for enhancement, not a replacement of this system.

## Overview

This project uses **storybook-design-token** addon to auto-generate documentation for all CSS design tokens. The system extracts tokens from annotated CSS files and displays them in interactive Storybook documentation.

**Current Scope:**

- ✅ Works in Storybook (development)
- ✅ Parses CSS files with `@token` annotations
- ✅ Displays tokens in interactive documentation
- ⚠️ Production builds: DesignTokenDocBlock not yet supported (see RFC for planned fix)

## How It Works

### 1. Token Annotation

CSS custom properties are annotated with special comments:

```css
/* Simple token */
--primary-color: #00fcd6; /* @token { "name": "Primary Color", "category": "Colors/Primary" } */

/* Token with category */
/**
 * @tokens Neon Colors
 * @presenter Color
 */
--neon-cyan: hsl(180, 85%, 45%); /* @token { "name": "Neon Cyan", "category": "Colors/Neon" } */
```

### 2. Token Categories

Tokens are organized by category for easy navigation:

**Light Mode:**

- `Colors/Background` - Page and content backgrounds
- `Colors/Primary` - Primary brand colors
- `Colors/Secondary` - Secondary accent colors
- `Colors/Neon` - Vibrant cyberpunk neon colors
- `Effects/Glow` - Neon glow box-shadow effects
- `Effects/Shadows` - Multi-layer neon shadows
- `Spacing/Radius` - Border radius values

**Dark Mode:**

- `Dark/Colors/*` - All dark mode color variants
- `Dark/Effects/*` - Dark mode specific effects
- `Dark/Effects/Scanline` - Retro scanline effects
- `Dark/Effects/Grid` - Cyberpunk grid overlays

### 3. Presenter Types

Different presenters visualize tokens appropriately:

- `@presenter Color` - Shows color swatches
- `@presenter Shadow` - Displays shadow effects
- `@presenter Spacing` - Shows spacing/sizing
- `@presenter Opacity` - Demonstrates opacity values

## Adding New Tokens

### Step 1: Define the Token in CSS

```css
.theme-catalyst.dark {
  /**
   * @tokens New Category
   * @presenter Color
   */
  --my-new-token: #ff00ff; /* @token { "name": "My Token", "category": "Custom/New" } */
}
```

### Step 2: Auto-Documentation

The token will automatically appear in:

- Storybook Design Tokens panel
- `Design System/Design Tokens` story
- Filtered by category in specific stories

### Step 3: Use the Token

```tsx
<div style={{ color: "var(--my-new-token)" }}>Styled with design token</div>
```

## Storybook Configuration

The addon is configured in `.storybook/main.ts`:

```typescript
addons: [
  // ... other addons
  "storybook-design-token",
];
```

Stories specify which CSS files to parse:

```typescript
parameters: {
  designToken: {
    files: ["lib/contexts/Theme/styles/catalyst.css"],
  },
}
```

## Viewing Documentation

### In Storybook

1. Run `yarn dev:storybook`
2. Navigate to **Design System → Design Tokens**
3. Browse organized token collections:
   - **Catalyst Theme Tokens** - All tokens in table view
   - **Color Palette** - Neon colors in card view
   - **Glow Effects** - Shadow-based glows
   - **Shadow System** - Elevation shadows
   - **Light Mode Palette** - Light theme colors
   - **Dark Mode Palette** - Dark theme colors

### Design Token Panel

Every story has a "Design Tokens" tab showing:

- All tokens used in the current story
- Color swatches, shadows, and values
- Copy token names for use in code

## Best Practices

### 1. Consistent Naming

```css
/* Good - follows pattern */
--{theme}-{category}-{variant}: value;
--neon-cyan: #00fcd6;
--glow-primary: 0 0 20px rgba(...);

/* Avoid - inconsistent */
--myColor: #00fcd6;
--glowEffect1: 0 0 20px rgba(...);
```

### 2. Meaningful Categories

Organize by:

- **Purpose**: Colors, Effects, Spacing, Typography
- **Component**: Button, Card, Form
- **State**: Hover, Active, Disabled

### 3. Documentation Comments

Always include:

```css
/**
 * @tokens Category Name
 * @presenter PresentationType
 */
--token-name: value; /* @token { "name": "Display Name", "category": "Category/Subcategory" } */
```

### 4. Color Formats

Use consistent formats per theme:

- Light mode: `hsl()` for easy color adjustments
- Dark mode: `hex` for precise cyberpunk colors
- Effects: `rgba()` for transparency

## Advanced Features

### View Types

**Card View** - Visual grid of tokens

```typescript
<DesignTokenDocBlock viewType="card" />
```

**Table View** - Detailed list with values

```typescript
<DesignTokenDocBlock viewType="table" />
```

### Category Filtering

Show specific token groups:

```typescript
<DesignTokenDocBlock categoryFilter="Colors/Neon" />
```

### Color Space Display

Change how colors are displayed:

```typescript
<DesignTokenDocBlock colorSpace="hsl" /> // or "hex", "rgb"
```

## Token Architecture

### Theme Variables Flow

```
catalyst.css (source of truth)
    ↓
@token annotations
    ↓
storybook-design-token parser
    ↓
Storybook UI Documentation
    ↓
Design Token Stories
```

### CSS Variable Hierarchy

```css
/* Base tokens */
--primary: #00fcd6;

/* Semantic tokens */
--button-bg: var(--primary);

/* Component tokens */
--cta-button: var(--button-bg);
```

## Maintenance

### Adding New Effect Types

1. Create presenter type in annotations:

```css
/**
 * @tokens New Effect
 * @presenter CustomPresenter
 */
```

2. Define tokens with category:

```css
--effect-name: value; /* @token { "name": "Effect", "category": "Effects/New" } */
```

3. Create dedicated story for visibility:

```typescript
export const NewEffects: Story = {
  render: () => <DesignTokenDocBlock categoryFilter="Effects/New" />
}
```

### Updating Token Values

Simply update the CSS value - documentation updates automatically:

```css
/* Before */
--neon-cyan: #00fcd6; /* @token ... */

/* After */
--neon-cyan: #00fff0; /* @token ... */
```

No code changes needed - Storybook reflects the update immediately.

## Export & Integration

### Using in Components

```typescript
import { catalystCSS } from '@/catalyst-ui';

// CSS is auto-included, tokens available via var()
<Button style={{ boxShadow: 'var(--glow-primary)' }} />
```

### Export to Other Formats

Tokens can be exported via Style Dictionary or custom scripts:

- JSON for design tools
- SCSS/LESS for other build systems
- Platform-specific formats (iOS, Android)

## Resources

- [Storybook Design Token Addon](https://github.com/UX-and-I/storybook-design-token)
- [Design Tokens W3C Spec](https://design-tokens.github.io/community-group/format/)
- [Style Dictionary](https://github.com/style-dictionary/style-dictionary))

---

**Built with ❤️ for the Catalyst Design System**
