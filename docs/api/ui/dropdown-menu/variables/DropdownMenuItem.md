[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuItem

# Variable: DropdownMenuItem

> `const` **DropdownMenuItem**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuItemProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `object` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:248](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L248)

DropdownMenuItem - Individual menu item for actions

A clickable menu item that triggers an action when selected. Includes hover/focus
states and supports disabled state. Can be used with `asChild` for custom elements.

**Props:**

- `inset` - Add extra left padding to align with checkbox/radio items
- `onSelect` - Callback fired when item is clicked or Enter is pressed

## Example

```tsx
<DropdownMenuItem onSelect={() => handleEdit()}>
  Edit Profile
</DropdownMenuItem>

// With icon and inset alignment
<DropdownMenuItem inset>
  <PencilIcon className="mr-2 h-4 w-4" />
  Edit
</DropdownMenuItem>

// Disabled item
<DropdownMenuItem disabled>
  Coming Soon
</DropdownMenuItem>
```
