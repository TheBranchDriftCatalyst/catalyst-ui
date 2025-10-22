/**
 * ThreeCanvas - Generic Three.js Canvas Wrapper
 *
 * Provides a reusable canvas with Suspense, error boundaries, and sensible defaults
 * for rendering Three.js scenes in React.
 */

import React, { Suspense } from "react";
import { Canvas, CanvasProps } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { CanvasLoader } from "./CanvasLoader";

export interface ThreeCanvasProps extends Partial<CanvasProps> {
  /** Canvas children (3D objects, lights, controls, etc.) */
  children: React.ReactNode;
  /** Custom loading fallback (defaults to CanvasLoader) */
  fallback?: React.ReactNode;
  /** Whether to preload all assets */
  preloadAll?: boolean;
  /** Additional CSS classes for the canvas wrapper */
  className?: string;
}

/**
 * ThreeCanvas Component
 *
 * @example
 * ```tsx
 * <ThreeCanvas camera={{ position: [0, 0, 5], fov: 75 }}>
 *   <ambientLight intensity={0.5} />
 *   <mesh>
 *     <boxGeometry />
 *     <meshStandardMaterial />
 *   </mesh>
 *   <OrbitControls />
 * </ThreeCanvas>
 * ```
 */
export function ThreeCanvas({
  children,
  fallback = <CanvasLoader />,
  preloadAll = true,
  className = "",
  shadows = true,
  dpr = [1, 2],
  gl = { preserveDrawingBuffer: true },
  frameloop = "demand",
  camera,
  ...restProps
}: ThreeCanvasProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows={shadows}
        dpr={dpr}
        gl={gl}
        frameloop={frameloop}
        camera={camera}
        {...restProps}
      >
        <Suspense fallback={fallback}>
          {children}
          {preloadAll && <Preload all />}
        </Suspense>
      </Canvas>
    </div>
  );
}
