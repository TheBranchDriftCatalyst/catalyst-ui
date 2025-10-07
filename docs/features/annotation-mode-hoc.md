# Developer Annotation Mode (HOC)

## Overview

A higher-order component (HOC) that wraps the entire application to provide an interactive "annotation mode" for developers. When enabled, developers can click on any rendered component to attach notes, TODOs, and documentation that are automatically mapped to specific lines of source code.

### Vision

Create a seamless in-app annotation system that bridges the gap between visual UI and source code. Developers can document components, track TODOs, and leave contextual notes directly on the running application, with all annotations intelligently mapped to their corresponding code locations.

### Key Differentiators

1. **Visual-to-Code Mapping**: Automatically maps UI elements to source code locations using React DevTools hooks and source maps
2. **Zero-Instrumentation**: Works with any React component without requiring special props or wrappers
3. **Developer Workflow Integration**: Export annotations as GitHub issues, TODO comments, or structured documentation

## Current State

### Existing Infrastructure We Can Leverage

✅ **Theme System with LocalStorage** (`lib/contexts/Theme/`)

- Persistent state management pattern we can reuse
- Theme toggle mechanism similar to annotation mode toggle
- Already integrated throughout the app

✅ **Dialog/Sheet Components** (`lib/ui/dialog.tsx`, `lib/ui/sheet.tsx`)

- Modal UI for annotation panels
- Can display annotation details and editing interface

✅ **Button & Form Components** (`lib/ui/button.tsx`, `lib/ui/form.tsx`)

- UI primitives for annotation controls
- React Hook Form integration for annotation editing

✅ **Card Components** (`lib/cards/`)

- Display annotations in a structured format
- Visual containers for annotation lists

### What's Missing

❌ Component introspection system (React DevTools bridge)
❌ Source map parsing and line number resolution
❌ Annotation overlay/highlight system
❌ Annotation persistence layer (local + export)
❌ Component path tracking and identification
❌ Visual annotation indicators

## Problem Statement

### Current Behavior

- ❌ **No Visual Context**: Developers must context-switch between running app and code editor to leave notes
- ❌ **Lost Context**: TODOs in code files don't show which visual component they relate to
- ❌ **Manual Mapping**: Developers must manually find component source files and line numbers
- ❌ **Disconnected Workflow**: Notes, screenshots, and code are managed separately

### Desired Behavior

- ✅ Click on any component in the running app to annotate it
- ✅ Annotations automatically map to source file paths and line numbers
- ✅ Visual indicators show which components have annotations
- ✅ Export annotations as GitHub issues, TODO comments, or documentation

## Proposed Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AnnotationModeProvider (HOC)                  │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Click Handler   │  │ Source Mapper   │  │ Annotation UI   │ │
│  │                 │  │                 │  │                 │ │
│  │ - Intercept     │  │ - React         │  │ - Overlay       │ │
│  │   clicks        │  │   DevTools      │  │ - Panel         │ │
│  │ - Identify      │  │ - Source maps   │  │ - Indicators    │ │
│  │   component     │  │ - File/line     │  │                 │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                     │          │
│           └────────────────────┴─────────────────────┘          │
│                                │                                │
│                     ┌──────────▼──────────┐                     │
│                     │  Annotation Store   │                     │
│                     │  (Zustand/Context)  │                     │
│                     │                     │                     │
│                     │ - Annotations       │                     │
│                     │ - Mode state        │                     │
│                     │ - Export handlers   │                     │
│                     └─────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                ┌───────────────────────────────────┐
                │      Persistence Layer            │
                │                                   │
                │  - LocalStorage (runtime)         │
                │  - JSON export (annotations.json) │
                │  - GitHub API (issues)            │
                │  - Code comments (TODO format)    │
                └───────────────────────────────────┘
```

### Data Flow

```typescript
// 1. User clicks component in annotation mode
const clickEvent = { target: HTMLElement, ctrlKey: true };
// → { fiber: Fiber, displayName: 'CardDemo' }

// 2. Source mapper resolves location
const sourceInfo = resolveSourceLocation(fiber);
// → { file: 'app/tabs/CardsTab.tsx', line: 13, column: 0, componentName: 'CardDemo' }

// 3. Annotation created
const annotation = {
  id: "uuid",
  componentPath: "CardDemo",
  sourceLocation: sourceInfo,
  note: "TODO: Add loading state",
  type: "todo",
  timestamp: Date.now(),
};

// 4. Persisted and displayed
annotationStore.add(annotation);
// → Shows annotation panel, visual indicator on component
```

## Implementation Plan

### Phase 1: Core Infrastructure

#### Step 1: Annotation Mode Provider & Context

**File**: `lib/components/AnnotationMode/AnnotationModeProvider.tsx`

```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorageState } from '@/catalyst-ui/hooks/useLocalStorageState';

interface Annotation {
  id: string;
  componentPath: string;
  componentName: string;
  sourceLocation: {
    file: string;
    line: number;
    column: number;
  };
  note: string;
  type: 'todo' | 'bug' | 'note' | 'docs';
  priority?: 'low' | 'medium' | 'high';
  timestamp: number;
  author?: string;
}

interface AnnotationModeContextValue {
  enabled: boolean;
  toggleMode: () => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'timestamp'>) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
}

const AnnotationModeContext = createContext<AnnotationModeContextValue | null>(null);

export function AnnotationModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useLocalStorageState('annotation-mode-enabled', false);
  const [annotations, setAnnotations] = useLocalStorageState<Annotation[]>('annotations', []);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const toggleMode = useCallback(() => {
    setEnabled(prev => !prev);
    setSelectedComponentId(null);
  }, [setEnabled]);

  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id' | 'timestamp'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  }, [setAnnotations]);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  }, [setAnnotations]);

  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setAnnotations]);

  return (
    <AnnotationModeContext.Provider
      value={{
        enabled,
        toggleMode,
        annotations,
        addAnnotation,
        removeAnnotation,
        updateAnnotation,
        selectedComponentId,
        setSelectedComponentId,
      }}
    >
      {children}
    </AnnotationModeContext.Provider>
  );
}

export function useAnnotationMode() {
  const context = useContext(AnnotationModeContext);
  if (!context) {
    throw new Error('useAnnotationMode must be used within AnnotationModeProvider');
  }
  return context;
}
```

**Purpose**: Central state management for annotation mode

#### Step 2: Component Click Interceptor

**File**: `lib/components/AnnotationMode/ComponentClickHandler.tsx`

```typescript
import { useEffect, useCallback } from 'react';
import { useAnnotationMode } from './AnnotationModeProvider';
import { getComponentInfo } from './utils/componentIntrospection';

export function ComponentClickHandler({ children }: { children: React.ReactNode }) {
  const { enabled, setSelectedComponentId } = useAnnotationMode();

  const handleClick = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    // Only intercept when Ctrl/Cmd + Click
    if (!(e.ctrlKey || e.metaKey)) return;

    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const componentInfo = getComponentInfo(target);

    if (componentInfo) {
      setSelectedComponentId(componentInfo.id);
    }
  }, [enabled, setSelectedComponentId]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('click', handleClick, true);
      return () => document.removeEventListener('click', handleClick, true);
    }
  }, [enabled, handleClick]);

  return <>{children}</>;
}
```

**Purpose**: Intercept clicks in annotation mode to identify components

#### Step 3: Component Introspection Utility

**File**: `lib/components/AnnotationMode/utils/componentIntrospection.ts`

```typescript
// Uses React DevTools global hook to inspect fiber tree
interface ComponentInfo {
  id: string;
  displayName: string;
  fiber: any; // React Fiber
  sourceLocation?: {
    file: string;
    line: number;
    column: number;
  };
}

export function getComponentInfo(element: HTMLElement): ComponentInfo | null {
  // Access React Fiber from DOM element
  const fiberKey = Object.keys(element).find(
    key => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance")
  );

  if (!fiberKey) return null;

  const fiber = (element as any)[fiberKey];
  if (!fiber) return null;

  // Walk up fiber tree to find component with source location
  let currentFiber = fiber;
  while (currentFiber) {
    if (currentFiber.type && typeof currentFiber.type === "function") {
      const displayName = currentFiber.type.displayName || currentFiber.type.name || "Anonymous";

      // Extract source location from fiber._debugSource (dev mode only)
      const debugSource = currentFiber._debugSource;

      return {
        id: generateComponentId(currentFiber),
        displayName,
        fiber: currentFiber,
        sourceLocation: debugSource
          ? {
              file: debugSource.fileName,
              line: debugSource.lineNumber,
              column: debugSource.columnNumber || 0,
            }
          : undefined,
      };
    }
    currentFiber = currentFiber.return;
  }

  return null;
}

function generateComponentId(fiber: any): string {
  // Generate stable ID from fiber key and component name
  const componentName = fiber.type?.name || "Anonymous";
  const key = fiber.key || "no-key";
  return `${componentName}-${key}-${fiber.index}`;
}

export function getSourceMapLocation(sourceLocation: ComponentInfo["sourceLocation"]): Promise<{
  file: string;
  line: number;
  column: number;
} | null> {
  // In production, source maps would be parsed here
  // For development, _debugSource already has the info
  return Promise.resolve(sourceLocation || null);
}
```

**Purpose**: Extract React component information and source code locations from DOM elements

### Phase 2: UI Components

#### Step 4: Annotation Panel

**File**: `lib/components/AnnotationMode/AnnotationPanel.tsx`

```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/catalyst-ui/ui/sheet';
import { useAnnotationMode } from './AnnotationModeProvider';
import { AnnotationForm } from './AnnotationForm';
import { AnnotationList } from './AnnotationList';

export function AnnotationPanel() {
  const { selectedComponentId, setSelectedComponentId, annotations } = useAnnotationMode();

  const componentAnnotations = annotations.filter(
    a => a.componentPath === selectedComponentId
  );

  return (
    <Sheet open={!!selectedComponentId} onOpenChange={(open) => !open && setSelectedComponentId(null)}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Component Annotations</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <AnnotationForm componentId={selectedComponentId} />

          {componentAnnotations.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Existing Annotations</h3>
              <AnnotationList annotations={componentAnnotations} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

#### Step 5: Annotation Form

**File**: `lib/components/AnnotationMode/AnnotationForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/catalyst-ui/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/catalyst-ui/ui/form';
import { Textarea } from '@/catalyst-ui/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/catalyst-ui/ui/select';
import { useAnnotationMode } from './AnnotationModeProvider';

const annotationSchema = z.object({
  note: z.string().min(1, 'Note is required'),
  type: z.enum(['todo', 'bug', 'note', 'docs']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export function AnnotationForm({ componentId }: { componentId: string | null }) {
  const { addAnnotation } = useAnnotationMode();

  const form = useForm({
    resolver: zodResolver(annotationSchema),
    defaultValues: {
      note: '',
      type: 'todo' as const,
      priority: 'medium' as const,
    },
  });

  const onSubmit = (data: z.infer<typeof annotationSchema>) => {
    if (!componentId) return;

    addAnnotation({
      componentPath: componentId,
      componentName: componentId.split('-')[0],
      sourceLocation: {
        file: 'unknown', // Will be resolved by component introspection
        line: 0,
        column: 0,
      },
      ...data,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">TODO</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="docs">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your note, TODO, or bug description..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Annotation
        </Button>
      </form>
    </Form>
  );
}
```

#### Step 6: Visual Indicators

**File**: `lib/components/AnnotationMode/AnnotationOverlay.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useAnnotationMode } from './AnnotationModeProvider';

export function AnnotationOverlay() {
  const { enabled, annotations } = useAnnotationMode();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHoveredElement(target);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Annotation mode indicator */}
      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg pointer-events-auto">
        <span className="text-sm font-medium">📝 Annotation Mode Active</span>
        <span className="text-xs block mt-1">Ctrl+Click to annotate</span>
      </div>

      {/* Component highlight on hover */}
      {hoveredElement && (
        <div
          className="absolute border-2 border-primary/50 bg-primary/10 pointer-events-none transition-all duration-150"
          style={{
            top: hoveredElement.getBoundingClientRect().top,
            left: hoveredElement.getBoundingClientRect().left,
            width: hoveredElement.getBoundingClientRect().width,
            height: hoveredElement.getBoundingClientRect().height,
          }}
        />
      )}

      {/* Annotation badges on annotated components */}
      {annotations.map(annotation => (
        <AnnotationBadge key={annotation.id} annotation={annotation} />
      ))}
    </div>
  );
}

function AnnotationBadge({ annotation }: { annotation: any }) {
  // Would need to find the DOM element for this annotation's component
  // and position the badge accordingly
  return null; // Simplified for now
}
```

### Phase 3: Export & Integration

#### Step 7: Export Utilities

**File**: `lib/components/AnnotationMode/utils/exporters.ts`

```typescript
import { Annotation } from "../AnnotationModeProvider";

export function exportAsJSON(annotations: Annotation[]): string {
  return JSON.stringify(annotations, null, 2);
}

export function exportAsTODOComments(annotations: Annotation[]): string {
  return annotations
    .map(a => {
      const priority = a.priority ? ` @${a.priority}` : "";
      return `// ${a.type.toUpperCase()}${priority}: ${a.note}\n// Location: ${a.sourceLocation.file}:${a.sourceLocation.line}`;
    })
    .join("\n\n");
}

export function exportAsGitHubIssues(annotations: Annotation[]): Array<{
  title: string;
  body: string;
  labels: string[];
}> {
  return annotations.map(a => ({
    title: `[${a.type.toUpperCase()}] ${a.componentName}: ${a.note.slice(0, 50)}...`,
    body: `
## Component
\`${a.componentName}\`

## Location
\`${a.sourceLocation.file}:${a.sourceLocation.line}\`

## Description
${a.note}

## Priority
${a.priority || "Not set"}

## Type
${a.type}
    `.trim(),
    labels: [a.type, a.priority || "medium"].filter(Boolean),
  }));
}

export function exportAsMarkdown(annotations: Annotation[]): string {
  const grouped = annotations.reduce(
    (acc, a) => {
      const file = a.sourceLocation.file;
      if (!acc[file]) acc[file] = [];
      acc[file].push(a);
      return acc;
    },
    {} as Record<string, Annotation[]>
  );

  let markdown = "# Component Annotations\n\n";

  for (const [file, anns] of Object.entries(grouped)) {
    markdown += `## ${file}\n\n`;
    anns.forEach(a => {
      markdown += `### Line ${a.sourceLocation.line}: ${a.componentName}\n`;
      markdown += `**Type**: ${a.type} | **Priority**: ${a.priority || "N/A"}\n\n`;
      markdown += `${a.note}\n\n`;
      markdown += "---\n\n";
    });
  }

  return markdown;
}
```

#### Step 8: Main HOC Wrapper

**File**: `lib/components/AnnotationMode/withAnnotationMode.tsx`

```typescript
import { ComponentType } from 'react';
import { AnnotationModeProvider } from './AnnotationModeProvider';
import { ComponentClickHandler } from './ComponentClickHandler';
import { AnnotationOverlay } from './AnnotationOverlay';
import { AnnotationPanel } from './AnnotationPanel';
import { AnnotationModeToggle } from './AnnotationModeToggle';

export function withAnnotationMode<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function WithAnnotationMode(props: P) {
    return (
      <AnnotationModeProvider>
        <ComponentClickHandler>
          <Component {...props} />
          <AnnotationOverlay />
          <AnnotationPanel />
          <AnnotationModeToggle />
        </ComponentClickHandler>
      </AnnotationModeProvider>
    );
  };
}
```

**Purpose**: Main HOC that wraps the entire app

## Features

### Core Features ✅

- **Click-to-Annotate**: Ctrl/Cmd+Click any component to add annotations
- **Source Mapping**: Automatic mapping to file paths and line numbers
- **Visual Indicators**: Highlight components with annotations
- **Persistent Storage**: LocalStorage saves annotations across sessions
- **Multiple Types**: Support TODO, Bug, Note, and Documentation annotations
- **Priority Levels**: Mark annotations with low/medium/high priority

### Advanced Features (Future)

- **Team Collaboration**: Share annotations via cloud sync
- **Code Integration**: Automatically insert TODO comments in source files
- **AI Assistance**: Suggest improvements based on annotations
- **Screenshot Capture**: Attach screenshots to annotations
- **Version Tracking**: Track annotations across code changes

## API Design

### HOC Usage

```typescript
import { withAnnotationMode } from '@/catalyst-ui/components/AnnotationMode';

function App() {
  return <div>Your app content</div>;
}

export default withAnnotationMode(App);
```

### Hook API

```typescript
import { useAnnotationMode } from "@/catalyst-ui/components/AnnotationMode";

function MyComponent() {
  const { enabled, toggleMode, annotations, addAnnotation, removeAnnotation, updateAnnotation } =
    useAnnotationMode();

  // Use annotation mode programmatically
}
```

### Annotation Interface

```typescript
interface Annotation {
  id: string;
  componentPath: string;
  componentName: string;
  sourceLocation: {
    file: string;
    line: number;
    column: number;
  };
  note: string;
  type: "todo" | "bug" | "note" | "docs";
  priority?: "low" | "medium" | "high";
  timestamp: number;
  author?: string;
}
```

## File Structure

```
lib/
├── components/
│   └── AnnotationMode/
│       ├── AnnotationModeProvider.tsx       # Context provider
│       ├── ComponentClickHandler.tsx        # Click interception
│       ├── AnnotationOverlay.tsx           # Visual indicators
│       ├── AnnotationPanel.tsx             # Annotation sheet panel
│       ├── AnnotationForm.tsx              # Form to create annotations
│       ├── AnnotationList.tsx              # List existing annotations
│       ├── AnnotationModeToggle.tsx        # Toggle button
│       ├── withAnnotationMode.tsx          # HOC wrapper
│       ├── utils/
│       │   ├── componentIntrospection.ts   # React Fiber inspection
│       │   ├── exporters.ts                # Export utilities
│       │   └── sourceMapParser.ts          # Source map handling
│       └── index.ts
└── hooks/
    └── useAnnotationMode.ts                # Re-exported hook
```

## Expected Output

### Example 1: Basic Annotation

**Action:**

1. Enable annotation mode (toggle button)
2. Ctrl+Click on a Card component
3. Add note: "TODO: Add loading skeleton"

**Output:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "componentPath": "CardDemo-no-key-0",
  "componentName": "CardDemo",
  "sourceLocation": {
    "file": "app/tabs/CardsTab.tsx",
    "line": 13,
    "column": 0
  },
  "note": "TODO: Add loading skeleton",
  "type": "todo",
  "priority": "medium",
  "timestamp": 1728234567890
}
```

### Example 2: Export as Markdown

**Input:**
Multiple annotations on different components

**Output:**

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

## Benefits

- ✅ **Visual Context**: Connect UI elements directly to source code
- ✅ **No Context Switching**: Annotate without leaving the app
- ✅ **Automatic Mapping**: No manual file path/line number lookup
- ✅ **Team Communication**: Share visual context with team members
- ✅ **Export Flexibility**: Multiple export formats (JSON, TODO, GitHub, Markdown)
- ✅ **Zero Instrumentation**: Works with any React component
- ✅ **Developer Workflow**: Integrates with existing tools (GitHub, IDE)

## Future Enhancements

### Phase 2 Features

- [ ] **Cloud Sync**: Share annotations across team via database
- [ ] **Screenshot Annotations**: Attach visual context to notes
- [ ] **Code Diff Integration**: Track annotations across git commits
- [ ] **Bulk Operations**: Select multiple components, batch annotate
- [ ] **Search & Filter**: Find annotations by type, priority, component

### Advanced Features

- [ ] **AI Suggestions**: Auto-generate improvement suggestions
- [ ] **Live Collaboration**: Real-time annotation sharing like Figma comments
- [ ] **Recording Mode**: Record user interactions and auto-annotate
- [ ] **Analytics Dashboard**: Track annotation patterns and technical debt

### Developer Experience

- [ ] **VSCode Extension**: Jump to annotation from code editor
- [ ] **CLI Tools**: Export/import annotations via command line
- [ ] **Storybook Integration**: Annotate components in Storybook
- [ ] **CI/CD Integration**: Block deploys if high-priority annotations exist

## Dependencies

### Required

```json
{
  "dependencies": {
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.0"
  }
}
```

### Already Installed

- ✅ `react` - Core framework
- ✅ `react-hook-form` + `zod` - Form handling (annotation forms)
- ✅ `@radix-ui/react-dialog` - Sheet component (annotation panel)
- ✅ `tailwindcss` - Styling for overlays and indicators

## Known Issues

### React DevTools Dependency

- **Issue**: Component introspection relies on React Fiber internals (dev mode only)
- **Mitigation**: In production, use build-time source map parsing instead
- **Status**: Core functionality works in dev mode; production support requires additional tooling

### Source Map Accuracy

- **Issue**: Transpiled code may have inaccurate line numbers
- **Mitigation**: Use high-quality source maps, document limitations
- **Status**: Acceptable for development workflow

## Testing Checklist

### Phase 1: Core Functionality

- [ ] Annotation mode toggle works
- [ ] Ctrl+Click identifies components correctly
- [ ] Source locations are accurate
- [ ] Annotations persist in LocalStorage
- [ ] CRUD operations work (create, read, update, delete)

### Phase 2: UI/UX

- [ ] Visual overlay highlights components on hover
- [ ] Annotation panel displays correctly
- [ ] Form validation works
- [ ] Existing annotations display properly
- [ ] Works across all themes

### Phase 3: Export Features

- [ ] JSON export is valid
- [ ] Markdown export is formatted correctly
- [ ] GitHub issue format is valid
- [ ] TODO comment format matches conventions

## Alternative Approaches

### Alternative 1: React DevTools Extension

**Description**: Build as a browser extension that extends React DevTools

**Pros:**

- Direct access to React DevTools API
- No app code changes needed
- More reliable component introspection

**Cons:**

- Separate installation required
- Limited to browser environment
- Can't integrate with app's existing UI/theme

**Decision**: Chose HOC approach for seamless integration with catalyst-ui theme and components

### Alternative 2: Babel Plugin for Annotation Injection

**Description**: Use Babel transform to inject annotation props into every component

**Pros:**

- More reliable component identification
- Works in production builds
- Can inject metadata at build time

**Cons:**

- Build step complexity
- Performance overhead (extra props on every component)
- Couples to build tooling

**Decision**: HOC approach is less invasive and doesn't require build changes

## Resources

- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [React DevTools Source](https://github.com/facebook/react/tree/main/packages/react-devtools)
- [Source Map Specification](https://sourcemaps.info/spec.html)
- Internal: `lib/hooks/useLocalStorageState.ts` - Persistence pattern
- Internal: `lib/contexts/Theme/ThemeProvider.tsx` - Context pattern reference

## Status

- [x] Problem identified
- [x] Solution designed
- [x] Feature proposal documented
- [ ] Dependencies installed
- [ ] Implementation started
- [ ] Core features complete
- [ ] Tests passing
- [ ] Integration complete
- [ ] Documentation updated
- [ ] Production ready

---

## Implementation Notes

### 2025-10-06 - Initial Proposal

This feature enables developers to bridge the visual-to-code gap by annotating components directly in the running application. The HOC approach was chosen for seamless integration with catalyst-ui's existing theming and UI components.

Key technical challenges:

1. **React Fiber Introspection**: Accessing internal React structures to identify components from DOM elements
2. **Source Map Accuracy**: Ensuring line numbers map correctly, especially with transpiled code
3. **Production Viability**: Dev mode relies on `_debugSource`; production needs alternative source map parsing

Next steps:

1. Prototype component introspection with React Fiber
2. Build basic annotation CRUD with LocalStorage
3. Create visual overlay system
4. Implement export utilities
