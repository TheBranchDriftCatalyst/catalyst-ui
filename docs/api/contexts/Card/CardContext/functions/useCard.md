[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Card/CardContext](../README.md) / useCard

# Function: useCard()

> **useCard**(): [`CardContextType`](../interfaces/CardContextType.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:127](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L127)

Hook to access card context

## Returns

[`CardContextType`](../interfaces/CardContextType.md)

CardContextType with registration functions and component arrays

## Remarks

Must be used within a CardProvider

Use this hook when you need full access to the card context.
For simpler registration, use [useCardHeader](useCardHeader.md) or [useCardFooter](useCardFooter.md).

## Examples

```tsx
import { useCard } from "@/catalyst-ui/contexts/Card";

function CardHeader() {
  const { headerComponents } = useCard();

  return (
    <div className="card-header">
      {headerComponents.map((comp, i) => (
        <div key={i}>{comp}</div>
      ))}
    </div>
  );
}
```

```tsx
import { useCard } from "@/catalyst-ui/contexts/Card";
import { useEffect } from "react";

function MyComponent() {
  const { registerHeaderComponent } = useCard();

  useEffect(() => {
    const cleanup = registerHeaderComponent(<span>My Header</span>);
    return cleanup; // Unregister on unmount
  }, []);

  return <div>...</div>;
}
```
