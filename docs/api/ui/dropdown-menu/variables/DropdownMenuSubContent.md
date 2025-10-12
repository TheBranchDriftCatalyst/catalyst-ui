[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuSubContent

# Variable: DropdownMenuSubContent

> `const` **DropdownMenuSubContent**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuSubContentProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:158](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L158)

DropdownMenuSubContent - Container for nested sub-menu items

Popover content for nested sub-menus. Automatically positions itself relative
to the trigger and includes smooth animations. Minimum width of 8rem.
Use within DropdownMenuSub after DropdownMenuSubTrigger.

## Example

```tsx
<DropdownMenuSubContent>
  <DropdownMenuItem>Nested Item 1</DropdownMenuItem>
  <DropdownMenuItem>Nested Item 2</DropdownMenuItem>
</DropdownMenuSubContent>
```
