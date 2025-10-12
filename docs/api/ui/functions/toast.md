[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [ui](../README.md) / toast

# Function: toast()

> **toast**(`props`): `object`

Defined in: [workspace/catalyst-ui/lib/ui/use-toast.ts:332](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/use-toast.ts#L332)

Imperatively displays a toast notification.

This function can be called from anywhere in your application,
even outside React components. Returns methods to update or dismiss
the specific toast instance.

## Parameters

### props

`Toast`

Toast configuration options

## Returns

`object`

Object with methods to control the toast

### id

> **id**: `string`

### dismiss()

> **dismiss**: () => `void`

#### Returns

`void`

### update()

> **update**: (`props`) => `void`

#### Parameters

##### props

`ToasterToast`

#### Returns

`void`

## Example

```tsx
// Simple success toast
toast({
  title: "Success",
  description: "Your changes have been saved.",
  variant: "default",
});

// Error toast with custom duration
toast({
  title: "Error",
  description: "Failed to save changes.",
  variant: "destructive",
  duration: 5000,
});

// Toast with action button
toast({
  title: "File uploaded",
  description: "Your file has been uploaded successfully.",
  action: <ToastAction altText="View">View</ToastAction>,
});

// Update toast dynamically
const { id, update } = toast({
  title: "Processing...",
  description: "Please wait",
});

setTimeout(() => {
  update({
    id,
    title: "Complete!",
    description: "Processing finished",
  });
}, 2000);
```
