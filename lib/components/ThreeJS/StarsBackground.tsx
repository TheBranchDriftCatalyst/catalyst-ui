/**
 * StarsBackground - Animated Particle Starfield
 *
 * Creates a rotating field of 5000 particles distributed in a sphere,
 * styled with synthwave pink/magenta color.
 */

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
import type * as THREE from "three";

export interface StarsBackgroundProps {
  /** Number of star particles (default: 5000) */
  count?: number;
  /** Star color (default: #f272c8 - synthwave pink) */
  color?: string;
  /** Star size (default: 0.002) */
  size?: number;
  /** Sphere radius for distribution (default: 1.2) */
  radius?: number;
}

/**
 * StarsBackground Component
 *
 * Renders an animated particle field that slowly rotates.
 * Works great as a background layer behind other 3D models.
 *
 * @example
 * ```tsx
 * <ThreeCanvas camera={{ position: [0, 0, 1] }}>
 *   <StarsBackground />
 *   <YourModel />
 * </ThreeCanvas>
 * ```
 */
export function StarsBackground({
  count = 5000,
  color = "#f272c8",
  size = 0.002,
  radius = 1.2,
}: StarsBackgroundProps) {
  const ref = useRef<THREE.Points>(null);

  // Generate random positions in a sphere
  const sphere = new Float32Array(count * 3);
  random.inSphere(sphere, { radius });

  // Rotate stars slowly for ambient motion
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial transparent color={color} size={size} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}
