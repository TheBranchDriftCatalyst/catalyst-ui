[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [toast](../README.md) / ToastViewport

# Variable: ToastViewport

> `const` **ToastViewport**: `ForwardRefExoticComponent`\<`Omit`\<`ToastViewportProps` & `RefAttributes`\<`HTMLOListElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLOListElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toast.tsx:54](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toast.tsx#L54)

ToastViewport - Portal container for rendering toasts.

Defines the fixed viewport where toast notifications appear.
By default, toasts render in the top-right corner of the screen.

## Component

## Example

```tsx
<ToastProvider>
  <Toast>...</Toast>
  <ToastViewport />
</ToastProvider>
```
