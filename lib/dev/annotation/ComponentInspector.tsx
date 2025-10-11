import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/catalyst-ui/ui/button";
import { Badge } from "@/catalyst-ui/ui/badge";
import { MousePointer2, XCircle } from "lucide-react";
import { cn } from "@/catalyst-ui/utils";

/**
 * Component information extracted from React Fiber
 */
export interface ComponentInfo {
  name: string;
  type: string;
  props: Record<string, any>;
  state?: any;
  filePath?: string;
  lineNumber?: number;
  /** Unique instance identifier (Fiber path + props hash) */
  instanceId?: string;
  /** Human-readable tree path (e.g., "App > Layout > Button") */
  treePath?: string;
}

interface ComponentInspectorProps {
  /**
   * Callback when a component is selected
   */
  onComponentSelect: (info: ComponentInfo) => void;
  /**
   * Whether inspector mode is active
   */
  active: boolean;
  /**
   * Callback to toggle inspector mode
   */
  onToggle: (active: boolean) => void;
}

/**
 * Get React Fiber node from a DOM element
 */
function getFiberFromElement(element: HTMLElement): any {
  const key = Object.keys(element).find(
    key => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
  );
  return key ? (element as any)[key] : null;
}

/**
 * Generate a simple hash from a string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Build a tree path from fiber to root
 */
function buildTreePath(fiber: any): string[] {
  const path: string[] = [];
  let current = fiber;

  while (current) {
    const { type } = current;

    if (typeof type === "function" || (typeof type === "object" && type !== null)) {
      const componentName =
        type.displayName ||
        type.name ||
        (type.render && (type.render.displayName || type.render.name)) ||
        null;

      if (
        componentName &&
        componentName !== "Anonymous" &&
        !componentName.includes("Context") &&
        !componentName.includes("Provider") &&
        componentName !== "ForwardRef"
      ) {
        path.unshift(componentName);
      }
    }

    current = current.return;
  }

  return path;
}

/**
 * Extract component info from React Fiber node
 */
function getComponentInfoFromFiber(fiber: any): ComponentInfo | null {
  if (!fiber) return null;

  // Walk up the fiber tree to find a component (not just a DOM node)
  let current = fiber;
  let targetFiber = null;

  while (current) {
    const { type, memoizedProps, memoizedState, _debugSource, key, index } = current;

    // Check if this is a function or class component
    if (typeof type === "function" || (typeof type === "object" && type !== null)) {
      const componentName =
        type.displayName ||
        type.name ||
        (type.render && (type.render.displayName || type.render.name)) ||
        "Anonymous";

      // Skip React internals and DOM elements
      if (
        componentName !== "Anonymous" &&
        !componentName.includes("Context") &&
        !componentName.includes("Provider") &&
        componentName !== "ForwardRef"
      ) {
        targetFiber = current;

        // Extract file path and line number from debug source (dev mode only)
        const filePath = _debugSource?.fileName;
        const lineNumber = _debugSource?.lineNumber;

        // Build tree path for human-readable identifier
        const treePath = buildTreePath(current).join(" > ");

        // Generate instance ID from tree path, key, index, and identifying props
        const identifyingProps = memoizedProps
          ? {
              key: key,
              index: index,
              // Include props that help identify this specific instance
              id: memoizedProps.id,
              className: memoizedProps.className,
              name: memoizedProps.name,
              title: memoizedProps.title,
            }
          : {};

        const instanceData = JSON.stringify({
          path: treePath,
          ...identifyingProps,
        });
        const instanceId = simpleHash(instanceData);

        return {
          name: componentName,
          type: typeof type === "function" ? "function" : "class",
          props: memoizedProps || {},
          state: memoizedState,
          filePath,
          lineNumber,
          instanceId,
          treePath,
        };
      }
    }

    current = current.return;
  }

  return null;
}

/**
 * ComponentInspector - Click-to-inspect React components
 *
 * Features:
 * - Click any component to inspect it
 * - Shows component name, props, state
 * - Extracts file path and line number (dev mode)
 * - Visual highlight on hover
 *
 * @example
 * ```tsx
 * const [active, setActive] = useState(false);
 *
 * <ComponentInspector
 *   active={active}
 *   onToggle={setActive}
 *   onComponentSelect={(info) => console.log(info)}
 * />
 * ```
 */
export function ComponentInspector({
  onComponentSelect,
  active,
  onToggle,
}: ComponentInspectorProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!active) return;

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (element && element !== hoveredElement) {
        setHoveredElement(element);
      }
    },
    [active, hoveredElement]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!active) return;

      e.preventDefault();
      e.stopPropagation();

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!element) return;

      const fiber = getFiberFromElement(element);
      const componentInfo = getComponentInfoFromFiber(fiber);

      if (componentInfo) {
        setSelectedComponent(componentInfo);
        onComponentSelect(componentInfo);
        onToggle(false); // Deactivate inspector after selection
      }
    },
    [active, onComponentSelect, onToggle]
  );

  // Set up event listeners when active
  useEffect(() => {
    if (!active) {
      setHoveredElement(null);
      return;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
    };
  }, [active, handleMouseMove, handleClick]);

  // Add visual highlight to hovered element
  useEffect(() => {
    if (!hoveredElement || !active) return;

    const originalOutline = hoveredElement.style.outline;
    const originalCursor = hoveredElement.style.cursor;
    const originalPointerEvents = hoveredElement.style.pointerEvents;

    hoveredElement.style.outline = "2px solid #3b82f6";
    hoveredElement.style.cursor = "crosshair";
    hoveredElement.style.pointerEvents = "auto";

    return () => {
      hoveredElement.style.outline = originalOutline;
      hoveredElement.style.cursor = originalCursor;
      hoveredElement.style.pointerEvents = originalPointerEvents;
    };
  }, [hoveredElement, active]);

  if (!import.meta.env.DEV) {
    return null; // Only available in dev mode
  }

  // Only render the floating indicator when active
  if (!active) {
    return null;
  }

  return (
    <>
      {/* Inspector Active Overlay Indicator */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-[9999]",
          "flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg",
          "bg-blue-500 text-white text-sm font-medium",
          "animate-in fade-in slide-in-from-top-2"
        )}
      >
        <MousePointer2 className="h-4 w-4" />
        <span>Inspector Mode Active - Click any component</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(false)}
          className="h-6 px-2 ml-2 bg-white/20 hover:bg-white/30 text-white"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Cancel
        </Button>
      </div>
    </>
  );
}
