[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuContent

# Variable: DropdownMenuContent

> `const` **DropdownMenuContent**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuContentProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:202](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L202)

DropdownMenuContent - Main popover container for menu items

The primary container for dropdown menu items. Automatically positioned relative to
the trigger with collision detection. Includes smooth zoom and slide animations based
on placement side. Renders in a portal at document.body for proper z-index stacking.

**Features:**

- Automatic positioning with collision detection
- Minimum width of 8rem
- Smooth entrance/exit animations
- 4px default offset from trigger
- Click outside to close
- ESC key to close

## Example

```tsx
// Default positioning
<DropdownMenuContent>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
</DropdownMenuContent>

// Custom offset
<DropdownMenuContent sideOffset={8}>
  {items}
</DropdownMenuContent>
```
