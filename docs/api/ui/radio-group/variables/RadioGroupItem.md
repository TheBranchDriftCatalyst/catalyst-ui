[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/radio-group](../README.md) / RadioGroupItem

# Variable: RadioGroupItem

> `const` **RadioGroupItem**: `ForwardRefExoticComponent`\<`Omit`\<`RadioGroupItemProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/radio-group.tsx:113](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/radio-group.tsx#L113)

RadioGroupItem - Individual radio button option

A single radio button within a RadioGroup. Must have a unique `value` prop
and should be paired with a Label for accessibility.

**Accessibility:**

- Focus indicator with ring
- Disabled state styling
- Works with Label's htmlFor attribute

**Visual States:**

- Unchecked: Empty circle with border
- Checked: Circle with filled inner dot
- Focused: Ring around circle
- Disabled: Reduced opacity, not-allowed cursor

## Example

```tsx
<RadioGroupItem value="option1" id="r1" />
<RadioGroupItem value="option2" id="r2" disabled />
```
