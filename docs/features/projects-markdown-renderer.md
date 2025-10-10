# Projects Module with Markdown-to-Component Renderer

## Overview

Create a modular, DRY system that scans the workspace for `catalyst_repo.yaml` files, fetches GitHub READMEs, parses markdown into AST (Abstract Syntax Tree), and maps markdown nodes to React components via a central configuration. This creates a "Projects" tab showcasing all workspace repositories with beautifully rendered documentation.

### Vision

A single-source-of-truth system where:

- Repository metadata lives in `catalyst_repo.yaml`
- Documentation lives in GitHub READMEs
- Markdown components are automatically mapped to themed React components
- The Projects page auto-updates when repos are added/modified
- All markdown rendering is configurable, reusable, and DRY

### Key Differentiators

1. **Component-First**: Code blocks → `CodeBlock`, Tables → `Table`, not generic HTML
2. **Central Config**: One mapping object controls all markdown → component transformations
3. **Modular Utilities**: Reusable extractors for sections, code blocks, tables, etc.
4. **Type-Safe**: Full TypeScript support with AST types
5. **Theme-Aware**: All rendered components use Catalyst theme system

## Phase 0: MVP - Changelog Tab ✅ COMPLETED

**Status**: Implemented (2025-10-07)

**Objective**: Validate the markdown rendering system with a simpler use case before building the full Projects tab.

### What Was Built

1. **Core Markdown Utilities** (`lib/utils/markdown/`)
   - ✅ `types.ts` - Type definitions for AST nodes and extracted data
   - ✅ `parser.ts` - Parse markdown string → AST using unified/remark
   - ✅ `mapper.tsx` - Map AST nodes → React components (CodeBlock, Table, Typography)
   - ✅ `index.ts` - Barrel exports

2. **MarkdownRenderer Component** (`lib/components/MarkdownRenderer/`)
   - ✅ Main renderer component that parses and renders markdown
   - ✅ Accepts custom component mappings for flexibility
   - ✅ Memoized parsing and rendering for performance

3. **Changelog Tab** (`app/tabs/ChangelogTab.tsx`)
   - ✅ Dual view toggle: "Custom Rendered" vs "GitHub Style"
   - ✅ Custom view uses our component mapper (CodeBlock, Typography, Table)
   - ✅ GitHub style uses react-markdown for comparison
   - ✅ Fetches CHANGELOG.md from public directory
   - ✅ Integrated into App.tsx with lazy loading

### Dependencies Installed ✅

```json
{
  "dependencies": {
    "unified": "^11.0.5", // ✅ Installed
    "remark-parse": "^11.0.0", // ✅ Installed
    "remark-gfm": "^4.0.1", // ✅ Installed
    "react-markdown": "^10.1.0", // ✅ Installed (for GitHub comparison view)
    "@types/mdast": "^4.0.4", // ✅ Installed
    "@types/unist": "^3.0.3" // ✅ Installed
  }
}
```

### Key Learnings

1. **Component Mapping Works**: Successfully maps markdown AST to themed components
2. **Performance**: Memoization prevents unnecessary re-parsing
3. **Flexibility**: Can override component renderers via componentMap prop
4. **Dual Views**: Side-by-side comparison validates our custom renderer quality

### Files Created

- `lib/utils/markdown/types.ts` (70 lines)
- `lib/utils/markdown/parser.ts` (24 lines)
- `lib/utils/markdown/mapper.tsx` (222 lines)
- `lib/utils/markdown/index.ts` (3 lines)
- `lib/components/MarkdownRenderer/MarkdownRenderer.tsx` (38 lines)
- `lib/components/MarkdownRenderer/index.ts` (2 lines)
- `app/tabs/ChangelogTab.tsx` (130 lines)
- Updated `app/App.tsx` (added changelog tab)
- Copied `CHANGELOG.md` to `public/`

**Total**: ~490 lines of code

### Next Steps

The system is now validated and ready for Phase 1+ (Full Projects System) when needed.

## Current State

### Existing Infrastructure We Can Leverage

✅ **CodeBlock Component** (`lib/components/CodeBlock/`)

- Shiki syntax highlighting
- Interactive features (editable, theme switching)
- CardContext integration for headers
- Perfect for rendering markdown code blocks

✅ **Table Components** (`lib/ui/table.tsx`)

- TanStack Table integration
- Radix UI primitives
- Theme-aware styling
- Ready for markdown tables

✅ **Card System** (`lib/ui/card.tsx`)

- Card, CardHeader, CardContent, CardFooter
- Interactive variants
- Can wrap entire repos or sections

✅ **Mermaid Parser Precedent** (`lib/utils/mermaid/`)

- Existing parser infrastructure
- AST manipulation patterns
- Clean separation of parsing and rendering

✅ **Typography Components** (`lib/ui/typography.tsx`)

- Headings, paragraphs, lists
- Consistent styling
- Perfect for markdown text nodes

✅ **catalyst_repo.yaml Files**

- Standardized metadata across workspace
- Tech stack, status, groups
- Already being used by @TheBranchDriftCatalyst

### What's Missing

❌ Markdown parser/AST utilities
❌ Component mapper configuration
❌ GitHub README fetcher
❌ Markdown-specific renderers
❌ Projects tab UI
❌ Repo scanner utility

## Proposed Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Projects Tab                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ProjectCard │  │ProjectCard │  │ProjectCard │  ...       │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               Markdown Renderer Component                    │
│                                                              │
│  Raw Markdown String                                        │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────┐                                     │
│  │  Unified/Remark    │  (Parse markdown → AST)            │
│  │     Parser         │                                     │
│  └────────────────────┘                                     │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────┐                                     │
│  │  Component Mapper  │  (AST nodes → React components)    │
│  └────────────────────┘                                     │
│           │                                                  │
│           ▼                                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │   Rendered Components:                             │    │
│  │   - code → CodeBlock                               │    │
│  │   - table → Table                                  │    │
│  │   - heading → Typography                           │    │
│  │   - blockquote → Card (styled)                     │    │
│  │   - list → Custom List                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Scanner    │  │   Fetcher    │  │  Extractor   │     │
│  │              │  │              │  │              │     │
│  │ Finds all    │  │ Gets README  │  │ Extracts     │     │
│  │ catalyst_    │  │ from GitHub  │  │ sections,    │     │
│  │ repo.yaml    │  │ raw URLs     │  │ code blocks, │     │
│  │ files        │  │              │  │ etc.         │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

````typescript
// 1. Scan workspace
const repos = scanWorkspace();
// → [{ name, description, repo_url, tech_stack, ... }]

// 2. Fetch READMEs
const readme = await fetchGitHubReadme(repos[0].repo_url);
// → "# Project\n\n## Features\n\n```ts\nconst foo = 'bar';\n```"

// 3. Parse markdown
const ast = parseMarkdown(readme);
// → { type: 'root', children: [...] }

// 4. Extract sections (optional)
const featuresSection = extractSection(ast, "Features");
// → { type: 'root', children: [code block nodes] }

// 5. Map to components
const component = renderMarkdown(ast, MARKDOWN_COMPONENT_MAP);
// → <><Typography>...</Typography><CodeBlock>...</CodeBlock></>
````

## Implementation Plan

### Phase 1: Dependencies & Types

#### Install Dependencies

```bash
yarn add unified remark-parse remark-gfm remark-rehype rehype-raw
yarn add @types/mdast @types/unist
yarn add js-yaml
```

**Package Roles:**

- `unified` - Core AST processing framework
- `remark-parse` - Markdown → AST
- `remark-gfm` - GitHub Flavored Markdown (tables, task lists, strikethrough)
- `remark-rehype` - Markdown AST → HTML AST
- `rehype-raw` - Handle raw HTML in markdown
- `js-yaml` - Parse `catalyst_repo.yaml` files

#### Create Types

**File**: `lib/utils/markdown/types.ts`

```typescript
import type {
  Root,
  Content,
  Code,
  Table,
  Heading,
  Paragraph,
  List,
  Blockquote,
  Link,
  Image,
} from "mdast";

export type { Root, Content, Code, Table, Heading, Paragraph, List, Blockquote, Link, Image };

export interface MarkdownSection {
  heading: string;
  level: number;
  content: Content[];
}

export interface ExtractedCodeBlock {
  language: string | null;
  value: string;
  meta?: string | null;
}

export interface ExtractedTable {
  headers: string[];
  rows: string[][];
  align: ("left" | "right" | "center" | null)[];
}

export interface CatalystRepoMetadata {
  name: string;
  description: string;
  repo_url: string;
  private?: boolean;
  status: "active" | "archived" | "wip" | "experimental";
  tech_stack: {
    languages: string[];
    frameworks?: string[];
    tools?: string[];
  };
  groups?: string[];
  badges?: {
    stars?: boolean;
    issues?: boolean;
    prs?: boolean;
    license?: boolean;
  };
  highlights?: string[];
}
```

### Phase 2: Utility Layer

#### 2.1 Catalyst Repo Scanner

**File**: `lib/utils/catalyst-repo/scanner.ts`

```typescript
import * as yaml from "js-yaml";
import type { CatalystRepoMetadata } from "../markdown/types";

/**
 * Scan workspace for catalyst_repo.yaml files
 * NOTE: This runs client-side, so we need pre-scanned data or a build-time script
 */
export function scanWorkspaceRepos(): CatalystRepoMetadata[] {
  // In reality, this would be generated at build time
  // For now, we'll import from a generated JSON file
  const repos = require("../../../data/workspace-repos.json");
  return repos;
}

/**
 * Parse a single catalyst_repo.yaml file
 */
export function parseCatalystRepoYaml(yamlContent: string): CatalystRepoMetadata {
  const data = yaml.load(yamlContent) as CatalystRepoMetadata;

  // Validation
  if (!data.name || !data.description) {
    throw new Error("Invalid catalyst_repo.yaml: missing required fields");
  }

  return data;
}

/**
 * Filter repos by criteria
 */
export function filterRepos(
  repos: CatalystRepoMetadata[],
  filters: {
    status?: string[];
    languages?: string[];
    frameworks?: string[];
    groups?: string[];
    private?: boolean;
  }
): CatalystRepoMetadata[] {
  return repos.filter(repo => {
    if (filters.status && !filters.status.includes(repo.status)) return false;
    if (filters.private !== undefined && repo.private !== filters.private) return false;
    if (
      filters.languages &&
      !filters.languages.some(lang => repo.tech_stack.languages.includes(lang))
    )
      return false;
    if (
      filters.frameworks &&
      !filters.frameworks.some(fw => repo.tech_stack.frameworks?.includes(fw))
    )
      return false;
    if (filters.groups && !filters.groups.some(g => repo.groups?.includes(g))) return false;
    return true;
  });
}
```

**Build Script**: `scripts/scan-workspace-repos.js`

```javascript
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const yaml = require("js-yaml");

// Scan workspace for catalyst_repo.yaml files
const workspaceRoot = path.join(__dirname, "../..");
const yamlFiles = glob.sync("**/catalyst_repo.yaml", {
  cwd: workspaceRoot,
  ignore: ["**/node_modules/**", "**/dist/**"],
});

const repos = yamlFiles.map(file => {
  const fullPath = path.join(workspaceRoot, file);
  const content = fs.readFileSync(fullPath, "utf-8");
  const data = yaml.load(content);

  return {
    ...data,
    _filePath: file, // Store relative path for reference
  };
});

// Write to data directory
const outputPath = path.join(__dirname, "../lib/data/workspace-repos.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(repos, null, 2));

console.log(`✓ Scanned ${repos.length} repositories`);
```

**Add to package.json:**

```json
{
  "scripts": {
    "prebuild:repos": "node scripts/scan-workspace-repos.js",
    "build:app": "yarn prebuild:repos && vite build --config vite.app.config.ts"
  }
}
```

#### 2.2 Markdown Parser

**File**: `lib/utils/markdown/parser.ts`

```typescript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

/**
 * Parse markdown string into AST
 */
export function parseMarkdown(markdown: string): Root {
  const processor = unified().use(remarkParse).use(remarkGfm);

  const ast = processor.parse(markdown);
  return ast as Root;
}
```

#### 2.3 Markdown Extractor

**File**: `lib/utils/markdown/extractor.ts`

```typescript
import type { Root, Content, Code, Table, Heading } from "mdast";
import type { MarkdownSection, ExtractedCodeBlock, ExtractedTable } from "./types";

/**
 * Extract a section by heading text
 */
export function extractSection(ast: Root, headingText: string): MarkdownSection | null {
  const children = ast.children;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    if (node.type === "heading" && getHeadingText(node) === headingText) {
      const heading = node as Heading;
      const content: Content[] = [];

      // Collect nodes until next heading of same or higher level
      for (let j = i + 1; j < children.length; j++) {
        const nextNode = children[j];
        if (nextNode.type === "heading" && (nextNode as Heading).depth <= heading.depth) {
          break;
        }
        content.push(nextNode);
      }

      return {
        heading: headingText,
        level: heading.depth,
        content,
      };
    }
  }

  return null;
}

/**
 * Extract all code blocks from AST
 */
export function extractCodeBlocks(ast: Root): ExtractedCodeBlock[] {
  const codeBlocks: ExtractedCodeBlock[] = [];

  function visit(node: Content) {
    if (node.type === "code") {
      const code = node as Code;
      codeBlocks.push({
        language: code.lang || null,
        value: code.value,
        meta: code.meta || null,
      });
    }

    // Recursively visit children
    if ("children" in node) {
      (node as any).children.forEach(visit);
    }
  }

  ast.children.forEach(visit);
  return codeBlocks;
}

/**
 * Extract all tables from AST
 */
export function extractTables(ast: Root): ExtractedTable[] {
  const tables: ExtractedTable[] = [];

  function visit(node: Content) {
    if (node.type === "table") {
      const table = node as Table;
      const headers: string[] = [];
      const rows: string[][] = [];

      table.children.forEach((row, rowIdx) => {
        const cells = row.children.map(cell =>
          cell.children.map(c => ("value" in c ? c.value : "")).join("")
        );

        if (rowIdx === 0) {
          headers.push(...cells);
        } else {
          rows.push(cells);
        }
      });

      tables.push({
        headers,
        rows,
        align: table.align || [],
      });
    }

    if ("children" in node) {
      (node as any).children.forEach(visit);
    }
  }

  ast.children.forEach(visit);
  return tables;
}

/**
 * Find nodes by type
 */
export function findNodesByType<T extends Content["type"]>(
  ast: Root,
  type: T
): Extract<Content, { type: T }>[] {
  const nodes: any[] = [];

  function visit(node: Content) {
    if (node.type === type) {
      nodes.push(node);
    }

    if ("children" in node) {
      (node as any).children.forEach(visit);
    }
  }

  ast.children.forEach(visit);
  return nodes;
}

/**
 * Helper: Get heading text
 */
function getHeadingText(heading: Heading): string {
  return heading.children.map(child => ("value" in child ? child.value : "")).join("");
}
```

#### 2.4 Barrel Export

**File**: `lib/utils/markdown/index.ts`

```typescript
export * from "./parser";
export * from "./extractor";
export * from "./types";
export { renderMarkdown, MARKDOWN_COMPONENT_MAP } from "./mapper";
```

### Phase 3: Component Mapper (THE CORE 🔥)

**File**: `lib/utils/markdown/mapper.tsx`

```typescript
import React from 'react';
import type { Content, Root, Code, Table, Heading, Paragraph, List, Blockquote, Link, Image } from 'mdast';
import { CodeBlock } from '@/catalyst-ui/components/CodeBlock';
import { Typography } from '@/catalyst-ui/ui/typography';
import { Table as TableComponent, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/catalyst-ui/ui/table';
import { Card, CardContent } from '@/catalyst-ui/ui/card';
import type { ExtractedTable } from './types';

/**
 * Component renderers for each markdown node type
 */

const CodeRenderer: React.FC<{ node: Code; index: number }> = ({ node, index }) => {
  return (
    <CodeBlock
      key={index}
      code={node.value}
      language={node.lang || 'text'}
      fileName={node.meta || undefined}
      useCardContext={false}
    />
  );
};

const TableRenderer: React.FC<{ node: Table; index: number }> = ({ node, index }) => {
  const headers = node.children[0]?.children.map(cell =>
    cell.children.map(c => ('value' in c ? c.value : '')).join('')
  ) || [];

  const rows = node.children.slice(1).map(row =>
    row.children.map(cell =>
      cell.children.map(c => ('value' in c ? c.value : '')).join('')
    )
  );

  return (
    <div key={index} className="my-4 rounded-md border overflow-hidden">
      <TableComponent>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </div>
  );
};

const HeadingRenderer: React.FC<{ node: Heading; index: number }> = ({ node, index }) => {
  const text = node.children.map(c => ('value' in c ? c.value : '')).join('');
  const variants = ['h1', 'h2', 'h3', 'h4', 'p', 'p'] as const;
  const variant = variants[node.depth - 1] || 'p';

  return <Typography key={index} variant={variant} className="mt-6 mb-2">{text}</Typography>;
};

const ParagraphRenderer: React.FC<{ node: Paragraph; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);
  return <Typography key={index} variant="p" className="my-2">{content}</Typography>;
};

const ListRenderer: React.FC<{ node: List; index: number }> = ({ node, index }) => {
  const Tag = node.ordered ? 'ol' : 'ul';

  return (
    <Tag key={index} className="my-4 ml-6 list-disc space-y-2">
      {node.children.map((item, i) => (
        <li key={i} className="text-foreground">
          {renderChildren(item.children as Content[])}
        </li>
      ))}
    </Tag>
  );
};

const BlockquoteRenderer: React.FC<{ node: Blockquote; index: number }> = ({ node, index }) => {
  const content = renderChildren(node.children);

  return (
    <Card key={index} className="my-4 border-l-4 border-primary">
      <CardContent className="pt-6">
        <div className="text-muted-foreground italic">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

const LinkRenderer: React.FC<{ node: Link; children: React.ReactNode }> = ({ node, children }) => {
  return (
    <a
      href={node.url}
      title={node.title || undefined}
      className="text-primary hover:underline transition-all"
      target={node.url.startsWith('http') ? '_blank' : undefined}
      rel={node.url.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

const ImageRenderer: React.FC<{ node: Image; index: number }> = ({ node, index }) => {
  return (
    <img
      key={index}
      src={node.url}
      alt={node.alt || ''}
      title={node.title || undefined}
      className="my-4 rounded-lg max-w-full h-auto"
    />
  );
};

/**
 * Central mapping configuration: markdown node type → React component
 */
export const MARKDOWN_COMPONENT_MAP = {
  code: CodeRenderer,
  table: TableRenderer,
  heading: HeadingRenderer,
  paragraph: ParagraphRenderer,
  list: ListRenderer,
  blockquote: BlockquoteRenderer,
  image: ImageRenderer,
} as const;

/**
 * Render children nodes (handles inline elements)
 */
function renderChildren(children: Content[]): React.ReactNode {
  return children.map((child, i) => {
    if (child.type === 'text') {
      return child.value;
    }

    if (child.type === 'strong') {
      return <strong key={i}>{renderChildren(child.children)}</strong>;
    }

    if (child.type === 'emphasis') {
      return <em key={i}>{renderChildren(child.children)}</em>;
    }

    if (child.type === 'inlineCode') {
      return (
        <code key={i} className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">
          {child.value}
        </code>
      );
    }

    if (child.type === 'link') {
      return <LinkRenderer key={i} node={child}>{renderChildren(child.children)}</LinkRenderer>;
    }

    if (child.type === 'break') {
      return <br key={i} />;
    }

    // Recursively handle other types
    if ('children' in child) {
      return renderChildren(child.children as Content[]);
    }

    return null;
  });
}

/**
 * Main renderer: AST → React components
 */
export function renderMarkdown(
  ast: Root,
  componentMap: Partial<typeof MARKDOWN_COMPONENT_MAP> = {}
): React.ReactElement {
  const map = { ...MARKDOWN_COMPONENT_MAP, ...componentMap };

  const elements = ast.children.map((node, index) => {
    const renderer = map[node.type as keyof typeof map];

    if (renderer) {
      return React.createElement(renderer, { node: node as any, index });
    }

    // Fallback for unhandled types
    console.warn(`Unhandled markdown node type: ${node.type}`);
    return null;
  });

  return <>{elements}</>;
}
```

### Phase 4: Components

#### 4.1 MarkdownRenderer Component

**File**: `lib/components/MarkdownRenderer/MarkdownRenderer.tsx`

```typescript
import React from 'react';
import { parseMarkdown, renderMarkdown, extractSection, MARKDOWN_COMPONENT_MAP } from '@/catalyst-ui/utils/markdown';
import type { Root } from 'mdast';

export interface MarkdownRendererProps {
  /** Raw markdown content */
  content: string;

  /** Override default component mappings */
  componentMap?: Partial<typeof MARKDOWN_COMPONENT_MAP>;

  /** Extract and render only specific sections by heading */
  sections?: string[];

  /** Additional CSS classes */
  className?: string;
}

/**
 * MarkdownRenderer
 *
 * Parses markdown and renders it using themed React components
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  componentMap,
  sections,
  className,
}) => {
  const ast = React.useMemo(() => parseMarkdown(content), [content]);

  const filteredAst = React.useMemo(() => {
    if (!sections || sections.length === 0) return ast;

    // Extract specified sections and combine into new AST
    const extractedChildren: any[] = [];

    sections.forEach(sectionName => {
      const section = extractSection(ast, sectionName);
      if (section) {
        extractedChildren.push(...section.content);
      }
    });

    return {
      type: 'root',
      children: extractedChildren,
    } as Root;
  }, [ast, sections]);

  const rendered = React.useMemo(
    () => renderMarkdown(filteredAst, componentMap),
    [filteredAst, componentMap]
  );

  return <div className={className}>{rendered}</div>;
};
```

#### 4.2 GitHub Fetcher Hook

**File**: `lib/hooks/useGitHubReadme.ts`

```typescript
import { useState, useEffect } from "react";

export interface UseGitHubReadmeOptions {
  /** GitHub repo URL (e.g., "https://github.com/user/repo") */
  repoUrl?: string;

  /** Direct raw URL to README */
  rawUrl?: string;

  /** Branch name (default: "main") */
  branch?: string;

  /** README filename (default: "README.md") */
  filename?: string;
}

export interface UseGitHubReadmeResult {
  content: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch README from GitHub repository
 */
export function useGitHubReadme(options: UseGitHubReadmeOptions): UseGitHubReadmeResult {
  const { repoUrl, rawUrl, branch = "main", filename = "README.md" } = options;

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!repoUrl && !rawUrl) {
      setLoading(false);
      return;
    }

    const fetchReadme = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = rawUrl;

        // Convert GitHub repo URL to raw URL if needed
        if (!url && repoUrl) {
          // https://github.com/user/repo → https://raw.githubusercontent.com/user/repo/main/README.md
          const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          if (match) {
            const [, owner, repo] = match;
            url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`;
          }
        }

        if (!url) {
          throw new Error("Invalid GitHub URL");
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch README: ${response.statusText}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [repoUrl, rawUrl, branch, filename, refetchKey]);

  const refetch = () => setRefetchKey(prev => prev + 1);

  return { content, loading, error, refetch };
}
```

#### 4.3 ProjectCard Component

**File**: `lib/components/ProjectCard/ProjectCard.tsx`

```typescript
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/catalyst-ui/ui/card';
import { Button } from '@/catalyst-ui/ui/button';
import { MarkdownRenderer } from '@/catalyst-ui/components/MarkdownRenderer';
import { useGitHubReadme } from '@/catalyst-ui/hooks/useGitHubReadme';
import type { CatalystRepoMetadata } from '@/catalyst-ui/utils/markdown/types';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export interface ProjectCardProps {
  /** Repository metadata from catalyst_repo.yaml */
  repo: CatalystRepoMetadata;

  /** Whether to auto-expand README (default: false) */
  defaultExpanded?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ repo, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { content, loading, error } = useGitHubReadme({
    repoUrl: repo.repo_url,
  });

  return (
    <Card interactive={!expanded} className="transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{repo.name}</CardTitle>
            <CardDescription className="mt-2">{repo.description}</CardDescription>
          </div>

          {repo.repo_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={repo.repo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-4">
          {repo.tech_stack.languages.map(lang => (
            <span
              key={lang}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {lang}
            </span>
          ))}
          {repo.tech_stack.frameworks?.map(fw => (
            <span
              key={fw}
              className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary-foreground"
            >
              {fw}
            </span>
          ))}
        </div>

        {/* Status Badge */}
        <div className="mt-2">
          <span
            className={`
              px-2 py-1 text-xs rounded
              ${repo.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
              ${repo.status === 'wip' ? 'bg-yellow-500/10 text-yellow-500' : ''}
              ${repo.status === 'archived' ? 'bg-gray-500/10 text-gray-500' : ''}
              ${repo.status === 'experimental' ? 'bg-purple-500/10 text-purple-500' : ''}
            `}
          >
            {repo.status}
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          {loading && <div className="text-muted-foreground">Loading README...</div>}
          {error && <div className="text-destructive">Error: {error.message}</div>}
          {content && <MarkdownRenderer content={content} className="prose dark:prose-invert max-w-none" />}
        </CardContent>
      )}

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide README
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show README
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
```

#### 4.4 ProjectsTab

**File**: `app/tabs/ProjectsTab.tsx`

```typescript
import React, { useState, useMemo } from 'react';
import { ProjectCard } from '@/catalyst-ui/components/ProjectCard';
import { Input } from '@/catalyst-ui/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/catalyst-ui/ui/select';
import { filterRepos } from '@/catalyst-ui/utils/catalyst-repo/scanner';
import workspaceRepos from '@/catalyst-ui/data/workspace-repos.json';
import type { CatalystRepoMetadata } from '@/catalyst-ui/utils/markdown/types';
import { Search } from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const repos = workspaceRepos as CatalystRepoMetadata[];

  // Extract unique languages for filter
  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(repo => {
      repo.tech_stack.languages.forEach(lang => langs.add(lang));
    });
    return Array.from(langs).sort();
  }, [repos]);

  // Filter repos
  const filteredRepos = useMemo(() => {
    let filtered = repos;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filterRepos(filtered, { status: [statusFilter] });
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filterRepos(filtered, { languages: [languageFilter] });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [repos, statusFilter, languageFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="wip">WIP</SelectItem>
            <SelectItem value="experimental">Experimental</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {allLanguages.map(lang => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredRepos.length} {filteredRepos.length === 1 ? 'project' : 'projects'}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRepos.map(repo => (
          <ProjectCard key={repo.name} repo={repo} />
        ))}
      </div>

      {/* Empty State */}
      {filteredRepos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No projects found matching your filters.
        </div>
      )}
    </div>
  );
};
```

### Phase 5: Integration

#### Update App.tsx

**File**: `app/App.tsx`

```typescript
// Add import
import { ProjectsTab } from "./tabs/ProjectsTab";

// Add to TabsList
<TabsTrigger value="projects" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
  Projects
</TabsTrigger>

// Add TabsContent
<TabsContent value="projects" className="space-y-4 mt-0">
  <ProjectsTab />
</TabsContent>
```

## File Structure

```
catalyst-ui/
├── lib/
│   ├── components/
│   │   ├── MarkdownRenderer/
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   └── index.ts
│   │   ├── ProjectCard/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── index.ts
│   │   └── CodeBlock/               # ✅ Existing
│   │       └── CodeBlock.tsx
│   ├── hooks/
│   │   ├── useGitHubReadme.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── markdown/
│   │   │   ├── parser.ts
│   │   │   ├── extractor.ts
│   │   │   ├── mapper.tsx           # 🔥 Core component mapping
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── catalyst-repo/
│   │       ├── scanner.ts
│   │       └── index.ts
│   └── data/
│       └── workspace-repos.json     # Generated by build script
├── app/
│   └── tabs/
│       └── ProjectsTab.tsx
├── scripts/
│   └── scan-workspace-repos.js
└── docs/
    └── features/
        └── projects-markdown-renderer.md  # This file
```

## Future Enhancements

### Phase 2 Features

- [ ] **MDX Support**: Allow interactive React components in markdown
- [ ] **Syntax Highlighting Themes**: Match code theme to active Catalyst theme
- [ ] **Live Demos**: Embed Storybook stories or live code demos
- [ ] **Section Anchors**: Auto-generate navigation from headings
- [ ] **README Caching**: Cache fetched READMEs in localStorage
- [ ] **Skeleton Loading**: Better loading states with skeletons
- [ ] **Search Highlighting**: Highlight search terms in results

### Advanced Features

- [ ] **Component Playground**: Edit and preview components from README examples
- [ ] **Dependency Graph**: Visualize project dependencies using ForceGraph
- [ ] **Stats Dashboard**: GitHub stars, commits, contributors
- [ ] **Changelog Integration**: Fetch and display CHANGELOG.md
- [ ] **Multi-Repo Search**: Search across all README contents
- [ ] **Export**: Export rendered markdown to PDF or HTML

### Developer Experience

- [ ] **Hot Reload**: Auto-refresh when catalyst_repo.yaml changes
- [ ] **Validation**: Validate YAML schema at build time
- [ ] **TypeScript Codegen**: Generate types from YAML schema
- [ ] **CLI Tool**: `catalyst-ui scan` to manually trigger repo scan

## Dependencies

### Required

```json
{
  "dependencies": {
    "unified": "^11.0.4",
    "remark-parse": "^11.0.0",
    "remark-gfm": "^4.0.0",
    "remark-rehype": "^11.1.0",
    "rehype-raw": "^7.0.0",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/mdast": "^4.0.3",
    "@types/unist": "^3.0.2",
    "@types/js-yaml": "^4.0.9"
  }
}
```

### Already Installed

- ✅ `lucide-react` - Icons (Search, ChevronDown, ExternalLink)
- ✅ `glob` - File scanning in build script
- ✅ Radix UI components (Card, Select, Input)

## Testing Checklist

### Phase 0 (MVP - Changelog): COMPLETED ✅

- [x] `parseMarkdown()` correctly parses GFM (implemented in parser.ts)
- [x] Core utility functions created (types.ts, parser.ts, mapper.tsx, changelog-parser.ts)
- [x] Code blocks render with CodeBlock component (mapper.tsx)
- [x] Tables render with Table component (mapper.tsx)
- [x] Headings use Typography variants (mapper.tsx)
- [x] MarkdownRenderer component created (MarkdownRenderer.tsx)
- [x] ChangelogTab with dual view toggle created (ChangelogTab.tsx)
- [x] Changelog tab integrated into App.tsx

### Phase 1+ (Full Projects System): NOT STARTED

- [ ] `extractSection()` finds sections by heading (extractor functions not in current codebase)
- [ ] `extractCodeBlocks()` returns all code blocks (not implemented beyond mapper)
- [ ] `extractTables()` parses table structure (not implemented)
- [ ] `scanWorkspaceRepos()` loads JSON correctly (scanner.ts not created)
- [ ] `filterRepos()` filters by all criteria (not implemented)
- [ ] useGitHubReadme fetches from raw URL (hook not created)
- [ ] useGitHubReadme converts repo URL to raw URL (not implemented)
- [ ] ProjectCard expands/collapses (ProjectCard component not created)
- [ ] ProjectCard displays tech stack badges (not implemented)
- [ ] ProjectsTab filters work correctly (ProjectsTab not created)
- [ ] ProjectsTab search is case-insensitive (not implemented)
- [ ] Projects tab appears in App.tsx (not added)
- [ ] Build script generates workspace-repos.json (script not created)
- [ ] All themes render markdown consistently (only tested with Changelog)
- [ ] No console errors on render (Changelog works, Projects not tested)
- [ ] Performance acceptable with 10+ repos (not tested)

## Status

- [x] Problem identified
- [x] Architecture designed
- [x] Feature proposal documented
- [x] Dependencies installed (unified, remark-parse, remark-gfm, react-markdown)
- [x] Utility layer implemented (Phase 0 MVP: lib/utils/markdown/)
- [x] Component mapper created (Phase 0 MVP: lib/utils/markdown/mapper.tsx)
- [x] Components built (Phase 0 MVP: MarkdownRenderer, ChangelogTab)
- [x] Integration complete (Phase 0 MVP: Changelog tab in App.tsx)
- [ ] Tests passing (no tests written yet)
- [ ] Production ready (Phase 0 complete, Phase 1+ not started - Full Projects System with scanner, GitHub fetcher, ProjectCard pending)

## Resources

- [Unified Documentation](https://unifiedjs.com/)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [MDAST Syntax Tree](https://github.com/syntax-tree/mdast)
- [GitHub Raw URLs](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files)
