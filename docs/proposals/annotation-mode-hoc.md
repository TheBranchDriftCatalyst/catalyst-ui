# Dev Mode Editing System (Annotation + i18n Text Editing)

## Overview

A comprehensive higher-order component (HOC) system that wraps the entire application to provide interactive dev-mode capabilities for developers. This system combines **two powerful features**:

1. **Component Annotation Mode**: Click components to attach notes, TODOs, and bug reports mapped to source code
2. **In-Browser Text Editing**: Edit any text content directly in the UI with automatic back-propagation to translation files

### Vision

Create a seamless in-app development system that bridges the gap between visual UI and source code. Developers can:

- Document components and track TODOs without leaving the browser
- Edit copy/text content directly in the UI
- Automatically back-propagate changes to files (annotations → code, text → i18n JSON)
- Maintain internationalization-ready architecture from day one

### Key Differentiators

1. **Visual-to-Code Mapping**: Automatically maps UI elements to source code locations using React DevTools hooks
2. **i18n-First Text Editing**: All text managed through translation files, enabling multi-language support from the start
3. **Safe Back-Propagation**: Edits write to JSON files (not source code), preventing AST corruption
4. **Zero-Instrumentation**: Works with any React component without requiring special props
5. **Unified Dev Experience**: Single dev mode toggle for both annotation and text editing
6. **Developer Workflow Integration**: Export annotations as GitHub issues, TODO comments, or structured documentation

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

**Annotation System:**
❌ Component introspection system (React DevTools bridge)
❌ Source map parsing and line number resolution
❌ Annotation overlay/highlight system
❌ Annotation persistence layer (local + export)
❌ Component path tracking and identification
❌ Visual annotation indicators

**Text Editing System:**
❌ i18n integration layer (react-i18next)
❌ Translation file management (JSON back-propagation)
❌ Editable text wrapper components
❌ Dev server API for file writing
❌ Hot reload on translation changes
❌ Build-time string extraction tooling

## Problem Statement

### Current Behavior - Annotations

- ❌ **No Visual Context**: Developers must context-switch between running app and code editor to leave notes
- ❌ **Lost Context**: TODOs in code files don't show which visual component they relate to
- ❌ **Manual Mapping**: Developers must manually find component source files and line numbers
- ❌ **Disconnected Workflow**: Notes, screenshots, and code are managed separately

### Current Behavior - Text Editing

- ❌ **Hardcoded Strings**: All text is hardcoded in JSX, making changes require code edits
- ❌ **No i18n**: Not internationalization-ready, difficult to add languages later
- ❌ **Context Switching**: Must edit text in code editor, then reload to see changes
- ❌ **Designer Friction**: Non-technical team members can't edit copy without developer help
- ❌ **Slow Iteration**: Copy changes require code edits, commits, and deployments

### Desired Behavior

**Annotations:**

- ✅ Click on any component in the running app to annotate it
- ✅ Annotations automatically map to source file paths and line numbers
- ✅ Visual indicators show which components have annotations
- ✅ Export annotations as GitHub issues, TODO comments, or documentation

**Text Editing:**

- ✅ Click any text to edit it inline (dev mode only)
- ✅ Changes automatically saved to translation JSON files
- ✅ Hot reload shows changes immediately
- ✅ i18n-ready from day one (easy to add languages)
- ✅ Build tools extract hardcoded strings automatically

## Proposed Architecture

### System Diagram - Unified Dev Mode

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DevModeProvider (Unified HOC)                         │
│                                                                               │
│  ┌──────────────────────────┐           ┌───────────────────────────────┐   │
│  │   Annotation System      │           │    Text Editing System        │   │
│  │                          │           │                               │   │
│  │  ┌────────────────────┐  │           │  ┌──────────────────────────┐│   │
│  │  │ Click Handler      │  │           │  │ EditableText Wrapper    ││   │
│  │  │ - Ctrl+Click       │  │           │  │ - Hover icon show       ││   │
│  │  │ - Component ID     │  │           │  │ - Click to edit         ││   │
│  │  └──────┬─────────────┘  │           │  └──────┬───────────────────┘│   │
│  │         │                │           │         │                    │   │
│  │  ┌──────▼─────────────┐  │           │  ┌──────▼───────────────────┐│   │
│  │  │ Source Mapper      │  │           │  │ i18n Context (react-    ││   │
│  │  │ - React Fiber      │  │           │  │ i18next)                 ││   │
│  │  │ - _debugSource     │  │           │  │ - t() function           ││   │
│  │  └──────┬─────────────┘  │           │  │ - Locale management      ││   │
│  │         │                │           │  └──────┬───────────────────┘│   │
│  │  ┌──────▼─────────────┐  │           │         │                    │   │
│  │  │ Annotation Store   │  │           │  ┌──────▼───────────────────┐│   │
│  │  │ - LocalStorage     │  │           │  │ Translation Manager      ││   │
│  │  │ - CRUD ops         │  │           │  │ - Key generation         ││   │
│  │  └────────────────────┘  │           │  │ - Namespace routing      ││   │
│  └──────────────────────────┘           │  └──────┬───────────────────┘│   │
│                                          └─────────┼────────────────────┘   │
│                                                    │                        │
└────────────────────────────────────────────────────┼────────────────────────┘
                                                     │
                                  ┌──────────────────▼──────────────────┐
                                  │    Dev Server API                   │
                                  │                                     │
                                  │  POST /api/i18n/update             │
                                  │  - Update translation key/value     │
                                  │  - Write to JSON file               │
                                  │  - Trigger HMR                      │
                                  │                                     │
                                  │  POST /api/annotations/export       │
                                  │  - Export as JSON/TODO/GitHub       │
                                  │  - Generate reports                 │
                                  └──────────────┬──────────────────────┘
                                                 │
                        ┌────────────────────────┴──────────────────────┐
                        │                                               │
           ┌────────────▼────────────┐              ┌──────────────────▼────────────┐
           │  Translation Files      │              │  Annotation Persistence        │
           │                         │              │                                │
           │  locales/               │              │  - LocalStorage (runtime)      │
           │  ├── en/                │              │  - annotations.json (export)   │
           │  │   ├── common.json    │              │  - GitHub issues (via API)     │
           │  │   ├── components.json│              │  - TODO comments (codegen)     │
           │  │   └── errors.json    │              │                                │
           │  └── es/ (future)       │              └────────────────────────────────┘
           │      └── common.json    │
           └─────────────────────────┘
```

### Data Flow

#### Flow 1: Component Annotation

```typescript
// 1. User Ctrl+Clicks component in annotation mode
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

#### Flow 2: Text Editing with i18n Back-Propagation

```typescript
// 1. User hovers over text in dev mode
<EditableText id="home.welcome">Welcome to Catalyst UI</EditableText>
// → Shows ✏️ icon overlay

// 2. User clicks edit icon, modal opens
const textEdit = {
  key: "home.welcome",
  namespace: "common",
  currentValue: "Welcome to Catalyst UI",
};

// 3. User updates text and saves
const newValue = "Welcome to Our Amazing UI Library";

// 4. POST to dev server API
fetch('/api/i18n/update', {
  method: 'POST',
  body: JSON.stringify({
    namespace: "common",
    locale: "en",
    key: "home.welcome",
    value: newValue,
  })
});

// 5. Backend writes to JSON file
// locales/en/common.json updated:
{
  "home": {
    "welcome": "Welcome to Our Amazing UI Library"
  }
}

// 6. Vite HMR triggers, component re-renders with new text
// → User sees change immediately without page reload
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

### Phase 4: i18n Foundation

#### Step 9: i18n Configuration

**File**: `lib/contexts/I18n/i18n.ts`

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enCommon from "../../../locales/en/common.json";
import enComponents from "../../../locales/en/components.json";
import enErrors from "../../../locales/en/errors.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      components: enComponents,
      errors: enErrors,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  // Development mode features
  debug: import.meta.env.DEV,
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (lng, ns, key) => {
    if (import.meta.env.DEV) {
      console.warn(`Missing translation key: ${ns}:${key}`);
    }
  },
});

export default i18n;
```

**Purpose**: Configure i18next with namespace support and dev mode features

#### Step 10: I18n Provider

**File**: `lib/contexts/I18n/I18nProvider.tsx`

```typescript
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading translations...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
}
```

**Purpose**: Wrap app with i18n context

#### Step 11: Translation Directory Structure

Create translation files with initial empty structure:

**Files**:

```
locales/
├── en/
│   ├── common.json          # General app text
│   ├── components.json      # Component-specific text
│   └── errors.json          # Error messages
└── README.md               # Translation guidelines
```

**`locales/en/common.json`**:

```json
{
  "app": {
    "title": "Catalyst UI",
    "tagline": "Modern React Component Library"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit"
  }
}
```

**`locales/en/components.json`**:

```json
{
  "card": {
    "defaultTitle": "Card Title",
    "defaultDescription": "Card description goes here"
  },
  "button": {
    "loading": "Loading..."
  }
}
```

**`locales/en/errors.json`**:

```json
{
  "validation": {
    "required": "This field is required",
    "email": "Invalid email address"
  }
}
```

### Phase 5: Text Editing Components

#### Step 12: EditableText Wrapper

**File**: `lib/components/EditableText/EditableText.tsx`

```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import { TextEditDialog } from './TextEditDialog';

interface EditableTextProps {
  id: string;
  namespace?: string;
  children: React.ReactNode;
  className?: string;
}

export function EditableText({ id, namespace = 'common', children, className }: EditableTextProps) {
  const { t } = useTranslation(namespace);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Only enable editing in dev mode
  const isDevMode = import.meta.env.DEV;

  if (!isDevMode) {
    return <>{children}</>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Edit icon on hover */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute -top-1 -right-6 p-1 bg-primary text-primary-foreground rounded-md shadow-lg hover:bg-primary/90 transition-colors"
          title="Edit text"
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}

      {/* Edit dialog */}
      {isEditing && (
        <TextEditDialog
          translationKey={id}
          namespace={namespace}
          currentValue={String(children)}
          onClose={() => setIsEditing(false)}
        />
      )}
    </span>
  );
}
```

**Purpose**: Wrapper component that shows edit icon on hover and opens edit dialog

#### Step 13: Text Edit Dialog

**File**: `lib/components/EditableText/TextEditDialog.tsx`

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/catalyst-ui/ui/dialog';
import { Button } from '@/catalyst-ui/ui/button';
import { Textarea } from '@/catalyst-ui/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/catalyst-ui/ui/form';
import { useToast } from '@/catalyst-ui/ui/use-toast';

const textEditSchema = z.object({
  value: z.string().min(1, 'Text cannot be empty'),
});

interface TextEditDialogProps {
  translationKey: string;
  namespace: string;
  currentValue: string;
  onClose: () => void;
}

export function TextEditDialog({ translationKey, namespace, currentValue, onClose }: TextEditDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(textEditSchema),
    defaultValues: {
      value: currentValue,
    },
  });

  const onSubmit = async (data: z.infer<typeof textEditSchema>) => {
    try {
      // Send update to dev server API
      const response = await fetch('/api/i18n/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namespace,
          locale: 'en',
          key: translationKey,
          value: data.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update translation');
      }

      toast({
        title: 'Text updated',
        description: 'Translation file updated successfully. Page will reload.',
      });

      // Close dialog
      onClose();

      // HMR will handle the reload automatically
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update text',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <strong>Translation Key:</strong> {namespace}:{translationKey}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>File:</strong> locales/en/{namespace}.json
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Purpose**: Modal dialog for editing text with API integration

#### Step 14: Translation Manager Utility

**File**: `lib/components/EditableText/utils/translationManager.ts`

```typescript
/**
 * Generates a translation key from text content
 * Example: "Welcome to Catalyst" -> "welcome_to_catalyst"
 */
export function generateTranslationKey(text: string, prefix?: string): string {
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return prefix ? `${prefix}.${key}` : key;
}

/**
 * Determines the appropriate namespace for a translation key
 * Based on component context or content type
 */
export function getNamespaceForComponent(componentName: string): string {
  const componentMappings: Record<string, string> = {
    Card: "components",
    Button: "components",
    Dialog: "components",
    Form: "components",
    Error: "errors",
    Validation: "errors",
  };

  for (const [pattern, namespace] of Object.entries(componentMappings)) {
    if (componentName.includes(pattern)) {
      return namespace;
    }
  }

  return "common";
}

/**
 * Parse a nested translation key path
 * Example: "home.welcome.title" -> ["home", "welcome", "title"]
 */
export function parseKeyPath(key: string): string[] {
  return key.split(".");
}

/**
 * Set a value in a nested object using a key path
 */
export function setNestedValue(obj: any, keyPath: string[], value: string): any {
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[keyPath[keyPath.length - 1]] = value;
  return result;
}
```

**Purpose**: Utility functions for translation key management

### Phase 6: Dev Server API

#### Step 15: Dev Server API Endpoint

**File**: `server/api/i18n.ts` (Vite plugin)

```typescript
import fs from "fs/promises";
import path from "path";
import {
  parseKeyPath,
  setNestedValue,
} from "../../lib/components/EditableText/utils/translationManager";

interface I18nUpdateRequest {
  namespace: string;
  locale: string;
  key: string;
  value: string;
}

export async function handleI18nUpdate(req: any, res: any) {
  try {
    const body: I18nUpdateRequest = await parseRequestBody(req);
    const { namespace, locale, key, value } = body;

    // Validate input
    if (!namespace || !locale || !key || !value) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Missing required fields" }));
      return;
    }

    // Build file path
    const filePath = path.join(process.cwd(), "locales", locale, `${namespace}.json`);

    // Read existing translations
    let translations = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      translations = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist, create new object
      console.log(`Creating new translation file: ${filePath}`);
    }

    // Update translation
    const keyPath = parseKeyPath(key);
    translations = setNestedValue(translations, keyPath, value);

    // Write back to file with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2), "utf-8");

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, file: filePath }));
  } catch (error) {
    console.error("Error updating translation:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

async function parseRequestBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}
```

**Purpose**: Server endpoint that writes translation updates to JSON files

#### Step 16: Vite Plugin for Dev Server Routes

**File**: `build/vite-plugin-i18n-api.ts`

```typescript
import { Plugin } from "vite";
import { handleI18nUpdate } from "../server/api/i18n";

export function i18nApiPlugin(): Plugin {
  return {
    name: "i18n-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/i18n/update" && req.method === "POST") {
          await handleI18nUpdate(req, res);
        } else {
          next();
        }
      });
    },
  };
}
```

**Purpose**: Vite plugin to register API routes in dev server

**Integration in `vite.config.ts`**:

```typescript
import { i18nApiPlugin } from "./build/vite-plugin-i18n-api";

export default defineConfig({
  plugins: [
    react(),
    i18nApiPlugin(),
    // ... other plugins
  ],
});
```

### Phase 7: String Extraction (Build Tool)

#### Step 17: Build-Time String Extractor

**File**: `build/vite-plugin-i18n-extractor.ts`

```typescript
import { Plugin } from "vite";
import fs from "fs/promises";
import path from "path";

/**
 * Vite plugin to extract hardcoded strings and generate translation keys
 * Runs during build to scan JSX files for string literals
 */
export function i18nExtractorPlugin(): Plugin {
  return {
    name: "i18n-extractor",

    async buildStart() {
      // Only run in dev mode
      if (process.env.NODE_ENV !== "development") return;

      console.log("🔍 Scanning for hardcoded strings...");

      const hardcodedStrings = await scanForHardcodedStrings();

      if (hardcodedStrings.length > 0) {
        console.warn(`⚠️  Found ${hardcodedStrings.length} hardcoded strings:`);
        hardcodedStrings.forEach(({ file, line, text }) => {
          console.warn(
            `   ${file}:${line} - "${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"`
          );
        });

        // Generate suggestions
        await generateMigrationSuggestions(hardcodedStrings);
      } else {
        console.log("✅ No hardcoded strings found - all text uses i18n!");
      }
    },
  };
}

interface HardcodedString {
  file: string;
  line: number;
  column: number;
  text: string;
  context: string;
}

async function scanForHardcodedStrings(): Promise<HardcodedString[]> {
  const files = await findTsxFiles(path.join(process.cwd(), "lib"));
  const results: HardcodedString[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Simple regex to find string literals in JSX (not perfect, but useful)
      const jsxStringRegex = />\s*["']([^"']+)["']\s*</g;
      let match;

      while ((match = jsxStringRegex.exec(line)) !== null) {
        const text = match[1];

        // Skip if it's a translation key pattern (contains dots or underscores)
        if (text.includes(".") || text.includes("_")) continue;

        // Skip short strings (likely not user-facing text)
        if (text.length < 3) continue;

        results.push({
          file: path.relative(process.cwd(), file),
          line: index + 1,
          column: match.index,
          text,
          context: line.trim(),
        });
      }
    });
  }

  return results;
}

async function findTsxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return findTsxFiles(fullPath);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx")) {
        return [fullPath];
      }
      return [];
    })
  );
  return files.flat();
}

async function generateMigrationSuggestions(strings: HardcodedString[]) {
  const suggestions = strings.map(({ file, line, text }) => ({
    file,
    line,
    original: text,
    suggested: `<EditableText id="${generateKeyFromText(text)}">${text}</EditableText>`,
  }));

  const reportPath = path.join(process.cwd(), "i18n-migration-report.json");
  await fs.writeFile(reportPath, JSON.stringify(suggestions, null, 2));
  console.log(`📄 Migration report saved to: ${reportPath}`);
}

function generateKeyFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}
```

**Purpose**: Build-time tool to identify hardcoded strings and suggest migrations to EditableText

## Features

### Core Features - Annotation System ✅

- **Click-to-Annotate**: Ctrl/Cmd+Click any component to add annotations
- **Source Mapping**: Automatic mapping to file paths and line numbers
- **Visual Indicators**: Highlight components with annotations
- **Persistent Storage**: LocalStorage saves annotations across sessions
- **Multiple Types**: Support TODO, Bug, Note, and Documentation annotations
- **Priority Levels**: Mark annotations with low/medium/high priority
- **Export Options**: JSON, Markdown, GitHub issues, TODO comments

### Core Features - Text Editing System ✅

- **Hover-to-Edit**: Hover over text to reveal edit icon (dev mode only)
- **Inline Editing**: Click icon to open edit dialog with current text
- **Translation Keys**: All text managed through i18n translation files
- **Namespace Support**: Organize translations (common, components, errors)
- **Hot Reload**: Changes appear instantly via Vite HMR
- **Safe Back-Propagation**: Writes to JSON files, not source code
- **String Extraction**: Build tool identifies hardcoded strings automatically
- **Zero Production Overhead**: EditableText wrapper is dev-only

### Advanced Features (Future)

- **Team Collaboration**: Share annotations via cloud sync
- **Code Integration**: Automatically insert TODO comments in source files
- **AI Assistance**: Suggest improvements based on annotations
- **Screenshot Capture**: Attach screenshots to annotations
- **Version Tracking**: Track annotations across code changes

## API Design

### HOC Usage (Annotation Mode)

```typescript
import { withAnnotationMode } from '@/catalyst-ui/components/AnnotationMode';

function App() {
  return <div>Your app content</div>;
}

export default withAnnotationMode(App);
```

### Hook API (Annotation Mode)

```typescript
import { useAnnotationMode } from "@/catalyst-ui/components/AnnotationMode";

function MyComponent() {
  const { enabled, toggleMode, annotations, addAnnotation, removeAnnotation, updateAnnotation } =
    useAnnotationMode();

  // Use annotation mode programmatically
}
```

### EditableText Component Usage

```typescript
import { EditableText } from '@/catalyst-ui/components/EditableText';
import { useTranslation } from 'react-i18next';

function WelcomePage() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>
        <EditableText id="welcome.title" namespace="common">
          {t('welcome.title', 'Welcome to Catalyst UI')}
        </EditableText>
      </h1>
      <p>
        <EditableText id="welcome.description" namespace="common">
          {t('welcome.description', 'Build beautiful interfaces with ease')}
        </EditableText>
      </p>
    </div>
  );
}
```

**Dev Mode Behavior**:

- Hover over text → Edit icon (✏️) appears
- Click icon → Modal opens with current text
- Edit and save → Updates `locales/en/common.json`
- HMR triggers → Page updates instantly

**Production Behavior**:

- EditableText wrapper is transparent (no overhead)
- Only translation keys are used (via `t()` function)

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

## File Structure

```

lib/
├── components/
│ ├── AnnotationMode/ # Annotation System
│ │ ├── AnnotationModeProvider.tsx # Context provider
│ │ ├── ComponentClickHandler.tsx # Click interception
│ │ ├── AnnotationOverlay.tsx # Visual indicators
│ │ ├── AnnotationPanel.tsx # Annotation sheet panel
│ │ ├── AnnotationForm.tsx # Form to create annotations
│ │ ├── AnnotationList.tsx # List existing annotations
│ │ ├── AnnotationModeToggle.tsx # Toggle button
│ │ ├── withAnnotationMode.tsx # HOC wrapper
│ │ ├── utils/
│ │ │ ├── componentIntrospection.ts # React Fiber inspection
│ │ │ ├── exporters.ts # Export utilities
│ │ │ └── sourceMapParser.ts # Source map handling
│ │ └── index.ts
│ └── EditableText/ # Text Editing System
│ ├── EditableText.tsx # Wrapper with edit icon
│ ├── TextEditDialog.tsx # Edit modal
│ ├── utils/
│ │ └── translationManager.ts # Key generation & management
│ └── index.ts
├── contexts/
│ └── I18n/
│ ├── i18n.ts # i18next configuration
│ ├── I18nProvider.tsx # Context provider
│ └── index.ts
└── hooks/
└── useAnnotationMode.ts # Re-exported hook

locales/ # Translation Files
├── en/
│ ├── common.json # General app text
│ ├── components.json # Component-specific text
│ └── errors.json # Error messages
└── README.md # Translation guidelines

server/ # Dev Server API
└── api/
└── i18n.ts # Translation update endpoint

build/ # Build Tooling
├── vite-plugin-i18n-api.ts # Dev server routes
└── vite-plugin-i18n-extractor.ts # String extraction tool

````

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
````

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

### Example 3: Text Editing Workflow

**Action:**

1. Hover over text "Welcome to Catalyst UI" (wrapped in EditableText)
2. Click the ✏️ edit icon
3. Change text to "Welcome to Our Amazing Component Library"
4. Click "Save Changes"

**Output:**

**Before** (`locales/en/common.json`):

```json
{
  "home": {
    "welcome": "Welcome to Catalyst UI"
  }
}
```

**After** (`locales/en/common.json`):

```json
{
  "home": {
    "welcome": "Welcome to Our Amazing Component Library"
  }
}
```

**Browser console**:

```
🔍 Translation updated: common:home.welcome
✅ File written: locales/en/common.json
🔥 HMR triggered, reloading...
```

**Result**: Page updates instantly without full reload, showing new text

### Example 4: String Extraction Report

**Action:**

Run build with i18n extractor plugin enabled

**Output** (`i18n-migration-report.json`):

```json
[
  {
    "file": "lib/components/Card.tsx",
    "line": 42,
    "original": "Click here to learn more",
    "suggested": "<EditableText id=\"click_here_to_learn_more\">Click here to learn more</EditableText>"
  },
  {
    "file": "lib/ui/button.tsx",
    "line": 18,
    "original": "Submit Form",
    "suggested": "<EditableText id=\"submit_form\">Submit Form</EditableText>"
  },
  {
    "file": "app/tabs/OverviewTab.tsx",
    "line": 67,
    "original": "Explore our features",
    "suggested": "<EditableText id=\"explore_our_features\">Explore our features</EditableText>"
  }
]
```

**Console output**:

```
🔍 Scanning for hardcoded strings...
⚠️  Found 3 hardcoded strings:
   lib/components/Card.tsx:42 - "Click here to learn more"
   lib/ui/button.tsx:18 - "Submit Form"
   app/tabs/OverviewTab.tsx:67 - "Explore our features"
📄 Migration report saved to: i18n-migration-report.json
```

## Benefits

### Annotation System Benefits

- ✅ **Visual Context**: Connect UI elements directly to source code
- ✅ **No Context Switching**: Annotate without leaving the app
- ✅ **Automatic Mapping**: No manual file path/line number lookup
- ✅ **Team Communication**: Share visual context with team members
- ✅ **Export Flexibility**: Multiple export formats (JSON, TODO, GitHub, Markdown)
- ✅ **Zero Instrumentation**: Works with any React component
- ✅ **Developer Workflow**: Integrates with existing tools (GitHub, IDE)

### Text Editing System Benefits

- ✅ **i18n-Ready from Day One**: All text managed through translation files
- ✅ **Instant Copy Changes**: Edit text in browser, see changes immediately via HMR
- ✅ **Designer-Friendly**: Non-technical team members can edit copy without code knowledge
- ✅ **Multi-Language Support**: Easy to add new languages (just add translation files)
- ✅ **Safe Back-Propagation**: Writes to JSON, not source code (no AST corruption risk)
- ✅ **Build-Time Validation**: String extractor identifies hardcoded text automatically
- ✅ **Zero Production Overhead**: EditableText wrapper is dev-only, no runtime cost
- ✅ **Namespace Organization**: Logical grouping (common, components, errors)
- ✅ **Migration Path**: Automated suggestions for converting hardcoded strings

### Combined System Benefits

- ✅ **Unified Dev Experience**: Single HOC wrapper for both annotation and text editing
- ✅ **Consistent Patterns**: Both systems use similar context/provider architecture
- ✅ **Dev-Only Features**: All editing features stripped in production builds
- ✅ **Hot Reload Everything**: Annotations and translations both support instant updates
- ✅ **File-Based Persistence**: Annotations → LocalStorage/export, Text → JSON files

## Future Enhancements

### Annotation System Enhancements

**Phase 2 Features:**

- [ ] **Cloud Sync**: Share annotations across team via database
- [ ] **Screenshot Annotations**: Attach visual context to notes
- [ ] **Code Diff Integration**: Track annotations across git commits
- [ ] **Bulk Operations**: Select multiple components, batch annotate
- [ ] **Search & Filter**: Find annotations by type, priority, component

**Advanced Features:**

- [ ] **AI Suggestions**: Auto-generate improvement suggestions
- [ ] **Live Collaboration**: Real-time annotation sharing like Figma comments
- [ ] **Recording Mode**: Record user interactions and auto-annotate
- [ ] **Analytics Dashboard**: Track annotation patterns and technical debt

**Developer Experience:**

- [ ] **VSCode Extension**: Jump to annotation from code editor
- [ ] **CLI Tools**: Export/import annotations via command line
- [ ] **Storybook Integration**: Annotate components in Storybook
- [ ] **CI/CD Integration**: Block deploys if high-priority annotations exist

### Text Editing System Enhancements

**Phase 2 Features:**

- [ ] **Multi-Language Support**: Add UI for switching locales, edit translations for different languages
- [ ] **Translation Memory**: Auto-suggest translations based on similar strings
- [ ] **Bulk Text Editing**: Edit multiple translation keys at once
- [ ] **Translation Diff View**: Compare translations across languages
- [ ] **Translation History**: Track changes to translations over time (git integration)

**Advanced Features:**

- [ ] **AI-Powered Translation**: Auto-translate to other languages using LLMs
- [ ] **Context-Aware Suggestions**: Show translation suggestions based on component context
- [ ] **Translation Validation**: Warn about missing translations, placeholder mismatches
- [ ] **Character Count Warnings**: Flag translations that exceed UI space limits
- [ ] **RTL Language Support**: Automatic right-to-left layout for Arabic, Hebrew, etc.

**Designer/Content Team Features:**

- [ ] **Translation Dashboard**: Web UI for non-developers to manage all translations
- [ ] **Translation Approval Workflow**: Require review before translations go live
- [ ] **A/B Testing Integration**: Test different copy variations
- [ ] **Translation Analytics**: Track which copy performs best

### Combined System Enhancements

- [ ] **Unified Dev Mode Toggle**: Single toggle for both annotation and text editing
- [ ] **Cross-Feature Annotations**: Annotate translation keys (e.g., "TODO: improve this copy")
- [ ] **Shared Export System**: Export both annotations and translation changes together
- [ ] **Integrated Workflow**: Create GitHub issues that reference both code and translations

## Dependencies

### Required (New)

**Annotation System:**

```json
{
  "dependencies": {
    "zustand": "^4.4.7"
  }
}
```

**Text Editing System:**

```json
{
  "dependencies": {
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0"
  }
}
```

### Already Installed

- ✅ `react` - Core framework
- ✅ `react-hook-form` + `zod` - Form handling (annotation forms, text edit dialog)
- ✅ `@radix-ui/react-dialog` - Sheet component (annotation panel, text edit modal)
- ✅ `tailwindcss` - Styling for overlays and indicators
- ✅ `lucide-react` - Icons (Pencil icon for EditableText)
- ✅ `vite` - Dev server (required for API plugin)

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

### Annotation System Tests

**Phase 1: Core Functionality**

- [ ] Annotation mode toggle works (not implemented)
- [ ] Ctrl+Click identifies components correctly (not implemented)
- [ ] Source locations are accurate (not implemented)
- [ ] Annotations persist in LocalStorage (not implemented)
- [ ] CRUD operations work (create, read, update, delete) (not implemented)

**Phase 2: UI/UX**

- [ ] Visual overlay highlights components on hover (not implemented)
- [ ] Annotation panel displays correctly (not implemented)
- [ ] Form validation works (not implemented)
- [ ] Existing annotations display properly (not implemented)
- [ ] Works across all themes (not implemented)

**Phase 3: Export Features**

- [ ] JSON export is valid (not implemented)
- [ ] Markdown export is formatted correctly (not implemented)
- [ ] GitHub issue format is valid (not implemented)
- [ ] TODO comment format matches conventions (not implemented)

### Text Editing System Tests

**Phase 4: i18n Foundation**

- [ ] i18next initializes correctly (not implemented)
- [ ] Translation files load properly (not implemented)
- [ ] Namespaces work (common, components, errors) (not implemented)
- [ ] Missing key warnings appear in dev mode (not implemented)
- [ ] I18nProvider wraps app correctly (not implemented)

**Phase 5: EditableText Component**

- [ ] Edit icon appears on hover (dev mode only) (not implemented)
- [ ] Edit icon doesn't appear in production (not implemented)
- [ ] Clicking edit icon opens dialog (not implemented)
- [ ] Dialog displays current text value (not implemented)
- [ ] Dialog shows translation key and file path (not implemented)
- [ ] Form validation prevents empty text (not implemented)
- [ ] Save button updates translation file (not implemented)
- [ ] Cancel button closes dialog without changes (not implemented)

**Phase 6: Dev Server API**

- [ ] POST /api/i18n/update endpoint exists (not implemented)
- [ ] API validates required fields (not implemented)
- [ ] API creates missing translation files (not implemented)
- [ ] API updates existing translations correctly (not implemented)
- [ ] API handles nested keys (e.g., "home.welcome.title") (not implemented)
- [ ] API returns success response with file path (not implemented)
- [ ] API handles errors gracefully (not implemented)
- [ ] HMR triggers after translation update (not implemented)

**Phase 7: String Extraction**

- [ ] Extractor plugin runs on buildStart (not implemented)
- [ ] Scans all .tsx and .jsx files in lib/ (not implemented)
- [ ] Identifies hardcoded strings in JSX (not implemented)
- [ ] Skips translation keys (strings with dots/underscores) (not implemented)
- [ ] Generates migration report JSON (not implemented)
- [ ] Suggests EditableText wrapper for each string (not implemented)
- [ ] Generates valid translation keys from text (not implemented)

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
- [ ] UNCLEAR: Dependencies installed (zustand not found in package.json - needs manual verification)
- [ ] Implementation started (no AnnotationMode directory found in lib/components/)
- [ ] Core features complete
- [ ] Tests passing
- [ ] Integration complete
- [ ] Documentation updated
- [ ] Production ready

---

## Implementation Notes

### 2025-10-10 - Combined System Proposal

This proposal merges two complementary dev-mode features:

1. **Component Annotation System**: Visual-to-code mapping for developer notes, TODOs, and bug tracking
2. **Text Editing System**: In-browser copy editing with i18n back-propagation to translation files

Both systems share common infrastructure (DevModeProvider pattern, dev-only execution, file back-propagation) and together create a comprehensive in-app development toolkit.

**Key Design Decisions:**

1. **i18n-First Approach**: Chose translation files over direct code editing to avoid AST parsing complexity
2. **JSON Back-Propagation**: Safe file writing (no source code modification risk)
3. **Unified HOC Pattern**: Single wrapper for both features, consistent with existing catalyst-ui patterns
4. **Dev-Only Architecture**: All editing features use `import.meta.env.DEV` checks, zero production overhead
5. **Vite Integration**: Custom dev server plugins for translation API endpoints

**Key Technical Challenges:**

**Annotation System:**

1. **React Fiber Introspection**: Accessing internal React structures to identify components from DOM elements
2. **Source Map Accuracy**: Ensuring line numbers map correctly, especially with transpiled code
3. **Production Viability**: Dev mode relies on `_debugSource`; production needs alternative source map parsing

**Text Editing System:**

1. **HMR Integration**: Ensuring translation updates trigger hot reload without full page refresh
2. **Nested Key Management**: Safely updating deeply nested translation objects (e.g., "home.welcome.title")
3. **String Extraction Accuracy**: Identifying hardcoded strings vs. translation keys via regex
4. **File Write Safety**: Validating JSON structure before writing to prevent corruption

**Next Steps:**

1. Install dependencies: `react-i18next`, `i18next`, `zustand`
2. Prototype component introspection with React Fiber
3. Set up i18n foundation (I18nProvider, translation files)
4. Build EditableText wrapper component
5. Implement dev server API for translation updates
6. Create visual overlay system for annotations
7. Implement export utilities for both systems
8. Build string extraction tooling

### 2025-10-06 - Original Annotation Proposal

Initial proposal focused on component annotation system only. Expanded on 2025-10-10 to include text editing capabilities based on user request for in-browser text editing with back-propagation to files.
