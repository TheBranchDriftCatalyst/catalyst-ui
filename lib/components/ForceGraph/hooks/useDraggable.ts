import { useRef, useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  storageKey?: string;
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, storageKey } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(() => {
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
    return initialPosition;
  });

  useEffect(() => {
    const element = elementRef.current;
    const handle = handleRef.current;
    if (!element || !handle) return;

    const onMouseDown = (e: MouseEvent) => {
      // Only drag if clicking on the handle
      if (e.target !== handle && !handle.contains(e.target as Node)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      handle.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const newPosition = {
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      };

      setPosition(newPosition);
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      if (handle) {
        handle.style.cursor = 'grab';
      }

      // Save to localStorage if storageKey is provided
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(position));
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
  }, [position, storageKey]);

  return {
    elementRef,
    handleRef,
    position,
    style: {
      position: 'fixed' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
    },
  };
}
