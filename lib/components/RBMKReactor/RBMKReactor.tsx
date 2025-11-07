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
import {
  updateNeutronPosition,
  updateAtom,
  updateControlRod,
  processCollisions,
  calculateReactionRate,
  createHeatGrid,
  createWaterGrid,
  updateHeatGrid,
  updateCoolingAndWater,
  getHeatAtPosition,
  calculateAverageTemperature,
  calculateVoidFraction,
  calculatePressure,
  updateFuelIntegrity,
  updateControlRodHealth,
  calculateAverageXenon,
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
}

const RBMKReactor: React.FC<RBMKReactorProps> = ({
  config = DEFAULT_REACTOR_CONFIG,
  width = 900,
  height = 700,
  onStateChange,
  controlRodInsertions,
  isRunning: controlledIsRunning,
  speed: controlledSpeed,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const heatLayerRef = useRef<SVGGElement>(null);
  const neutronLayerRef = useRef<SVGGElement>(null);
  const atomLayerRef = useRef<SVGGElement>(null);
  const rodLayerRef = useRef<SVGGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastStatsUpdateRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);
  const holdPositionRef = useRef<{ x: number; y: number } | null>(null);
  const emissionIntervalRef = useRef<number | null>(null);

  // Get theme colors reactively via hook (replaces manual getComputedStyle)
  const themeColors = useCalculatedThemeColors();

  // Cache config and dimensions to avoid recreating animate callback
  const configRef = useRef(config);
  const dimensionsRef = useRef({ width, height });

  // D3 color scales - updated reactively when theme changes
  const colorScalesRef = useRef<{
    heat: d3.ScaleLinear<string, string, never>;
    atom: d3.ScaleLinear<string, string, never>;
  } | null>(null);

  // Update color scales when theme changes
  useEffect(() => {
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
  }, [themeColors]);

  // FPS monitoring for performance debugging
  const frameTimesRef = useRef<number[]>([]);
  const lastFpsLogRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Simulation state stored in ref (not React state) to avoid triggering renders during animation
  const stateRef = useRef<SimulationState>(initializeSimulation(config, width, height));

  // Stats-only state for UI display (throttled updates)
  const [stats, setStats] = useState({
    neutronCount: 0,
    totalFissions: 0,
    totalAbsorbed: 0,
    reactionRate: 0,
    reactorTemp: 0, // Average reactor temperature (0-1)
  });

  // Use controlled props if provided, otherwise use internal state
  const isRunning = controlledIsRunning ?? stateRef.current.isRunning;
  const speed = controlledSpeed ?? stateRef.current.speed;

  /**
   * Convert mouse coordinates to SVG coordinates
   */
  const getSVGCoordinates = useCallback(
    (event: React.MouseEvent<SVGSVGElement>): { x: number; y: number } | null => {
      if (!svgRef.current) return null;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Convert to SVG coordinates (accounting for viewBox scaling)
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      return {
        x: x * scaleX,
        y: y * scaleY,
      };
    },
    [width, height]
  );

  /**
   * Create energized neutrons at a position
   */
  const createEnergizedNeutrons = useCallback(
    (x: number, y: number, count: number = 3) => {
      const newNeutrons: Neutron[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = config.neutron.baseSpeed * 1.5; // 50% faster for energized neutrons

        newNeutrons.push({
          id: `energized-neutron-${Date.now()}-${Math.random()}`,
          position: { x, y },
          velocity: {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          },
          age: 0,
          speed,
          radius: config.neutron.radius * 1.2, // Slightly larger
          isNew: true,
          trail: [{ x, y }],
          wallBounces: 0,
        });
      }

      stateRef.current.neutrons.push(...newNeutrons);
    },
    [config]
  );

  /**
   * Handle mouse down - start continuous particle emission
   */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const coords = getSVGCoordinates(event);
      if (!coords) return;

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
    [getSVGCoordinates, createEnergizedNeutrons]
  );

  /**
   * Handle mouse move - update emission position while holding
   */
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!isHoldingRef.current) return;

      const coords = getSVGCoordinates(event);
      if (!coords) return;

      // Update emission position (particles will be emitted here by interval)
      holdPositionRef.current = coords;
    },
    [getSVGCoordinates]
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
   * Initialize simulation with atoms and control rods
   *
   * COORDINATE SYSTEM:
   * All positions use absolute SVG coordinates (0,0 = top-left of canvas)
   * - Canvas: 0 to width (default 1100px), 0 to height (default 850px)
   * - Vessel Outer Shell: 5% padding = 55 to 1045 (x), 42.5 to 807.5 (y)
   * - Vessel Inner (Physics Boundary): 8% padding = 88 to 1012 (x), 68 to 782 (y)
   * - Atom Grid: Centered within vessel inner bounds (~170 to 930)
   * - Control Rods: Start at vesselTop, extend to vesselTop + vesselHeight
   * - Neutrons: Absolute positions, reflect off vessel inner bounds
   */
  function initializeSimulation(cfg: ReactorConfig, w: number, h: number): SimulationState {
    const atoms: Atom[] = [];
    const controlRods: ControlRod[] = [];
    const initialNeutrons: Neutron[] = [];

    // Containment vessel bounds (inner vessel for actual containment)
    const vesselPadding = 0.08; // 8% padding matches the inner vessel
    const vesselLeft = w * vesselPadding;
    const vesselTop = h * vesselPadding;
    const vesselWidth = w * (1 - 2 * vesselPadding);
    const vesselHeight = h * (1 - 2 * vesselPadding);

    // Outer vessel dimensions (for control rod visual extent)
    const outerVesselPadding = 0.05;
    const outerVesselTop = h * outerVesselPadding;
    const outerVesselHeight = h * (1 - 2 * outerVesselPadding);

    // Create heat grid for temperature visualization
    // Grid cell size should be roughly 1/20th of vessel size for smooth gradients
    const heatCellSize = 25; // pixels per cell (smaller = finer detail, more computation)
    const heatGrid = createHeatGrid(vesselWidth, vesselHeight, heatCellSize);

    // Create water coolant grid (matches heat grid dimensions)
    // Water density: 1.0 = full water, 0.0 = all steam
    const waterGrid = createWaterGrid(vesselWidth, vesselHeight, heatCellSize);

    // Calculate grid centering within the vessel
    const gridWidth = (cfg.grid.columns - 1) * cfg.grid.spacing;
    const gridHeight = (cfg.grid.rows - 1) * cfg.grid.spacing;
    const offsetX = vesselLeft + (vesselWidth - gridWidth) / 2;
    const offsetY = vesselTop + (vesselHeight - gridHeight) / 2;

    // Create fuel atoms in grid
    for (let row = 0; row < cfg.grid.rows; row++) {
      for (let col = 0; col < cfg.grid.columns; col++) {
        atoms.push({
          id: `atom-${row}-${col}`,
          position: {
            x: offsetX + col * cfg.grid.spacing,
            y: offsetY + row * cfg.grid.spacing,
          },
          gridX: col,
          gridY: row,
          energy: 0.1 + Math.random() * 0.15, // Start at 0.1-0.25 energy (mostly below emission threshold)
          timeSinceEmission: Math.random() * 1000,
          radius: cfg.atom.radius,
          emittedCount: 0,
          integrity: 1.0, // Start with intact fuel
          lastTemperature: 0, // Cold startup
          xenonLevel: 0, // No xenon at cold startup
        });
      }
    }

    // Create initial "neutron source" - like californium-252 in real reactors
    // Seed the reaction with some neutrons at random positions
    const numSeedNeutrons = 15; // Reduced for slower, more controlled startup
    for (let i = 0; i < numSeedNeutrons; i++) {
      const randomAtomIndex = Math.floor(Math.random() * atoms.length);
      const randomAtom = atoms[randomAtomIndex];
      if (randomAtom) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = cfg.neutron.baseSpeed;
        initialNeutrons.push({
          id: `initial-neutron-${i}`,
          position: { ...randomAtom.position },
          velocity: {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          },
          age: 0,
          speed,
          radius: cfg.neutron.radius,
          isNew: true,
          trail: [{ ...randomAtom.position }],
          wallBounces: 0,
        });
      }
    }

    // Create control rods centered in gaps between atom columns
    // For 10 rods with 20 columns, place them in gaps between every 2 columns
    // Gaps are at: 0-1, 2-3, 4-5, 6-7, 8-9, 10-11, 12-13, 14-15, 16-17, 18-19
    // Use staggered insertion pattern for better flux distribution and stability
    for (let i = 0; i < cfg.controlRod.count; i++) {
      // Rod i is centered between columns (2*i) and (2*i + 1)
      // Gap center = column_position + (spacing / 2)
      const gapCenterX = (i * 2 + 0.5) * cfg.grid.spacing;

      // Staggered insertion pattern: alternating between 65% and 45% insertion
      // This creates checkerboard absorption pattern for better flux distribution
      // Even rods (0,2,4,6,8) more inserted, odd rods (1,3,5,7,9) less inserted
      const insertion = i % 2 === 0 ? 0.65 : 0.45;

      controlRods.push({
        id: `rod-${i}`,
        x: offsetX + gapCenterX,
        y: outerVesselTop, // Start at outer vessel top for full visual extent
        width: cfg.controlRod.width,
        maxHeight: outerVesselHeight + 5, // Extend 5px beyond outer vessel bottom for full insertion
        insertion, // Staggered pattern for stability
        targetInsertion: insertion,
        absorbedCount: 0,
        isAbsorbing: false,
        lastAbsorptionTime: 0,
        health: 1.0, // Perfect condition at startup
      });
    }

    return {
      atoms,
      controlRods,
      neutrons: initialNeutrons, // Start with seed neutrons
      heatGrid,
      waterGrid,
      isRunning: false, // Start paused to prevent immediate criticality
      speed: cfg.simulation.defaultSpeed,
      totalEmitted: 0,
      totalAbsorbed: 0,
      totalFissions: 0,
      totalWaterAbsorbed: 0,
      totalLeaked: 0, // Neutrons that escaped through containment
      reactionRate: 0,
      reactorTemp: 0, // Average reactor temperature (0-1)
      voidFraction: 0, // Average void fraction (0-1, steam percentage)
      reactorPressure: cfg.pressure.basePressure, // Start at atmospheric pressure (cold shutdown)
      xenonLevel: 0, // Average xenon-135 poisoning level (0-1)
      lastFrameTime: performance.now(),
      animationFrameId: null,
    };
  }

  /**
   * Render using D3 (called directly from RAF loop)
   */
  const renderWithD3 = useCallback(() => {
    if (
      !heatLayerRef.current ||
      !neutronLayerRef.current ||
      !atomLayerRef.current ||
      !rodLayerRef.current
    )
      return;
    if (!colorScalesRef.current) return; // Wait for colors to be loaded

    const state = stateRef.current;
    const colors = themeColors;
    const { width: w, height: h } = dimensionsRef.current;

    // COMBINED HEAT + WATER VISUALIZATION
    // Shows temperature as color, water density as saturation/steam overlay
    const vesselPadding = 0.08;
    const vesselLeft = w * vesselPadding;
    const vesselTop = h * vesselPadding;
    const heatLayer = d3.select(heatLayerRef.current);

    // Use cached color scale (created once on mount)
    const heatColor = colorScalesRef.current.heat;

    // Flatten heat + water grids into combined cells for D3 data binding
    const combinedCells: Array<{
      x: number;
      y: number;
      temp: number;
      waterDensity: number;
      voidFraction: number; // 1 - waterDensity (steam percentage)
    }> = [];

    // FIX: Use active buffer instead of direct access to temperatures array
    // Heat grid uses double-buffering (swaps between temperatures/backBuffer)
    const activeTemperatures =
      state.heatGrid.activeBuffer === 0 ? state.heatGrid.temperatures : state.heatGrid.backBuffer;
    const { cellSize } = state.heatGrid;
    const { waterDensity } = state.waterGrid;

    // Safety check: ensure both grids are initialized
    if (!activeTemperatures || activeTemperatures.length === 0) {
      console.error("[RBMK] Heat grid temperatures not initialized!", {
        activeBuffer: state.heatGrid.activeBuffer,
        temperaturesLength: state.heatGrid.temperatures?.length,
        backBufferLength: state.heatGrid.backBuffer?.length,
        heatGridDims: { width: state.heatGrid.width, height: state.heatGrid.height },
      });
      return; // Skip rendering if heat grid not ready
    }

    if (!waterDensity || waterDensity.length === 0) {
      console.error("[RBMK] waterDensity array not initialized!", {
        waterGrid: state.waterGrid,
        heatGridHeight: state.heatGrid.height,
        heatGridWidth: state.heatGrid.width,
      });
      return; // Skip rendering if water grid not ready
    }

    // Use minimum dimensions to avoid out-of-bounds access
    const maxY = Math.min(activeTemperatures.length, waterDensity.length);
    const maxX =
      maxY > 0 ? Math.min(activeTemperatures[0]?.length ?? 0, waterDensity[0]?.length ?? 0) : 0;

    if (maxY === 0 || maxX === 0) {
      console.warn("[RBMK] Grid dimensions are zero, skipping render", {
        maxY,
        maxX,
        heatRows: activeTemperatures.length,
        heatCols: activeTemperatures[0]?.length,
        waterRows: waterDensity.length,
        waterCols: waterDensity[0]?.length,
      });
      return;
    }

    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const temp = activeTemperatures[y]?.[x] ?? 0;
        const water = waterDensity[y]?.[x] ?? 1.0;
        const voidFrac = 1 - water; // Steam percentage

        // Render cells with heat OR steam voids (makes steam visible even when cooling)
        if (temp > 0.01 || voidFrac > 0.1) {
          combinedCells.push({
            x: vesselLeft + x * cellSize,
            y: vesselTop + y * cellSize,
            temp,
            waterDensity: water,
            voidFraction: voidFrac,
          });
        }
      }
    }

    const cellRects = heatLayer
      .selectAll<SVGRectElement, (typeof combinedCells)[0]>("rect.thermal-cell")
      .data(combinedCells, d => `${d.x}-${d.y}`);

    // Enter + update
    cellRects
      .enter()
      .append("rect")
      .attr("class", "thermal-cell")
      .merge(cellRects)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", state.heatGrid.cellSize)
      .attr("height", state.heatGrid.cellSize)
      .attr("fill", d => {
        // Base temperature color
        const baseColor = heatColor(d.temp);

        // Steam voids appear WHITE (shows dangerous positive void coefficient!)
        // Blend between base heat color and white based on void fraction
        if (d.voidFraction > 0.3) {
          // High steam content: blend toward white/yellow (visible steam)
          const steamColor = "#FFFFFF";
          const blendFactor = Math.min(d.voidFraction * 0.7, 0.7); // Max 70% white
          return d3.interpolateRgb(baseColor, steamColor)(blendFactor);
        }

        return baseColor;
      })
      .attr("opacity", d => {
        // Base opacity from temperature
        let opacity = Math.min(d.temp * 0.6, 0.6);

        // Steam voids are MORE visible (positive void coefficient warning!)
        if (d.voidFraction > 0.3) {
          opacity = Math.max(opacity, d.voidFraction * 0.5); // Steam always visible
        }

        return Math.min(opacity, 0.7); // Max 70% opacity
      });

    // Remove old cells
    cellRects.exit().remove();

    // Render neutrons with D3
    const neutronLayer = d3.select(neutronLayerRef.current);
    const neutronGroups = neutronLayer
      .selectAll<SVGGElement, Neutron>("g.neutron")
      .data(state.neutrons, d => d.id);

    // DEBUG: Log D3 neutron rendering (EVERY frame for first 120 frames)
    const shouldDebugLog = frameCountRef.current <= 120;
    if (shouldDebugLog) {
      console.log(`[RBMK D3 Render] Frame ${frameCountRef.current}:`, {
        neutronsToRender: state.neutrons.length,
        enterSelection: neutronGroups.enter().size(),
        updateSelection: neutronGroups.size(),
        exitSelection: neutronGroups.exit().size(),
        firstNeutronPos: state.neutrons[0]?.position,
      });
    }

    // Enter new neutrons
    const neutronEnter = neutronGroups.enter().append("g").attr("class", "neutron");

    neutronEnter
      .append("circle")
      .attr("class", "particle")
      .attr("r", (d: Neutron) => d.radius)
      .attr("fill", "var(--primary)")
      .attr("stroke", "var(--primary-foreground)")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.9);

    // Update positions
    neutronGroups
      .merge(neutronEnter)
      .select<SVGCircleElement>("circle.particle")
      .attr("cx", (d: Neutron) => d.position.x)
      .attr("cy", (d: Neutron) => d.position.y);

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
      .attr("stroke", (d: Atom) => (d.energy > 0.6 ? colors.accent : colors.primary)) // Accent for hot, primary for cold
      .attr("stroke-width", (d: Atom) => (d.energy > 0.8 ? 3 : 1.5)) // Thicker stroke when critical
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
  }, []); // No dependencies - reads from refs only

  /**
   * Animation loop using RAF - updates refs and calls D3 directly (no React state updates)
   * NOTE: Don't check isRunning here - the useEffect controls loop start/stop
   */
  const animate = useCallback(() => {
    const frameStart = performance.now();
    const currentTime = frameStart;
    const deltaTime = (currentTime - lastFrameTimeRef.current) * speed;
    lastFrameTimeRef.current = currentTime;

    // DEBUG: Enable logging for first 120 frames
    const shouldDebugLog = frameCountRef.current <= 120;

    // FPS monitoring (track frame times for debugging)
    frameTimesRef.current.push(deltaTime);
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

    const state = stateRef.current;
    const cfg = configRef.current;
    const { width: w, height: h } = dimensionsRef.current;

    // Vessel bounds (used throughout animate loop)
    const vesselPadding = 0.08;
    const vesselLeft = w * vesselPadding;
    const vesselTop = h * vesselPadding;
    const vesselBounds = {
      left: vesselLeft,
      top: vesselTop,
      right: w * (1 - vesselPadding),
      bottom: h * (1 - vesselPadding),
    };

    // Update atoms and collect emitted neutrons
    const emittedNeutrons: Neutron[] = [];
    for (const atom of state.atoms) {
      const newNeutrons = updateAtom(
        atom,
        state.waterGrid,
        vesselLeft,
        vesselTop,
        cfg,
        deltaTime,
        currentTime,
        state.neutrons // Pass current neutrons for flux calculation
      );
      emittedNeutrons.push(...newNeutrons);

      // Get temperature at atom position for fuel damage calculation
      const temperature = getHeatAtPosition(
        state.heatGrid,
        atom.position.x,
        atom.position.y,
        vesselLeft,
        vesselTop
      );

      // Update fuel integrity and get decay heat contribution
      const decayHeat = updateFuelIntegrity(atom, temperature, cfg);
      // Add decay heat to atom energy so it spreads in updateHeatGeneration
      atom.energy += decayHeat;
    }

    // Update control rods
    for (const rod of state.controlRods) {
      updateControlRod(rod, cfg, deltaTime, currentTime);

      // Get temperature at rod position for heat damage calculation
      const temperature = getHeatAtPosition(state.heatGrid, rod.x, rod.y, vesselLeft, vesselTop);

      updateControlRodHealth(rod, temperature, cfg);
    }

    // OPTIMIZED: Update heat and water in two steps for better performance
    // Step 1: Heat generation and diffusion (atom energy -> heat spreading)
    updateHeatGrid(state.heatGrid, state.atoms, deltaTime, vesselLeft, vesselTop);

    // Step 2: Coupled cooling + water updates in single pass
    // - Cooling rate depends on water density (less water = less cooling)
    // - Water boils/condenses based on temperature
    // This drives the positive void coefficient feedback loop
    updateCoolingAndWater(state.heatGrid, state.waterGrid, cfg);

    // Update neutron positions and ages
    for (const neutron of state.neutrons) {
      updateNeutronPosition(neutron, deltaTime);
      neutron.age += deltaTime;
    }

    // OPTIMIZATION: In-place filtering to remove old neutrons (eliminates array allocation)
    // Use a write index to compact the array in-place
    let writeIndex = 0;
    for (let i = 0; i < state.neutrons.length; i++) {
      if (state.neutrons[i]!.age < cfg.neutron.maxAge) {
        if (writeIndex !== i) {
          state.neutrons[writeIndex] = state.neutrons[i]!;
        }
        writeIndex++;
      }
    }

    // DEBUG: Log age filtering results
    const removedByAge = state.neutrons.length - writeIndex;
    if (shouldDebugLog && removedByAge > 0) {
      console.log(`[RBMK Age Filter] Frame ${frameCountRef.current}:`, {
        before: state.neutrons.length,
        after: writeIndex,
        removedByAge,
        deltaTime,
      });
    }

    // Truncate array to new length (no allocation, just updates length property)
    state.neutrons.length = writeIndex;

    // DEBUG: Log BEFORE collision processing
    if (shouldDebugLog) {
      console.log(`[RBMK Before Collisions] Frame ${frameCountRef.current}:`, {
        neutronsToProcess: state.neutrons.length,
      });
    }

    const collisionResults = processCollisions(
      state.neutrons, // Use compacted array directly
      state.atoms,
      state.controlRods,
      state.waterGrid,
      vesselLeft,
      vesselTop,
      cfg,
      currentTime,
      shouldDebugLog // Enable debug logging for first 120 frames
    );

    // DEBUG: Log AFTER collision processing
    if (shouldDebugLog) {
      console.log(`[RBMK After Collisions] Frame ${frameCountRef.current}:`, {
        remaining: collisionResults.remainingNeutrons.length,
        emitted: emittedNeutrons.length,
        rodAbsorbed: collisionResults.absorptionCount,
        fissions: collisionResults.fissionCount,
      });
    }

    // OPTIMIZATION: Append emitted neutrons in-place (no spread operator allocation)
    // Start by replacing state.neutrons with remainingNeutrons (already an array)
    state.neutrons = collisionResults.remainingNeutrons;
    // Append emitted neutrons using push (in-place, no allocation)
    for (const neutron of emittedNeutrons) {
      state.neutrons.push(neutron);
    }

    // Check vessel boundary collisions and reflect neutrons off containment walls
    for (const neutron of state.neutrons) {
      // Left wall
      if (neutron.position.x - neutron.radius <= vesselBounds.left) {
        neutron.position.x = vesselBounds.left + neutron.radius;
        neutron.velocity.vx = Math.abs(neutron.velocity.vx) * 0.95; // 5% energy loss
        neutron.wallBounces += 1;
      }
      // Right wall
      if (neutron.position.x + neutron.radius >= vesselBounds.right) {
        neutron.position.x = vesselBounds.right - neutron.radius;
        neutron.velocity.vx = -Math.abs(neutron.velocity.vx) * 0.95;
        neutron.wallBounces += 1;
      }
      // Top wall
      if (neutron.position.y - neutron.radius <= vesselBounds.top) {
        neutron.position.y = vesselBounds.top + neutron.radius;
        neutron.velocity.vy = Math.abs(neutron.velocity.vy) * 0.95;
        neutron.wallBounces += 1;
      }
      // Bottom wall
      if (neutron.position.y + neutron.radius >= vesselBounds.bottom) {
        neutron.position.y = vesselBounds.bottom - neutron.radius;
        neutron.velocity.vy = -Math.abs(neutron.velocity.vy) * 0.95;
        neutron.wallBounces += 1;
      }
    }

    // Note: Neutron leakage (wall bounce limit) is now handled in processCollisions
    // which filters out neutrons that exceed config.neutron.maxWallBounces

    // OPTIMIZATION: In-place truncation to max count (eliminates slice allocation)
    if (state.neutrons.length > cfg.neutron.maxCount) {
      state.neutrons.length = cfg.neutron.maxCount;
    }

    // Calculate reactor metrics
    const reactorTemp = calculateAverageTemperature(state.heatGrid);
    const voidFraction = calculateVoidFraction(state.waterGrid);
    const reactorPressure = calculatePressure(reactorTemp, voidFraction, cfg);
    const xenonLevel = calculateAverageXenon(state.atoms);

    // DEBUG: Log neutron lifecycle (detailed logging for first 120 frames)
    if (shouldDebugLog) {
      console.log(`[RBMK Collisions] Frame ${frameCountRef.current}:`, {
        neutronCount: state.neutrons.length,
        emitted: emittedNeutrons.length,
        fissions: collisionResults.fissionCount,
        rodAbsorbed: collisionResults.absorptionCount,
        waterAbsorbed: collisionResults.waterAbsorptionCount,
        remainingAfterCollisions: collisionResults.remainingNeutrons.length,
        maxEnergy: Math.max(...state.atoms.map(a => a.energy)).toFixed(2),
        avgEnergy: (state.atoms.reduce((sum, a) => sum + a.energy, 0) / state.atoms.length).toFixed(
          2
        ),
      });
    }

    // Update state metrics (state.neutrons already updated in-place above)
    state.totalEmitted += emittedNeutrons.length;
    state.totalAbsorbed += collisionResults.absorptionCount;
    state.totalFissions += collisionResults.fissionCount;
    state.totalWaterAbsorbed += collisionResults.waterAbsorptionCount;
    state.reactionRate = calculateReactionRate(state.neutrons.length, deltaTime);
    state.reactorTemp = reactorTemp;
    state.voidFraction = voidFraction;
    state.reactorPressure = reactorPressure;
    state.xenonLevel = xenonLevel;
    state.lastFrameTime = currentTime;

    // Render with D3 (direct DOM manipulation, no React)
    renderWithD3();

    // Throttled stats update for UI (only every 200ms to avoid thrashing)
    if (currentTime - lastStatsUpdateRef.current > 200) {
      setStats({
        neutronCount: state.neutrons.length,
        totalFissions: state.totalFissions,
        totalAbsorbed: state.totalAbsorbed,
        reactionRate: state.reactionRate,
        reactorTemp, // Use already-calculated value
      });
      lastStatsUpdateRef.current = currentTime;
    }

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [speed, renderWithD3]); // Reduced dependencies - config/dimensions read from refs, isRunning controlled by useEffect

  /**
   * Start/stop animation loop
   */
  useEffect(() => {
    if (isRunning) {
      lastFrameTimeRef.current = performance.now();
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
      onStateChange({
        atoms: stateRef.current.atoms,
        controlRods: stateRef.current.controlRods,
        neutrons: stateRef.current.neutrons, // Send neutrons for length calculation
        heatGrid: stateRef.current.heatGrid,
        waterGrid: stateRef.current.waterGrid,
        isRunning: stateRef.current.isRunning,
        speed: stateRef.current.speed,
        totalEmitted: stats.totalFissions, // Use stats values
        totalAbsorbed: stats.totalAbsorbed,
        totalFissions: stats.totalFissions,
        totalWaterAbsorbed: stateRef.current.totalWaterAbsorbed,
        totalLeaked: stateRef.current.totalLeaked, // Neutrons leaked through containment
        reactionRate: stats.reactionRate,
        reactorTemp: stats.reactorTemp, // Average reactor temperature
        voidFraction: stateRef.current.voidFraction,
        reactorPressure: stateRef.current.reactorPressure, // Reactor pressure (0-1)
        xenonLevel: stateRef.current.xenonLevel, // Xenon-135 poisoning level
        lastFrameTime: stateRef.current.lastFrameTime,
        animationFrameId: stateRef.current.animationFrameId,
      });
    }
  }, [stats, onStateChange]);

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
   * Update control rod insertions from external control (directly update ref)
   */
  useEffect(() => {
    if (controlRodInsertions && controlRodInsertions.length > 0) {
      stateRef.current.controlRods.forEach((rod, index) => {
        rod.targetInsertion = controlRodInsertions[index] ?? rod.targetInsertion;
      });
    }
  }, [controlRodInsertions]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="bg-background border border-border rounded-lg w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

        {/* Neutron trail gradient - enhanced visibility */}
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

      {/* Heat Layer - D3 managed (rendered first, behind everything) */}
      <g ref={heatLayerRef} className="heat-layer" />

      {/* Control Rods - D3 managed */}
      <g ref={rodLayerRef} className="rods-layer" />

      {/* Fuel Atoms - D3 managed */}
      <g ref={atomLayerRef} className="atoms-layer" />

      {/* Neutrons - D3 managed */}
      <g ref={neutronLayerRef} className="neutrons-layer" />
    </svg>
  );
};

export default RBMKReactor;
