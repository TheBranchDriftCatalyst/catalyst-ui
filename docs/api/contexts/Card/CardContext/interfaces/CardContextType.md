[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [contexts/Card/CardContext](../README.md) / CardContextType

# Interface: CardContextType

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L26)

Card context shape for dynamic card content management

## Remarks

Provides a registry system for components to dynamically inject
content into card headers and footers. Useful for:

- Breadcrumbs in card headers
- Action buttons in card footers
- Status indicators in headers
- Pagination controls in footers

Components register themselves on mount and automatically
unregister on unmount via cleanup functions.

## Properties

### headerComponents

> **headerComponents**: `ReactNode`[]

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:31](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L31)

Array of components registered for the card header
Rendered in registration order

---

### footerComponents

> **footerComponents**: `ReactNode`[]

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L37)

Array of components registered for the card footer
Rendered in registration order

---

### registerHeaderComponent()

> **registerHeaderComponent**: (`component`) => () => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:44](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L44)

Register a component to appear in the card header

#### Parameters

##### component

`ReactNode`

React component or node to render

#### Returns

Cleanup function to unregister (called on unmount)

> (): `void`

##### Returns

`void`

---

### registerFooterComponent()

> **registerFooterComponent**: (`component`) => () => `void`

Defined in: [workspace/catalyst-ui/lib/contexts/Card/CardContext.tsx:51](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/contexts/Card/CardContext.tsx#L51)

Register a component to appear in the card footer

#### Parameters

##### component

`ReactNode`

React component or node to render

#### Returns

Cleanup function to unregister (called on unmount)

> (): `void`

##### Returns

`void`
