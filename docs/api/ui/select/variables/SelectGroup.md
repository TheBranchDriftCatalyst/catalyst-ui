[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/select](../README.md) / SelectGroup

# Variable: SelectGroup

> `const` **SelectGroup**: `ForwardRefExoticComponent`\<`SelectGroupProps` & `RefAttributes`\<`HTMLDivElement`\>\> = `SelectPrimitive.Group`

Defined in: [workspace/catalyst-ui/lib/ui/select.tsx:63](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/select.tsx#L63)

SelectGroup - Groups related select options with an optional label

Use to organize options into logical sections within a dropdown.
Should contain a SelectLabel followed by SelectItem components.

## Example

```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Fruits</SelectLabel>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
  <SelectGroup>
    <SelectLabel>Vegetables</SelectLabel>
    <SelectItem value="carrot">Carrot</SelectItem>
  </SelectGroup>
</SelectContent>
```
