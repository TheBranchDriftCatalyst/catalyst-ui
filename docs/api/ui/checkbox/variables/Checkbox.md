[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/checkbox](../README.md) / Checkbox

# Variable: Checkbox

> `const` **Checkbox**: `ForwardRefExoticComponent`\<`Omit`\<`CheckboxProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/checkbox.tsx:69](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/checkbox.tsx#L69)

Checkbox - Accessible checkbox input component

A fully accessible checkbox built on Radix UI primitives with a check icon
indicator. Supports checked, unchecked, and indeterminate states with proper
keyboard navigation and screen reader support.

**Accessibility Features:**

- Full keyboard navigation (Space to toggle)
- Focus ring for keyboard users
- ARIA attributes for screen readers
- Disabled state styling
- Proper checked/unchecked state announcements

**States:**

- `unchecked` - Default empty state
- `checked` - Selected state with check icon
- `indeterminate` - Partial selection (for parent checkboxes)

**React Hook Form Integration:**
Use `checked` prop with `field.value` and `onCheckedChange` with `field.onChange`

## Example

```tsx
// Standalone checkbox
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

// React Hook Form
<FormField
  control={form.control}
  name="marketing"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>Send me marketing emails</FormLabel>
    </FormItem>
  )}
/>

// Disabled state
<Checkbox disabled checked />

// Indeterminate state (partial selection)
<Checkbox checked="indeterminate" />
```
