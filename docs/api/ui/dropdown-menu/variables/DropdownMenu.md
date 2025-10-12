[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenu

# Variable: DropdownMenu

> `const` **DropdownMenu**: `FC`\<`DropdownMenuProps`\> = `DropdownMenuPrimitive.Root`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:25](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L25)

DropdownMenu - Root component for dropdown menu state management

Radix UI DropdownMenu primitive that handles open/close state, positioning, and accessibility.
Use this as the root wrapper for all dropdown menus.

## Example

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
