[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/CodeFlipCard](../README.md) / CodeFlipCardProps

# Interface: CodeFlipCardProps

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:21](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L21)

Props for the CodeFlipCard component

Extends CodeBlockProps but omits `code` and `language` since they're provided differently

CodeFlipCardProps

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

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:23](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L23)

The rendered component to display on the front face of the card

#### Overrides

`Omit.children`

---

### sourceCode

> **sourceCode**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:37](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L37)

Raw source code string to display on the back face

Use Vite's `?raw` import to load source files:

#### Example

```tsx
import sourceCode from "./MyComponent.tsx?raw";
<CodeFlipCard sourceCode={sourceCode}>
  <MyComponent />
</CodeFlipCard>;
```

---

### language?

> `optional` **language**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:40](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L40)

Programming language for syntax highlighting (default: "tsx")

---

### fileName?

> `optional` **fileName**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:43](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L43)

File name to display in the CodeBlock header

#### Overrides

[`CodeBlockProps`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md).[`fileName`](../../../CodeBlock/CodeBlock/interfaces/CodeBlockProps.md#filename)

---

### lineRange?

> `optional` **lineRange**: [`LineRangeTuple`](../../utils/type-aliases/LineRangeTuple.md) \| [`LineRange`](../../utils/interfaces/LineRange.md)

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:60](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L60)

Extract specific line range from source code

Can be a tuple [start, end] or an object with start/end properties

#### Example

```tsx
// Tuple format
<CodeFlipCard lineRange={[10, 25]} sourceCode={code}>

// Object format
<CodeFlipCard lineRange={{ start: 10, end: 25 }} sourceCode={code}>
```

---

### stripImports?

> `optional` **stripImports**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:64](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L64)

Remove import statements from source code display

---

### stripComments?

> `optional` **stripComments**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:67](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L67)

Remove comments from source code display

---

### extractFunction?

> `optional` **extractFunction**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:77](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L77)

Extract only a specific function or component from the source code

#### Example

```tsx
<CodeFlipCard extractFunction="MyButton" sourceCode={code}>
```

---

### flipTrigger?

> `optional` **flipTrigger**: `"click"` \| `"hover"`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:88](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L88)

How to trigger the flip animation

- "click": User must click the code icon button to flip
- "hover": Flips when hovering over the card (not recommended for mobile)

#### Default

```ts
"click";
```

---

### flipDirection?

> `optional` **flipDirection**: `"horizontal"` \| `"vertical"`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:98](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L98)

Direction of flip animation

- "horizontal": Flips left-to-right (Y-axis rotation)
- "vertical": Flips top-to-bottom (X-axis rotation)

#### Default

```ts
"horizontal";
```

---

### flipDuration?

> `optional` **flipDuration**: `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:105](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L105)

Animation duration in milliseconds

#### Default

```ts
600;
```

---

### className?

> `optional` **className**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:109](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L109)

Additional class names for the flip card container

#### Overrides

`Omit.className`

---

### minHeight?

> `optional` **minHeight**: `string` \| `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:118](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L118)

Minimum height for the card container

Can be a number (pixels) or a CSS string value

#### Default

```ts
400;
```
