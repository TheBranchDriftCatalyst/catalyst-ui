[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / markdown/types

# markdown/types

## Description

Type definitions for the markdown parsing and rendering system.

This module re-exports mdast types and defines custom types for markdown
processing utilities. It provides TypeScript type safety for the entire
markdown → React transformation pipeline.

**Type categories:**

- **mdast types** - Standard markdown AST node types (re-exported from mdast)
- **Extraction types** - Structured data extracted from markdown (sections, tables, code blocks)
- **Metadata types** - Repository and project metadata (for catalyst_repo.yaml)

## Examples

```ts
import type { Root, Heading, Paragraph } from "@/catalyst-ui/utils/markdown/types";

function processHeading(heading: Heading) {
  console.log(heading.depth); // 1-6
  console.log(heading.children); // Array of inline nodes
}
```

```ts
import type { MarkdownSection, ExtractedCodeBlock } from '@/catalyst-ui/utils/markdown/types';

const section: MarkdownSection = {
  heading: "Installation",
  level: 2,
  content: [/* mdast nodes

## References

### Root

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Content

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Code

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Table

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Heading

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Paragraph

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### List

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Blockquote

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Link

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Strong

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Emphasis

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### InlineCode

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)

***

### Break

Renames and re-exports [AnimatedSlide](../../catalyst/variables/AnimatedSlide.md)
```
