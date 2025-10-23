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
      {/* Overhead directional lighting setup */}
      <hemisphereLight intensity={0.5} groundColor="black" />

      {/* Main directional light from above - simulates ceiling lighting */}
      <directionalLight position={[0, 10, 0]} intensity={2} color="#ffffff" />

      {/* Directional fill lights from sides for depth */}
      <directionalLight position={[5, 8, 5]} intensity={1} color="#00fcd6" />
      <directionalLight position={[-5, 8, -5]} intensity={0.8} color="#bd00ff" />

      {/* Soft spotlight from front for model visibility */}
      <spotLight
        position={[0, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Desktop PC Model */}
      <primitive object={computer.scene} scale={scale} position={position} rotation={rotation} />

      {/* Orbit Controls - Fully rotatable */}
      {enableControls && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          maxDistance={30}
          minDistance={10}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/desktop_pc/scene.gltf");
