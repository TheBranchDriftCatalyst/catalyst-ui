[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/context/AnnotationContext](../README.md) / useAnnotationContext

# Function: useAnnotationContext()

> **useAnnotationContext**(): `AnnotationContextValue`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:325](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L325)

Hook to access annotation context

## Returns

`AnnotationContextValue`

## Example

```tsx
import { useAnnotationContext } from "@/catalyst-ui/dev/context";

function MyComponent() {
  const { addAnnotation, getAllAnnotations } = useAnnotationContext();

  const handleAddNote = () => {
    addAnnotation({
      componentName: "MyComponent",
      note: "Fix this later",
      type: "todo",
      priority: "high",
    });
  };

  return <button onClick={handleAddNote}>Add Note</button>;
}
```
