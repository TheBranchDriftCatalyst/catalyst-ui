[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuLabel

# Variable: DropdownMenuLabel

> `const` **DropdownMenuLabel**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuLabelProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `object` & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:385](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L385)

DropdownMenuLabel - Non-interactive label for grouping menu items

A text label that provides context or categorization for groups of menu items.
Not focusable or clickable. Typically placed at the top of a group.

**Props:**

- `inset` - Add extra left padding to align with checkbox/radio items

## Example

```tsx
<DropdownMenuLabel>My Account</DropdownMenuLabel>
<DropdownMenuSeparator />
<DropdownMenuItem>Profile</DropdownMenuItem>
<DropdownMenuItem>Settings</DropdownMenuItem>

// With inset alignment
<DropdownMenuLabel inset>Actions</DropdownMenuLabel>
```
