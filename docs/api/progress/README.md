[**Catalyst UI API Documentation v1.4.0**](../README.md)

---

[Catalyst UI API Documentation](../README.md) / progress

# progress

Progress Components

Visual progress indicators built on Radix UI Progress primitives.
Shows completion status for tasks, loading states, or multi-step processes.

## Example

```tsx
import { Progress } from "@/catalyst-ui/ui/progress";

function UploadProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return <Progress value={progress} />;
}
```

## Variables

- [Progress](variables/Progress.md)
