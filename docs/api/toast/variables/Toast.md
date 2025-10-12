[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [toast](../README.md) / Toast

# Variable: Toast

> `const` **Toast**: `ForwardRefExoticComponent`\<`Omit`\<`ToastProps` & `RefAttributes`\<`HTMLLIElement`\>, `"ref"`\> & `VariantProps`\<(`props?`) => `string`\> & `object` & `RefAttributes`\<`HTMLLIElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toast.tsx:145](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toast.tsx#L145)

Toast - Main toast notification component.

Displays a toast notification with configurable styling, animation,
and optional auto-dismiss with progress indicator. Supports swipe-to-dismiss
gesture on mobile devices.

## Component

## Param

Visual style: "default" | "secondary" | "destructive"

## Param

Entrance/exit animation: "slide" | "fade" | "bounce" | "scale" | "slide-up" | "slide-down"

## Param

Auto-dismiss duration in milliseconds (shows progress bar)

## Param

Additional CSS classes

## Examples

```tsx
<Toast variant="default" animation="slide" duration={5000}>
  <ToastTitle>Success</ToastTitle>
  <ToastDescription>Your changes have been saved.</ToastDescription>
  <ToastClose />
</Toast>
```

```tsx
// Error toast with action
<Toast variant="destructive">
  <div className="grid gap-1">
    <ToastTitle>Error</ToastTitle>
    <ToastDescription>Failed to delete item.</ToastDescription>
  </div>
  <ToastAction altText="Retry">Retry</ToastAction>
  <ToastClose />
</Toast>
```
