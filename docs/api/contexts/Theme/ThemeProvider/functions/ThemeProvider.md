[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Theme/ThemeProvider](../README.md) / ThemeProvider

# Function: ThemeProvider()

> **ThemeProvider**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeProvider.tsx:127](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeProvider.tsx#L127)

Theme provider component - manages theming state and CSS injection

## Parameters

### props

Component props

#### children

`ReactNode`

Child components to render

## Returns

`Element`

## Remarks

This provider should wrap your entire application (typically in `App.tsx`).
It provides:

- Theme selection (catalyst, dracula, nord, etc.)
- Variant toggling (light/dark mode)
- Visual effect controls (glow, scanlines, borders, gradients)
- LocalStorage persistence for all settings
- Dynamic CSS loading via Vite code-splitting

**How it works:**

1. Loads theme/variant/effects from localStorage on mount
2. Applies className to `<html>`: `theme-{name} {variant}`
3. Sets data attributes for effects: `data-effect-*="true|false"`
4. Dynamically imports theme CSS when theme changes
5. Effect CSS is always loaded (controlled via data attributes)

**LocalStorage keys:**

- `theme:name` - Current theme name (default: "catalyst")
- `theme:variant` - Current variant (default: "dark")
- `theme:effects` - Effect toggles object

## Examples

```tsx
// App.tsx
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

```tsx
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme";
import { DebuggerProvider } from "@/catalyst-ui/contexts/Debug";

function App() {
  return (
    <ThemeProvider>
      <DebuggerProvider>
        <YourApp />
      </DebuggerProvider>
    </ThemeProvider>
  );
}
```

```tsx
import { useTheme } from "@/catalyst-ui/contexts/Theme";

function ThemedComponent() {
  const { theme, variant, effects } = useTheme();

  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Variant: {variant}</p>
      <p>Glow: {effects.glow ? "On" : "Off"}</p>
    </div>
  );
}
```
