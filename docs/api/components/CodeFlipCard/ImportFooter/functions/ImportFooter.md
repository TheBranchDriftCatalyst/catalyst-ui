[**Catalyst UI API Documentation v1.4.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [components/CodeFlipCard/ImportFooter](../README.md) / ImportFooter

# Function: ImportFooter()

> **ImportFooter**(`props`): `null` \| `Element`

Defined in: [workspace/catalyst-ui/lib/components/CodeFlipCard/ImportFooter.tsx:118](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/components/CodeFlipCard/ImportFooter.tsx#L118)

ImportFooter - Interactive footer displaying import statements with copy functionality

A reusable footer component that displays import statements with one-click copying.
Used across component demos to show developers how to import and use components.

Supports two modes:

1. **Manual Mode**: Explicitly provide `imports` and `from` props
2. **Automatic Mode**: Pass `sourceCode` to auto-extract imports (recommended)

Features:

- One-click copy to clipboard
- Visual feedback on copy (checkmark animation)
- Hover effects with smooth transitions
- Automatic import extraction from source code
- Configurable path filtering

## Parameters

### props

`ImportFooterProps`

Component props

## Returns

`null` \| `Element`

Rendered footer with import statement, or null if no valid imports

## Examples

Manual mode:

```tsx
<Card>
  <CardContent>...</CardContent>
  <ImportFooter imports="Button, Input" from="@/catalyst-ui/ui/button" />
</Card>
```

Automatic mode (recommended):

```tsx
import sourceCode from "./MyComponent.tsx?raw";

<Card>
  <CardContent>...</CardContent>
  <ImportFooter sourceCode={sourceCode} />
</Card>;
// Automatically extracts: import { Button } from "@/catalyst-ui/ui/button";
```

Custom filter:

```tsx
<ImportFooter sourceCode={sourceCode} filter="@/catalyst-ui/effects" />
// Only shows imports from the effects directory
```
