[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Theme/ThemeContext](../README.md) / useTheme

# Function: useTheme()

> **useTheme**(): [`ThemeContextType`](../interfaces/ThemeContextType.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:286](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L286)

Hook to access theme context

## Returns

[`ThemeContextType`](../interfaces/ThemeContextType.md)

ThemeContextType with theme state and setters

## Remarks

Must be used within a ThemeProvider

## Examples

```tsx
import { useTheme } from "@/catalyst-ui/contexts/Theme";

function ThemeSwitcher() {
  const { theme, setTheme, allThemes } = useTheme();

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      {allThemes.filter(Boolean).map(t => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
```

```tsx
import { useTheme } from "@/catalyst-ui/contexts/Theme";

function DarkModeToggle() {
  const { variant, setVariant } = useTheme();

  return (
    <button onClick={() => setVariant(variant === "dark" ? "light" : "dark")}>
      {variant === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
```

```tsx
import { useTheme } from "@/catalyst-ui/contexts/Theme";

function EffectsPanel() {
  const { effects, updateEffect } = useTheme();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={effects.glow}
          onChange={e => updateEffect("glow", e.target.checked)}
        />
        Glow Effects
      </label>
      <label>
        <input
          type="checkbox"
          checked={effects.scanlines}
          onChange={e => updateEffect("scanlines", e.target.checked)}
        />
        Scanlines
      </label>
    </div>
  );
}
```
