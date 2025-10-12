[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogHeader

# Function: DialogHeader()

> **DialogHeader**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:340](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L340)

DialogHeader - Container for dialog title and description

Flexbox container that vertically stacks DialogTitle and DialogDescription
with consistent spacing. Centered on mobile, left-aligned on larger screens.
Typically the first child of DialogContent.

## Parameters

### \_\_namedParameters

`HTMLAttributes`\<`HTMLDivElement`\>

## Returns

`Element`

## Example

```tsx
<DialogHeader>
  <DialogTitle>Delete Account</DialogTitle>
  <DialogDescription>
    This action cannot be undone. All your data will be permanently removed.
  </DialogDescription>
</DialogHeader>
```
