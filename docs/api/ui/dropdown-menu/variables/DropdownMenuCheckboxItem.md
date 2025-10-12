[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuCheckboxItem

# Variable: DropdownMenuCheckboxItem

> `const` **DropdownMenuCheckboxItem**: `ForwardRefExoticComponent`\<`Omit`\<`DropdownMenuCheckboxItemProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:294](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L294)

DropdownMenuCheckboxItem - Toggleable checkbox menu item

A menu item with checkbox behavior for toggling boolean states. Displays a check
icon when checked. Use for multi-select options where multiple items can be active.

**Props:**

- `checked` - Boolean or "indeterminate" state
- `onCheckedChange` - Callback fired when checkbox state changes

## Example

```tsx
<DropdownMenuCheckboxItem
  checked={showToolbar}
  onCheckedChange={setShowToolbar}
>
  Show Toolbar
</DropdownMenuCheckboxItem>

// Multiple checkboxes for settings
<DropdownMenuCheckboxItem
  checked={settings.notifications}
  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
>
  Enable Notifications
</DropdownMenuCheckboxItem>
```
