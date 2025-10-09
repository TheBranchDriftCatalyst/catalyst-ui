import { useCallback, useRef } from "react";
import { NodeData } from "../types";
import { LayoutKind } from "../utils/layouts";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("ForceGraph:useNodePositions");

/**
 * Node position for persistence
 */
export interface NodePosition {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
}

/**
 * Saved positions indexed by node ID
 */
export type SavedPositions = Record<string, NodePosition>;

/**
 * Hook to persist and restore node positions per layout type
 *
 * Positions are stored in localStorage with key: `${storageKey}.positions.${layout}`
 * This allows each layout type to maintain its own node arrangement
 *
 * @param storageKey - Optional localStorage key prefix (from ForceGraph prop)
 * @param layout - Current layout type (force, dagre, elk, etc.)
 * @returns Methods to load, save, apply, and clear node positions
 */
export function useNodePositions(storageKey?: string, layout: LayoutKind = "force") {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get the full localStorage key for current layout
   */
  const getStorageKey = useCallback((): string | null => {
    if (!storageKey) return null;
    return `${storageKey}.positions.${layout}`;
  }, [storageKey, layout]);

  /**
   * Load saved positions from localStorage for current layout
   * Returns empty object if no positions saved or storage disabled
   */
  const loadPositions = useCallback((): SavedPositions => {
    const key = getStorageKey();
    if (!key) return {};

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return {};

      const parsed = JSON.parse(stored);
      return parsed || {};
    } catch (e) {
      log.warn("Failed to load node positions from localStorage", e);
      return {};
    }
  }, [getStorageKey]);

  /**
   * Save node positions to localStorage (debounced)
   * Only saves nodes that have been positioned (have x, y coordinates)
   *
   * @param nodes - Array of nodes to save positions for
   * @param immediate - Skip debounce and save immediately
   */
  const savePositions = useCallback(
    (nodes: NodeData[], immediate = false) => {
      const key = getStorageKey();
      if (!key) return; // No storage key, skip persistence

      const doSave = () => {
        try {
          const positions: SavedPositions = {};

          // Save positions for nodes that have coordinates
          nodes.forEach(node => {
            if (node.x !== undefined && node.y !== undefined) {
              positions[node.id] = {
                x: node.x,
                y: node.y,
                fx: node.fx ?? null,
                fy: node.fy ?? null,
              };
            }
          });

          localStorage.setItem(key, JSON.stringify(positions));
        } catch (e) {
          log.warn("Failed to save node positions to localStorage", e);
        }
      };

      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (immediate) {
        doSave();
      } else {
        // Debounce saves to avoid thrashing localStorage
        saveTimeoutRef.current = setTimeout(doSave, 500);
      }
    },
    [getStorageKey]
  );

  /**
   * Apply saved positions to a node array
   * Mutates the nodes in-place to restore their positions
   *
   * @param nodes - Array of nodes to apply positions to
   */
  const applyPositions = useCallback(
    (nodes: NodeData[]) => {
      const savedPositions = loadPositions();
      if (Object.keys(savedPositions).length === 0) return;

      // Apply saved positions to matching nodes
      nodes.forEach(node => {
        const saved = savedPositions[node.id];
        if (saved) {
          node.x = saved.x;
          node.y = saved.y;
          node.fx = saved.fx;
          node.fy = saved.fy;
        }
      });
    },
    [loadPositions]
  );

  /**
   * Clear all saved positions for current layout
   * Useful for "reset layout" functionality
   */
  const clearPositions = useCallback(() => {
    const key = getStorageKey();
    if (!key) return;

    try {
      localStorage.removeItem(key);
    } catch (e) {
      log.warn("Failed to clear node positions from localStorage", e);
    }
  }, [getStorageKey]);

  /**
   * Clear all saved positions for ALL layouts
   * Useful for complete reset
   */
  const clearAllPositions = useCallback(() => {
    if (!storageKey) return;

    try {
      const layouts: LayoutKind[] = ["force", "structured", "community", "dagre", "elk"];
      layouts.forEach(layoutType => {
        const key = `${storageKey}.positions.${layoutType}`;
        localStorage.removeItem(key);
      });
    } catch (e) {
      log.warn("Failed to clear all node positions from localStorage", e);
    }
  }, [storageKey]);

  return {
    loadPositions,
    savePositions,
    applyPositions,
    clearPositions,
    clearAllPositions,
  };
}
