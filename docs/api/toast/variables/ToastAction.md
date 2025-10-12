[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [toast](../README.md) / ToastAction

# Variable: ToastAction

> `const` **ToastAction**: `ForwardRefExoticComponent`\<`Omit`\<`ToastActionProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toast.tsx:204](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toast.tsx#L204)

ToastAction - Action button within a toast.

Provides a clickable action button for toasts, typically used
for actions like "Undo", "Retry", or "View". Automatically styled
to match the toast variant.

## Component

## Param

Accessible alternative text (required for screen readers)

## Param

Additional CSS classes

## Example

```tsx
<Toast>
  <ToastTitle>File deleted</ToastTitle>
  <ToastDescription>Your file has been moved to trash.</ToastDescription>
  <ToastAction altText="Undo deletion" onClick={handleUndo}>
    Undo
  </ToastAction>
</Toast>
```
