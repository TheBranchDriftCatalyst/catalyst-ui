[**Catalyst UI API Documentation v1.4.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [dev/components/EditableText/utils/translationManager](../README.md) / setNestedValue

# Function: setNestedValue()

> **setNestedValue**(`obj`, `keyPath`, `value`): `any`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/utils/translationManager.ts:88](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/utils/translationManager.ts#L88)

Set a value in a nested object using a key path

## Parameters

### obj

`any`

### keyPath

`string`[]

### value

`string`

## Returns

`any`

## Example

```ts
const obj = { home: { welcome: { title: "Old Title" } } };
const updated = setNestedValue(obj, ["home", "welcome", "title"], "New Title");
// Returns: { home: { welcome: { title: "New Title" } } }
```
