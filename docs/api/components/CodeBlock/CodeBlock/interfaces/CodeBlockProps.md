[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeBlock/CodeBlock](../README.md) / CodeBlockProps

# Interface: CodeBlockProps

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:82](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L82)

## Extends

- `HTMLAttributes`\<`HTMLDivElement`\>

## Properties

### code

> **code**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:83](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L83)

---

### language

> **language**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:84](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L84)

---

### theme?

> `optional` **theme**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:85](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L85)

---

### showLineNumbers?

> `optional` **showLineNumbers**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:86](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L86)

---

### showCopyButton?

> `optional` **showCopyButton**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:87](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L87)

---

### fileName?

> `optional` **fileName**: `string`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:88](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L88)

---

### startLineNumber?

> `optional` **startLineNumber**: `number`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:89](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L89)

---

### interactive?

> `optional` **interactive**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:90](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L90)

---

### editable?

> `optional` **editable**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:91](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L91)

---

### onThemeChange()?

> `optional` **onThemeChange**: (`theme`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:92](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L92)

#### Parameters

##### theme

`string`

#### Returns

`void`

---

### onLineNumbersChange()?

> `optional` **onLineNumbersChange**: (`show`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:93](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L93)

#### Parameters

##### show

`boolean`

#### Returns

`void`

---

### onCodeChange()?

> `optional` **onCodeChange**: (`code`) => `void`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:94](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L94)

#### Parameters

##### code

`string`

#### Returns

`void`

---

### useCardContext?

> `optional` **useCardContext**: `boolean`

Defined in: [workspace/catalyst-ui/lib/components/CodeBlock/CodeBlock.tsx:96](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeBlock/CodeBlock.tsx#L96)

Whether to use CardContext for header registration (default: true)
