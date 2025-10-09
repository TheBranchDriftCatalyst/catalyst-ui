/**
 * Event handling utilities for D3 graph interactions
 */
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("ForceGraph:eventHelpers");

/**
 * Safely stop propagation of a D3 drag event
 * Prevents the event from bubbling up, which could interfere with zoom/pan
 * @param event - D3 drag event or any event with sourceEvent
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
 * @param event - D3 drag event or any event with sourceEvent
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
 * @param event - D3 drag event or any event with sourceEvent
 */
export const safeStopEvent = (event: any): void => {
  safeStopPropagation(event);
  safePreventDefault(event);
};
