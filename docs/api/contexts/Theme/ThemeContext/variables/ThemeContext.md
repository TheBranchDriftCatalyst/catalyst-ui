[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Theme/ThemeContext](../README.md) / ThemeContext

# Variable: ThemeContext

> `const` **ThemeContext**: `Context`\<[`ThemeContextType`](../interfaces/ThemeContextType.md)\>

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:201](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L201)

React context for theme management

## Remarks

This context should be consumed via the [useTheme](../functions/useTheme.md) hook.
Do not use `useContext(ThemeContext)` directly.

## Example

```tsx
import { useTheme } from "@/catalyst-ui/contexts/Theme";

function MyComponent() {
  const { theme, setTheme, variant, effects } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dracula")}>Switch to Dracula</button>
    </div>
  );
}
```
