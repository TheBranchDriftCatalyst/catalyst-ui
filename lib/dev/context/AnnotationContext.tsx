import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { isDevUtilsEnabled, isBackendSyncEnabled } from "../utils/devMode";

/**
 * Annotation type - represents a user-created annotation
 */
export interface Annotation {
  /** Unique identifier (UUID) */
  id: string;
  /** Component name (user-typed, no React Fiber introspection) */
  componentName: string;
  /** Annotation note/content */
  note: string;
  /** Annotation type */
  type: "todo" | "bug" | "note" | "docs";
  /** Priority level */
  priority: "low" | "medium" | "high";
  /** Creation timestamp (milliseconds since epoch) */
  timestamp: number;
  /** Optional: File path (for instance-scoped annotations - legacy) */
  filePath?: string;
  /** Optional: Line number (for instance-scoped annotations - legacy) */
  lineNumber?: number;
  /** Optional: Instance identifier (for instance-scoped annotations) */
  instanceId?: string;
  /** Optional: Tree path (for instance-scoped annotations) */
  treePath?: string;
}

interface AnnotationContextValue {
  /**
   * Get all annotations
   */
  getAllAnnotations: () => Annotation[];

  /**
   * Get annotations for a specific component
   * @param componentName - The component name to filter by
   */
  getAnnotationsByComponent: (componentName: string) => Annotation[];

  /**
   * Add a new annotation
   * @param annotation - Annotation data (id and timestamp will be auto-generated if not provided)
   */
  addAnnotation: (
    annotation: Omit<Annotation, "id" | "timestamp"> & Partial<Pick<Annotation, "id" | "timestamp">>
  ) => void;

  /**
   * Remove an annotation by ID
   * @param id - The annotation ID to remove
   */
  removeAnnotation: (id: string) => void;

  /**
   * Update an existing annotation
   * @param id - The annotation ID to update
   * @param updates - Partial annotation data to update
   */
  updateAnnotation: (id: string, updates: Partial<Omit<Annotation, "id" | "timestamp">>) => void;

  /**
   * Sync status - indicates backend sync state
   */
  syncStatus: "idle" | "syncing" | "synced" | "error";

  /**
   * Last error message from sync operation
   */
  syncError: string | null;

  /**
   * Manually trigger backend sync
   */
  syncToBackend: () => Promise<void>;

  /**
   * Clear all annotations
   */
  clearAll: () => void;
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

const STORAGE_KEY = "catalyst-ui-annotations";
const SYNC_INTERVAL_MS = 5000; // Sync every 5 seconds if there are annotations

/**
 * AnnotationProvider manages component annotations in dev mode
 *
 * Features:
 * - Stores annotations locally (in-memory + localStorage)
 * - CRUD operations for annotations
 * - Periodic backend sync (writes to annotations.json via Vite middleware)
 * - Manual component name entry (no React Fiber introspection)
 *
 * @example
 * ```tsx
 * import { AnnotationProvider } from '@/catalyst-ui/dev/context';
 *
 * function App() {
 *   return (
 *     <AnnotationProvider>
 *       <YourApp />
 *     </AnnotationProvider>
 *   );
 * }
 * ```
 */
export function AnnotationProvider({ children }: { children: React.ReactNode }) {
  // Load annotations from localStorage
  const [annotations, setAnnotations] = useState<Annotation[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("[AnnotationProvider] Failed to load stored annotations:", error);
      return [];
    }
  });

  // Backend sync state
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(0);

  // Persist annotations to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    } catch (error) {
      console.error("[AnnotationProvider] Failed to persist annotations:", error);
    }
  }, [annotations]);

  const getAllAnnotations = useCallback(() => annotations, [annotations]);

  const getAnnotationsByComponent = useCallback(
    (componentName: string) => {
      return annotations.filter(a => a.componentName === componentName);
    },
    [annotations]
  );

  const addAnnotation = useCallback(
    (
      annotation: Omit<Annotation, "id" | "timestamp"> &
        Partial<Pick<Annotation, "id" | "timestamp">>
    ) => {
      const newAnnotation: Annotation = {
        ...annotation,
        id: annotation.id || crypto.randomUUID(),
        timestamp: annotation.timestamp || Date.now(),
      };

      setAnnotations(prev => [...prev, newAnnotation]);

      if (isDevUtilsEnabled()) {
        console.log("[AnnotationProvider] Added annotation:", newAnnotation);
      }
    },
    []
  );

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));

    if (isDevUtilsEnabled()) {
      console.log(`[AnnotationProvider] Removed annotation: ${id}`);
    }
  }, []);

  const updateAnnotation = useCallback(
    (id: string, updates: Partial<Omit<Annotation, "id" | "timestamp">>) => {
      setAnnotations(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));

      if (isDevUtilsEnabled()) {
        console.log(`[AnnotationProvider] Updated annotation ${id}:`, updates);
      }
    },
    []
  );

  const syncToBackend = useCallback(async () => {
    // Only sync in true dev mode, not when using production flag
    if (!isBackendSyncEnabled()) {
      if (isDevUtilsEnabled()) {
        console.log("[AnnotationProvider] Backend sync disabled (production mode)");
      }
      return;
    }

    if (annotations.length === 0) {
      if (isDevUtilsEnabled()) {
        console.log("[AnnotationProvider] No annotations to sync");
      }
      return;
    }

    setSyncStatus("syncing");
    setSyncError(null);

    try {
      const response = await fetch("/api/annotations/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annotations }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to sync annotations: ${errorText}`);
      }

      const result = await response.json();

      setSyncStatus("synced");
      setLastSyncedAt(Date.now());

      if (isDevUtilsEnabled()) {
        console.log(
          `[AnnotationProvider] Successfully synced ${result.count} annotations to ${result.file}`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sync failed";
      setSyncError(errorMessage);
      setSyncStatus("error");

      console.error("[AnnotationProvider] Sync error:", error);
    }
  }, [annotations]);

  const clearAll = useCallback(() => {
    setAnnotations([]);

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (isDevUtilsEnabled()) {
      console.log("[AnnotationProvider] Cleared all annotations");
    }
  }, []);

  // Periodic backend sync - syncs annotations every 5 seconds
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only set up periodic sync if backend sync is enabled (true dev mode only)
    if (!isBackendSyncEnabled()) {
      return;
    }

    // Only set up interval if there are annotations
    if (annotations.length === 0) {
      return;
    }

    if (isDevUtilsEnabled()) {
      console.log(
        `[AnnotationProvider] Setting up periodic sync (${SYNC_INTERVAL_MS}ms) for ${annotations.length} annotations`
      );
    }

    const intervalId = setInterval(() => {
      syncToBackend();
    }, SYNC_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (isDevUtilsEnabled()) {
        console.log("[AnnotationProvider] Cleared periodic sync interval");
      }
    };
  }, [annotations.length, syncToBackend]);

  return (
    <AnnotationContext.Provider
      value={{
        getAllAnnotations,
        getAnnotationsByComponent,
        addAnnotation,
        removeAnnotation,
        updateAnnotation,
        syncStatus,
        syncError,
        syncToBackend,
        clearAll,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

/**
 * Hook to access annotation context
 *
 * @example
 * ```tsx
 * import { useAnnotationContext } from '@/catalyst-ui/dev/context';
 *
 * function MyComponent() {
 *   const { addAnnotation, getAllAnnotations } = useAnnotationContext();
 *
 *   const handleAddNote = () => {
 *     addAnnotation({
 *       componentName: 'MyComponent',
 *       note: 'Fix this later',
 *       type: 'todo',
 *       priority: 'high',
 *     });
 *   };
 *
 *   return <button onClick={handleAddNote}>Add Note</button>;
 * }
 * ```
 */
export function useAnnotationContext() {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error("useAnnotationContext must be used within AnnotationProvider");
  }
  return context;
}
