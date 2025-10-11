# Text Extraction Codemod

Automatically wraps hardcoded JSX text with `EditableText` components and generates co-located translation files.

## Features

✅ **Automatic text wrapping** - Wraps all eligible text in `<EditableText>` components
✅ **Smart filtering** - Skips numbers, short text (< 3 chars), variables
✅ **Co-located translations** - Creates `ComponentName/.locale/ComponentName.i18n.json`
✅ **Auto-imports** - Adds `EditableText` import if needed
✅ **Translation key generation** - Converts text to snake_case keys
✅ **Dry run mode** - Preview changes before applying

## Usage

### Basic usage (dry run first)

```bash
# Preview changes
yarn text-extract app/tabs --dry-run

# Apply transformations
yarn text-extract app/tabs
```

### Process specific file

```bash
yarn text-extract app/tabs/MyTab.tsx
```

### Options

```bash
--dry-run          # Preview without modifying files
--min-length=N     # Only wrap text with N+ characters (default: 3)
--skip-imports     # Don't add EditableText imports
--namespace=NAME   # Override auto-detected namespace (rarely needed)
```

### Examples

```bash
# Preview changes for all components
yarn text-extract lib/components --dry-run

# Process with minimum 5 character requirement
yarn text-extract app/tabs --min-length=5

# Process specific file
yarn text-extract app/tabs/OverviewTab.tsx
```

## What Gets Wrapped?

### ✅ Wrapped

- Text with 3+ characters: `Welcome to Catalyst UI`
- Multi-word text: `Click Me`
- Text with special chars: `Settings & Preferences`
- Text in JSX elements: `<Button>Save</Button>`

### ❌ Skipped

- Short text (< 3 chars): `OK`, `No`
- Numbers: `123`, `42`
- Variables: `userName`, `CONSTANT_VALUE`
- Whitespace-only text

## Output Structure

### Before

```tsx
// app/tabs/MyTab.tsx
export function MyTab() {
  return (
    <div>
      <h1>Welcome to My Tab</h1>
      <Button>Click Me</Button>
    </div>
  );
}
```

### After

```tsx
// app/tabs/MyTab.tsx
import { EditableText } from "@/catalyst-ui/components/EditableText";

export function MyTab() {
  return (
    <div>
      <h1>
        <EditableText id="welcome_to_my_tab" namespace="MyTab">
          Welcome to My Tab
        </EditableText>
      </h1>
      <Button>
        <EditableText id="click_me" namespace="MyTab">
          Click Me
        </EditableText>
      </Button>
    </div>
  );
}
```

### Generated Translation File

```json
// app/tabs/MyTab/.locale/MyTab.i18n.json
{
  "welcome_to_my_tab": "Welcome to My Tab",
  "click_me": "Click Me"
}
```

## How It Works

1. **Scans** TSX/JSX files for text nodes
2. **Filters** out numbers, short text, variables
3. **Generates** snake_case translation keys
4. **Wraps** text in `<EditableText>` components
5. **Creates** `ComponentName/.locale/ComponentName.i18n.json`
6. **Auto-loads** via `import.meta.glob` in i18n config

## Integration

The i18n config (`lib/contexts/I18n/i18n.ts`) automatically loads all translation files from `.locale` folders:

```typescript
const translationModules = import.meta.glob(
  [
    "../../../**/.locale/*.i18n.json",
    "../../../**/.locale/*.*.i18n.json",
    "../../../../app/**/.locale/*.i18n.json",
    "../../../../app/**/.locale/*.*.i18n.json",
  ],
  { eager: true }
);
```

**Namespace = filename** (without extension)

- `MyComponent/.locale/MyComponent.i18n.json` → namespace: `"MyComponent"`
- `OverviewTab/.locale/OverviewTab.i18n.json` → namespace: `"OverviewTab"`
- `OverviewTab/.locale/OverviewTab.es.i18n.json` → namespace: `"OverviewTab"`, locale: `"es"`

## Tips

1. **Always dry run first**: `yarn text-extract path/to/dir --dry-run`
2. **Start with one file**: Test on a single component before batch processing
3. **Review changes**: Check git diff before committing
4. **Adjust min-length**: Use `--min-length=5` to skip very short text
5. **Run dev server**: Verify text is editable with hover icons

## Troubleshooting

### Text not wrapped

- Check minimum length (default: 3 chars)
- Verify it's not a number or variable name
- Make sure it's actual JSX text, not a string in props

### Import not added

- Use `--skip-imports` if you want to add import manually
- Check if import already exists (won't duplicate)

### Translation file not created

- Verify file was transformed (check console output)
- Check file permissions
- Look for `ComponentName/.locale/ComponentName.i18n.json`

## Next Steps

After running the codemod:

1. **Start dev server**: `yarn dev`
2. **Hover over text**: Edit icons appear in dev mode
3. **Edit translations**: Click icon → modal → save
4. **Dump changes**: Settings → i18n tab → Dump translations
5. **Test all components**: Verify no text is broken

## Architecture

- **Codemod**: `scripts/codemods/text-extract.ts` (jscodeshift-based)
- **EditableText**: `lib/components/EditableText/EditableText.tsx`
- **LocalizationContext**: `lib/contexts/Localization/LocalizationContext.tsx`
- **i18n config**: `lib/contexts/I18n/i18n.ts`
- **Translation files**: `ComponentName/.locale/*.i18n.json` (co-located with components)
- **Backend API**: `server/api/i18n.ts` (handles translation updates)
