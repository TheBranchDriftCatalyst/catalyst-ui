[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuGroup

# Variable: DropdownMenuGroup

> `const` **DropdownMenuGroup**: `ForwardRefExoticComponent`\<`DropdownMenuGroupProps` & `RefAttributes`\<`HTMLDivElement`\>\> = `DropdownMenuPrimitive.Group`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:56](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L56)

DropdownMenuGroup - Logical grouping for menu items

Groups related menu items together. Does not add visual styling - use
DropdownMenuSeparator between groups for visual separation.

## Example

```tsx
<DropdownMenuGroup>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
</DropdownMenuGroup>
```
