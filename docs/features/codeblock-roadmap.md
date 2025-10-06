# CodeBlock Component

A syntax highlighting code block component with advanced features and performance optimization.

## Implementation Status

✅ **MVP Complete** - All core features implemented
✅ **Advanced Features** - Interactive controls and theme support
✅ **Performance** - Lazy-loading and caching optimizations

## Features

### Core Features ✅
- **Syntax Highlighting**: Powered by [Shiki](https://shiki.matsu.io/) with WASM support
- **Language Support**: All bundled languages via lazy-loading
- **Theme Support**: Custom Catalyst theme + all Shiki bundled themes
- **Line Numbers**: Configurable with custom start number support
- **Copy Button**: One-click code copying to clipboard
- **File Names**: Optional header with file name display

### Interactive Features ✅
- **Editable Mode**: Convert to live-editable textarea
- **Theme Switcher**: Dynamic theme switching in interactive mode
- **Line Number Toggle**: Show/hide line numbers on demand
- **Header Controls**: Slim control header with all options

### Performance Optimizations ✅
- **Singleton Highlighter**: Shared instance across all CodeBlock components
- **Lazy Language Loading**: Languages loaded on-demand, not upfront
- **Lazy Theme Loading**: Themes loaded only when needed
- **Error Handling**: Graceful fallback to plain `<pre><code>` if Shiki fails
- **WASM Caching**: Highlighter instance cached to avoid re-initialization

## Architecture

### Component Structure
```
lib/components/CodeBlock/
├── CodeBlock.tsx              # Main component with Shiki integration
├── CodeBlockHeader.tsx        # Interactive header with controls
├── catalyst-theme.ts          # Custom Catalyst syntax theme
└── CodeBlock.stories.tsx      # Storybook documentation
```

### API

```typescript
interface CodeBlockProps {
  code: string;                    // Code to highlight
  language: string;                // Language for syntax highlighting
  theme?: string;                  // Theme name (default: "catalyst")
  showLineNumbers?: boolean;       // Show line numbers (default: true)
  showCopyButton?: boolean;        // Show copy button (default: true)
  fileName?: string;               // Optional file name in header
  startLineNumber?: number;        // Custom line number start (default: 1)
  interactive?: boolean;           // Enable interactive controls (default: false)
  editable?: boolean;              // Enable edit mode (default: false)
  onThemeChange?: (theme: string) => void;
  onLineNumbersChange?: (show: boolean) => void;
  onCodeChange?: (code: string) => void;
}
```

### Usage Example

```typescript
import { CodeBlock } from 'catalyst-ui';

// Basic usage
<CodeBlock
  code={`function hello() {\n  console.log("Hello, World!");\n}`}
  language="typescript"
/>

// Advanced usage
<CodeBlock
  code={tsCode}
  language="typescript"
  fileName="example.ts"
  theme="dracula"
  interactive={true}
  editable={true}
  onCodeChange={setCode}
/>
```

## Shiki Integration

### Lazy Loading Pattern
```typescript
// Singleton pattern with lazy-loaded languages/themes
async function getHighlighter() {
  if (highlighterInstance) return highlighterInstance;

  highlighterInstance = await createHighlighter({
    themes: [],
    langs: [],
  });

  return highlighterInstance;
}

// Load language on-demand
if (!loadedLanguages.has(language)) {
  await highlighter.loadLanguage(language as BundledLanguage);
  loadedLanguages.add(language);
}
```

### Custom Theme
The Catalyst theme (`catalyst-theme.ts`) provides cyberpunk-inspired syntax colors:
- Neon cyan for keywords
- Electric purple for strings
- Bright green for comments
- Matches the overall Catalyst design system

## Known Issues

### WASM Loading in Production
- **Issue**: Shiki WASM files may fail to load in some production environments
- **Mitigation**: Component has error handling to fall back to plain `<pre><code>` blocks
- **Status**: Gracefully degraded, no blocking errors

## Future Enhancements

### Planned Features
- [ ] **Code Execution**: Run JavaScript/TypeScript in sandboxed environment
- [ ] **Diff View**: Side-by-side or inline diff highlighting
- [ ] **Virtual Scrolling**: Performance for extremely large code blocks (10k+ lines)
- [ ] **Export Options**: Export to HTML, SVG, or image formats
- [ ] **Code Folding**: Collapsible code sections

### Potential Improvements
- [ ] **Line Highlighting**: Highlight specific lines (e.g., error lines)
- [ ] **Search/Filter**: In-block code search
- [ ] **Annotations**: Inline comments and explanations
- [ ] **Token Linking**: Click tokens to navigate to definitions

## Documentation

- **Storybook**: See `lib/components/CodeBlock/CodeBlock.stories.tsx` for live examples
- **Implementation**: `lib/components/CodeBlock/CodeBlock.tsx`
- **Theme**: `lib/components/CodeBlock/catalyst-theme.ts`

## Resources

- [Shiki Documentation](https://shiki.matsu.io/)
- [Bundled Languages](https://shiki.matsu.io/languages)
- [Bundled Themes](https://shiki.matsu.io/themes)
- [Custom Themes Guide](https://shiki.matsu.io/guide/load-theme)
