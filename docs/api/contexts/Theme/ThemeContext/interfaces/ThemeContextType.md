[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Theme/ThemeContext](../README.md) / ThemeContextType

# Interface: ThemeContextType

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:27](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L27)

## Properties

### theme

> **theme**: `string`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:28](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L28)

---

### setTheme()

> **setTheme**: (`theme`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:29](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L29)

#### Parameters

##### theme

`string`

#### Returns

`void`

---

### variant

> **variant**: [`ThemeVariant`](../type-aliases/ThemeVariant.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L30)

---

### setVariant()

> **setVariant**: (`variant`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L31)

#### Parameters

##### variant

[`ThemeVariant`](../type-aliases/ThemeVariant.md)

#### Returns

`void`

---

### effects

> **effects**: [`ThemeEffects`](ThemeEffects.md)

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L32)

---

### setEffects()

> **setEffects**: (`effects`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:33](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L33)

#### Parameters

##### effects

[`ThemeEffects`](ThemeEffects.md)

#### Returns

`void`

---

### updateEffect()

> **updateEffect**: (`key`, `value`) => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L34)

#### Parameters

##### key

keyof [`ThemeEffects`](ThemeEffects.md)

##### value

`boolean`

#### Returns

`void`

---

### allThemes

> **allThemes**: (`null` \| `string`)[]

Defined in: [workspace/catalyst-ui/lib/contexts/Theme/ThemeContext.tsx:35](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Theme/ThemeContext.tsx#L35)
