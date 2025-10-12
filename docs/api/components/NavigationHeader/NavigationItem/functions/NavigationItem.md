[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/NavigationHeader/NavigationItem](../README.md) / NavigationItem

# Function: NavigationItem()

> **NavigationItem**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationItem.tsx:209](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationItem.tsx#L209)

NavigationItem - Dropdown navigation item with trigger and content

A navigation menu item that displays a trigger button and dropdown content.
Supports two content modes: custom JSX children or an array of predefined links.

Built on Radix UI's NavigationMenuItem, NavigationMenuTrigger, and
NavigationMenuContent primitives for accessibility and keyboard navigation.

## Parameters

### props

`NavigationItemProps`

Component props

## Returns

`Element`

Rendered navigation menu item with dropdown

## Examples

With predefined links:

```tsx
const productLinks = [
  {
    title: "Laptops",
    href: "/products/laptops",
    description: "High-performance laptops",
  },
  {
    title: "Phones",
    href: "/products/phones",
    description: "Latest smartphones",
  },
];

<NavigationItem title="Products" links={productLinks} />;
```

With custom content:

```tsx
<NavigationItem title="Special">
  <div className="p-6 w-[600px]">
    <h3 className="text-lg font-bold">Featured Products</h3>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <ProductCard />
      <ProductCard />
    </div>
  </div>
</NavigationItem>
```

Mixed usage in NavigationHeader:

```tsx
<NavigationHeader>
  <NavigationItem title="Products" links={productLinks} />
  <NavigationItem title="Custom">
    <CustomDropdownContent />
  </NavigationItem>
</NavigationHeader>
```
