# Design Tokens Auto-Generation Feature

## Problem Statement

The `DesignTokenDocBlock` component from `storybook-design-token` package fails in production builds due to missing `/design-tokens.json` file.

### Current Behavior

- ✅ **Storybook**: Works perfectly - parses CSS files at runtime using `parameters.designToken.files`
- ❌ **Production**: Fails with JSON parse error - expects static `/design-tokens.json` endpoint

### Error

```
Uncaught (in promise) SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

The component tries to fetch `/design-tokens.json` which returns `index.html` (404).

## Current State

### CSS Annotations Already Exist

Our theme CSS files already have comprehensive `@token` annotations:

```css
/* lib/contexts/Theme/styles/catalyst.css */
--background: hsl(30 30% 82%);
/* @token { "name": "Background", "category": "Colors/Background" } */

--primary: hsl(180, 70%, 32%);
/* @token { "name": "Primary", "category": "Colors/Primary" } */
```

**All themes have these annotations:**

- `catalyst.css`
- `dracula.css`
- `gold.css`
- `laracon.css`
- `nature.css`
- `netflix.css`
- `nord.css`

### Package Behavior

`storybook-design-token` has two modes:

1. **Development (Storybook)**: Parses CSS files from `files` parameter
2. **Production**: Expects pre-generated static JSON at `/design-tokens.json`

## Proposed Solution

Create an automated build script that:

1. Parses all theme CSS files
2. Extracts `@token` annotations from comments
3. Generates `public/design-tokens.json` in the format expected by the package
4. Runs automatically before app builds

### Benefits

- ✅ Single source of truth (CSS files remain authoritative)
- ✅ Auto-updates when CSS changes
- ✅ Works in both Storybook and production
- ✅ No runtime parsing overhead in production
- ✅ Type-safe token extraction
- ✅ Can extend to generate TypeScript types from tokens

## Implementation Plan

### Step 1: Create Token Extraction Script

**File**: `scripts/generate-design-tokens.js`

```javascript
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Find all theme CSS files
const cssFiles = glob.sync("lib/contexts/Theme/styles/*.css");

// Regex to extract: --variable-name: value; /* @token { json } */
const tokenRegex = /--([a-z-]+):\s*([^;]+);\s*\/\*\s*@token\s*({[^}]+})\s*\*\//gi;

const tokens = {};

cssFiles.forEach(file => {
  const content = fs.readFileSync(file, "utf-8");
  let match;

  while ((match = tokenRegex.exec(content)) !== null) {
    const [, name, value, metadata] = match;
    const meta = JSON.parse(metadata);

    tokens[name] = {
      name: meta.name,
      value: value.trim(),
      category: meta.category,
      type: meta.type || "color",
    };
  }
});

// Write to public directory
const outputPath = path.join(__dirname, "../public/design-tokens.json");
fs.writeFileSync(outputPath, JSON.stringify({ tokens }, null, 2));

console.log(`✓ Generated ${Object.keys(tokens).length} design tokens`);
```

### Step 2: Add Build Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "prebuild:tokens": "node scripts/generate-design-tokens.js",
    "build:app": "yarn prebuild:tokens && vite build --config vite.app.config.ts",
    "build:full": "yarn build && yarn build:app"
  }
}
```

### Step 3: Restore DesignTokenDocBlock

**File**: `app/App.tsx`

```tsx
import { DesignTokenDocBlock } from "storybook-design-token";

// In Tokens tab:
<Card>
  <CardHeader>
    <CardTitle>Complete Design Token Reference</CardTitle>
    <CardDescription>Auto-generated from CSS annotations</CardDescription>
  </CardHeader>
  <CardContent>
    <DesignTokenDocBlock viewType="table" maxHeight={600} />
  </CardContent>
</Card>;
```

### Step 4: Update .gitignore (Optional)

If tokens should be generated fresh each build:

```
public/design-tokens.json
```

Or commit it if you want version control over the generated output.

## Expected Output Format

```json
{
  "tokens": {
    "background": {
      "name": "Background",
      "value": "hsl(30 30% 82%)",
      "category": "Colors/Background",
      "type": "color"
    },
    "primary": {
      "name": "Primary",
      "value": "hsl(180, 70%, 32%)",
      "category": "Colors/Primary",
      "type": "color"
    },
    "neon-cyan": {
      "name": "Neon Cyan",
      "value": "#00ffff",
      "category": "Colors/Neon",
      "type": "color"
    }
  }
}
```

## Future Enhancements

### 1. TypeScript Type Generation

Generate type-safe token references:

```typescript
// types/design-tokens.d.ts
export type DesignToken = "background" | "foreground" | "primary" | "neon-cyan";
// ... auto-generated from tokens
```

### 2. Multi-Theme Support

Generate tokens per theme:

```json
{
  "catalyst": { "tokens": { ... } },
  "dracula": { "tokens": { ... } },
  "nord": { "tokens": { ... } }
}
```

### 3. Token Validation

Add script to validate:

- All tokens have required metadata
- No duplicate token names
- Values match expected format (HSL, hex, etc.)

### 4. Watch Mode for Development

```json
{
  "scripts": {
    "dev:tokens": "nodemon --watch 'lib/contexts/Theme/styles/*.css' --exec 'yarn prebuild:tokens'"
  }
}
```

## Dependencies

**Required:**

- `glob` - For finding CSS files (already installed as devDep)

**Optional:**

- `nodemon` - For watch mode
- `chokidar` - Alternative file watcher

## Testing Checklist

- [ ] Script extracts all tokens from `catalyst.css` (script not created)
- [ ] Script handles all theme files (script not created)
- [ ] Generated JSON is valid (JSON file not generated)
- [ ] `DesignTokenDocBlock` loads in production (not tested - no JSON file)
- [ ] Storybook still works (DesignTokens.stories.tsx was deleted per git status)
- [ ] Build pipeline runs without errors (no build integration added)
- [ ] No console errors in production (not deployed)
- [ ] Token categories display correctly (not implemented)
- [ ] Color previews render properly (not implemented)

## Alternative: Manual JSON Maintenance

If automation is too complex initially, manually create and maintain `public/design-tokens.json`.

**Pros:**

- Immediate fix
- No build tooling changes

**Cons:**

- Dual maintenance (CSS + JSON)
- Easy to get out of sync
- Manual work for each token change

## References

- [storybook-design-token GitHub](https://github.com/UX-and-I/storybook-design-token)
- CSS files: `lib/contexts/Theme/styles/*.css`
- Storybook config: `lib/contexts/Theme/DesignTokens.stories.tsx`

## Status

- [x] Problem identified
- [x] CSS annotations verified (CSS files have @token annotations)
- [ ] Extraction script created (scripts/generate-design-tokens.js not found)
- [ ] Build integration added (no prebuild:tokens script in package.json)
- [ ] Production tested (cannot test without script)
- [ ] Documentation updated (DesignTokens.stories.tsx deleted per git status)
