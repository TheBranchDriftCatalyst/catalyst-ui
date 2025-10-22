/**
 * FloatingBall - Texture-Mapped Floating Sphere
 *
 * Creates a floating icosahedron with dynamic texture mapping,
 * perfect for displaying technology icons or logos.
 */

import React from "react";
import { Decal, Float, useTexture } from "@react-three/drei";

export interface FloatingBallProps {
  /** Image URL for texture */
  icon: string;
  /** Floating speed (default: 1.75) */
  floatSpeed?: number;
  /** Rotation intensity (default: 1) */
  rotationIntensity?: number;
  /** Float intensity (default: 2) */
  floatIntensity?: number;
  /** Scale multiplier (default: 2.75) */
  scale?: number;
}

/**
 * FloatingBall Component
 *
 * Renders a floating sphere with a texture decal.
 * Use for tech stack icons, brand logos, or decorative elements.
 *
 * @example
 * ```tsx
 * <ThreeCanvas>
 *   <ambientLight intensity={0.25} />
 *   <directionalLight position={[0, 0, 0.05]} />
 *   <FloatingBall icon="/icons/react.png" />
 * </ThreeCanvas>
 * ```
 */
export function FloatingBall({
  icon,
  floatSpeed = 1.75,
  rotationIntensity = 1,
  floatIntensity = 2,
  scale = 2.75,
}: FloatingBallProps) {
  const [decalTexture] = useTexture([icon]);

  return (
    <Float speed={floatSpeed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />

      <mesh castShadow receiveShadow scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decalTexture}
          flatShading
        />
      </mesh>
    </Float>
  );
}
