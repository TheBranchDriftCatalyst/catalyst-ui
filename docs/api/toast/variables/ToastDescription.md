[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [toast](../README.md) / ToastDescription

# Variable: ToastDescription

> `const` **ToastDescription**: `ForwardRefExoticComponent`\<`Omit`\<`ToastDescriptionProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/toast.tsx:312](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/toast.tsx#L312)

ToastDescription - Body text for toast notifications.

Displays detailed message text below the title. Styled with
slightly reduced opacity for visual hierarchy.

## Component

## Param

Additional CSS classes

## Example

```tsx
<Toast>
  <ToastTitle>File Uploaded</ToastTitle>
  <ToastDescription>
    Your document has been uploaded successfully and is now available.
  </ToastDescription>
</Toast>
```
