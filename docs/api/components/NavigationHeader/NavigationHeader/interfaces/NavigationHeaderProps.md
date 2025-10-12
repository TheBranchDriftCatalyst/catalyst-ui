[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/NavigationHeader/NavigationHeader](../README.md) / NavigationHeaderProps

# Interface: NavigationHeaderProps

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationHeader.tsx:12](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationHeader.tsx#L12)

Props for the NavigationHeader component

NavigationHeaderProps

## Properties

### children

> **children**: `ReactElement`\<(`props`) => `Element`, `string` \| `JSXElementConstructor`\<`any`\>\>[]

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationHeader.tsx:24](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationHeader.tsx#L24)

Array of NavigationItem components to display in the header

#### Example

```tsx
<NavigationHeader>
  <NavItem title="Products" links={productLinks} />
  <NavItem title="About" links={aboutLinks} />
</NavigationHeader>
```

---

### direction?

> `optional` **direction**: `"left"` \| `"right"`

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationHeader.tsx:41](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationHeader.tsx#L41)

Direction for dropdown menu positioning

Controls where the NavigationMenuContent dropdown appears relative to the trigger.
This is a workaround for positioning issues when navigation items are near edges.

- "left": Dropdowns expand to the left (use for right-side navigation)
- "right": Dropdowns expand to the right (use for left-side navigation)

#### Default

```ts
"left";
```

#### Remarks

Ideally this should be computed automatically based on the NavigationMenuItem
position, but currently requires manual specification. See inline TODO.
