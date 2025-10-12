[**Catalyst UI API Documentation v1.4.0**](../README.md)

---

[Catalyst UI API Documentation](../README.md) / toaster

# toaster

Toaster - Global toast container component.

Renders all active toasts managed by the useToast hook.
This component should be included once at the root of your application.

## Examples

```tsx
// In your root layout or App component
import { Toaster } from "@/catalyst-ui/ui/toaster";

function App() {
  return (
    <>
      <YourAppContent />
      <Toaster />
    </>
  );
}
```

```tsx
// Then use toast anywhere in your app
import { toast } from "@/catalyst-ui/ui/use-toast";

function MyComponent() {
  const handleClick = () => {
    toast({
      title: "Success!",
      description: "Your action completed successfully.",
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

## Functions

- [Toaster](functions/Toaster.md)
