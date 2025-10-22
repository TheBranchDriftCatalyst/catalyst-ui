/**
 * DesktopPCModel - 3D Desktop Computer Visualizer
 *
 * Loads and renders a GLTF model of a desktop PC with responsive scaling,
 * three-point lighting, and orbit controls.
 */

import React from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";

export interface DesktopPCModelProps {
  /** Scale multiplier (default: 0.75 desktop, 0.7 mobile) */
  scale?: number;
  /** Position [x, y, z] (default: [0, -3.25, -1.5] desktop) */
  position?: [number, number, number];
  /** Rotation [x, y, z] in radians (default: [-0.01, -0.2, -0.1]) */
  rotation?: [number, number, number];
  /** Enable orbit controls (default: true) */
  enableControls?: boolean;
  /** Is mobile viewport (auto-adjusts scale and position) */
  isMobile?: boolean;
}

/**
 * Desktop PC 3D Model Component
 *
 * Renders a detailed desktop computer model with realistic lighting.
 * Automatically adjusts for mobile viewports.
 *
 * @example
 * ```tsx
 * <ThreeCanvas camera={{ position: [20, 3, 5], fov: 25 }}>
 *   <DesktopPCModel />
 * </ThreeCanvas>
 * ```
 */
export function DesktopPCModel({
  scale: customScale,
  position: customPosition,
  rotation = [-0.01, -0.2, -0.1],
  enableControls = true,
  isMobile = false,
}: DesktopPCModelProps) {
  const computer = useGLTF("/models/desktop_pc/scene.gltf");

  // Responsive defaults
  const scale = customScale ?? (isMobile ? 0.7 : 0.75);
  const position = customPosition ?? (isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]);

  return (
    <group>
      {/* Three-point lighting setup */}
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />

      {/* Desktop PC Model */}
      <primitive object={computer.scene} scale={scale} position={position} rotation={rotation} />

      {/* Orbit Controls */}
      {enableControls && (
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/desktop_pc/scene.gltf");
