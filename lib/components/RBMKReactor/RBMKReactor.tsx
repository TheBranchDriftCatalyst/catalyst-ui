/**
 * RBMK Reactor Visualization Component
 *
 * Interactive D3-powered visualization of an RBMK nuclear reactor with:
 * - Grid of uranium fuel atoms emitting neutrons
 * - Control rods that absorb neutrons (raise/lower)
 * - Neutron particles with collision physics
 * - Real-time chain reaction simulation
 *
 * Uses requestAnimationFrame for smooth 60fps physics simulation.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { useCalculatedThemeColors } from "@/catalyst-ui/contexts/Theme";
import { Atom, ControlRod, Neutron, SimulationState, ReactorConfig } from "./types";
import { DEFAULT_REACTOR_CONFIG } from "./config";
import { ReactorCore } from "./ReactorCore";
import { ReactorAutopilot } from "./ReactorAutopilot";
import {
  FRAME_MS,
  getHeatAtPosition,
  getWaterDensityAtPosition,
  getActiveTemperatures,
} from "./physics";

export interface RBMKReactorProps {
  /** Reactor configuration (optional, uses defaults if not provided) */
  config?: ReactorConfig;
  /** Width of the visualization */
  width?: number;
  /** Height of the visualization */
  height?: number;
  /** Callback when simulation state changes */
  onStateChange?: (state: SimulationState) => void;
  /** Control rod target insertions (0-1, where 0 = raised, 1 = lowered) */
  controlRodInsertions?: number[];
  /** Simulation running state (controlled mode) */
  isRunning?: boolean;
  /** Simulation speed multiplier */
  speed?: number;
  /** Recirculation pump throughput 0–1.5; scales coolant regeneration (default 1) */
  pumpPower?: number;
  /**
   * Autopilot engagement. While enabled, the closed-loop controller owns the
   * rods and pumps (manual controlRodInsertions/pumpPower are ignored) and
   * posts its control actions to the event log tagged source:"autopilot".
   */
  autopilot?: { enabled: boolean; targetMW: number };
  /** Enables first-120-frame diagnostic console logging (default false) */
  debug?: boolean;
}

const RBMKReactor: React.FC<RBMKReactorProps> = ({
  config = DEFAULT_REACTOR_CONFIG,
  width = 900,
  height = 700,
  onStateChange,
  controlRodInsertions,
  isRunning: controlledIsRunning,
  speed: controlledSpeed,
  pumpPower = 1,
  autopilot,
  debug = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const heatCanvasRef = useRef<HTMLCanvasElement>(null);
  const neutronLayerRef = useRef<SVGGElement>(null);
  const atomLayerRef = useRef<SVGGElement>(null);
  const rodLayerRef = useRef<SVGGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastStatsUpdateRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);
  const holdPositionRef = useRef<{ x: number; y: number } | null>(null);
  const emissionIntervalRef = useRef<number | null>(null);
  const tooltipLayerRef = useRef<SVGGElement>(null);
  // Hovered fuel atom (id) for the stats tooltip — a ref so the RAF loop reads it without re-renders
  const hoveredAtomIdRef = useRef<string | null>(null);
  // Pinned fuel atom (id) — shift+click keeps a node's tooltip up while hovering elsewhere
  const pinnedAtomIdRef = useRef<string | null>(null);

  // Fixed-timestep accumulator: pending simulation time (ms) not yet consumed by a step
  const accumulatorRef = useRef<number>(0);

  // Autopilot controller (null = disengaged). Lives in a ref so the RAF loop
  // drives it per step without re-renders; engage/disengage happens in an effect.
  const autopilotRef = useRef<ReactorAutopilot | null>(null);

  // Offscreen canvas + ImageData for the smooth thermal-camera heat field (rebuilt if grid dims change)
  const heatOffscreenRef = useRef<HTMLCanvasElement | null>(null);
  const heatImageDataRef = useRef<ImageData | null>(null);
  // 64-entry RGB lookup table sampled from the d3 heat scale (built in the theme effect)
  const heatLUTRef = useRef<Uint8ClampedArray | null>(null);

  // Get theme colors reactively via hook (replaces manual getComputedStyle)
  const themeColors = useCalculatedThemeColors();

  // Cache config and dimensions to avoid recreating animate callback
  const configRef = useRef(config);
  const dimensionsRef = useRef({ width, height });

  // Debug gate for first-120-frame diagnostic logging — ref so the RAF loop sees the latest prop
  const debugRef = useRef(debug);
  useEffect(() => {
    debugRef.current = debug;
  }, [debug]);

  // Pump throughput in a ref so the RAF loop reads the latest prop without re-creating animate
  const pumpPowerRef = useRef(pumpPower);
  useEffect(() => {
    pumpPowerRef.current = pumpPower;
  }, [pumpPower]);

  // D3 color scales - updated reactively when theme changes
  const colorScalesRef = useRef<{
    heat: d3.ScaleLinear<string, string, never>;
    atom: d3.ScaleLinear<string, string, never>;
  } | null>(null);

  // Latest theme colors in a ref so renderWithD3 (which has [] deps) never renders stale colors
  const themeColorsRef = useRef(themeColors);

  // Update color scales (and the colors ref) when theme changes
  useEffect(() => {
    themeColorsRef.current = themeColors;
    colorScalesRef.current = {
      heat: d3.scaleLinear<string>().domain([0, 0.3, 0.6, 1.0]).range([
        themeColors.chart1, // cold - chart blue
        themeColors.chart2, // warming - chart green/teal
        themeColors.chart3, // hot - chart orange
        themeColors.destructive, // very hot - destructive red
      ]),
      atom: d3.scaleLinear<string>().domain([0, 0.3, 0.6, 1.0]).range([
        themeColors.mutedForeground, // low energy - muted
        themeColors.primary, // medium energy - primary blue
        themeColors.accent, // high energy - accent yellow
        themeColors.destructive, // very high energy - destructive red
      ]),
    };

    // Sample the heat scale into a 64-entry RGB LUT for the canvas thermal field
    // (per-cell d3.color() calls would be far too slow across the whole grid every frame)
    const heatScale = colorScalesRef.current.heat;
    const lut = new Uint8ClampedArray(64 * 3);
    for (let i = 0; i < 64; i++) {
      const rgb = d3.color(heatScale(i / 63))!.rgb();
      lut[i * 3] = rgb.r;
      lut[i * 3 + 1] = rgb.g;
      lut[i * 3 + 2] = rgb.b;
    }
    heatLUTRef.current = lut;
  }, [themeColors]);

  // FPS monitoring for performance debugging
  const frameTimesRef = useRef<number[]>([]);
  const lastFpsLogRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Headless simulation core (no React/D3/DOM). useState's lazy initializer builds
  // it exactly once (400 atoms + 2 grids + 15 seed neutrons); its identity is stable
  // across renders, so the RAF loop mutates core state in place without re-renders.
  // Config/dimensions are fixed at construction — the tab remounts (via a key bump)
  // whenever they change, so there is no need to rebuild the core mid-life.
  const [core] = useState(() => new ReactorCore(config, { width, height, seedNeutrons: 15 }));

  // Stats-only state for UI display (throttled updates)
  const [stats, setStats] = useState({
    neutronCount: 0,
    totalFissions: 0,
    totalAbsorbed: 0,
    reactionRate: 0,
    reactorTemp: 0, // Average reactor temperature (0-1)
  });

  // Use controlled props if provided, otherwise fall back to the core's inert defaults
  const isRunning = controlledIsRunning ?? core.isRunning;
  const speed = controlledSpeed ?? core.speed;

  /**
   * Convert mouse coordinates to SVG viewBox coordinates.
   * Uses the screen CTM so the uniform scale + centering offsets introduced by
   * preserveAspectRatio="xMidYMid meet" letterboxing are handled correctly
   * (independent x/y scales would land clicks off-target when aspect ratios differ).
   */
  const getSVGCoordinates = useCallback(
    (event: React.MouseEvent<SVGSVGElement>): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;

      const ctm = svg.getScreenCTM();
      if (!ctm) return null;

      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
      return { x: p.x, y: p.y };
    },
    []
  );

  /**
   * Handle mouse up - stop continuous emission
   */
  const handleMouseUp = useCallback(() => {
    isHoldingRef.current = false;
    holdPositionRef.current = null;

    // Clear emission interval
    if (emissionIntervalRef.current !== null) {
      clearInterval(emissionIntervalRef.current);
      emissionIntervalRef.current = null;
    }
  }, []);

  /**
   * Render using D3 (called directly from RAF loop)
   */
  const renderWithD3 = useCallback(() => {
    if (!neutronLayerRef.current || !atomLayerRef.current || !rodLayerRef.current) return;
    if (!colorScalesRef.current) return; // Wait for colors to be loaded

    const state = core;
    const colors = themeColorsRef.current; // via ref — the [] deps below would otherwise freeze colors at the first theme
    const { width: w, height: h } = dimensionsRef.current;

    // Inner vessel bounds (8% padding) — the physics containment region the grid maps onto
    const vesselPadding = 0.08;
    const vesselLeft = w * vesselPadding;
    const vesselTop = h * vesselPadding;
    const vesselWidth = w * (1 - 2 * vesselPadding);
    const vesselHeight = h * (1 - 2 * vesselPadding);

    // COMBINED HEAT + WATER FIELD (canvas, bilinear-upscaled for a smooth thermal-camera look)
    // Temperature drives color via a sampled LUT; steam voids blend toward white and boost alpha
    // (the positive void coefficient made visible). Drawn beneath the SVG overlay.
    const heatCanvas = heatCanvasRef.current;
    const heatLUT = heatLUTRef.current;
    if (heatCanvas && heatLUT) {
      // Heat grid is double-buffered; getActiveTemperatures returns the currently-active buffer
      const activeTemperatures = getActiveTemperatures(state.heatGrid);
      const { waterDensity } = state.waterGrid;

      if (
        activeTemperatures &&
        activeTemperatures.length > 0 &&
        waterDensity &&
        waterDensity.length > 0
      ) {
        const gridH = Math.min(activeTemperatures.length, waterDensity.length);
        const gridW = Math.min(activeTemperatures[0]?.length ?? 0, waterDensity[0]?.length ?? 0);

        if (gridH > 0 && gridW > 0) {
          // Build/reuse the offscreen buffer sized to the grid (one pixel per cell)
          let off = heatOffscreenRef.current;
          let img = heatImageDataRef.current;
          if (!off || off.width !== gridW || off.height !== gridH || !img) {
            off = document.createElement("canvas");
            off.width = gridW;
            off.height = gridH;
            heatOffscreenRef.current = off;
            img = off.getContext("2d")!.createImageData(gridW, gridH);
            heatImageDataRef.current = img;
          }

          const data = img.data;
          for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
              const temp = activeTemperatures[y]?.[x] ?? 0;
              const water = waterDensity[y]?.[x] ?? 1.0;
              const voidFrac = 1 - water; // Steam percentage
              const li = Math.max(0, Math.min(63, Math.round(temp * 63)));
              let r = heatLUT[li * 3]!;
              let g = heatLUT[li * 3 + 1]!;
              let b = heatLUT[li * 3 + 2]!;
              // Steam voids blend toward white (dangerous positive void coefficient!)
              if (voidFrac > 0.3) {
                const blend = Math.min(voidFrac * 0.7, 0.7);
                r = r + (255 - r) * blend;
                g = g + (255 - g) * blend;
                b = b + (255 - b) * blend;
              }
              const alpha = Math.min(
                Math.max(temp * 0.6, voidFrac > 0.3 ? voidFrac * 0.5 : 0),
                0.7
              );
              const idx = (y * gridW + x) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = alpha * 255;
            }
          }
          off.getContext("2d")!.putImageData(img, 0, 0);

          // Match the backing store to the element's CSS size × devicePixelRatio (cheap per-frame check)
          const cw = heatCanvas.clientWidth;
          const ch = heatCanvas.clientHeight;
          const dpr = window.devicePixelRatio || 1;
          const backingW = Math.max(1, Math.round(cw * dpr));
          const backingH = Math.max(1, Math.round(ch * dpr));
          if (heatCanvas.width !== backingW || heatCanvas.height !== backingH) {
            heatCanvas.width = backingW;
            heatCanvas.height = backingH;
          }

          const ctx = heatCanvas.getContext("2d")!;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, cw, ch);

          // Replicate the SVG's preserveAspectRatio="xMidYMid meet" letterbox so the field
          // lands exactly under the vessel regardless of the container's aspect ratio.
          const fit = Math.min(cw / w, ch / h);
          const offsetX = (cw - w * fit) / 2;
          const offsetY = (ch - h * fit) / 2;
          ctx.imageSmoothingEnabled = true; // bilinear upscale = smooth thermal gradient
          ctx.drawImage(
            off,
            vesselLeft * fit + offsetX,
            vesselTop * fit + offsetY,
            vesselWidth * fit,
            vesselHeight * fit
          );
        }
      }
    }

    // Render neutrons with D3
    const neutronLayer = d3.select(neutronLayerRef.current);
    const neutronGroups = neutronLayer
      .selectAll<SVGGElement, Neutron>("g.neutron")
      .data(state.neutrons, d => d.id);

    // DEBUG: Log D3 neutron rendering for the first 120 frames when the debug prop is enabled
    const shouldDebugLog = debugRef.current && frameCountRef.current <= 120;
    if (shouldDebugLog) {
      console.log(`[RBMK D3 Render] Frame ${frameCountRef.current}:`, {
        neutronsToRender: state.neutrons.length,
        enterSelection: neutronGroups.enter().size(),
        updateSelection: neutronGroups.size(),
        exitSelection: neutronGroups.exit().size(),
        firstNeutronPos: state.neutrons[0]?.position,
      });
    }

    // Enter new neutrons: trail polyline appended first so it renders beneath the particle
    const neutronEnter = neutronGroups.enter().append("g").attr("class", "neutron");

    neutronEnter
      .append("polyline")
      .attr("class", "trail")
      .attr("fill", "none")
      .attr("stroke", "var(--primary)")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1);

    neutronEnter
      .append("circle")
      .attr("class", "particle")
      .attr("fill", "url(#neutron-gradient)")
      .attr("stroke", "var(--primary-foreground)")
      .attr("stroke-width", 0.5);

    // Update trail paths and particle positions
    const neutronMerged = neutronGroups.merge(neutronEnter);

    neutronMerged
      .select<SVGPolylineElement>("polyline.trail")
      .attr("points", (d: Neutron) => d.trail.map(p => `${p.x},${p.y}`).join(" "));

    // Radius/opacity track moderation: fast neutrons (moderation→0) render smaller and dimmer,
    // thermal neutrons (moderation→1) full-size and bright. Set in merge so live moderation shows.
    neutronMerged
      .select<SVGCircleElement>("circle.particle")
      .attr("cx", (d: Neutron) => d.position.x)
      .attr("cy", (d: Neutron) => d.position.y)
      .attr("r", (d: Neutron) => d.radius * (0.7 + 0.3 * (d.moderation ?? 1)))
      .attr("opacity", (d: Neutron) => 0.6 + 0.35 * (d.moderation ?? 1));

    // Remove old neutrons
    neutronGroups.exit().remove();

    // Render atoms with D3
    const atomLayer = d3.select(atomLayerRef.current);

    // Use cached atom color scale (created once on mount)
    const atomColor = colorScalesRef.current.atom;

    const atoms = atomLayer
      .selectAll<SVGCircleElement, Atom>("circle.atom")
      .data(state.atoms, (d: Atom) => d.id);

    atoms
      .enter()
      .append("circle")
      .attr("class", "atom")
      .attr("r", (d: Atom) => d.radius)
      .attr("stroke-width", 1.5)
      .merge(atoms)
      .attr("cx", (d: Atom) => d.position.x)
      .attr("cy", (d: Atom) => d.position.y)
      .attr("r", (d: Atom) => d.radius * (1 + d.energy * 0.15)) // Pulse size with energy
      .attr("fill", (d: Atom) => atomColor(d.energy))
      .attr("stroke", (d: Atom) =>
        d.id === hoveredAtomIdRef.current || d.id === pinnedAtomIdRef.current
          ? colors.accent // Hover/pin highlight
          : d.energy > 0.6
            ? colors.accent
            : colors.primary
      )
      .attr("stroke-width", (d: Atom) =>
        d.id === hoveredAtomIdRef.current || d.id === pinnedAtomIdRef.current
          ? 3
          : d.energy > 0.8
            ? 3
            : 1.5
      )
      .attr("opacity", (d: Atom) => 0.7 + d.energy * 0.3)
      .attr("filter", (d: Atom) => {
        if (d.energy > 0.85) return "url(#atom-critical-glow)"; // Intense glow when critical
        if (d.energy > 0.6) return "url(#atom-glow)"; // Normal glow when hot
        return null;
      });

    // Render control rods with D3
    const rodLayer = d3.select(rodLayerRef.current);
    const rods = rodLayer
      .selectAll<SVGLineElement, ControlRod>("line.rod")
      .data(state.controlRods, (d: ControlRod) => d.id);

    rods
      .enter()
      .append("line")
      .attr("class", "rod")
      .attr("stroke-linecap", "round")
      .merge(rods)
      .attr("x1", (d: ControlRod) => d.x)
      .attr("y1", (d: ControlRod) => d.y)
      .attr("x2", (d: ControlRod) => d.x)
      .attr("y2", (d: ControlRod) => d.y + d.maxHeight * d.insertion)
      .attr("stroke", (d: ControlRod) =>
        d.isAbsorbing ? "var(--primary)" : "var(--muted-foreground)"
      )
      .attr("stroke-width", (d: ControlRod) => (d.isAbsorbing ? 4 : 2))
      .attr("opacity", (d: ControlRod) => (d.isAbsorbing ? 0.9 : 0.7));

    // STATS TOOLTIPS — live per-node stats for the pinned and/or hovered fuel atoms.
    // Drawn every render so values track the simulation frame-by-frame. A shift+click pin
    // stays up while the pointer roams; the hovered node is shown alongside it (deduped when
    // hover and pin land on the same node). The keyed join renders one tooltip <g> per datum.
    if (tooltipLayerRef.current) {
      const tooltipLayer = d3.select(tooltipLayerRef.current);
      const pinnedAtom = pinnedAtomIdRef.current
        ? (state.atoms.find(a => a.id === pinnedAtomIdRef.current) ?? null)
        : null;
      const hoveredAtom = hoveredAtomIdRef.current
        ? (state.atoms.find(a => a.id === hoveredAtomIdRef.current) ?? null)
        : null;

      const tipData: Atom[] = [];
      if (pinnedAtom) tipData.push(pinnedAtom);
      if (hoveredAtom && hoveredAtom.id !== pinnedAtom?.id) tipData.push(hoveredAtom);

      const TIP_W = 172;
      const TIP_H = 122;
      const LINE_H = 15;
      const PAD = 10;

      const tip = tooltipLayer
        .selectAll<SVGGElement, Atom>("g.atom-tooltip")
        .data(tipData, (d: Atom) => d.id);

      tip.exit().remove();

      const tipEnter = tip.enter().append("g").attr("class", "atom-tooltip");

      tipEnter
        .append("rect")
        .attr("class", "tip-bg")
        .attr("width", TIP_W)
        .attr("height", TIP_H)
        .attr("rx", 6)
        .attr("fill", "var(--background)")
        .attr("fill-opacity", 0.92)
        .attr("stroke", "var(--border)")
        .attr("stroke-width", 1);

      tipEnter
        .append("text")
        .attr("class", "tip-title")
        .attr("x", PAD)
        .attr("y", PAD + 8)
        .attr("fill", "var(--primary)")
        .attr("font-size", 11)
        .attr("font-weight", "bold")
        .attr("font-family", "monospace");

      for (let i = 0; i < 6; i++) {
        tipEnter
          .append("text")
          .attr("class", `tip-line-${i}`)
          .attr("x", PAD)
          .attr("y", PAD + 8 + LINE_H * (i + 1))
          .attr("fill", "var(--foreground)")
          .attr("font-size", 10.5)
          .attr("font-family", "monospace");
      }

      const tipMerged = tip.merge(tipEnter);

      tipMerged.attr("transform", (d: Atom) => {
        // Offset beside the atom; flip when near the right edge, clamp vertically
        let tx = d.position.x + 16;
        if (tx + TIP_W > w - 8) tx = d.position.x - TIP_W - 16;
        let ty = d.position.y - TIP_H / 2;
        ty = Math.max(8, Math.min(ty, h - TIP_H - 8));
        return `translate(${tx},${ty})`;
      });

      tipMerged
        .select("text.tip-title")
        .text(
          (d: Atom) =>
            `${d.id === pinnedAtomIdRef.current ? "[PINNED] " : ""}FUEL NODE [${d.gridX},${d.gridY}]`
        );

      tipMerged.each((d: Atom, i, nodes) => {
        const g = d3.select(nodes[i]!);
        const localTemp = getHeatAtPosition(
          state.heatGrid,
          d.position.x,
          d.position.y,
          vesselLeft,
          vesselTop
        );
        const localWater = getWaterDensityAtPosition(
          state.waterGrid,
          d.position.x,
          d.position.y,
          vesselLeft,
          vesselTop
        );
        const lines = [
          `Energy     ${(d.energy * 100).toFixed(0)}%`,
          `Integrity  ${(d.integrity * 100).toFixed(1)}%`,
          `Xenon-135  ${((d.xenonLevel || 0) * 100).toFixed(1)}%`,
          `Local temp ${(localTemp * 100).toFixed(0)}%`,
          `Water      ${(localWater * 100).toFixed(0)}% (void ${((1 - localWater) * 100).toFixed(0)}%)`,
          `Emitted    ${d.emittedCount} neutrons`,
        ];
        lines.forEach((text, li) => {
          g.select(`text.tip-line-${li}`).text(text);
        });
      });
    }
  }, [core]); // reads core simulation state (stable identity) + refs

  /**
   * Create energized neutrons at a position (click/hold interaction).
   * Defined after renderWithD3 so it can render the new neutrons immediately —
   * otherwise they would stay invisible until the next RAF frame (i.e. never, while paused).
   */
  const createEnergizedNeutrons = useCallback(
    (x: number, y: number, count: number = 3) => {
      core.injectNeutrons(x, y, count);
      // Render immediately so manual neutrons appear even while the simulation is paused
      renderWithD3();
    },
    [core, renderWithD3]
  );

  /**
   * Hit-test the nearest fuel atom within the pick radius of a point.
   * Shared by hover tracking and shift+click pinning.
   */
  const pickAtomId = useCallback(
    (x: number, y: number): string | null => {
      const pickRadius = configRef.current.atom.radius + 6;
      let nearestId: string | null = null;
      let bestDistSq = pickRadius * pickRadius;
      for (const atom of core.atoms) {
        const dx = atom.position.x - x;
        const dy = atom.position.y - y;
        const distSq = dx * dx + dy * dy;
        if (distSq <= bestDistSq) {
          bestDistSq = distSq;
          nearestId = atom.id;
        }
      }
      return nearestId;
    },
    [core]
  );

  /**
   * Handle mouse down - shift+click pins/unpins a fuel node's stats tooltip;
   * a plain click starts continuous particle emission.
   */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const coords = getSVGCoordinates(event);
      if (!coords) return;

      // Shift+click: toggle the pinned inspector on the nearest node — never emits neutrons
      if (event.shiftKey) {
        const id = pickAtomId(coords.x, coords.y);
        if (id) {
          pinnedAtomIdRef.current = pinnedAtomIdRef.current === id ? null : id;
          // While paused there is no RAF loop — repaint so the pin appears/clears immediately
          if (animationFrameRef.current === null) renderWithD3();
        }
        return;
      }

      isHoldingRef.current = true;
      holdPositionRef.current = coords;

      // Immediate burst on initial click
      createEnergizedNeutrons(coords.x, coords.y, 5);

      // Start continuous emission interval (emit every 100ms while holding)
      emissionIntervalRef.current = window.setInterval(() => {
        if (isHoldingRef.current && holdPositionRef.current) {
          createEnergizedNeutrons(holdPositionRef.current.x, holdPositionRef.current.y, 3);
        }
      }, 100);
    },
    [getSVGCoordinates, createEnergizedNeutrons, pickAtomId, renderWithD3]
  );

  /**
   * Handle mouse move - update emission position while holding, and hit-test
   * fuel atoms for the hover stats tooltip. Defined below renderWithD3 so the
   * tooltip can repaint immediately while the simulation is paused.
   */
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const coords = getSVGCoordinates(event);
      if (!coords) return;

      // Update emission position (particles will be emitted here by interval)
      if (isHoldingRef.current) {
        holdPositionRef.current = coords;
      }

      // Hover hit-test: nearest fuel atom within pick radius
      const nearestId = pickAtomId(coords.x, coords.y);

      if (nearestId !== hoveredAtomIdRef.current) {
        hoveredAtomIdRef.current = nearestId;
        // While paused there is no RAF loop — repaint so the tooltip appears/moves
        if (animationFrameRef.current === null) renderWithD3();
      }
    },
    [getSVGCoordinates, pickAtomId, renderWithD3]
  );

  /**
   * Handle mouse leave - stop emission and dismiss the hover tooltip
   */
  const handleMouseLeave = useCallback(() => {
    handleMouseUp();
    if (hoveredAtomIdRef.current !== null) {
      hoveredAtomIdRef.current = null;
      if (animationFrameRef.current === null) renderWithD3();
    }
  }, [handleMouseUp, renderWithD3]);

  /**
   * Animation loop using RAF - updates refs and calls D3 directly (no React state updates).
   *
   * FIXED-TIMESTEP ACCUMULATOR: physics always advances in whole FRAME_MS reference frames,
   * decoupled from the (variable) RAF cadence. Real elapsed time (clamped, speed-scaled) is
   * banked in accumulatorRef and drained in FRAME_MS chunks. This makes the simulation
   * deterministic and frame-rate independent — dropped frames or high speed multipliers run
   * more steps rather than mutating dt. Rendering happens once per RAF regardless of step count.
   * NOTE: Don't check isRunning here - the useEffect controls loop start/stop
   */
  const animate = useCallback(() => {
    frameCountRef.current += 1;
    const currentTime = performance.now();
    const realFrameDelta = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    // DEBUG: diagnostic logging for the first 120 frames, gated behind the debug prop
    const shouldDebugLog = debugRef.current && frameCountRef.current <= 120;

    // FPS monitoring — track real (unclamped, unscaled) frame times so reported FPS
    // stays accurate regardless of the speed multiplier
    frameTimesRef.current.push(realFrameDelta);
    if (frameTimesRef.current.length > 60) {
      // Calculate average FPS over last 60 frames
      const totalTime = frameTimesRef.current.reduce((a, b) => a + b, 0);
      const avgFrameTime = totalTime / frameTimesRef.current.length;
      const fps = 1000 / avgFrameTime;

      // Log warning if FPS drops below 30 (every 5 seconds max)
      if (fps < 30 && currentTime - lastFpsLogRef.current > 5000) {
        console.warn(
          `[RBMK] Low FPS detected: ${fps.toFixed(1)} fps (avg frame time: ${avgFrameTime.toFixed(2)}ms)`
        );
        lastFpsLogRef.current = currentTime;
      }

      // Reset for next measurement window
      frameTimesRef.current = [];
    }

    // FIXED-TIMESTEP DRAIN: bank clamped, speed-scaled real time and consume it in whole frames.
    // The per-frame clamp (50ms) stops a background-tab gap from teleporting/mass-expiring neutrons.
    // All simulation stepping — physics AND rising-edge alarm events — now lives in the headless
    // core; this loop only drains the accumulator and (optionally) logs the per-step StepStats.
    accumulatorRef.current += Math.min(realFrameDelta, 50) * speed;
    let steps = 0;
    while (accumulatorRef.current >= FRAME_MS && steps < 5) {
      // While the autopilot is engaged it owns the pump command; otherwise the
      // operator's pump slider does
      const autopilot = autopilotRef.current;
      const effectivePump = autopilot ? autopilot.pumpCommand : pumpPowerRef.current;
      const stats = core.step(FRAME_MS, currentTime, effectivePump);

      // Autopilot control pass (acts on its own 500ms cadence internally)
      if (autopilot) autopilot.update(core, FRAME_MS, currentTime);

      // DEBUG: per-step diagnostics for the first 120 frames, gated behind the debug prop.
      // The core stays silent; it returns StepStats so all logging lives here in the component.
      if (shouldDebugLog) {
        console.log(`[RBMK Step] Frame ${frameCountRef.current}:`, {
          neutronCount: stats.neutronCount,
          emitted: stats.emitted,
          fissions: stats.fissions,
          rodAbsorbed: stats.rodAbsorbed,
          waterAbsorbed: stats.waterAbsorbed,
          leaked: stats.leaked,
          substeps: stats.substeps,
          removedByAge: stats.removedByAge,
          maxEnergy: Math.max(...core.atoms.map(a => a.energy)).toFixed(2),
          avgEnergy: (core.atoms.reduce((sum, a) => sum + a.energy, 0) / core.atoms.length).toFixed(
            2
          ),
        });
      }

      accumulatorRef.current -= FRAME_MS;
      steps++;
    }
    // Spiral-of-death guard: if we hit the step cap with time still owed, drop the backlog
    // (fall behind real time rather than accumulate an ever-growing debt).
    if (accumulatorRef.current >= FRAME_MS) accumulatorRef.current = FRAME_MS;

    // Render once per RAF (after all steps), even on zero-step frames at low speed
    renderWithD3();

    // Throttled stats update for UI (only every 200ms to avoid thrashing)
    if (currentTime - lastStatsUpdateRef.current > 200) {
      setStats({
        neutronCount: core.neutrons.length,
        totalFissions: core.totals.fissions,
        totalAbsorbed: core.totals.rodAbsorbed,
        reactionRate: core.reactionRate,
        reactorTemp: core.reactorTemp,
      });
      lastStatsUpdateRef.current = currentTime;
    }

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [speed, core, renderWithD3]); // config/dimensions fixed at construction; isRunning controlled by useEffect

  /**
   * Start/stop animation loop
   */
  useEffect(() => {
    if (isRunning) {
      lastFrameTimeRef.current = performance.now();
      accumulatorRef.current = 0; // Discard time banked while paused (avoids a burst of catch-up steps)
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Cleanup emission interval on unmount
      if (emissionIntervalRef.current !== null) {
        clearInterval(emissionIntervalRef.current);
        emissionIntervalRef.current = null;
      }
    };
  }, [isRunning, animate]);

  /**
   * Notify parent of stats changes
   */
  useEffect(() => {
    if (onStateChange) {
      // Send simulation state with stats
      // Same SimulationState shape as before; live values now read from the core,
      // throttled counters still from the `stats` React state (updated every ~200ms).
      onStateChange({
        atoms: core.atoms,
        controlRods: core.controlRods,
        neutrons: core.neutrons, // Send neutrons for length calculation
        heatGrid: core.heatGrid,
        waterGrid: core.waterGrid,
        isRunning: core.isRunning,
        speed: core.speed,
        totalEmitted: core.totals.emitted, // stats has no totalEmitted; read the live sim value
        totalAbsorbed: stats.totalAbsorbed, // Use throttled stats values
        totalFissions: stats.totalFissions,
        totalWaterAbsorbed: core.totals.waterAbsorbed,
        totalLeaked: core.totals.leaked, // Neutrons leaked through containment
        reactionRate: stats.reactionRate,
        reactorTemp: stats.reactorTemp, // Average reactor temperature
        voidFraction: core.voidFraction,
        reactorPressure: core.reactorPressure, // Reactor pressure (0-1)
        xenonLevel: core.xenonLevel, // Xenon-135 poisoning level
        powerOutputMW: core.powerOutputMW, // Thermal power output (derived)
        events: core.events, // Event/alarm log
        lastFrameTime: core.lastFrameTime,
        animationFrameId: null, // RAF id is tracked in animationFrameRef, not sim state
      });
    }
  }, [stats, onStateChange, core]);

  /**
   * Update cached refs when config or dimensions change
   */
  useEffect(() => {
    configRef.current = config;
    dimensionsRef.current = { width, height };
  }, [config, width, height]);

  /**
   * Initial D3 render on mount
   */
  useEffect(() => {
    renderWithD3();
  }, [renderWithD3]);

  /**
   * Update control rod target insertions from external control (delegates to the core).
   * Suppressed while the autopilot is engaged — the autopilot owns the rods, and the
   * tab's slider state would otherwise fight it on every render.
   */
  useEffect(() => {
    if (autopilotRef.current) return;
    if (controlRodInsertions && controlRodInsertions.length > 0) {
      core.setRodTargets(controlRodInsertions);
    }
  }, [controlRodInsertions, core]);

  /**
   * Engage/disengage the autopilot and track its target. The controller instance
   * lives in a ref so the RAF loop drives it without re-renders; engage/disengage
   * transitions are posted to the operator log.
   */
  useEffect(() => {
    const enabled = autopilot?.enabled ?? false;
    const targetMW = autopilot?.targetMW ?? 800;

    if (enabled && !autopilotRef.current) {
      autopilotRef.current = new ReactorAutopilot(targetMW);
      core.postEvent(
        performance.now(),
        "info",
        `AUTO: autopilot engaged — target ${Math.round(targetMW)}MW`,
        "autopilot"
      );
    } else if (!enabled && autopilotRef.current) {
      autopilotRef.current = null;
      core.postEvent(performance.now(), "info", "AUTO: autopilot disengaged", "autopilot");
    } else if (enabled && autopilotRef.current && autopilotRef.current.targetMW !== targetMW) {
      autopilotRef.current.targetMW = targetMW;
      core.postEvent(
        performance.now(),
        "info",
        `AUTO: target changed to ${Math.round(targetMW)}MW`,
        "autopilot"
      );
    }
  }, [autopilot?.enabled, autopilot?.targetMW, core]);

  return (
    // Wrapper carries the background/border; the canvas thermal field sits beneath the SVG overlay.
    <div className="relative w-full h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Canvas heat field - drawn by renderWithD3, letterboxed to match the SVG viewBox */}
      <canvas ref={heatCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="relative w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: "contents" }}
      >
        {/* Definitions */}
        <defs>
          {/* Atom glow filter */}
          <filter id="atom-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow for critical atoms */}
          <filter id="atom-critical-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Rod absorption glow */}
          <filter id="rod-absorption" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Neutron particle gradient - radial falloff used as the neutron circle fill */}
          <radialGradient id="neutron-gradient">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Containment Vessel - Outer concrete shell */}
        <rect
          x={width * 0.05}
          y={height * 0.05}
          width={width * 0.9}
          height={height * 0.9}
          fill="var(--muted)"
          fillOpacity={0.05}
          stroke="var(--border)"
          strokeWidth={6}
          rx={20}
          opacity={0.5}
        />

        {/* Inner containment vessel - actual neutron reflector */}
        <rect
          x={width * 0.08}
          y={height * 0.08}
          width={width * 0.84}
          height={height * 0.84}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={3}
          rx={15}
          opacity={0.4}
        />

        {/* Vessel label */}
        <text
          x={width * 0.5}
          y={height * 0.04}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize={12}
          opacity={0.6}
        >
          CONTAINMENT VESSEL
        </text>

        {/* Control Rods - D3 managed */}
        <g ref={rodLayerRef} className="rods-layer" />

        {/* Fuel Atoms - D3 managed */}
        <g ref={atomLayerRef} className="atoms-layer" />

        {/* Neutrons - D3 managed */}
        <g ref={neutronLayerRef} className="neutrons-layer" />

        {/* Hover/pin stats tooltip - D3 managed (topmost, never intercepts mouse) */}
        <g ref={tooltipLayerRef} className="tooltip-layer" style={{ pointerEvents: "none" }} />
      </svg>
    </div>
  );
};

export default RBMKReactor;
