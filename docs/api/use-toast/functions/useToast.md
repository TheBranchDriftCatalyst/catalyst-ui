[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [use-toast](../README.md) / useToast

# Function: useToast()

> **useToast**(): `object`

Defined in: [workspace/catalyst-ui/lib/ui/use-toast.ts:443](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/use-toast.ts#L443)

React hook for managing toast notifications.

Provides reactive access to the global toast state and methods
to display or dismiss toasts. This hook subscribes to state changes
and automatically re-renders when toasts are added, updated, or removed.

## Returns

Toast state and control methods

### toasts

> **toasts**: `ToasterToast`[]

### toast()

> **toast**: (`props`) => `object`

Imperatively displays a toast notification.

This function can be called from anywhere in your application,
even outside React components. Returns methods to update or dismiss
the specific toast instance.

#### Parameters

##### props

`Toast`

Toast configuration options

#### Returns

`object`

Object with methods to control the toast

##### id

> **id**: `string`

##### dismiss()

> **dismiss**: () => `void`

###### Returns

`void`

##### update()

> **update**: (`props`) => `void`

###### Parameters

###### props

`ToasterToast`

###### Returns

`void`

#### Example

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

### dismiss()

> **dismiss**: (`toastId?`) => `void`

#### Parameters

##### toastId?

`string`

#### Returns

`void`

## Examples

```tsx
function MyComponent() {
  const { toast, dismiss } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast({
        title: "Saved!",
        description: "Your data has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const dismissAll = () => {
    dismiss(); // Dismiss all toasts
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={dismissAll}>Clear All</button>
    </>
  );
}
```

```tsx
// Loading toast pattern
function AsyncOperation() {
  const { toast } = useToast();

  const handleProcess = async () => {
    const { id, update, dismiss } = toast({
      title: "Processing...",
      description: "Please wait while we process your request",
      duration: Infinity, // Don't auto-dismiss
    });

    try {
      await processData();
      update({
        id,
        title: "Success!",
        description: "Processing complete",
        duration: 3000,
      });
    } catch (error) {
      update({
        id,
        title: "Failed",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return <button onClick={handleProcess}>Start Process</button>;
}
```
