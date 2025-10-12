[**Catalyst UI API Documentation v1.4.0**](../../../../../../README.md)

---

[Catalyst UI API Documentation](../../../../../../README.md) / [dev/components/EditableText/utils/translationManager](../README.md) / generateTranslationKey

# Function: generateTranslationKey()

> **generateTranslationKey**(`text`, `prefix?`): `string`

Defined in: [workspace/catalyst-ui/lib/dev/components/EditableText/utils/translationManager.ts:19](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/dev/components/EditableText/utils/translationManager.ts#L19)

Generates a translation key from text content

## Parameters

### text

`string`

### prefix?

`string`

## Returns

`string`

## Example

```ts
generateTranslationKey("Welcome to Catalyst");
// Returns: "welcome_to_catalyst"

generateTranslationKey("Hello World!", "home");
// Returns: "home.hello_world"
```
