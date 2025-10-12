[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / Select

# Variable: Select

> `const` **Select**: `FC`\<`SelectProps`\> = `SelectPrimitive.Root`

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:40](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L40)

Select - Root component for dropdown selection

A fully accessible dropdown select component built on Radix UI primitives.
Provides keyboard navigation, search, and proper ARIA attributes.

**Composition Pattern:**
Use with SelectTrigger, SelectContent, and SelectItem to build complete dropdowns.

**Accessibility:**

- Keyboard navigation (Arrow keys, Home, End, Page Up/Down)
- Type-ahead search
- Focus management
- Screen reader support

**React Hook Form Integration:**
Use `value` with `field.value` and `onValueChange` with `field.onChange`

## Example

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```
