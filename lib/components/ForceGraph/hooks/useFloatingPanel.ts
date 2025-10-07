import { useState, useCallback } from "react";
import { useDraggable, Position } from "./useDraggable";
import { useResizable, Size } from "./useResizable";

export interface UseFloatingPanelOptions {
  // Draggable options
  initialPosition?: Position;
  positionStorageKey?: string;
  enableDragging?: boolean;

  // Resizable options
  initialSize?: Size;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  sizeStorageKey?: string;
  enableResizing?: boolean;

  // Collapse options
  initialCollapsed?: boolean;
  collapseStorageKey?: string;
  enableCollapse?: boolean;
}

/**
 * Combined hook for floating panels with drag, resize, and collapse functionality
 * Provides a unified interface for all floating panel behaviors
 */
export function useFloatingPanel(options: UseFloatingPanelOptions = {}) {
  const {
    // Draggable defaults
    initialPosition = { x: 20, y: 20 },
    positionStorageKey,
    enableDragging = true,

    // Resizable defaults
    initialSize = { width: 400, height: 500 },
    minWidth = 300,
    minHeight = 200,
    maxWidth = 800,
    maxHeight = 1000,
    sizeStorageKey,
    enableResizing = true,

    // Collapse defaults
    initialCollapsed = false,
    collapseStorageKey,
    enableCollapse = true,
  } = options;

  // Draggable hook
  const draggable = useDraggable({
    initialPosition,
    storageKey: positionStorageKey,
  });

  // Resizable hook
  const resizable = useResizable({
    initialSize,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    storageKey: sizeStorageKey,
  });

  // Collapse state
  const [isCollapsed, setIsCollapsedState] = useState<boolean>(() => {
    if (collapseStorageKey) {
      try {
        const stored = localStorage.getItem(collapseStorageKey);
        if (stored !== null) {
          return JSON.parse(stored);
        }
      } catch (e) {
        // Ignore errors
      }
    }
    return initialCollapsed;
  });

  // Toggle collapse with localStorage persistence
  const toggleCollapse = useCallback(() => {
    setIsCollapsedState(prev => {
      const newValue = !prev;
      if (collapseStorageKey) {
        try {
          localStorage.setItem(collapseStorageKey, JSON.stringify(newValue));
        } catch (e) {
          // Ignore errors
        }
      }
      return newValue;
    });
  }, [collapseStorageKey]);

  const setIsCollapsed = useCallback(
    (value: boolean) => {
      setIsCollapsedState(value);
      if (collapseStorageKey) {
        try {
          localStorage.setItem(collapseStorageKey, JSON.stringify(value));
        } catch (e) {
          // Ignore errors
        }
      }
    },
    [collapseStorageKey]
  );

  // Combined style (conditionally apply resize style when not collapsed)
  const combinedStyle = {
    ...draggable.style,
    ...(enableResizing && !isCollapsed ? resizable.style : {}),
  };

  // Merged ref for panels that need both drag and resize on the same element
  const mergedRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (draggable.elementRef) {
        (draggable.elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
      if (resizable.elementRef) {
        (resizable.elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    },
    [draggable.elementRef, resizable.elementRef]
  );

  return {
    // Main panel ref (combines drag + resize)
    panelRef: mergedRef,

    // Draggable
    dragHandleRef: enableDragging ? draggable.handleRef : undefined,
    position: draggable.position,

    // Resizable
    resizeHandleRef: enableResizing ? resizable.resizeHandleRef : undefined,
    size: resizable.size,

    // Collapse
    isCollapsed: enableCollapse ? isCollapsed : false,
    toggleCollapse: enableCollapse ? toggleCollapse : () => {},
    setIsCollapsed: enableCollapse ? setIsCollapsed : () => {},

    // Combined
    style: combinedStyle,

    // Feature flags
    isDraggable: enableDragging,
    isResizable: enableResizing,
    isCollapsible: enableCollapse,
  };
}
