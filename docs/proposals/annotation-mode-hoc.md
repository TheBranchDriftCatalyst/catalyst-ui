# Dev Mode Editing System (Annotation + i18n Text Editing)

## Overview

A comprehensive development system that provides interactive dev-mode capabilities. This system combines **two powerful features**:

1. **Component Annotation System**: Click components to attach notes, TODOs, and bug reports mapped to source code
2. **In-Browser Text Editing**: Edit any text content directly in the UI with automatic back-propagation to translation files

### Current Status

| Feature                     | Status             | Implementation               |
| --------------------------- | ------------------ | ---------------------------- |
| i18n Text Editing           | ✅ **COMPLETE**    | Phase 1 (2025-10-10)         |
| Component Annotation        | ✅ **COMPLETE**    | Phase 2 (2025-10-11)         |
| React Fiber Inspection      | ✅ **COMPLETE**    | ComponentInspector           |
| Backend API                 | ✅ **COMPLETE**    | i18n + annotations endpoints |
| Export Utilities            | ✅ **IMPLEMENTED** | JSON, TODO, GitHub formats   |
| Instance-Scoped Annotations | ✅ **COMPLETE**    | Unique instance tracking     |

**Lines of Code**: 2,323 lines across lib/dev/, server/api/, and documentation

## Implementation Summary

### Architecture

The system is organized under `lib/dev/` with three main areas:

```
lib/dev/
├── context/              # State management
│   ├── AnnotationContext.tsx
│   ├── I18nProvider.tsx
│   └── i18n.ts
├── annotation/           # Annotation UI
│   ├── ComponentInspector.tsx
│   ├── AnnotationForm.tsx
│   ├── AnnotationList.tsx
│   ├── AnnotationPanel.tsx
│   ├── AnnotationToggle.tsx
│   ├── AnnotationListSheet.tsx
│   ├── AnnotationFormSheet.tsx
│   └── utils/exporters.ts
├── i18n/                 # I18n exports
│   └── index.ts
└── components/           # Shared dev components
    └── DevModeToggle.tsx
```

### Key Features Implemented

#### 1. React Fiber Component Inspection ✅

**File**: `lib/dev/annotation/ComponentInspector.tsx` (285 lines)

**What it does**:

- Click "Inspect" button to activate inspector mode
- Visual blue outline appears on component hover
- Click any component to select it and extract information
- Uses React Fiber API to walk component tree from DOM elements
- Extracts component name, props, state, file path, and line number (dev mode only)
- Generates unique instance identifiers and human-readable tree paths

**Key implementation**:

```typescript
// Extract React Fiber from DOM element
function getFiberFromElement(element: HTMLElement): any {
  const key = Object.keys(element).find(
    key => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
  );
  return key ? (element as any)[key] : null;
}

// Walk up fiber tree to find component
function getComponentInfoFromFiber(fiber: any): ComponentInfo | null {
  let current = fiber;

  while (current) {
    const { type, memoizedProps, memoizedState, _debugSource } = current;

    if (typeof type === "function") {
      const treePath = buildTreePath(current).join(" > ");
      const instanceId = generateInstanceId(current, memoizedProps);

      return {
        name: type.displayName || type.name || "Anonymous",
        type: "function",
        props: memoizedProps || {},
        state: memoizedState,
        filePath: _debugSource?.fileName,
        lineNumber: _debugSource?.lineNumber,
        instanceId,
        treePath,
      };
    }
    current = current.return;
  }

  return null;
}
```

**ComponentInfo Interface**:

```typescript
export interface ComponentInfo {
  name: string; // Component name
  type: string; // "function" or "class"
  props: Record<string, any>; // Component props
  state?: any; // Component state (if any)
  filePath?: string; // Source file path (dev only)
  lineNumber?: number; // Line number (dev only)
  instanceId?: string; // Unique instance identifier
  treePath?: string; // Human-readable tree path ("App > Layout > Button")
}
```

#### 2. AnnotationContext with Backend Sync ✅

**File**: `lib/dev/context/AnnotationContext.tsx` (313 lines)

**Features**:

- Stores annotations in-memory + localStorage
- CRUD operations for annotations
- Periodic backend sync (writes to annotations.json via Vite middleware)
- Sync status tracking ("idle", "syncing", "synced", "error")
- 5-second sync interval when annotations exist

**Annotation Interface**:

```typescript
export interface Annotation {
  id: string; // UUID
  componentName: string; // Component name
  note: string; // Annotation content
  type: "todo" | "bug" | "note" | "docs";
  priority: "low" | "medium" | "high";
  timestamp: number; // Creation time (ms since epoch)
  filePath?: string; // Source file path
  lineNumber?: number; // Line number
  instanceId?: string; // Unique instance identifier
  treePath?: string; // Tree path for identification
}
```

**Usage**:

```typescript
import { useAnnotationContext } from "@/catalyst-ui/dev/context";

function MyComponent() {
  const { addAnnotation, getAllAnnotations, syncToBackend } = useAnnotationContext();

  const handleAddNote = () => {
    addAnnotation({
      componentName: "MyComponent",
      note: "Fix this later",
      type: "todo",
      priority: "high",
    });
  };
}
```

#### 3. Bottom Drawer UI with Inspector Integration ✅

**File**: `lib/dev/annotation/AnnotationPanel.tsx`

**Features**:

- Bottom drawer (80vh height) with smooth transitions
- Minimizes to 15vh when inspector is active (full page access)
- Tabs: Create, List, Export
- ComponentInspector integrated in "Create" tab
- Auto-fills component name when component selected
- Displays selected component info (props, state, file path)

**User Experience Flow**:

1. User opens annotation panel (bottom drawer at 80vh height)
2. Switches to "Create" tab
3. Clicks "Inspect" button to activate inspector mode
4. **Drawer automatically minimizes to 15vh height** (smooth transition)
5. Floating blue indicator appears: "Inspector Mode Active - Click any component"
6. User hovers over components → blue outline highlights them
7. User clicks a component → Component info is extracted and displayed
8. Inspector mode deactivates automatically
9. **Drawer expands back to 80vh height** (smooth transition)
10. Component name is auto-filled in the annotation form
11. Selected component details displayed (props, state, file path)
12. User adds note, type, priority
13. Submits annotation → Stored in context → Synced to backend

#### 4. Backend API Endpoints ✅

**Files**:

- `server/api/annotations.ts` (annotation sync)
- `server/api/i18n.ts` (translation updates)

**Endpoints**:

**POST `/api/annotations/sync`**

```typescript
// Request
{
  "annotations": [
    {
      "id": "uuid",
      "componentName": "Button",
      "note": "Add loading state",
      "type": "todo",
      "priority": "high",
      "timestamp": 1728234567890
    }
  ]
}

// Response
{
  "success": true,
  "count": 1,
  "file": "annotations.json"
}
```

**POST `/api/i18n/update`**

```typescript
// Request
{
  "namespace": "OverviewTab",
  "locale": "en",
  "key": "welcome_message",
  "value": "Welcome to Catalyst UI"
}

// Response
{
  "success": true,
  "file": "app/tabs/.locale/OverviewTab.en.i18n.json"
}
```

#### 5. Export Utilities ✅

**File**: `lib/dev/annotation/utils/exporters.ts`

**Functions**:

- `exportAsJSON(annotations)` - Raw JSON export
- `exportAsTODOComments(annotations)` - Generate TODO comments for code
- `exportAsGitHubIssues(annotations)` - Format for GitHub Issues API
- `exportAsMarkdown(annotations)` - Human-readable markdown report

**Example Markdown Output**:

```markdown
# Component Annotations

## app/tabs/CardsTab.tsx

### Line 13: CardDemo

**Type**: todo | **Priority**: medium

TODO: Add loading skeleton

---

### Line 13: CardDemo

**Type**: bug | **Priority**: high

Button doesn't trigger action on first click

---
```

#### 6. i18n Text Editing System ✅

**Complete implementation from Phase 1** (2025-10-10):

**Components**:

- `lib/components/EditableText/EditableText.tsx` - Hover-to-edit wrapper
- `lib/components/EditableText/TextEditDialog.tsx` - Edit modal
- `lib/contexts/Localization/LocalizationContext.tsx` - State management
- `lib/contexts/I18n/` - react-i18next configuration
- `scripts/codemods/text-extract.ts` - Automated text extraction codemod

**Translation File Organization**:

**Two patterns supported**:

1. **Co-located translations** (preferred for component-specific text):

   ```
   app/tabs/.locale/
   ├── OverviewTab.en.i18n.json
   ├── OverviewTab.es.i18n.json
   └── TypographyTab.en.i18n.json
   ```

2. **Global translations** (for shared text):
   ```
   locales/en/
   ├── common.json
   ├── components.json
   └── errors.json
   ```

**Usage**:

```typescript
import { EditableText } from '@/catalyst-ui/components/EditableText';

function WelcomePage() {
  return (
    <h1>
      <EditableText id="welcome_title" namespace="OverviewTab">
        Welcome to Catalyst UI 👋
      </EditableText>
    </h1>
  );
}
```

**Dev Mode Behavior**:

- Hover over text → Edit icon (✏️) appears
- Click icon → Modal opens with current text
- Edit and save → Updates translation file via backend API
- Page updates instantly (HMR via Vite)

**Production Behavior**:

- EditableText wrapper is transparent (no overhead)
- Only translation keys are used

#### 7. Automated Text Extraction ✅

**File**: `scripts/codemods/text-extract.ts` (329 lines)

**What it does**:

- Automatically wraps all JSX text nodes in `EditableText` components
- Generates snake_case translation keys
- Creates co-located `.locale/ComponentName.LANG.i18n.json` files
- Auto-adds imports for EditableText
- Filters intelligently (skips numbers, variables, short strings)

**Usage**:

```bash
# Extract and wrap text from a single file
yarn text-extract app/tabs/OverviewTab.tsx

# Dry run on entire directory
yarn text-extract app/tabs --dry-run

# Process with custom namespace
yarn text-extract lib/components --namespace=common
```

**Real-world Results** (OverviewTab.tsx):

- Processed 690 lines of code in 0.58s
- Wrapped 143 text blocks
- Generated 135 unique translation keys
- Created co-located translation file

## Provider Hierarchy

**File**: `app/App.tsx`

```tsx
<AnnotationProvider>
  {" "}
  {/* Dev-mode annotation system */}
  <I18nProvider>
    {" "}
    {/* react-i18next (read translations) */}
    <LocalizationProvider>
      {" "}
      {/* Dev-only editing layer */}
      <ThemeProvider>
        {" "}
        {/* Theme system */}
        <HeaderProvider>
          {" "}
          {/* Header management */}
          <YourApp />
        </HeaderProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </I18nProvider>
</AnnotationProvider>
```

**Order Rationale**:

1. AnnotationProvider outermost (can annotate any component)
2. I18nProvider provides translation database
3. LocalizationProvider adds editing layer on top
4. ThemeProvider/HeaderProvider may use translations

## API Design

### Annotation System

```typescript
// Access annotation context
import { useAnnotationContext } from "@/catalyst-ui/dev/context";

const {
  getAllAnnotations,
  getAnnotationsByComponent,
  addAnnotation,
  removeAnnotation,
  updateAnnotation,
  syncStatus,
  syncError,
  syncToBackend,
  clearAll,
} = useAnnotationContext();

// Add annotation
addAnnotation({
  componentName: "Button",
  note: "Add loading state",
  type: "todo",
  priority: "high",
  instanceId: "abc123", // Optional: for instance-scoped annotations
  treePath: "App > Layout > Button",
});

// Manually trigger sync
await syncToBackend();
```

### Text Editing System

```typescript
// Use EditableText wrapper
import { EditableText } from '@/catalyst-ui/components/EditableText';

<EditableText id="welcome_message" namespace="OverviewTab">
  Welcome to Catalyst UI
</EditableText>

// Access localization context
import { useLocalizationContext } from '@/catalyst-ui/contexts/Localization';

const {
  updateTranslation,
  dumpLocalizationFile,
  getChanges,
  clearChanges,
} = useLocalizationContext();

// Programmatically update translation
updateTranslation('OverviewTab', 'welcome_message', 'New text');

// Dump changes to JSON file
dumpLocalizationFile('OverviewTab'); // or dumpLocalizationFile() for all
```

### Component Inspector

```typescript
import { ComponentInspector } from '@/catalyst-ui/dev/annotation';

const [active, setActive] = useState(false);

<ComponentInspector
  active={active}
  onToggle={setActive}
  onComponentSelect={(info) => {
    console.log('Selected:', info.name, info.treePath);
    console.log('Instance ID:', info.instanceId);
    console.log('Props:', info.props);
  }}
/>
```

## Testing Summary

### Phase 1 - i18n Text Editing ✅

- [x] i18next initializes correctly
- [x] Translation files load (global + co-located)
- [x] Namespaces work correctly
- [x] Edit icon appears on hover (dev mode only)
- [x] Edit dialog opens and displays current text
- [x] Form validation prevents empty text
- [x] Save updates translation file via backend API
- [x] Cancel closes dialog without changes
- [x] Codemod processes TSX/JSX files
- [x] Real-world tested on OverviewTab.tsx (143 blocks, 135 keys)
- [x] Production build strips dev-only code

### Phase 2 - Annotation System ✅

- [x] React Fiber inspection works correctly
- [x] Component name, props, state extracted
- [x] File path and line number resolved (dev mode)
- [x] Visual highlight on hover (blue outline)
- [x] Click-to-select activates
- [x] Annotation form auto-fills component name
- [x] AnnotationContext stores annotations (localStorage)
- [x] Backend sync works (POST /api/annotations/sync)
- [x] Periodic sync every 5 seconds
- [x] Instance-scoped annotations with unique IDs
- [x] Tree path tracking for identification
- [x] Export utilities implemented (JSON, TODO, GitHub, Markdown)
- [x] Bottom drawer UI with smooth transitions
- [x] Inspector integration with drawer minimize/expand

## Benefits

### Annotation System

- ✅ **Visual Context**: Connect UI elements directly to source code
- ✅ **No Context Switching**: Annotate without leaving the app
- ✅ **Automatic Mapping**: No manual file path/line number lookup
- ✅ **React Fiber Introspection**: Extract component details automatically
- ✅ **Instance-Level Tracking**: Annotate specific component instances
- ✅ **Export Flexibility**: Multiple export formats (JSON, TODO, GitHub, Markdown)
- ✅ **Zero Instrumentation**: Works with any React component
- ✅ **Backend Sync**: Auto-saves to annotations.json file

### Text Editing System

- ✅ **i18n-Ready from Day One**: All text managed through translation files
- ✅ **Instant Copy Changes**: Edit text in browser, see changes immediately
- ✅ **Designer-Friendly**: Non-technical team members can edit copy
- ✅ **Multi-Language Support**: Easy to add new languages
- ✅ **Safe Back-Propagation**: Writes to JSON, not source code
- ✅ **Build-Time Validation**: Codemod identifies hardcoded text
- ✅ **Zero Production Overhead**: EditableText wrapper is dev-only
- ✅ **Co-located Organization**: Translations live next to components

### Combined System

- ✅ **Unified Dev Experience**: Single provider system for both features
- ✅ **Consistent Patterns**: Both systems use similar context/provider architecture
- ✅ **Dev-Only Features**: All editing features stripped in production
- ✅ **Hot Reload Everything**: Annotations and translations both support instant updates
- ✅ **File-Based Persistence**: Backend API writes to filesystem

## Future Enhancements

### Annotation System

**Phase 3 Features**:

- [ ] Cloud Sync: Share annotations across team via database
- [ ] Screenshot Annotations: Attach visual context to notes
- [ ] Code Diff Integration: Track annotations across git commits
- [ ] Bulk Operations: Select multiple components, batch annotate
- [ ] Search & Filter: Find annotations by type, priority, component

**Advanced Features**:

- [ ] AI Suggestions: Auto-generate improvement suggestions
- [ ] Live Collaboration: Real-time annotation sharing
- [ ] Recording Mode: Record user interactions and auto-annotate
- [ ] Analytics Dashboard: Track annotation patterns

**Developer Experience**:

- [ ] VSCode Extension: Jump to annotation from code editor
- [ ] CLI Tools: Export/import annotations via command line
- [ ] Storybook Integration: Annotate components in Storybook
- [ ] CI/CD Integration: Block deploys if high-priority annotations exist

### Text Editing System

**Phase 3 Features**:

- [ ] Multi-Language Support: UI for switching locales, edit multiple languages
- [ ] Translation Memory: Auto-suggest translations based on similar strings
- [ ] Bulk Text Editing: Edit multiple translation keys at once
- [ ] Translation Diff View: Compare translations across languages
- [ ] Translation History: Track changes with git integration

**Advanced Features**:

- [ ] AI-Powered Translation: Auto-translate using LLMs
- [ ] Context-Aware Suggestions: Show suggestions based on component context
- [ ] Translation Validation: Warn about missing translations
- [ ] Character Count Warnings: Flag translations exceeding UI space limits
- [ ] RTL Language Support: Automatic right-to-left layout

**Designer/Content Team Features**:

- [ ] Translation Dashboard: Web UI for non-developers
- [ ] Translation Approval Workflow: Require review before going live
- [ ] A/B Testing Integration: Test different copy variations
- [ ] Translation Analytics: Track which copy performs best

## Dependencies

### Installed

**Required**:

- `react` (≥18.0) - Core framework
- `react-i18next` (^13.5.0) - i18n framework
- `i18next` (^23.7.0) - Translation engine
- `react-hook-form` + `zod` - Form handling
- `@radix-ui/react-dialog` - Modal components
- `lucide-react` - Icons

**Dev Dependencies**:

- `jscodeshift` (^17.3.0) - AST transformation for codemod
- `tsx` (^4.20.6) - TypeScript execution
- `@types/node` (^20.10.0) - Node.js types

## Known Limitations

### React Fiber Dependency

- **Issue**: Component introspection relies on React Fiber internals (dev mode only)
- **Mitigation**: `_debugSource` only available in development builds
- **Status**: Works perfectly in dev mode; production would require source map parsing

### Source Map Accuracy

- **Issue**: Transpiled code may have inaccurate line numbers
- **Mitigation**: Use high-quality source maps, document limitations
- **Status**: Acceptable for development workflow

### Instance Identification

- **Issue**: Generating stable instance IDs across re-renders can be challenging
- **Mitigation**: Use combination of tree path, props hash, key, and index
- **Status**: Works well for most use cases; edge cases may exist

## Architectural Decisions

### 1. Co-located Translation Files

**Decision**: Support both co-located (`.locale/ComponentName.LANG.i18n.json`) and global (`locales/LANG/*.json`) translation files.

**Rationale**:

- Better file organization (translations live next to code)
- Easier maintenance (no giant global JSON files)
- Automatic namespace detection from filename
- Backward compatible with global pattern

### 2. React Fiber over React DevTools Extension

**Decision**: Use direct Fiber access instead of building a browser extension.

**Rationale**:

- Seamless in-app integration
- No separate installation required
- Works with existing theme and UI components
- Can be packaged with library

### 3. Bottom Drawer over Side Sheet

**Decision**: Use bottom drawer for annotation panel instead of side sheet.

**Rationale**:

- More horizontal space for displaying props/state
- Doesn't cover the UI being annotated
- Better for wide-format displays
- Dynamic height allows full page access during inspection

### 4. LocalizationContext (Offline-First) over Backend-Only

**Decision**: Store translation changes in-memory + localStorage, with manual dump to files.

**Rationale**:

- Simpler than backend API (Phase 1)
- Works completely offline
- Instant feedback (no network latency)
- Safe (no automatic file system writes)
- Easy to audit changes before committing
- Backend API added in Phase 2 for convenience

### 5. Instance-Scoped Annotations

**Decision**: Generate unique instance IDs for annotations instead of only tracking components by name.

**Rationale**:

- Allows annotating specific instances of the same component
- More precise than class-level annotations
- Uses tree path + props hash for identification
- Enables fine-grained tracking

## File Changes Summary

### Created Files

**Annotation System**:

- `lib/dev/context/AnnotationContext.tsx` (313 lines)
- `lib/dev/annotation/ComponentInspector.tsx` (285 lines)
- `lib/dev/annotation/AnnotationForm.tsx`
- `lib/dev/annotation/AnnotationList.tsx`
- `lib/dev/annotation/AnnotationPanel.tsx`
- `lib/dev/annotation/AnnotationToggle.tsx`
- `lib/dev/annotation/AnnotationListSheet.tsx`
- `lib/dev/annotation/AnnotationFormSheet.tsx`
- `lib/dev/annotation/utils/exporters.ts`
- `lib/dev/annotation/index.ts`
- `server/api/annotations.ts` (annotation sync endpoint)

**Text Editing System**:

- `lib/dev/context/I18nProvider.tsx`
- `lib/dev/context/i18n.ts` (66 lines)
- `lib/components/EditableText/EditableText.tsx` (121 lines)
- `lib/components/EditableText/TextEditDialog.tsx`
- `lib/contexts/Localization/LocalizationContext.tsx` (216 lines)
- `scripts/codemods/text-extract.ts` (329 lines)
- `scripts/codemods/text-extract.md` (usage guide)
- `server/api/i18n.ts` (i18n update endpoint)
- `docs/architecture/translation-patterns.md`

**Shared Dev Components**:

- `lib/dev/components/DevModeToggle.tsx`
- `lib/dev/components/index.ts`
- `lib/dev/index.ts`

**Translation Files**:

- `app/tabs/.locale/OverviewTab.en.i18n.json` (135 translation keys)
- `app/tabs/.locale/OverviewTab.es.i18n.json`
- `app/tabs/.locale/TypographyTab.en.i18n.json`
- `app/demos/.locale/TypographyDemo.en.i18n.json`

### Modified Files

- `app/App.tsx` - Added AnnotationProvider, I18nProvider, LocalizationProvider
- `app/tabs/OverviewTab.tsx` - Wrapped 143 text blocks with EditableText
- `package.json` - Added `text-extract` script
- `vite.config.ts` - Added i18n and annotations API plugins

## Lessons Learned

### Technical

1. **React Fiber is powerful but fragile**: Relying on internal APIs means potential breakage in React updates. However, the benefit of automatic component introspection outweighs the risk.

2. **Co-located translations scale better**: Giant global JSON files become unmaintainable. Co-located files keep related code together.

3. **Offline-first architecture simplifies Phase 1**: Starting with LocalStorage and manual dumps was simpler than building backend API upfront. Backend added later for convenience.

4. **jscodeshift is powerful but complex**: AST transformation requires careful manipulation, but automation pays off massively.

5. **UX details matter**: Edit button positioning, drawer transitions, visual feedback - all critical for usability.

6. **Instance-level annotations provide more precision**: Being able to annotate specific instances (not just component classes) enables fine-grained tracking.

### Process

1. **Iterate on working code**: Starting with a simple implementation and iterating based on real usage was more effective than trying to design everything upfront.

2. **Test on real code early**: Running the text-extract codemod on OverviewTab.tsx (690 lines) revealed edge cases that unit tests wouldn't catch.

3. **Documentation as you go**: Writing docs during implementation (not after) ensures accuracy and helps identify gaps in design.

## Timeline

### 2025-10-06 - Original Proposal

- Initial proposal for annotation system only

### 2025-10-10 - Phase 1 Complete: i18n Text Editing

- Expanded scope to include text editing capabilities
- Implemented EditableText component
- Built LocalizationContext
- Created text-extract codemod
- Co-located translation pattern established
- Backend API for i18n updates
- Real-world testing on OverviewTab.tsx

### 2025-10-11 - Phase 2 Complete: Annotation System

- Implemented AnnotationContext with backend sync
- Built ComponentInspector with React Fiber introspection
- Created bottom drawer UI with inspector integration
- Added instance-scoped annotations with unique IDs
- Implemented tree path tracking
- Backend API for annotation sync
- Export utilities (JSON, TODO, GitHub, Markdown)
- Dynamic drawer height for inspector mode
- Smooth transitions and visual feedback

### 2025-10-11 - i18n File Structure Refactoring

- Restructured translation files to directory-level `.locale` folders
- Changed naming convention: `ComponentName.i18n.json` → `ComponentName.en.i18n.json`
- Updated all code to match new pattern (glob imports, codemod, backend API)
- Moved files: `tabs/OverviewTab/.locale/` → `tabs/.locale/`

## Status

### ✅ Phase 1: i18n Text Editing System - COMPLETE

All features implemented and tested in production.

### ✅ Phase 2: Annotation System - COMPLETE

All core features implemented and working:

- React Fiber inspection
- Component selection with visual highlighting
- AnnotationPanel with bottom drawer
- Instance-scoped annotations
- Backend sync
- Export utilities

### 🎯 Next Steps (Phase 3)

Optional enhancements (not blocking):

- Cloud sync for team collaboration
- Screenshot annotations
- Multi-language editing UI
- AI-powered features
- VSCode extension
- Storybook integration

---

**Total Implementation**: 2,323 lines of production code across 30+ files

**Development Time**: ~5 days from proposal to completion

**Status**: Production-ready, actively used in development
