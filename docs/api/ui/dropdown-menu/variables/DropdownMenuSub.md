[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuSub

# Variable: DropdownMenuSub

> `const` **DropdownMenuSub**: `FC`\<`DropdownMenuSubProps`\> = `DropdownMenuPrimitive.Sub`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L82)

DropdownMenuSub - Root component for nested sub-menus

Container for creating nested dropdown menus. Use with DropdownMenuSubTrigger
and DropdownMenuSubContent to create hierarchical menu structures.

## Example

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```
