[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/button](../README.md) / ButtonProps

# Interface: ButtonProps

Defined in: [workspace/catalyst-ui/lib/ui/button.tsx:48](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/button.tsx#L48)

Props for the Button component

Extends standard HTML button attributes with variant styling options
and Radix UI's asChild composition pattern.

## Extends

- `ButtonHTMLAttributes`\<`HTMLButtonElement`\>.`VariantProps`\<_typeof_ [`buttonVariants`](../variables/buttonVariants.md)\>

## Properties

### variant?

> `optional` **variant**: `null` \| `"default"` \| `"secondary"` \| `"destructive"` \| `"outline"` \| `"ghost"` \| `"link"`

Defined in: [workspace/catalyst-ui/lib/ui/button.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/button.tsx#L16)

#### Inherited from

`VariantProps.variant`

---

### size?

> `optional` **size**: `null` \| `"default"` \| `"sm"` \| `"lg"` \| `"icon"` \| `"icon-sm"` \| `"icon-lg"`

Defined in: [workspace/catalyst-ui/lib/ui/button.tsx:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/button.tsx#L26)

#### Inherited from

`VariantProps.size`

---

### asChild?

> `optional` **asChild**: `boolean`

Defined in: [workspace/catalyst-ui/lib/ui/button.tsx:65](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/button.tsx#L65)

Use Radix UI Slot to render as a different element

When true, Button will not render a `<button>` but will instead
clone and pass props to its child element. Useful for rendering
buttons as links or other interactive elements.

#### Example

```tsx
<Button asChild>
  <a href="/about">Link Button</a>
</Button>
```
