/**
 * DossierHeroBackdrop — ambient WebGL backdrop for a "dossier" / profile hero.
 *
 * A self-contained <Canvas> (drop it into any position:relative container and
 * it fills it) rendering a slow, domain-warped fbm-noise field tinted to a
 * single theme color, with additive blending so it reads as a faint glow over
 * a dark surface rather than a solid panel. No drei / no maath — just
 * @react-three/fiber + three, to keep the consuming app's dependency surface
 * minimal (three + @react-three/fiber only).
 *
 * Intended usage: lazy-loaded behind a hero title, gated by the consumer on
 * WebGL capability + prefers-reduced-motion (this component assumes it should
 * animate once mounted).
 *
 * @example
 * ```tsx
 * <header style={{ position: "relative" }}>
 *   <DossierHeroBackdrop color="#f272c8" intensity={0.9} />
 *   <h1>PANDAX</h1>
 * </header>
 * ```
 */
import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface DossierHeroBackdropProps {
  /** CSS color the field is tinted with (rgb()/hex; default synthwave pink). */
  color?: string;
  /** Overall strength multiplier, 0..1+ (default 1). */
  intensity?: number;
  /** Flow speed multiplier (default 1). */
  speed?: number;
  /** className forwarded to the <Canvas> element. */
  className?: string;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // Fullscreen clip-space quad — ignore camera matrices entirely so the
    // plane always covers the viewport regardless of camera setup.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform vec2 uAspect;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Correct for aspect so the flow isn't stretched on wide viewports.
    vec2 uv = (vUv - 0.5) * uAspect + 0.5;
    float t = uTime * 0.03;

    // Domain-warped fbm for an organic, slowly-flowing field.
    vec2 q = vec2(fbm(uv * 3.0 + t), fbm(uv * 3.0 - t + 5.2));
    float f = fbm(uv * 3.5 + q * 1.5 + t);

    float energy = smoothstep(0.35, 0.92, f);
    // Vignette: fade to nothing at the edges so the layer bleeds off cleanly.
    float vig = smoothstep(1.15, 0.15, length(vUv - 0.5) * 1.6);

    float alpha = energy * 0.28 * vig * uIntensity;
    vec3 col = uColor * (0.55 + 0.9 * energy);
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.4));
  }
`;

function Field({
  color,
  intensity,
  speed,
}: Required<Pick<DossierHeroBackdropProps, "color" | "intensity" | "speed">>) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uColor: { value: new THREE.Color(color) },
      uAspect: { value: new THREE.Vector2(1, 1) },
    }),
    // Created once; live values are pushed in useFrame so prop changes
    // (theme swap) don't rebuild the material.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(state => {
    uniforms.uTime.value = state.clock.elapsedTime * speed;
    uniforms.uIntensity.value = intensity;
    uniforms.uColor.value.set(color);
    const w = state.size.width;
    const h = state.size.height;
    // Aspect vector keeps the noise cells roughly square.
    uniforms.uAspect.value.set(Math.max(1, w / h), Math.max(1, h / w));
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function DossierHeroBackdrop({
  color = "#f272c8",
  intensity = 1,
  speed = 1,
  className,
}: DossierHeroBackdropProps) {
  return (
    <Canvas
      className={className}
      orthographic
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Field color={color} intensity={intensity} speed={speed} />
    </Canvas>
  );
}

export default DossierHeroBackdrop;
