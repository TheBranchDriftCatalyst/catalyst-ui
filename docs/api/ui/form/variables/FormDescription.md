[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / FormDescription

# Variable: FormDescription

> `const` **FormDescription**: `ForwardRefExoticComponent`\<`HTMLAttributes`\<`HTMLParagraphElement`\> & `RefAttributes`\<`HTMLParagraphElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:358](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L358)

FormDescription - Helper text for a form field

Displays additional information or instructions below the form control.
Automatically linked to the input via ARIA attributes for screen readers.

**Styling:**

- Muted foreground color for subtlety
- Small text size
- Proper spacing within FormItem

## Example

```tsx
<FormDescription>
  Your password must be at least 8 characters long
</FormDescription>

<FormDescription>
  We'll use this email to send you notifications
</FormDescription>
```
