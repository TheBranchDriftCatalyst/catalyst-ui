[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/NavigationHeader/NavigationItem](../README.md) / NavigationListItem

# Variable: NavigationListItem

> `const` **NavigationListItem**: `any`

Defined in: [workspace/catalyst-ui/lib/components/NavigationHeader/NavigationItem.tsx:36](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/NavigationHeader/NavigationItem.tsx#L36)

NavigationListItem - Individual link item within a navigation dropdown

A styled link component for use within NavigationMenuContent dropdowns.
Displays a title and description with hover/focus states.

## Param

Component props (extends anchor element props)

## Param

Additional CSS classes

## Param

Link title text

## Param

Description text (displayed below title)

## Param

Optional custom component to render (default: "a")

## Param

Forwarded ref to the anchor element

## Returns

Rendered list item with link

## Example

```tsx
<ul>
  <NavigationListItem href="/products/laptops" title="Laptops">
    Browse our selection of laptops
  </NavigationListItem>
</ul>
```
