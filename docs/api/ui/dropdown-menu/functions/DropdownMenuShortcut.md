[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dropdown-menu](../README.md) / DropdownMenuShortcut

# Function: DropdownMenuShortcut()

> **DropdownMenuShortcut**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/dropdown-menu.tsx:454](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dropdown-menu.tsx#L454)

DropdownMenuShortcut - Keyboard shortcut hint display

A small text component for displaying keyboard shortcuts next to menu items.
Automatically positioned to the right with muted styling. Does not implement
the actual keyboard functionality - use for display only.

**Note:** This is purely visual. Implement actual keyboard shortcuts separately
using onKeyDown handlers or a keyboard shortcut library.

## Parameters

### \_\_namedParameters

`HTMLAttributes`\<`HTMLSpanElement`\>

## Returns

`Element`

## Example

```tsx
<DropdownMenuItem>
  Save
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>

<DropdownMenuItem>
  Copy
  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
</DropdownMenuItem>

<DropdownMenuItem>
  Delete
  <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
</DropdownMenuItem>
```
