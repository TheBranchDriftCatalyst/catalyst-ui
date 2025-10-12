[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Card/CardContext](../README.md) / useCardHeader

# Function: useCardHeader()

> **useCardHeader**(`component`): () => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:187](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L187)

Hook to register a component in the card header

## Parameters

### component

`ReactNode`

React component or node to render in header

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
import { useCardHeader } from "@/catalyst-ui/contexts/Card";
import { useEffect } from "react";

function Breadcrumbs() {
  const cleanup = useCardHeader(<nav>Home / Products / Details</nav>);

  useEffect(() => cleanup, []); // Cleanup on unmount

  return <div>Main content...</div>;
}
```

```tsx
import { useCardHeader } from "@/catalyst-ui/contexts/Card";
import { useEffect, useState } from "react";

function DynamicHeader() {
  const [count, setCount] = useState(0);

  const cleanup = useCardHeader(
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );

  useEffect(() => cleanup, [count]); // Re-register when count changes

  return <div>Main content...</div>;
}
```
