/**
 * PlanetModel - 3D Rotating Earth Visualizer
 *
 * Loads and renders a GLTF model of planet Earth with auto-rotation
 * and orbit controls.
 */

import React from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";

export interface PlanetModelProps {
  /** Scale multiplier (default: 2.5) */
  scale?: number;
  /** Enable auto-rotation (default: true) */
  autoRotate?: boolean;
  /** Auto-rotation speed (default: 1) */
  autoRotateSpeed?: number;
  /** Enable orbit controls (default: true) */
  enableControls?: boolean;
}

/**
 * Planet Earth 3D Model Component
 *
 * Renders a detailed Earth model with auto-rotation.
 * Great for space-themed or global context visualizations.
 *
 * @example
 * ```tsx
 * <ThreeCanvas camera={{ position: [-4, 3, 6], fov: 45 }}>
 *   <PlanetModel />
 * </ThreeCanvas>
 * ```
 */
export function PlanetModel({
  scale = 2.5,
  autoRotate = true,
  autoRotateSpeed = 1,
  enableControls = true,
}: PlanetModelProps) {
  const earth = useGLTF("/models/planet/scene.gltf");

  return (
    <group>
      {/* Planet Model */}
      <primitive object={earth.scene} scale={scale} position-y={0} rotation-y={0} />

      {/* Orbit Controls with auto-rotation */}
      {enableControls && (
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/planet/scene.gltf");
