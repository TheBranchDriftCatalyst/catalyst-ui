[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/NavigationHeader/NavigationHeader](../README.md) / NavigationHeader

# Function: NavigationHeader()

> **NavigationHeader**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationHeader.tsx:93](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationHeader.tsx#L93)

NavigationHeader - Multi-level navigation menu with dropdown support

A wrapper component for Radix UI's NavigationMenu that provides a consistent
navigation header experience. Displays a horizontal list of navigation items,
each of which can trigger a dropdown menu with child links.

Features:

- Horizontal navigation bar
- Dropdown menus with links or custom content
- Automatic key assignment to children
- Configurable dropdown positioning
- Built on Radix UI NavigationMenu primitives

## Parameters

### props

[`NavigationHeaderProps`](../interfaces/NavigationHeaderProps.md)

Component props

## Returns

`Element`

Rendered navigation header

## Examples

Basic usage with links:

```tsx
import { NavigationHeader, NavItem } from "catalyst-ui";

const productLinks = [
  { title: "Laptops", href: "/products/laptops", description: "Browse laptops" },
  { title: "Phones", href: "/products/phones", description: "Browse phones" },
];

<NavigationHeader>
  <NavItem title="Products" links={productLinks} />
  <NavItem title="About" links={aboutLinks} />
  <NavItem title="Contact" links={contactLinks} />
</NavigationHeader>;
```

With custom dropdown content:

```tsx
<NavigationHeader direction="right">
  <NavItem title="Custom">
    <div className="p-4">
      <h3>Custom Content</h3>
      <p>Any JSX can go here</p>
    </div>
  </NavItem>
</NavigationHeader>
```

## See

[NavItem](../../NavigationItem/functions/NavigationItem.md) - Navigation item component used as children
