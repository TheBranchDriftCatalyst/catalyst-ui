[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/CodeFlipCard](../README.md) / CodeFlipCardProps

# Interface: CodeFlipCardProps

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:14](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L14)

## Extends

- `Omit`\<[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md), `"code"` \| `"language"`\>

## Properties

### theme?

> `optional` **theme**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:85](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L85)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`theme`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#theme)

---

### showLineNumbers?

> `optional` **showLineNumbers**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:86](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L86)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`showLineNumbers`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#showlinenumbers)

---

### showCopyButton?

> `optional` **showCopyButton**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L87)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`showCopyButton`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#showcopybutton)

---

### startLineNumber?

> `optional` **startLineNumber**: `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:89](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L89)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`startLineNumber`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#startlinenumber)

---

### interactive?

> `optional` **interactive**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:90](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L90)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`interactive`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#interactive)

---

### editable?

> `optional` **editable**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:91](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L91)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`editable`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#editable)

---

### onThemeChange()?

> `optional` **onThemeChange**: (`theme`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:92](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L92)

#### Parameters

##### theme

`string`

#### Returns

`void`

#### Inherited from

`Omit.onThemeChange`

---

### onLineNumbersChange()?

> `optional` **onLineNumbersChange**: (`show`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:93](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L93)

#### Parameters

##### show

`boolean`

#### Returns

`void`

#### Inherited from

`Omit.onLineNumbersChange`

---

### onCodeChange()?

> `optional` **onCodeChange**: (`code`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:94](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L94)

#### Parameters

##### code

`string`

#### Returns

`void`

#### Inherited from

`Omit.onCodeChange`

---

### useCardContext?

> `optional` **useCardContext**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:96](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L96)

Whether to use CardContext for header registration (default: true)

#### Inherited from

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`useCardContext`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#usecardcontext)

---

### children

> **children**: `ReactNode`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:16](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L16)

The rendered component to display on the front

#### Overrides

`Omit.children`

---

### sourceCode

> **sourceCode**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:18](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L18)

Raw source code string (use ?raw import)

---

### language?

> `optional` **language**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:20](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L20)

Programming language for syntax highlighting

---

### fileName?

> `optional` **fileName**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:22](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L22)

File name to display in CodeBlock header

#### Overrides

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`fileName`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#filename)

---

### lineRange?

> `optional` **lineRange**: [`LineRangeTuple`](../../utils/type-aliases/LineRangeTuple.md) \| [`LineRange`](../../utils/interfaces/LineRange.md)

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:26](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L26)

Extract specific line range from source code

---

### stripImports?

> `optional` **stripImports**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:30](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L30)

Remove import statements from source

---

### stripComments?

> `optional` **stripComments**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:32](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L32)

Remove comments from source

---

### extractFunction?

> `optional` **extractFunction**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:34](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L34)

Extract only a specific function/component

---

### flipTrigger?

> `optional` **flipTrigger**: `"click"` \| `"hover"`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:38](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L38)

How to trigger the flip animation

---

### flipDirection?

> `optional` **flipDirection**: `"horizontal"` \| `"vertical"`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:40](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L40)

Direction of flip animation

---

### flipDuration?

> `optional` **flipDuration**: `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:42](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L42)

Animation duration in milliseconds

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:46](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L46)

Additional class names for the flip card container

#### Overrides

`Omit.className`

---

### minHeight?

> `optional` **minHeight**: `string` \| `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:48](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L48)

Minimum height for the card container
