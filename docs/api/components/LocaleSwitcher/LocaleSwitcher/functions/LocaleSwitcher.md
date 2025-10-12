[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/LocaleSwitcher/LocaleSwitcher](../README.md) / LocaleSwitcher

# Function: LocaleSwitcher()

> **LocaleSwitcher**(): `Element`

Defined in: [workspace/catalyst-ui/lib/components/LocaleSwitcher/LocaleSwitcher.tsx:35](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/LocaleSwitcher/LocaleSwitcher.tsx#L35)

LocaleSwitcher component for changing language via URL params

Changes the ?locale=XX URL parameter and reloads the page
to apply the new language across all components.

## Returns

`Element`

## Example

```tsx
import { LocaleSwitcher } from "@/catalyst-ui/components/LocaleSwitcher";

function Header() {
  return (
    <div>
      <LocaleSwitcher />
    </div>
  );
}
```
