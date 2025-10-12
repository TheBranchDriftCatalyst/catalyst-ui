[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/radio-group](../README.md) / RadioGroup

# Variable: RadioGroup

> `const` **RadioGroup**: `ForwardRefExoticComponent`\<`Omit`\<`RadioGroupProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/radio-group.tsx:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/radio-group.tsx#L82)

RadioGroup - Container for radio button options

Groups multiple RadioGroupItem components into a single-choice selection.
Built on Radix UI primitives with full keyboard navigation and accessibility
support. Only one option can be selected at a time.

**Accessibility Features:**

- Arrow key navigation between options
- Automatic focus management
- Proper ARIA attributes for screen readers
- Roving tabindex for keyboard navigation

**Layout:**
By default uses CSS Grid with gap-2 spacing. Override with className
for custom layouts (flex, custom grid, etc.)

**React Hook Form Integration:**
Use `value` prop with `field.value` and `onValueChange` with `field.onChange`

## Example

```tsx
// Basic radio group
<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="r2" />
    <Label htmlFor="r2">Option 2</Label>
  </div>
</RadioGroup>

// React Hook Form
<FormField
  control={form.control}
  name="notificationMethod"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Notification Method</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" id="sms" />
            <Label htmlFor="sms">SMS</Label>
          </div>
        </RadioGroup>
      </FormControl>
    </FormItem>
  )}
/>

// Custom layout (horizontal)
<RadioGroup defaultValue="small" className="flex space-x-4">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="small" id="small" />
    <Label htmlFor="small">Small</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="medium" id="medium" />
    <Label htmlFor="medium">Medium</Label>
  </div>
</RadioGroup>
```
