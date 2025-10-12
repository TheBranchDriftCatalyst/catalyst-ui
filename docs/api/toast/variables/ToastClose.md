[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [toast](../README.md) / ToastClose

# Variable: ToastClose

> `const` **ToastClose**: `ForwardRefExoticComponent`\<`Omit`\<`ToastCloseProps` & `RefAttributes`\<`HTMLButtonElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLButtonElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toast.tsx:244](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toast.tsx#L244)

ToastClose - Close button for dismissing toasts.

Renders an X icon button in the top-right corner of the toast.
Hidden by default, appears on hover with smooth transitions.
Clicking triggers the toast dismissal animation.

## Component

## Param

Additional CSS classes

## Example

```tsx
<Toast>
  <ToastTitle>Notification</ToastTitle>
  <ToastDescription>This is a message.</ToastDescription>
  <ToastClose />
</Toast>
```

## Accessibility

- Keyboard accessible (focusable and can be activated with Enter/Space)
- Shows on focus for keyboard navigation
- Proper ARIA labels from Radix UI primitives
