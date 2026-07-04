/**
 * useSmartCursorPosition — compute a viewport-safe anchor position for a
 * cursor-anchored floating panel (context menus, right-click surfaces).
 *
 * Unlike Radix Popover / SmartPopover which anchor to a trigger element,
 * cursor-anchored menus render at a raw ``(x, y)`` from a mouse/touch
 * event. This hook takes that raw position + the panel's measured size
 * and returns a resolved ``{x, y}`` that either:
 *
 *   - fits below+right of the cursor (default, ``strategy: 'shift'``), or
 *   - FLIPS to open above / left of the cursor when there's more room in
 *     that direction (``strategy: 'flip'``)
 *
 * When both dimensions overflow (rare — tiny viewport), the panel clamps
 * to the safe inset (``padding`` on all sides).
 *
 * Usage:
 *   const rootRef = useRef<HTMLDivElement>(null);
 *   const pos = useSmartCursorPosition({ target, rootRef, strategy: 'flip' });
 *   return <div ref={rootRef} style={{ left: pos.x, top: pos.y, opacity: pos.ready ? 1 : 0 }} />
 *
 * ``ready`` is false for one frame after ``target`` changes so the panel
 * can measure itself before painting — prevents a visible jump.
 */
import { useLayoutEffect, useState, type RefObject } from "react";

export interface CursorTarget {
  x: number;
  y: number;
}

export type CursorPlacementStrategy =
  /** Move back inside the viewport by nudging along the axis that overflows. */
  | "shift"
  /** Open above / to the left of the cursor when the natural direction overflows. */
  | "flip";

export interface SmartCursorPositionOptions {
  /** Raw cursor position (e.g. from a right-click event). ``null`` closes. */
  target: CursorTarget | null;
  /** Ref to the floating panel — used to measure its actual size after mount. */
  rootRef: RefObject<HTMLElement | null>;
  /**
   * Fixed panel width — required. Cursor menus generally have known dims.
   * The panel's actual measured width is used only when it's smaller than this.
   */
  width: number;
  /**
   * Estimated panel height for the first frame (before measurement). Once
   * mounted, the hook re-runs with the measured size. Default 260.
   */
  estimatedHeight?: number;
  /** Padding from viewport edges. Default 8. */
  padding?: number;
  /** ``'shift'`` (default) nudges back into viewport; ``'flip'`` opens up/left. */
  strategy?: CursorPlacementStrategy;
}

export interface ResolvedCursorPosition {
  x: number;
  y: number;
  /** false until the panel has been measured — bind to ``opacity`` to hide the jump. */
  ready: boolean;
  /** Whether the panel opened UP (only true when ``strategy: 'flip'``). */
  flippedY: boolean;
  /** Whether the panel opened LEFT (only true when ``strategy: 'flip'``). */
  flippedX: boolean;
}

export function useSmartCursorPosition({
  target,
  rootRef,
  width,
  estimatedHeight = 260,
  padding = 8,
  strategy = "shift",
}: SmartCursorPositionOptions): ResolvedCursorPosition {
  const [state, setState] = useState<ResolvedCursorPosition>({
    x: 0,
    y: 0,
    ready: false,
    flippedX: false,
    flippedY: false,
  });

  useLayoutEffect(() => {
    if (!target) {
      setState(s => ({ ...s, ready: false }));
      return;
    }
    const rect = rootRef.current?.getBoundingClientRect();
    const measuredW = rect?.width || width;
    const measuredH = rect?.height || estimatedHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = target.x;
    let y = target.y;
    let flippedX = false;
    let flippedY = false;

    if (strategy === "flip") {
      // FLIP: if the natural position (right/below cursor) would overflow,
      // check whether the opposite side has more room and open there.
      const overflowRight = x + measuredW + padding > vw;
      const overflowBottom = y + measuredH + padding > vh;
      if (overflowRight && x - measuredW > padding) {
        x = target.x - measuredW;
        flippedX = true;
      }
      if (overflowBottom && y - measuredH > padding) {
        y = target.y - measuredH;
        flippedY = true;
      }
    }

    // Regardless of strategy, apply a final shift clamp so the panel
    // stays inside the viewport when neither natural nor flipped position
    // fits (tiny viewport, huge panel).
    x = Math.max(padding, Math.min(x, vw - measuredW - padding));
    y = Math.max(padding, Math.min(y, vh - measuredH - padding));

    setState({ x, y, ready: true, flippedX, flippedY });
  }, [target, rootRef, width, estimatedHeight, padding, strategy]);

  return state;
}
