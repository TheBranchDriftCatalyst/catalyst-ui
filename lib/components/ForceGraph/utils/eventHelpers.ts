/**
 * Event handling utilities for D3 graph interactions
 *
 * Provides safe, error-tolerant methods for controlling event behavior
 * in D3 drag/zoom interactions. Prevents common issues like event bubbling
 * interfering with pan/zoom controls.
 *
 * **Problem Solved:**
 * D3 events have a nested structure (event.sourceEvent) that can fail
 * in various ways. These utilities handle errors gracefully and provide
 * consistent behavior across different D3 event types.
 *
 * **Use Cases:**
 * - Node dragging without triggering pan
 * - Click events without triggering zoom
 * - Preventing default browser behaviors
 * - Safe event handling in React components
 *
 * @module ForceGraph/utils/eventHelpers
 * @see {@link https://github.com/d3/d3-drag|D3 Drag Documentation}
 * @see {@link https://github.com/d3/d3-zoom|D3 Zoom Documentation}
 */
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("ForceGraph:eventHelpers");

/**
 * Safely stop propagation of a D3 drag event
 *
 * Prevents the event from bubbling up to parent elements, which could
 * trigger unwanted behaviors like zooming when dragging a node.
 *
 * **Why It's Safe:**
 * - Handles undefined/null events gracefully
 * - Handles missing sourceEvent property
 * - Logs errors only in development
 * - Never throws exceptions
 *
 * **Common Use:**
 * ```typescript
 * const dragBehavior = d3.drag()
 *   .on('drag', (event) => {
 *     safeStopPropagation(event);  // Prevent zoom from triggering
 *     // ... update node position
 *   });
 * ```
 *
 * **Performance:**
 * - Negligible overhead
 * - Try-catch only triggers on actual errors
 * - Development logging doesn't affect production
 *
 * @param event - D3 drag event or any event with sourceEvent property
 *
 * @example
 * ```typescript
 * // In node drag handler
 * function onNodeDrag(event: any, node: NodeData) {
 *   safeStopPropagation(event);  // Prevent pan/zoom
 *   node.x = event.x;
 *   node.y = event.y;
 * }
 * ```
 *
 * @see {@link safeStopEvent} to also prevent default behavior
 */
export const safeStopPropagation = (event: any): void => {
  try {
    event?.sourceEvent?.stopPropagation();
  } catch (err) {
    // Silently fail - event propagation is a best-effort operation
    if (process.env.NODE_ENV === "development") {
      log.warn("Failed to stop event propagation", err);
    }
  }
};

/**
 * Safely prevent default behavior of a D3 drag event
 *
 * Stops the browser's default handling of the event (e.g., text selection,
 * context menu, link navigation). Essential for custom drag interactions.
 *
 * **Why It's Safe:**
 * - Gracefully handles missing sourceEvent
 * - Won't throw if preventDefault doesn't exist
 * - Logs errors only in development
 * - Silent failure in production
 *
 * **Common Use:**
 * ```typescript
 * const dragBehavior = d3.drag()
 *   .on('start', (event) => {
 *     safePreventDefault(event);  // Prevent text selection
 *   });
 * ```
 *
 * @param event - D3 drag event or any event with sourceEvent property
 *
 * @see {@link safeStopEvent} to also stop propagation
 */
export const safePreventDefault = (event: any): void => {
  try {
    event?.sourceEvent?.preventDefault();
  } catch (err) {
    // Silently fail
    if (process.env.NODE_ENV === "development") {
      log.warn("Failed to prevent default behavior", err);
    }
  }
};

/**
 * Combines stopPropagation and preventDefault for complete event control
 *
 * Convenience function that both stops event bubbling AND prevents default
 * browser behavior. Use this when you want total control over event handling.
 *
 * **What It Does:**
 * 1. Stops event from bubbling to parent elements
 * 2. Prevents browser's default handling
 *
 * **When to Use:**
 * - Custom drag-and-drop implementations
 * - Preventing all default behaviors
 * - Isolating event handling to specific elements
 * - Node/edge interaction handlers
 *
 * **Example Use Cases:**
 * - Dragging nodes without text selection
 * - Custom context menus without browser menu
 * - Click handlers that shouldn't trigger parent actions
 *
 * @param event - D3 drag event or any event with sourceEvent property
 *
 * @example
 * ```typescript
 * const dragBehavior = d3.drag()
 *   .on('drag', (event, d) => {
 *     safeStopEvent(event);  // Complete event isolation
 *     d.x = event.x;
 *     d.y = event.y;
 *     updateVisualization();
 *   });
 * ```
 *
 * @see {@link safeStopPropagation} for just stopping bubbling
 * @see {@link safePreventDefault} for just preventing defaults
 */
export const safeStopEvent = (event: any): void => {
  safeStopPropagation(event);
  safePreventDefault(event);
};
