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
import { Atom, ControlRod, Neutron, SimulationState, ReactorConfig } from "./types";
import { DEFAULT_REACTOR_CONFIG } from "./config";
import {
  updateNeutronPosition,
  updateAtom,
  updateControlRod,
  processCollisions,
  calculateReactionRate,
  createHeatGrid,
  updateHeatGrid,
  calculateAverageTemperature,
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
  const isDraggingRef = useRef<boolean>(false);
  const lastDragPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Cache theme colors to avoid expensive getComputedStyle calls every frame
  const themeColorsRef = useRef<{
    chart1: string;
    chart2: string;
    chart3: string;
    destructive: string;
    mutedForeground: string;
    primary: string;
    accent: string;
  } | null>(null);

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
   * Handle mouse down - start dragging
   */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const coords = getSVGCoordinates(event);
      if (!coords) return;

      isDraggingRef.current = true;
      lastDragPositionRef.current = coords;
      createEnergizedNeutrons(coords.x, coords.y, 5); // Initial burst
    },
    [getSVGCoordinates, createEnergizedNeutrons]
  );

  /**
   * Handle mouse move - create neutrons along drag path
   */
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!isDraggingRef.current) return;

      const coords = getSVGCoordinates(event);
      if (!coords || !lastDragPositionRef.current) return;

      // Calculate distance from last position
      const dx = coords.x - lastDragPositionRef.current.x;
      const dy = coords.y - lastDragPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Create neutrons if moved enough (throttle by distance)
      if (distance > 20) {
        createEnergizedNeutrons(coords.x, coords.y, 2);
        lastDragPositionRef.current = coords;
      }
    },
    [getSVGCoordinates, createEnergizedNeutrons]
  );

  /**
   * Handle mouse up - stop dragging
   */
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    lastDragPositionRef.current = null;
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
          energy: 0.4 + Math.random() * 0.5, // Start at 0.4-0.9 energy (above emission threshold)
          timeSinceEmission: Math.random() * 1000,
          radius: cfg.atom.radius,
          emittedCount: 0,
        });
      }
    }

    // Create initial "neutron source" - like californium-252 in real reactors
    // Seed the reaction with some neutrons at random positions
    const numSeedNeutrons = 50; // Increased for more immediate activity
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
    for (let i = 0; i < cfg.controlRod.count; i++) {
      // Rod i is centered between columns (2*i) and (2*i + 1)
      // Gap center = column_position + (spacing / 2)
      const gapCenterX = (i * 2 + 0.5) * cfg.grid.spacing;

      controlRods.push({
        id: `rod-${i}`,
        x: offsetX + gapCenterX,
        y: outerVesselTop, // Start at outer vessel top for full visual extent
        width: cfg.controlRod.width,
        maxHeight: outerVesselHeight + 5, // Extend 5px beyond outer vessel bottom for full insertion
        insertion: 0.5, // Start at 50% insertion
        targetInsertion: 0.5,
        absorbedCount: 0,
        isAbsorbing: false,
        lastAbsorptionTime: 0,
      });
    }

    return {
      atoms,
      controlRods,
      neutrons: initialNeutrons, // Start with seed neutrons
      heatGrid,
      isRunning: true,
      speed: cfg.simulation.defaultSpeed,
      totalEmitted: 0,
      totalAbsorbed: 0,
      totalFissions: 0,
      reactionRate: 0,
      reactorTemp: 0, // Average reactor temperature (0-1)
      lastFrameTime: performance.now(),
      animationFrameId: null,
    };
  }

  /**
   * Read theme colors from CSS custom properties (only called once on mount)
   */
  const readThemeColors = useCallback(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const getCSSColor = (varName: string): string => {
      const hslValue = computedStyle.getPropertyValue(varName).trim();
      if (!hslValue) return "#000000";
      // Convert "220 10% 50%" to "hsl(220, 10%, 50%)"
      const parts = hslValue.split(" ");
      if (parts.length === 3) {
        return `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`;
      }
      return hslValue;
    };

    themeColorsRef.current = {
      chart1: getCSSColor("--chart-1"),
      chart2: getCSSColor("--chart-2"),
      chart3: getCSSColor("--chart-3"),
      destructive: getCSSColor("--destructive"),
      mutedForeground: getCSSColor("--muted-foreground"),
      primary: getCSSColor("--primary"),
      accent: getCSSColor("--accent"),
    };
  }, []);

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
    if (!themeColorsRef.current) return; // Wait for colors to be loaded

    const state = stateRef.current;
    const colors = themeColorsRef.current;

    // Render heat grid with D3
    const vesselPadding = 0.08;
    const vesselLeft = width * vesselPadding;
    const vesselTop = height * vesselPadding;
    const heatLayer = d3.select(heatLayerRef.current);

    // Create color scale for temperature visualization using design tokens
    // 0 = dark blue (cold), 0.5 = orange, 1.0 = bright yellow (hot)
    const heatColor = d3.scaleLinear<string>().domain([0, 0.3, 0.6, 1.0]).range([
      colors.chart1, // cold - chart blue
      colors.chart2, // warming - chart green/teal
      colors.chart3, // hot - chart orange
      colors.destructive, // very hot - destructive red
    ]);

    // Flatten heat grid into array of cells for D3 data binding
    const heatCells: Array<{ x: number; y: number; temp: number }> = [];
    const { temperatures, cellSize } = state.heatGrid;
    for (let y = 0; y < state.heatGrid.height; y++) {
      for (let x = 0; x < state.heatGrid.width; x++) {
        const temp = temperatures[y]![x]!;
        if (temp > 0.01) {
          // Only render cells with significant heat (performance)
          heatCells.push({
            x: vesselLeft + x * cellSize,
            y: vesselTop + y * cellSize,
            temp,
          });
        }
      }
    }

    const heatRects = heatLayer
      .selectAll<SVGRectElement, (typeof heatCells)[0]>("rect.heat-cell")
      .data(heatCells, (d, i) => `${d.x}-${d.y}-${i}`);

    // Enter + update
    heatRects
      .enter()
      .append("rect")
      .attr("class", "heat-cell")
      .merge(heatRects)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", state.heatGrid.cellSize)
      .attr("height", state.heatGrid.cellSize)
      .attr("fill", d => heatColor(d.temp))
      .attr("opacity", d => Math.min(d.temp * 0.6, 0.6)); // Max 60% opacity for visibility

    // Remove old cells
    heatRects.exit().remove();

    // Render neutrons with D3
    const neutronLayer = d3.select(neutronLayerRef.current);
    const neutronGroups = neutronLayer
      .selectAll<SVGGElement, Neutron>("g.neutron")
      .data(state.neutrons, d => d.id);

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

    // Color scale for atom energy visualization using design tokens
    // Low energy (0.0-0.3): Muted → Medium energy (0.3-0.6): Accent → High energy (0.6-1.0): Destructive
    const atomColor = d3.scaleLinear<string>().domain([0, 0.3, 0.6, 1.0]).range([
      colors.mutedForeground, // low energy - muted
      colors.primary, // medium energy - primary blue
      colors.accent, // high energy - accent yellow
      colors.destructive, // very high energy - destructive red
    ]);

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
   */
  const animate = useCallback(() => {
    if (!isRunning) return;

    const frameStart = performance.now();
    const currentTime = frameStart;
    const deltaTime = (currentTime - lastFrameTimeRef.current) * speed;
    lastFrameTimeRef.current = currentTime;

    const state = stateRef.current;

    // Vessel bounds (used throughout animate loop)
    const vesselPadding = 0.08;
    const vesselLeft = width * vesselPadding;
    const vesselTop = height * vesselPadding;
    const vesselBounds = {
      left: vesselLeft,
      top: vesselTop,
      right: width * (1 - vesselPadding),
      bottom: height * (1 - vesselPadding),
    };

    // Update atoms and collect emitted neutrons
    const emittedNeutrons: Neutron[] = [];
    for (const atom of state.atoms) {
      const newNeutrons = updateAtom(atom, config, deltaTime, currentTime);
      emittedNeutrons.push(...newNeutrons);
    }

    // Update control rods
    for (const rod of state.controlRods) {
      updateControlRod(rod, config, deltaTime, currentTime);
    }

    // Update heat grid based on atom energy
    updateHeatGrid(state.heatGrid, state.atoms, deltaTime, vesselLeft, vesselTop);

    // Update neutron positions
    for (const neutron of state.neutrons) {
      updateNeutronPosition(neutron, deltaTime);
      neutron.age += deltaTime;
    }

    // Remove old neutrons
    const activeNeutrons = state.neutrons.filter(n => n.age < config.neutron.maxAge);

    const collisionResults = processCollisions(
      activeNeutrons,
      state.atoms,
      state.controlRods,
      config,
      currentTime
    );

    // Combine remaining and emitted neutrons
    let allNeutrons = [...collisionResults.remainingNeutrons, ...emittedNeutrons];

    // Check vessel boundary collisions and reflect neutrons off containment walls
    for (const neutron of allNeutrons) {
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

    // Remove neutrons that have bounced too many times (absorbed by concrete vessel walls)
    // Real concrete containment absorbs neutrons after many collisions
    const maxWallBounces = 15; // ~15 bounces before absorption
    allNeutrons = allNeutrons.filter(n => n.wallBounces < maxWallBounces);

    // Enforce max neutron count
    if (allNeutrons.length > config.neutron.maxCount) {
      allNeutrons = allNeutrons.slice(0, config.neutron.maxCount);
    }

    // Update state ref (no React setState!)
    state.neutrons = allNeutrons;
    state.totalEmitted += emittedNeutrons.length;
    state.totalAbsorbed += collisionResults.absorptionCount;
    state.totalFissions += collisionResults.fissionCount;
    state.reactionRate = calculateReactionRate(allNeutrons.length, deltaTime);
    state.lastFrameTime = currentTime;

    // Render with D3 (direct DOM manipulation, no React)
    renderWithD3();

    // Throttled stats update for UI (only every 200ms to avoid thrashing)
    if (currentTime - lastStatsUpdateRef.current > 200) {
      const reactorTemp = calculateAverageTemperature(state.heatGrid);
      setStats({
        neutronCount: allNeutrons.length,
        totalFissions: state.totalFissions,
        totalAbsorbed: state.totalAbsorbed,
        reactionRate: state.reactionRate,
        reactorTemp,
      });
      lastStatsUpdateRef.current = currentTime;
    }

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isRunning, speed, config, width, height, renderWithD3]);

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
        isRunning: stateRef.current.isRunning,
        speed: stateRef.current.speed,
        totalEmitted: stats.totalFissions, // Use stats values
        totalAbsorbed: stats.totalAbsorbed,
        totalFissions: stats.totalFissions,
        reactionRate: stats.reactionRate,
        reactorTemp: stats.reactorTemp, // Average reactor temperature
        lastFrameTime: stateRef.current.lastFrameTime,
        animationFrameId: stateRef.current.animationFrameId,
      });
    }
  }, [stats, onStateChange]);

  /**
   * Initialize theme colors on mount
   */
  useEffect(() => {
    readThemeColors();
  }, [readThemeColors]);

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
