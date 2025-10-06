import { useRef, useEffect, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

export interface UseResizableOptions {
  initialSize?: Size;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  storageKey?: string;
}

export function useResizable(options: UseResizableOptions = {}) {
  const {
    initialSize = { width: 400, height: 500 },
    minWidth = 300,
    minHeight = 200,
    maxWidth = 800,
    maxHeight = 1000,
    storageKey,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [size, setSize] = useState<Size>(() => {
    // Try to load from localStorage if storageKey is provided
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        // Ignore errors
      }
    }
    return initialSize;
  });

  useEffect(() => {
    const element = elementRef.current;
    const handle = resizeHandleRef.current;
    if (!element || !handle) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isResizingRef.current = true;
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      };

      handle.style.cursor = 'nwse-resize';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      e.preventDefault();

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeStartRef.current.width + deltaX)
      );
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeStartRef.current.height + deltaY)
      );

      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      if (!isResizingRef.current) return;

      isResizingRef.current = false;
      if (handle) {
        handle.style.cursor = 'nwse-resize';
      }

      // Save to localStorage if storageKey is provided
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(size));
        } catch (e) {
          // Ignore errors
        }
      }
    };

    handle.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [size, minWidth, minHeight, maxWidth, maxHeight, storageKey]);

  return {
    elementRef,
    resizeHandleRef,
    size,
    style: {
      width: `${size.width}px`,
      height: `${size.height}px`,
    },
  };
}
