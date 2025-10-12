[**Catalyst UI API Documentation v1.4.0**](../README.md)

---

[Catalyst UI API Documentation](../README.md) / use-toast

# use-toast

Toast Management System

Provides a global toast notification system inspired by react-hot-toast.
Manages toast queue, animations, and lifecycle through a reducer-based state machine.

## Example

```tsx
import { useToast } from "@/catalyst-ui/ui/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success!",
      description: "Your changes have been saved.",
      variant: "default",
    });
  };

  const handleError = () => {
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };

  return (
    <>
      <button onClick={handleSuccess}>Save</button>
      <button onClick={handleError}>Trigger Error</button>
    </>
  );
}
```

## Type Aliases

- [ToastAnimation](type-aliases/ToastAnimation.md)

## Functions

- [reducer](functions/reducer.md)
- [toast](functions/toast.md)
- [useToast](functions/useToast.md)
