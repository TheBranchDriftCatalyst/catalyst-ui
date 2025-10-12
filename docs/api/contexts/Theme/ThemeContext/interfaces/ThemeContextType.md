[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Theme/ThemeContext](../README.md) / ThemeContextType

# Interface: ThemeContextType

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:114](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L114)

Theme context shape for catalyst-ui theming system

## Remarks

Provides complete control over visual theming including:

- Theme selection (catalyst, dracula, nord, etc.)
- Variant (light/dark mode)
- Visual effects (glow, scanlines, borders, gradients)
- LocalStorage persistence for all settings

Theme state is persisted to localStorage:

- `theme:name` - Current theme name
- `theme:variant` - Current variant (light/dark)
- `theme:effects` - Effect toggles

## Properties

### theme

> **theme**: `string`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:118](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L118)

Current theme name (e.g., "catalyst", "dracula", "nord")

---

### setTheme()

> **setTheme**: (`theme`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:124](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L124)

Change the active theme

#### Parameters

##### theme

`string`

Theme name from THEMES array

#### Returns

`void`

---

### variant

> **variant**: [`ThemeVariant`](../type-aliases/ThemeVariant.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:129](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L129)

Current theme variant (light or dark)

---

### setVariant()

> **setVariant**: (`variant`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:135](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L135)

Change the theme variant

#### Parameters

##### variant

[`ThemeVariant`](../type-aliases/ThemeVariant.md)

"light" or "dark"

#### Returns

`void`

---

### effects

> **effects**: [`ThemeEffects`](ThemeEffects.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:140](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L140)

Current visual effects configuration

---

### setEffects()

> **setEffects**: (`effects`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:146](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L146)

Replace all effect settings

#### Parameters

##### effects

[`ThemeEffects`](ThemeEffects.md)

Complete ThemeEffects object

#### Returns

`void`

---

### updateEffect()

> **updateEffect**: (`key`, `value`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:153](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L153)

Update a single effect setting

#### Parameters

##### key

keyof [`ThemeEffects`](ThemeEffects.md)

Effect name to update

##### value

`boolean`

New boolean value

#### Returns

`void`

---

### allThemes

> **allThemes**: (`null` \| `string`)[]

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:158](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L158)

List of all available theme names
