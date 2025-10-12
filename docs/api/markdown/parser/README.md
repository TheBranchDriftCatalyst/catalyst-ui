[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / markdown/parser

# markdown/parser

## Description

Core markdown parsing utilities that convert markdown strings into
Abstract Syntax Trees (AST) using the unified/remark ecosystem.

This module provides the foundation for the markdown → React transformation pipeline.
The parsed AST can be consumed by the mapper module to render React components.

## Example

```ts
import { parseMarkdown } from "@/catalyst-ui/utils/markdown/parser";

const markdown = `
# Hello World

This is a **bold** statement with \`code\`.
`;

const ast = parseMarkdown(markdown);
// Use ast with renderMarkdown() from mapper.tsx
```

## See

mapper.tsx for rendering AST to React components

## Functions

- [parseMarkdown](functions/parseMarkdown.md)
