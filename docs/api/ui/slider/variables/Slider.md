[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/slider](../README.md) / Slider

# Variable: Slider

> `const` **Slider**: `ForwardRefExoticComponent`\<`SliderProps` & `RefAttributes`\<`HTMLSpanElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/slider.tsx:162](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/slider.tsx#L162)

Slider - Range input component with customizable value display

A fully accessible range slider built on Radix UI primitives with optional
value labels, custom thumb shapes, and formatted value display. Perfect for
settings, filters, and value selection.

**Features:**

- Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
- Optional value display (inside thumb or tooltip)
- Custom thumb shapes (circle, rectangle, rounded-rectangle)
- Label mapping for discrete values
- Custom value formatting
- Smooth animations and hover effects
- Disabled state support

**Accessibility:**

- Full keyboard control
- ARIA attributes for screen readers
- Focus indicators
- Disabled state styling

**Value Display Options:**

- `showValue={false}` - No label (default)
- `labelPosition="outside"` - Tooltip that appears on hover
- `labelPosition="inside"` - Value shown inside enlarged thumb

**React Hook Form Integration:**
Use `value` with `field.value` and `onValueChange` with `field.onChange`

## Example

```tsx
// Basic slider
<Slider
  defaultValue={[50]}
  max={100}
  step={1}
/>

// With value display (tooltip on hover)
<Slider
  defaultValue={[75]}
  max={100}
  showValue
/>

// Value inside thumb
<Slider
  defaultValue={[50]}
  max={100}
  showValue
  labelPosition="inside"
  thumbShape="rounded-rectangle"
/>

// Custom formatting (percentage)
<Slider
  defaultValue={[0.5]}
  max={1}
  step={0.01}
  showValue
  formatValue={(val) => `${Math.round(val * 100)}%`}
/>

// Discrete labels (skill level)
<Slider
  defaultValue={[2]}
  min={1}
  max={5}
  step={1}
  showValue
  labelPosition="inside"
  thumbShape="rounded-rectangle"
  labels={{
    1: "Novice",
    2: "Beginner",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert"
  }}
/>

// React Hook Form
<FormField
  control={form.control}
  name="volume"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Volume: {field.value}%</FormLabel>
      <FormControl>
        <Slider
          value={[field.value]}
          onValueChange={(vals) => field.onChange(vals[0])}
          max={100}
          step={1}
        />
      </FormControl>
    </FormItem>
  )}
/>

// Disabled state
<Slider defaultValue={[50]} disabled />
```
