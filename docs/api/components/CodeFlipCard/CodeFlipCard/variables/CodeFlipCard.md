[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/CodeFlipCard](../README.md) / CodeFlipCard

# Variable: CodeFlipCard

> `const` **CodeFlipCard**: `ForwardRefExoticComponent`\<[`CodeFlipCardProps`](../interfaces/CodeFlipCardProps.md) & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/CodeFlipCard.tsx:183](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/CodeFlipCard.tsx#L183)

CodeFlipCard - Interactive component showcase with flippable source code view

A specialized card component that displays a rendered React component on the front
and its source code on the back, with a smooth 3D flip animation. Perfect for
component libraries, documentation, and interactive demos.

Uses the AnimatedFlip HOC for the flip animation and integrates with the CodeBlock
component for syntax-highlighted code display.

Features:

- Front: Rendered component with optional flip trigger button
- Back: Syntax-highlighted source code with CodeBlock
- Auto-unflip when mouse leaves (500ms delay)
- Code transformations: strip imports, comments, extract functions
- Line range extraction with automatic line number adjustment
- Click or hover trigger modes
- Horizontal or vertical flip directions

## Param

Component props

## Param

Forwarded ref to the container div

## Returns

Rendered flip card component

## Examples

Basic usage:

```tsx
import sourceCode from "./MyButton.tsx?raw";

<CodeFlipCard sourceCode={sourceCode} fileName="MyButton.tsx">
  <MyButton>Click me</MyButton>
</CodeFlipCard>;
```

With code transformations:

```tsx
<CodeFlipCard
  sourceCode={sourceCode}
  fileName="MyComponent.tsx"
  stripImports={true}
  stripComments={true}
  extractFunction="MyComponent"
  lineRange={[10, 30]}
>
  <MyComponent />
</CodeFlipCard>
```

Custom animation:

```tsx
<CodeFlipCard
  sourceCode={sourceCode}
  flipTrigger="hover"
  flipDirection="vertical"
  flipDuration={800}
  minHeight={500}
>
  <MyComponent />
</CodeFlipCard>
```
