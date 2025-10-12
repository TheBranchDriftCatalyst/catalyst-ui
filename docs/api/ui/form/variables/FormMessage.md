[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/form](../README.md) / FormMessage

# Variable: FormMessage

> `const` **FormMessage**: `ForwardRefExoticComponent`\<`HTMLAttributes`\<`HTMLParagraphElement`\> & `RefAttributes`\<`HTMLParagraphElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/form.tsx:402](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/form.tsx#L402)

FormMessage - Validation error message display

Automatically displays validation error messages from React Hook Form.
Only renders when there's an error or when children are provided.
Linked to the form control via ARIA for accessibility.

**Behavior:**

- Shows error message from validation when field has error
- Can show custom content via children prop
- Returns null when no error and no children (no empty DOM node)
- Automatically styled in destructive/error color

**Priority:**
Error messages from validation take precedence over children.

## Example

```tsx
// Automatic error display from validation
<FormMessage />

// Custom success message
<FormMessage className="text-green-600">
  Username is available!
</FormMessage>
```
