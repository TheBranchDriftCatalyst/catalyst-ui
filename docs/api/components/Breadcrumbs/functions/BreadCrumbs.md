[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [components/Breadcrumbs](../README.md) / BreadCrumbs

# Function: BreadCrumbs()

> **BreadCrumbs**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/components/Breadcrumbs.tsx:103](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/Breadcrumbs.tsx#L103)

BreadCrumbs - Hierarchical navigation component with smart compaction

A breadcrumb navigation component that displays a hierarchical navigation trail.
Supports automatic compaction of multiple breadcrumbs into a dropdown menu to
save space when dealing with deeply nested navigation paths.

Features:

- Standard breadcrumb display with separators
- Smart compaction: collapse multiple items into a dropdown
- Responsive design with small text sizing
- Accessible dropdown menus

## Parameters

### props

[`BreadcrumbsProps`](../interfaces/BreadcrumbsProps.md)

Component props

## Returns

`Element`

Rendered breadcrumb navigation

## Examples

Basic usage:

```tsx
<BreadCrumbs
  crumbs={[
    { href: "/", name: "Home" },
    { href: "/products", name: "Products" },
    { href: "/products/laptops", name: "Laptops" },
  ]}
/>
```

With compaction (long paths):

```tsx
<BreadCrumbs
  crumbs={[
    { href: "/", name: "Home" },
    { href: "/docs", name: "Documentation", compact: 3 },
    { href: "/docs/guides", name: "Guides" },
    { href: "/docs/guides/react", name: "React" },
    { href: "/docs/guides/react/hooks", name: "Hooks" },
  ]}
/>
// Renders: Home / ... / Hooks
// Dropdown shows: Documentation, Guides, React
```
