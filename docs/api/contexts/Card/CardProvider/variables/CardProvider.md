[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Card/CardProvider](../README.md) / CardProvider

# Variable: CardProvider

> `const` **CardProvider**: `React.FC`\<\{ `children`: `ReactNode`; \}\>

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardProvider.tsx:110](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardProvider.tsx#L110)

Card provider component - manages dynamic card header/footer content

## Param

Component props

## Param

Child components to render

## Remarks

This provider enables components to dynamically register content
for card headers and footers. Common use cases:

- Breadcrumb navigation in headers
- Action buttons in footers
- Status indicators
- Pagination controls

Components register themselves on mount and automatically unregister
on unmount. Multiple components can register simultaneously and will
be rendered in registration order.

**Architecture:**

1. Child components call `useCardHeader()` or `useCardFooter()`
2. Components are added to internal state arrays
3. Card container renders all registered components
4. Cleanup functions auto-remove components on unmount

## Examples

```tsx
// App.tsx
import { CardProvider } from "@/catalyst-ui/contexts/Card";

function App() {
  return (
    <CardProvider>
      <Card>
        <CardHeader /> {/* Renders registered header components */}
        <CardContent>
          <MyComponent /> {/* Can use useCardHeader/Footer */}
        </CardContent>
        <CardFooter /> {/* Renders registered footer components */}
      </Card>
    </CardProvider>
  );
}
```

```tsx
import { useCard } from "@/catalyst-ui/contexts/Card";

function Card({ children }) {
  const { headerComponents, footerComponents } = useCard();

  return (
    <div className="card">
      {headerComponents.length > 0 && (
        <div className="card-header">
          {headerComponents.map((comp, i) => (
            <div key={i}>{comp}</div>
          ))}
        </div>
      )}
      <div className="card-content">{children}</div>
      {footerComponents.length > 0 && (
        <div className="card-footer">
          {footerComponents.map((comp, i) => (
            <div key={i}>{comp}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

```tsx
import { useCardHeader, useCardFooter } from "@/catalyst-ui/contexts/Card";
import { useEffect } from "react";

function FormWithActions() {
  // Register breadcrumbs in header
  const cleanupHeader = useCardHeader(<nav>Home / Forms / Edit</nav>);

  // Register action buttons in footer
  const cleanupFooter = useCardFooter(
    <div>
      <button>Cancel</button>
      <button>Save</button>
    </div>
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupHeader();
      cleanupFooter();
    };
  }, []);

  return <form>...</form>;
}
```
