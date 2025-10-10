[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/utils](../README.md) / processSourceCode

# Function: processSourceCode()

> **processSourceCode**(`code`, `options`): `object`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/utils.ts:206](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/utils.ts#L206)

Main processing pipeline for source code

## Parameters

### code

`string`

### options

#### lineRange?

[`LineRangeTuple`](../type-aliases/LineRangeTuple.md) \| [`LineRange`](../interfaces/LineRange.md)

#### stripImports?

`boolean`

#### stripComments?

`boolean`

#### extractFunction?

`string`

## Returns

`object`

### code

> **code**: `string`

### startLineNumber

> **startLineNumber**: `number`
