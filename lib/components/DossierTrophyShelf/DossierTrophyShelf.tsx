/**
 * DossierTrophyShelf — award medallions as glossy 3D coins on a tilting shelf.
 *
 * Each item becomes a metallic coin with its glyph + label baked onto the
 * face (procedural canvas texture — no font/asset loading, no drei). Coins
 * fan out along a shallow arc, bob + spin gently, and the whole shelf tilts
 * toward the pointer. Self-contained <Canvas>; drop it into a positioned box.
 *
 * Pure @react-three/fiber + three, so the consuming app only needs those two.
 * Consumers should lazy-load it and gate on WebGL + prefers-reduced-motion.
 *
 * @example
 * <DossierTrophyShelf items={[{ id:"night-watch", glyph:"★", label:"NIGHT WATCH", color:"#f5a623" }]} />
 */
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

export interface TrophyItem {
  id: string;
  label: string;
  glyph?: string;
  /** Base metal tint (hex/rgb). Defaults to a warm gold. */
  color?: string;
}

export interface DossierTrophyShelfProps {
  items: TrophyItem[];
  /** Accent used for rim light + fallback tint. */
  accent?: string;
  className?: string;
}

const GOLD = "#e8b23a";

// Bake glyph (large) + label (small, wrapped) onto a transparent canvas that
// becomes the coin's face texture.
function makeFaceTexture(item: TrophyItem): THREE.Texture {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);

  // Faint engraved ring.
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 20, 0, Math.PI * 2);
  ctx.stroke();

  // Glyph.
  ctx.fillStyle = "rgba(20,12,4,0.92)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "130px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', serif";
  ctx.fillText(item.glyph || "★", S / 2, S / 2 - 22);

  // Label (uppercase, wrapped to 2 lines).
  ctx.font = "700 22px ui-monospace, 'JetBrains Mono', monospace";
  const words = (item.label || "").toUpperCase().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > S - 48 && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 2);
  shown.forEach((ln, i) => ctx.fillText(ln, S / 2, S / 2 + 74 + i * 26));

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural studio environment so the metal actually reflects something
// (metalness needs an env map or it renders near-black). A tiny vertical
// gradient equirect → PMREM. No HDR fetch, no drei.
function StudioEnv() {
  const { scene, gl } = useThree();
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, "#33333d");
    g.addColorStop(0.5, "#0b0b10");
    g.addColorStop(1, "#1c0b13");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    tex.dispose();
    pmrem.dispose();
  }, [scene, gl]);
  return null;
}

function Coin({
  item,
  index,
  count,
  scrollRef,
  spacing,
}: {
  item: TrophyItem;
  index: number;
  count: number;
  scrollRef: { current: number };
  spacing: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const faceTex = useMemo(() => makeFaceTexture(item), [item.id]);
  const metal = useMemo(() => new THREE.Color(item.color || GOLD), [item.color]);

  const totalW = count * spacing;
  const baseX = (index - (count - 1) / 2) * spacing; // centered
  const phase = index * 0.9;

  useFrame(state => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Marquee: wrap the coin's x into a window centered on 0 so the row
    // scrolls seamlessly regardless of how many awards there are — no arc,
    // no sag, no overlap.
    let x = (baseX - scrollRef.current) % totalW;
    if (x < -totalW / 2) x += totalW;
    if (x >= totalW / 2) x -= totalW;
    g.position.x = x;
    g.position.y = Math.sin(t * 1.1 + phase) * 0.05;
    // Gentle wobble so the metal catches the light; no full spin.
    g.rotation.y = Math.sin(t * 0.5 + phase) * 0.3;
  });

  return (
    <group ref={ref}>
      {/* Coin body — cylinder rotated so faces point at the camera (+Z). */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
        <meshStandardMaterial
          color={metal}
          metalness={0.85}
          roughness={0.32}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* Face plate carrying the glyph/label, just proud of the front face.
          Low metalness so the engraving stays legible. */}
      <mesh position={[0, 0, 0.061]}>
        <circleGeometry args={[0.6, 48]} />
        <meshStandardMaterial
          color={metal}
          metalness={0.35}
          roughness={0.45}
          map={faceTex}
          transparent
        />
      </mesh>
    </group>
  );
}

function Shelf({ items }: { items: TrophyItem[] }) {
  const group = useRef<THREE.Group>(null);
  const scroll = useRef(0);
  const paused = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const { camera, size } = useThree();
  const spacing = 1.5;

  // Only auto-scroll when the row is wider than the viewport; otherwise the
  // coins all fit and a static centered row reads better (nothing pops across
  // an empty gap). viewW = visible world width at the coin plane (z=0).
  const cam = camera as THREE.PerspectiveCamera;
  const viewW =
    2 *
    cam.position.z *
    Math.tan((cam.fov * Math.PI) / 360) *
    (size.width / Math.max(size.height, 1));
  const totalW = items.length * spacing;
  const speed = totalW > viewW * 0.92 ? 0.85 : 0; // units / second

  useFrame((_, delta) => {
    if (!paused.current) scroll.current += delta * speed;
    const g = group.current;
    if (!g) return;
    // Ease toward the pointer-driven tilt target.
    g.rotation.x += (target.current.y - g.rotation.x) * 0.06;
    g.rotation.y += (target.current.x - g.rotation.y) * 0.06;
  });

  const onEnter = () => {
    paused.current = true;
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    target.current.x = e.pointer.x * 0.22;
    target.current.y = -e.pointer.y * 0.14;
  };
  const onLeave = () => {
    paused.current = false;
    target.current.x = 0;
    target.current.y = 0;
  };

  return (
    <group ref={group}>
      {/* Invisible catcher plane so the pointer anywhere over the canvas
          pauses the drift + drives the tilt. */}
      <mesh
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        position={[0, 0, -0.5]}
      >
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {items.map((it, i) => (
        <Coin
          key={it.id}
          item={it}
          index={i}
          count={items.length}
          scrollRef={scroll}
          spacing={spacing}
        />
      ))}
    </group>
  );
}

export function DossierTrophyShelf({
  items,
  accent = "#ff4d6d",
  className,
}: DossierTrophyShelfProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 6.6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <StudioEnv />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-4, 1, 3]} intensity={0.9} color={accent} />
      <pointLight position={[4, -2, 2]} intensity={0.5} color="#7dd3fc" />
      <Shelf items={items} />
    </Canvas>
  );
}

export default DossierTrophyShelf;
