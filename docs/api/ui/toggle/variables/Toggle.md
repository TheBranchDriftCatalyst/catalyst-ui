[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/toggle](../README.md) / Toggle

# Variable: Toggle

> `const` **Toggle**: `ForwardRefExoticComponent`\<`Omit`\<`ToggleProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `VariantProps`\<(`props?`) => `string`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toggle.tsx:126](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toggle.tsx#L126)

Toggle - Two-state button for on/off selections

A button that can be toggled between on and off states. Built on Radix UI
primitives with full accessibility support. Different from a checkbox - use
Toggle for actions that apply immediately (like bold text), use Checkbox
for form selections.

**Variants:**

- `default` - Transparent background, accent color when active
- `outline` - Border with transparent background

**Sizes:**

- `sm` - Small (36px height)
- `default` - Standard (40px height)
- `lg` - Large (44px height)

**States:**

- `off` (default) - Inactive state with transparent background
- `on` - Active state with accent background color
- `disabled` - Cannot be toggled, reduced opacity

**Accessibility:**

- Proper ARIA attributes
- Keyboard accessible (Space/Enter to toggle)
- Focus ring for keyboard navigation
- Screen reader support

**Use Cases:**

- Toolbar buttons (bold, italic, underline)
- View toggles (grid/list view)
- Feature toggles in UI
- Filter chips

## Example

```tsx
// Basic toggle
<Toggle aria-label="Toggle italic">
  <ItalicIcon />
</Toggle>

// Controlled toggle
<Toggle
  pressed={isBold}
  onPressedChange={setIsBold}
  aria-label="Toggle bold"
>
  <BoldIcon />
</Toggle>

// Outline variant
<Toggle variant="outline" aria-label="Toggle feature">
  Feature
</Toggle>

// Different sizes
<Toggle size="sm">Small</Toggle>
<Toggle size="default">Default</Toggle>
<Toggle size="lg">Large</Toggle>

// Toolbar example
<div className="flex gap-1">
  <Toggle
    pressed={isBold}
    onPressedChange={setIsBold}
    aria-label="Toggle bold"
  >
    <BoldIcon />
  </Toggle>
  <Toggle
    pressed={isItalic}
    onPressedChange={setIsItalic}
    aria-label="Toggle italic"
  >
    <ItalicIcon />
  </Toggle>
  <Toggle
    pressed={isUnderline}
    onPressedChange={setIsUnderline}
    aria-label="Toggle underline"
  >
    <UnderlineIcon />
  </Toggle>
</div>

// Disabled state
<Toggle disabled aria-label="Toggle feature">
  Disabled
</Toggle>
```
