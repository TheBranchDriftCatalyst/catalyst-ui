[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/button](../README.md) / Button

# Variable: Button

> `const` **Button**: `ForwardRefExoticComponent`\<[`ButtonProps`](../interfaces/ButtonProps.md) & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/button.tsx:112](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/button.tsx#L112)

Button - Primary interactive element for user actions

A versatile button component with multiple visual variants, sizes, and states.
Built on Radix UI primitives with full accessibility support. Includes smooth
hover effects, focus indicators, and disabled states.

**Variants:**

- `default` - Primary action button with theme colors
- `destructive` - For dangerous actions (delete, remove, etc.)
- `outline` - Secondary actions with border
- `secondary` - Alternative styling for less prominent actions
- `ghost` - Minimal styling, hover only
- `link` - Styled as a hyperlink

**Sizes:**

- `default` - Standard button height (40px)
- `sm` - Small button (36px)
- `lg` - Large button (44px)
- `icon` / `icon-sm` / `icon-lg` - Square buttons for icons

## Example

```tsx
// Primary action button
<Button variant="default" size="lg">
  Save Changes
</Button>

// Destructive action
<Button variant="destructive" onClick={() => handleDelete()}>
  Delete Account
</Button>

// Button as link (Radix Slot pattern)
<Button variant="outline" asChild>
  <a href="/docs">View Documentation</a>
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <SearchIcon />
</Button>
```
