[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/textarea](../README.md) / Textarea

# Variable: Textarea

> `const` **Textarea**: `ForwardRefExoticComponent`\<[`TextareaProps`](../interfaces/TextareaProps.md) & `RefAttributes`\<`HTMLTextAreaElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/textarea.tsx:84](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/textarea.tsx#L84)

Textarea - Multi-line text input component

A resizable text input for longer form content like comments, descriptions,
or messages. Includes smooth animations and consistent styling with other
form inputs.

**Features:**

- Minimum height of 80px (customizable via className)
- User-resizable by default (browser native)
- Focus ring for keyboard navigation
- Hover effects on border
- Subtle scale animation on focus
- Placeholder text support
- Disabled state styling

**Accessibility:**

- Proper focus indicators
- Disabled state with cursor and opacity changes
- Works with Label component via id/htmlFor

**React Hook Form Integration:**
Spread `{...field}` to connect with form state and validation.

## Example

```tsx
// Basic textarea
<Textarea placeholder="Enter your message..." />

// With controlled value
<Textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>

// Custom height
<Textarea
  className="min-h-[200px]"
  placeholder="Write a long description..."
/>

// Disable resize
<Textarea className="resize-none" />

// React Hook Form
<FormField
  control={form.control}
  name="bio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Bio</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Tell us about yourself"
          {...field}
        />
      </FormControl>
      <FormDescription>
        Brief description for your profile
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

// Disabled state
<Textarea disabled placeholder="Not editable" />

// With rows prop
<Textarea rows={5} placeholder="Fixed row height" />
```
