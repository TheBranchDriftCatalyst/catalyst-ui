[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/context/AnnotationContext](../README.md) / AnnotationProvider

# Function: AnnotationProvider()

> **AnnotationProvider**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/context/AnnotationContext.tsx:111](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/AnnotationContext.tsx#L111)

AnnotationProvider manages component annotations in dev mode

Features:

- Stores annotations locally (in-memory + localStorage)
- CRUD operations for annotations
- Periodic backend sync (writes to annotations.json via Vite middleware)
- Manual component name entry (no React Fiber introspection)

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
import { AnnotationProvider } from "@/catalyst-ui/dev/context";

function App() {
  return (
    <AnnotationProvider>
      <YourApp />
    </AnnotationProvider>
  );
}
```
