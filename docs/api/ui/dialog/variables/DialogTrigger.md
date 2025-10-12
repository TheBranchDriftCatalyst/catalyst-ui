[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/dialog](../README.md) / DialogTrigger

# Variable: DialogTrigger

> `const` **DialogTrigger**: `ForwardRefExoticComponent`\<`DialogTriggerProps` & `RefAttributes`\<`HTMLButtonElement`\>\> = `DialogPrimitive.Trigger`

Defined in: [workspace/catalyst-ui/lib/ui/dialog.tsx:165](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/dialog.tsx#L165)

DialogTrigger - Button/element that opens the dialog

Radix UI trigger primitive that automatically connects to the Dialog state.
Renders as a button by default but can be composed with any element.

## Example

```tsx
<DialogTrigger asChild>
  <Button variant="outline">Open Settings</Button>
</DialogTrigger>
```
