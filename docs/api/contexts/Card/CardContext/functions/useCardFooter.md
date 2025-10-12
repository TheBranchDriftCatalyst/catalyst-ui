[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Card/CardContext](../README.md) / useCardFooter

# Function: useCardFooter()

> **useCardFooter**(`component`): () => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:248](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L248)

Hook to register a component in the card footer

## Parameters

### component

`ReactNode`

React component or node to render in footer

## Returns

Cleanup function (automatically called on unmount)

> (): `void`

### Returns

`void`

## Remarks

Must be used within a CardProvider

The component is registered on mount and automatically unregistered
on unmount. Multiple components can be registered and will be
rendered in registration order.

## Examples

```tsx
import { useCardFooter } from "@/catalyst-ui/contexts/Card";
import { useEffect } from "react";

function FormActions() {
  const cleanup = useCardFooter(
    <div>
      <button>Cancel</button>
      <button>Save</button>
    </div>
  );

  useEffect(() => cleanup, []);

  return <form>...</form>;
}
```

```tsx
import { useCardFooter } from "@/catalyst-ui/contexts/Card";
import { useEffect, useState } from "react";

function DataTable() {
  const [page, setPage] = useState(1);

  const cleanup = useCardFooter(
    <div>
      <button onClick={() => setPage(p => p - 1)}>Prev</button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );

  useEffect(() => cleanup, [page]);

  return <table>...</table>;
}
```
