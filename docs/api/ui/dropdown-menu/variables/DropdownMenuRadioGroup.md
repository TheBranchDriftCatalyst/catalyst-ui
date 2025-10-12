[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuRadioGroup

# Variable: DropdownMenuRadioGroup

> `const` **DropdownMenuRadioGroup**: `ForwardRefExoticComponent`\<`DropdownMenuRadioGroupProps` & `RefAttributes`\<`HTMLDivElement`\>\> = `DropdownMenuPrimitive.RadioGroup`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:98](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L98)

DropdownMenuRadioGroup - Container for mutually exclusive radio items

Groups DropdownMenuRadioItem components for single-selection behavior.
Only one radio item can be selected at a time within the group.

## Example

```tsx
<DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
  <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```
