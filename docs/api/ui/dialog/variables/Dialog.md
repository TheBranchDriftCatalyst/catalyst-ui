[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / Dialog

# Variable: Dialog

> `const` **Dialog**: `FC`\<`DialogProps`\> = `DialogPrimitive.Root`

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:150](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L150)

Dialog - Root component for dialog/modal management

Radix UI Dialog primitive that handles open state, focus trapping, and accessibility.
Use this as the root wrapper for controlled dialogs.

## Example

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>
```
