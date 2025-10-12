[**Catalyst UI API Documentation v1.4.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [dev/components/EditableText/utils/translationManager](../README.md) / parseKeyPath

# Function: parseKeyPath()

> **parseKeyPath**(`key`): `string`[]

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/utils/translationManager.ts:74](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/utils/translationManager.ts#L74)

Parse a nested translation key path

## Parameters

### key

`string`

## Returns

`string`[]

## Example

```ts
parseKeyPath("home.welcome.title");
// Returns: ["home", "welcome", "title"]
```
