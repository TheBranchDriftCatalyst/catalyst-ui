[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [dev/context/LocalizationContext](../README.md) / useLocalizationContext

# Function: useLocalizationContext()

> **useLocalizationContext**(): `LocalizationContextValue`

Defined in: [workspace/catalyst-ui/lib/dev/context/LocalizationContext.tsx:617](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/context/LocalizationContext.tsx#L617)

Hook to access localization context

## Returns

`LocalizationContextValue`

## Example

```tsx
import { useLocalizationContext } from "@/catalyst-ui/contexts/Localization";

function MyComponent() {
  const { updateTranslation, dumpLocalizationFile } = useLocalizationContext();

  return <button onClick={() => dumpLocalizationFile("common")}>Dump Common Translations</button>;
}
```
