/**
 * CanvasLoader - Loading Overlay for Three.js Canvas
 *
 * Displays a synthwave-styled loading spinner with progress percentage
 * while 3D models and assets are being loaded.
 */

import React from "react";
import { Html, useProgress } from "@react-three/drei";

export interface CanvasLoaderProps {
  /** Custom loading text */
  loadingText?: string;
  /** Show percentage progress */
  showProgress?: boolean;
}

/**
 * CanvasLoader Component
 *
 * Automatically tracks loading progress via drei's useProgress hook.
 * Styled to match catalyst synthwave theme.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<CanvasLoader />}>
 *   <Model />
 * </Suspense>
 * ```
 */
export function CanvasLoader({ loadingText = "Loading", showProgress = true }: CanvasLoaderProps) {
  const { progress } = useProgress();

  return (
    <Html
      as="div"
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Spinner */}
      <div className="canvas-loader">
        <div className="spinner" />
      </div>

      {/* Loading text */}
      <p className="text-sm font-medium text-primary">
        {loadingText}
        {showProgress && ` ${progress.toFixed(2)}%`}
      </p>

      <style>{`
        .canvas-loader {
          width: 80px;
          height: 80px;
          position: relative;
        }

        .spinner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: var(--primary);
          border-right-color: var(--secondary);
          animation: spin 1.1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          box-shadow:
            0 0 15px rgba(0, 252, 214, 0.4),
            0 0 30px rgba(0, 252, 214, 0.2),
            inset 0 0 10px rgba(0, 252, 214, 0.1);
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Html>
  );
}
