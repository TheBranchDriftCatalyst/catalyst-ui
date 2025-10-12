[**Catalyst UI API Documentation v1.4.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [dev/components/EditableText/utils/translationManager](../README.md) / getNamespaceForComponent

# Function: getNamespaceForComponent()

> **getNamespaceForComponent**(`componentName`): `string`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/utils/translationManager.ts:44](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/utils/translationManager.ts#L44)

Determines the appropriate namespace for a component

## Parameters

### componentName

`string`

## Returns

`string`

## Example

```ts
getNamespaceForComponent("CardDemo");
// Returns: "components"

getNamespaceForComponent("ErrorBoundary");
// Returns: "errors"

getNamespaceForComponent("HomePage");
// Returns: "common"
```
