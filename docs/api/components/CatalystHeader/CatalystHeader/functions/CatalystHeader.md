[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CatalystHeader/CatalystHeader](../README.md) / CatalystHeader

# Function: CatalystHeader()

> **CatalystHeader**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/components/CatalystHeader/CatalystHeader.tsx:52](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CatalystHeader/CatalystHeader.tsx#L52)

CatalystHeader - Themed application header with navigation

A sticky header component with a glassmorphism effect that provides three distinct zones:

- Left: Brand/title
- Center: Tab navigation
- Right: Utility navigation and user settings

## Parameters

### props

`CatalystHeaderProps`

Component props

## Returns

`Element`

Rendered header component

## Example

```tsx
import { CatalystHeader, ChangeThemeDropdown } from "catalyst-ui";

function App() {
  return (
    <CatalystHeader
      title="My App"
      tabs={<Tabs>...</Tabs>}
      navigationItems={[<Button key="settings">Settings</Button>]}
      userSettings={<ChangeThemeDropdown />}
    />
  );
}
```
