[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / FormItem

# Variable: FormItem

> `const` **FormItem**: `ForwardRefExoticComponent`\<`HTMLAttributes`\<`HTMLDivElement`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:230](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L230)

FormItem - Container for a single form field and its label, description, and error

Provides spacing and context for form field components. Generates unique IDs
that connect labels, inputs, descriptions, and error messages for accessibility.

**Structure:**
Typically contains FormLabel, FormControl, FormDescription, and FormMessage
in that order, with automatic spacing between them.

**Accessibility:**
Automatically generates and manages IDs used for:

- `htmlFor` on labels
- `id` on inputs
- `aria-describedby` linking descriptions and errors

## Example

```tsx
<FormItem>
  <FormLabel>Username</FormLabel>
  <FormControl>
    <Input {...field} />
  </FormControl>
  <FormDescription>This will be your public display name</FormDescription>
  <FormMessage />
</FormItem>
```
