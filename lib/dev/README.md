# Development Utilities

This directory contains all development-mode utilities and UI components for catalyst-ui. These tools are designed to be **tree-shakeable** and can be completely removed from production builds when not explicitly enabled.

## Directory Structure

```
lib/dev/
├── annotation/          # Component annotation system
├── components/          # Dev-mode UI components (DevModeToggle, EditableText)
├── context/             # Dev-mode React contexts (LocalizationContext, AnnotationContext)
├── utils/               # Dev-mode utilities (devMode.ts)
└── README.md           # This file
```

## Core Concepts

### Production Dev Flag

The dev utilities can be enabled in production builds using the `VITE_CATALYST_DEV_UTILS_ENABLED` environment variable. This enables **inspection and UI features** while **disabling all file write operations**.

**Key utilities:**

```typescript
import { isDevUtilsEnabled, isBackendSyncEnabled } from "@/catalyst-ui/dev/utils/devMode";

// Check if dev UI should be visible
if (isDevUtilsEnabled()) {
  // Show dev tools, render DevModeToggle, enable inspection
}

// Check if backend sync (file writes) is allowed
if (isBackendSyncEnabled()) {
  // Only true in genuine dev mode (never in production)
  // Safe to write to file system via Vite middleware
}
```

### Tree-Shaking

All code in `lib/dev/` is automatically tree-shaken from production builds if not imported. The library uses:

- **ES modules** format for optimal tree-shaking
- **sideEffects: false** for all JS/TS files (only CSS has side effects)
- **Conditional imports** - dev utilities are only imported when `isDevUtilsEnabled()` returns true

## Features

### 1. Annotation System

Real-time component annotations for tracking TODOs, bugs, notes, and documentation needs.

**Features:**

- Visual component inspector
- Annotation CRUD operations
- LocalStorage persistence
- Backend sync (dev mode only)
- Priority levels and categories

**Usage:**

```tsx
import { AnnotationProvider, DevModeToggle } from "@/catalyst-ui/dev";

function App() {
  return (
    <AnnotationProvider>
      <DevModeToggle />
      {/* Your app */}
    </AnnotationProvider>
  );
}
```

### 2. Localization Editing

Live translation editing with undo/redo support.

**Features:**

- In-place text editing
- Namespace-aware translation management
- Undo/redo history
- Dirty state tracking
- Backend sync (dev mode only)
- Export to JSON

**Usage:**

```tsx
import { LocalizationProvider, EditableText } from "@/catalyst-ui/dev";

function App() {
  return (
    <LocalizationProvider>
      <EditableText namespace="common" translationKey="app.welcome" defaultValue="Welcome!" />
    </LocalizationProvider>
  );
}
```

### 3. DevModeToggle Component

Central hub for all dev utilities.

**Features:**

- Dropdown menu with organized sections
- Component inspector activation
- Annotation list view
- Translation management UI
- Auto-hides in production (unless flag is set)

## Environment Variables

### `VITE_CATALYST_DEV_UTILS_ENABLED`

**Type:** `"true" | "false" | undefined`
**Default:** `undefined`

Enables dev utilities UI in production builds while disabling backend sync.

**Example `.env.production`:**

```bash
# Enable dev tools in production (no file writes)
VITE_CATALYST_DEV_UTILS_ENABLED=true
```

**Build command:**

```bash
# Production build with dev tools
VITE_CATALYST_DEV_UTILS_ENABLED=true yarn build

# Regular production build (no dev tools)
yarn build
```

**GitHub CI/CD:**

The demo site deployed to GitHub Pages has dev utilities enabled by default. This is configured in `scripts/build-ci.sh`:

```bash
# Enable dev utilities in production demo (UI only, no backend sync)
export VITE_CATALYST_DEV_UTILS_ENABLED=true
```

This allows visitors to the demo site to:

- View component annotations
- See translation editing UI
- Explore dev mode features

But backend sync (file writes) is disabled in production builds, so no data persists.

## Backend Sync

Backend sync is implemented via Vite middleware and **only works in true development mode**.

### Annotation Sync

**Endpoint:** `POST /api/annotations/sync`

Writes annotations to `annotations.json` at the workspace root.

**Implementation:** `build/vite-plugin-i18n-api.ts`

### Translation Sync

**Endpoint:** `POST /api/i18n/update`

Writes translation changes to component-specific i18n files:

- Global: `lib/i18n/locales/*.json`
- Component: `app/tabs/.locale/ComponentName.en.i18n.json`

**Implementation:** `build/vite-plugin-i18n-api.ts`

## Architecture Notes

### Separation from Production Code

**Production i18n** lives in `lib/contexts/i18n/`:

- `i18n.ts` - i18next configuration
- `I18nProvider.tsx` - React provider

**Dev-mode localization editing** lives in `lib/dev/context/`:

- `LocalizationContext.tsx` - Translation editing layer

This separation ensures:

- Core i18n always ships with the library
- Dev editing features are tree-shakeable
- Clean separation of concerns

### State Management

All dev utilities use:

- **LocalStorage** for persistence across sessions
- **React Context** for state management
- **Periodic sync** (dev mode only) for file writes

## Adding New Dev Utilities

Follow this pattern when adding new dev features:

1. **Create the feature in `lib/dev/`**

```typescript
// lib/dev/utils/myFeature.ts
import { isDevUtilsEnabled, isBackendSyncEnabled } from "./devMode";

export function myDevFeature() {
  if (!isDevUtilsEnabled()) {
    return; // Early return if not enabled
  }

  // ... dev UI logic
}

export async function syncToBackend(data: any) {
  if (!isBackendSyncEnabled()) {
    console.log("[MyFeature] Backend sync disabled");
    return;
  }

  // ... sync logic
}
```

2. **Use conditional rendering**

```tsx
import { isDevUtilsEnabled } from "@/catalyst-ui/dev/utils/devMode";

function MyComponent() {
  if (!isDevUtilsEnabled()) {
    return null;
  }

  return <div>Dev UI</div>;
}
```

3. **Export from barrel files**

```typescript
// lib/dev/index.ts
export * from "./utils/myFeature";
```

## TypeScript

Environment variable types are defined in `lib/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_CATALYST_DEV_UTILS_ENABLED?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}
```

## Testing

Test dev utilities by:

1. **Dev mode (default):**

   ```bash
   yarn dev
   # All features enabled, backend sync works
   ```

2. **Production mode with dev UI:**

   ```bash
   VITE_CATALYST_DEV_UTILS_ENABLED=true yarn build
   yarn preview
   # UI visible, backend sync disabled
   ```

3. **Production mode (clean):**
   ```bash
   yarn build
   yarn preview
   # No dev UI, completely tree-shaken
   ```

## Best Practices

1. **Always check `isDevUtilsEnabled()` before rendering dev UI**
2. **Always check `isBackendSyncEnabled()` before file writes**
3. **Use early returns for performance**
4. **Keep dev code isolated in `lib/dev/`**
5. **Document all backend endpoints**
6. **Add TypeScript types for all env variables**

## Troubleshooting

### Dev tools not appearing in production

**Check:**

1. Is `VITE_CATALYST_DEV_UTILS_ENABLED=true` set at build time?
2. Are you importing dev utilities correctly?
3. Is the component wrapped in the appropriate provider?

### Backend sync not working

**Check:**

1. Are you in true dev mode (`import.meta.env.DEV === true`)?
2. Is the Vite dev server running (not production build)?
3. Are the API endpoints registered in `vite.config.ts`?

### Build size larger than expected

**Check:**

1. Are you importing from `lib/dev/` in production code?
2. Run `yarn build --mode production` and check the bundle analyzer
3. Ensure `sideEffects: ["**/*.css"]` is in `package.json`

## Related Documentation

- [Animation Architecture](../../docs/architecture/animation-hoc.md)
- [Export Patterns](../../docs/architecture/export-patterns.md)
- [i18n Co-location](../../docs/architecture/i18n-colocated-translations.md)
