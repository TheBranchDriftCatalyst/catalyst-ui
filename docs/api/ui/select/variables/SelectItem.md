[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / SelectItem

# Variable: SelectItem

> `const` **SelectItem**: `ForwardRefExoticComponent`\<`Omit`\<`SelectItemProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:288](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L288)

SelectItem - Individual selectable option in a dropdown

A single option within the select dropdown. Must have a unique `value` prop.
Shows a check icon when selected and highlights on hover/focus.

**Accessibility:**

- Keyboard navigable
- Focus styling
- Disabled state support
- Screen reader friendly

**Visual States:**

- Default: Plain text with left padding for check icon space
- Hover/Focus: Accent background color
- Selected: Check icon appears on left
- Disabled: Reduced opacity, not interactive

## Example

```tsx
<SelectItem value="apple">Apple</SelectItem>
<SelectItem value="banana" disabled>Banana (Out of stock)</SelectItem>
```
