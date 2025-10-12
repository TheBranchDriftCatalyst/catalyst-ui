[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [utils](../README.md) / addKeysToChildren

# Function: addKeysToChildren()

> **addKeysToChildren**(`children`): `ReactNode`

Defined in: [workspace/catalyst-ui/lib/utils.ts:69](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/utils.ts#L69)

Add React keys to children elements that don't have them

Iterates through React children and ensures each valid element has a key prop.
Useful when mapping over children without explicit keys. Uses array index as
fallback key for children without existing keys.

**Note:** Index-based keys are generally discouraged for dynamic lists, but
acceptable for static children that won't be reordered.

## Parameters

### children

`ReactNode`

React children elements to process

## Returns

`ReactNode`

Children array with keys added where missing

## Example

```tsx
// Inside a component that accepts children
function Tabs({ children }) {
  return <div className="tabs">{addKeysToChildren(children)}</div>;
}

// Usage (children without explicit keys)
<Tabs>
  <TabPanel>First</TabPanel>
  <TabPanel>Second</TabPanel>
</Tabs>;
```
