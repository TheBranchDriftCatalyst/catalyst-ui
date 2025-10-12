[**Catalyst UI API Documentation v1.4.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [dev/components/EditableText/utils/translationManager](../README.md) / getNestedValue

# Function: getNestedValue()

> **getNestedValue**(`obj`, `keyPath`): `undefined` \| `string`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/utils/translationManager.ts:116](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/utils/translationManager.ts#L116)

Get a value from a nested object using a key path

## Parameters

### obj

`any`

### keyPath

`string`[]

## Returns

`undefined` \| `string`

## Example

```ts
const obj = { home: { welcome: { title: "Hello" } } };
getNestedValue(obj, ["home", "welcome", "title"]);
// Returns: "Hello"
```
