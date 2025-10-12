[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/context/LocalizationContext](../README.md) / LocalizationProvider

# Function: LocalizationProvider()

> **LocalizationProvider**(`__namedParameters`): `Element`

Defined in: [workspace/catalyst-ui/lib/dev/context/LocalizationContext.tsx:127](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/LocalizationContext.tsx#L127)

LocalizationProvider manages translation editing in dev mode

Features:

- Stores translation changes locally (in-memory + localStorage)
- Allows dumping translations as JSON files
- Updates i18next resources in real-time
- Periodic backend sync (writes to directory/.locale/ComponentName.LANG.i18n.json files via Vite middleware)

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
import { LocalizationProvider } from "@/catalyst-ui/contexts/Localization";

function App() {
  return (
    <I18nProvider>
      <LocalizationProvider>
        <YourApp />
      </LocalizationProvider>
    </I18nProvider>
  );
}
```
