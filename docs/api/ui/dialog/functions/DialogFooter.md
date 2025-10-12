[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogFooter

# Function: DialogFooter()

> **DialogFooter**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:364](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L364)

DialogFooter - Container for dialog action buttons

Flexbox container for buttons and footer actions. Stacks vertically on mobile
(reversed order for accessibility), horizontal row on larger screens with right alignment.
Typically the last child of DialogContent.

## Parameters

### \_\_namedParameters

`HTMLAttributes`\<`HTMLDivElement`\>

## Returns

`Element`

## Example

```tsx
<DialogFooter>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="destructive" onClick={onConfirm}>
    Delete
  </Button>
</DialogFooter>
```
