[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / SelectTrigger

# Variable: SelectTrigger

> `const` **SelectTrigger**: `ForwardRefExoticComponent`\<`Omit`\<`SelectTriggerProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:104](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L104)

SelectTrigger - Button that opens the select dropdown

The clickable element that displays the current selection and opens
the dropdown menu. Should contain a SelectValue component.

**Styling:**

- Matches Input component styling for consistency
- Focus ring for keyboard navigation
- Disabled state styling
- Chevron icon indicator

## Example

```tsx
<SelectTrigger>
  <SelectValue placeholder="Select a fruit" />
</SelectTrigger>

// Custom width
<SelectTrigger className="w-[200px]">
  <SelectValue />
</SelectTrigger>
```
