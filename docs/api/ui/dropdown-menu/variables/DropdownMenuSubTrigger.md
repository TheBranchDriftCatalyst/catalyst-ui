[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuSubTrigger

# Variable: DropdownMenuSubTrigger

> `const` **DropdownMenuSubTrigger**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuSubTriggerProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `object` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:122](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L122)

DropdownMenuSubTrigger - Trigger for opening nested sub-menus

Menu item that opens a nested sub-menu on hover or click. Automatically includes
a chevron-right icon to indicate expandability. Use within DropdownMenuSub.

**Props:**

- `inset` - Add extra left padding to align with checkbox/radio items

## Example

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>Export Options</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```
