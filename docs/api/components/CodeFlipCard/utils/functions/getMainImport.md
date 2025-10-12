[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/utils](../README.md) / getMainImport

# Function: getMainImport()

> **getMainImport**(`sourceCode`, `filter`): `null` \| `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/utils.ts:288](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/utils.ts#L288)

Extract imports and format as a single line for display in ImportFooter

## Parameters

### sourceCode

`string`

Raw source code string

### filter

`string` = `"@/catalyst-ui"`

Optional filter to only show imports from specific paths

## Returns

`null` \| `string`

Formatted import string for display
