/**
 * Physics simulation for RBMK Reactor
 *
 * Handles neutron movement, collision detection, and chain reaction dynamics.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */

import { Atom, ControlRod, Neutron, Position, Velocity, ReactorConfig, HeatGrid } from "./types";

/**
 * Generate a random ID for particles
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Calculate distance between two positions
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalize a vector to unit length
 */
export function normalize(v: Velocity): Velocity {
  const mag = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
  if (mag === 0) return { vx: 0, vy: 0 };
  return { vx: v.vx / mag, vy: v.vy / mag };
}

/**
 * Create a random velocity vector with given speed
 */
export function randomVelocity(speed: number): Velocity {
  const angle = Math.random() * 2 * Math.PI;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

/**
 * Create a new neutron at given position with random direction
 */
export function createNeutron(position: Position, config: ReactorConfig, speed?: number): Neutron {
  const variance = config.neutron.speedVariation;
  const baseSpeed = speed ?? config.neutron.baseSpeed;
  const actualSpeed = baseSpeed * (1 + (Math.random() - 0.5) * variance * 2);

  return {
    id: generateId(),
    position: { ...position },
    velocity: randomVelocity(actualSpeed),
    age: 0,
    speed: actualSpeed,
    radius: config.neutron.radius,
    isNew: true,
    trail: [{ ...position }],
    wallBounces: 0,
  };
}

/**
 * Update neutron position based on velocity and delta time
 */
export function updateNeutronPosition(neutron: Neutron, deltaTime: number): void {
  // deltaTime is in seconds, velocity is in pixels per frame at 60fps
  // Normalize to frame-based movement
  const frameDelta = (deltaTime * 60) / 1000;

  neutron.position.x += neutron.velocity.vx * frameDelta;
  neutron.position.y += neutron.velocity.vy * frameDelta;

  // Update trail
  neutron.trail.unshift({ ...neutron.position });
  if (neutron.trail.length > 6) {
    neutron.trail.pop();
  }

  neutron.isNew = false;
}

/**
 * Check collision between neutron and atom
 */
export function checkAtomCollision(neutron: Neutron, atom: Atom, config: ReactorConfig): boolean {
  const dist = distance(neutron.position, atom.position);
  const threshold = neutron.radius + atom.radius + config.physics.collisionThreshold;
  return dist <= threshold;
}

/**
 * Check collision between neutron and control rod
 */
export function checkRodCollision(
  neutron: Neutron,
  rod: ControlRod,
  config: ReactorConfig
): boolean {
  // Control rod is a vertical rectangle
  const rodHeight = rod.maxHeight * rod.insertion; // only check against inserted portion
  const rodLeft = rod.x - rod.width / 2;
  const rodRight = rod.x + rod.width / 2;
  const rodTop = rod.y;
  const rodBottom = rod.y + rodHeight;

  // Use larger threshold for rods to catch fast-moving neutrons (prevent tunneling)
  const threshold = config.physics.collisionThreshold * 2.5; // 2.5x larger hitbox for rods
  return (
    neutron.position.x + neutron.radius + threshold >= rodLeft &&
    neutron.position.x - neutron.radius - threshold <= rodRight &&
    neutron.position.y + neutron.radius + threshold >= rodTop &&
    neutron.position.y - neutron.radius - threshold <= rodBottom
  );
}

/**
 * Handle collision between neutron and atom
 * Returns true if neutron should be removed (absorbed), false if it should bounce
 */
export function handleAtomCollision(
  _neutron: Neutron,
  atom: Atom,
  config: ReactorConfig
): { absorbed: boolean; fission: boolean } {
  // Check if fission occurs based on U-235 cross-section
  const fission = Math.random() < config.neutron.fissionProbability;

  if (fission) {
    // Neutron absorbed, causes fission
    // Increase atom energy (which will lead to neutron emission)
    atom.energy = Math.min(1, atom.energy + config.atom.energyGain);
    atom.emittedCount += 1;
    return { absorbed: true, fission: true };
  } else {
    // Radiative capture - neutron absorbed but no fission
    atom.energy = Math.min(1, atom.energy + config.atom.energyGain * 0.3);
    return { absorbed: true, fission: false };
  }
}

/**
 * Handle collision between neutron and control rod
 * Returns true if neutron was absorbed
 */
export function handleRodCollision(
  _neutron: Neutron,
  rod: ControlRod,
  config: ReactorConfig,
  currentTime: number
): boolean {
  // Check if absorbed based on B-10 absorption probability
  if (Math.random() < config.controlRod.absorptionProbability) {
    rod.absorbedCount += 1;
    rod.isAbsorbing = true;
    rod.lastAbsorptionTime = currentTime;
    return true; // neutron absorbed
  }
  return false; // neutron passed through (rare)
}

/**
 * Update atom state (energy decay, neutron emission)
 */
export function updateAtom(
  atom: Atom,
  config: ReactorConfig,
  deltaTime: number,
  _currentTime: number
): Neutron[] {
  const newNeutrons: Neutron[] = [];

  // Energy decay (cooling)
  atom.energy *= config.atom.energyDecay;

  // Update emission timer
  atom.timeSinceEmission += deltaTime;

  // Check for neutron emission
  // Emission rate scales with energy level (higher energy = faster emission)
  // At minimum threshold energy (0.3): baseEmissionRate
  // At maximum energy (1.0): baseEmissionRate * 3.33 (scale factor)
  const energyScaleFactor = atom.energy / config.atom.emissionThreshold;
  const scaledEmissionRate = config.atom.baseEmissionRate * energyScaleFactor;
  const emissionInterval = 1000 / scaledEmissionRate; // ms between emissions

  const shouldEmit =
    atom.energy >= config.atom.emissionThreshold && atom.timeSinceEmission >= emissionInterval;

  if (shouldEmit) {
    // U-235 releases average of 2.43 neutrons per fission
    const numNeutrons = Math.round(config.atom.neutronsPerFission + (Math.random() - 0.5) * 0.5);

    for (let i = 0; i < numNeutrons; i++) {
      // Add small random offset from atom center
      const offset = {
        x: (Math.random() - 0.5) * atom.radius,
        y: (Math.random() - 0.5) * atom.radius,
      };

      newNeutrons.push(
        createNeutron(
          {
            x: atom.position.x + offset.x,
            y: atom.position.y + offset.y,
          },
          config
        )
      );
    }

    // Reset emission timer and reduce energy
    atom.timeSinceEmission = 0;
    atom.energy = Math.max(0, atom.energy - 0.2);
  }

  return newNeutrons;
}

/**
 * Update control rod insertion (smooth interpolation to target)
 */
export function updateControlRod(
  rod: ControlRod,
  config: ReactorConfig,
  deltaTime: number,
  currentTime: number
): void {
  // Smooth interpolation to target insertion
  const delta = rod.targetInsertion - rod.insertion;
  if (Math.abs(delta) > 0.001) {
    const maxChange = (config.controlRod.insertionSpeed * deltaTime) / 1000;
    const change = Math.sign(delta) * Math.min(Math.abs(delta), maxChange);
    rod.insertion = Math.max(0, Math.min(1, rod.insertion + change));

    // Update visual position
    rod.y = 0; // Always starts at top
  }

  // Clear absorption animation after duration
  if (
    rod.isAbsorbing &&
    currentTime - rod.lastAbsorptionTime > config.controlRod.absorptionEffectDuration
  ) {
    rod.isAbsorbing = false;
  }
}

/**
 * Spatial grid for efficient collision detection
 */
interface SpatialGrid {
  cellSize: number;
  cells: Map<string, Atom[]>;
}

/**
 * Create spatial grid for atoms
 */
function createSpatialGrid(atoms: Atom[], cellSize: number): SpatialGrid {
  const grid: SpatialGrid = {
    cellSize,
    cells: new Map(),
  };

  for (const atom of atoms) {
    const cellX = Math.floor(atom.position.x / cellSize);
    const cellY = Math.floor(atom.position.y / cellSize);
    const key = `${cellX},${cellY}`;

    if (!grid.cells.has(key)) {
      grid.cells.set(key, []);
    }
    grid.cells.get(key)!.push(atom);
  }

  return grid;
}

/**
 * Get nearby atoms from spatial grid
 */
function getNearbyAtoms(grid: SpatialGrid, position: Position, radius: number): Atom[] {
  const cellSize = grid.cellSize;
  const minX = Math.floor((position.x - radius) / cellSize);
  const maxX = Math.floor((position.x + radius) / cellSize);
  const minY = Math.floor((position.y - radius) / cellSize);
  const maxY = Math.floor((position.y + radius) / cellSize);

  const nearby: Atom[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const key = `${x},${y}`;
      const cell = grid.cells.get(key);
      if (cell) {
        nearby.push(...cell);
      }
    }
  }
  return nearby;
}

/**
 * Process all collisions and update simulation state (optimized with spatial grid)
 */
export function processCollisions(
  neutrons: Neutron[],
  atoms: Atom[],
  controlRods: ControlRod[],
  config: ReactorConfig,
  currentTime: number
): {
  remainingNeutrons: Neutron[];
  fissionCount: number;
  absorptionCount: number;
} {
  const remainingNeutrons: Neutron[] = [];
  let fissionCount = 0;
  let absorptionCount = 0;

  // Create spatial grid for atoms (grid size = 2x spacing for efficiency)
  const spatialGrid = createSpatialGrid(atoms, config.grid.spacing * 2);
  const searchRadius =
    config.atom.radius + config.neutron.radius + config.physics.collisionThreshold;

  for (const n of neutrons) {
    let absorbed = false;

    // NOTE: Boundary collision is now handled in RBMKReactor.tsx animate() function
    // with correct absolute vessel bounds, not here with relative dimensions

    // Check control rod collisions (higher priority - rods absorb before atoms)
    for (const rod of controlRods) {
      if (rod.insertion > 0 && checkRodCollision(n, rod, config)) {
        if (handleRodCollision(n, rod, config, currentTime)) {
          absorbed = true;
          absorptionCount += 1;
          break;
        }
      }
    }

    // If not absorbed by rod, check atom collisions using spatial grid
    if (!absorbed) {
      const nearbyAtoms = getNearbyAtoms(spatialGrid, n.position, searchRadius);
      for (const atom of nearbyAtoms) {
        if (checkAtomCollision(n, atom, config)) {
          const result = handleAtomCollision(n, atom, config);
          absorbed = result.absorbed;
          if (result.fission) {
            fissionCount += 1;
          }
          break;
        }
      }
    }

    // Keep neutron if not absorbed
    if (!absorbed) {
      remainingNeutrons.push(n);
    }
  }

  return { remainingNeutrons, fissionCount, absorptionCount };
}

/**
 * Calculate current reaction rate (neutrons per second)
 */
export function calculateReactionRate(neutronCount: number, deltaTime: number): number {
  // Simple moving average estimation
  if (deltaTime === 0) return 0;
  return (neutronCount * 1000) / deltaTime;
}

/**
 * Create a heat grid for temperature visualization
 */
export function createHeatGrid(width: number, height: number, cellSize: number): HeatGrid {
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  // Initialize 2D array with zeros (ambient temperature)
  const temperatures: number[][] = [];
  for (let y = 0; y < gridHeight; y++) {
    temperatures[y] = new Array(gridWidth).fill(0);
  }

  return {
    width: gridWidth,
    height: gridHeight,
    cellSize,
    temperatures,
  };
}

/**
 * Update heat grid based on atom energy and thermal diffusion
 *
 * Heat generation:
 * - Atoms with high energy generate heat (fission reactions are exothermic)
 * - Heat is proportional to atom energy level
 *
 * Heat diffusion:
 * - Heat spreads to neighboring cells (thermal conduction)
 * - Uses simple averaging with neighbors
 *
 * Cooling:
 * - Heat dissipates over time (radiation and convection to coolant)
 */
export function updateHeatGrid(
  heatGrid: HeatGrid,
  atoms: Atom[],
  deltaTime: number,
  vesselLeft: number,
  vesselTop: number
): void {
  const { width, height, cellSize, temperatures } = heatGrid;

  // 1. Heat generation from atoms
  for (const atom of atoms) {
    // Convert atom position to grid coordinates
    const gridX = Math.floor((atom.position.x - vesselLeft) / cellSize);
    const gridY = Math.floor((atom.position.y - vesselTop) / cellSize);

    // Check bounds
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      // Heat generated is proportional to atom energy
      // High energy atoms (0.7-1.0) generate significant heat
      // Scale: energy 1.0 = temperature increase of 0.05 per frame
      const heatGeneration = atom.energy * 0.05 * (deltaTime / 16.67); // Normalize to ~60fps
      temperatures[gridY]![gridX]! += heatGeneration;

      // Spread heat to immediate neighbors (atoms radiate heat)
      const spreadRadius = 1;
      for (let dy = -spreadRadius; dy <= spreadRadius; dy++) {
        for (let dx = -spreadRadius; dx <= spreadRadius; dx++) {
          const nx = gridX + dx;
          const ny = gridY + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && (dx !== 0 || dy !== 0)) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const falloff = 1 / (distance + 1); // Inverse distance falloff
            temperatures[ny]![nx]! += heatGeneration * falloff * 0.5;
          }
        }
      }
    }
  }

  // 2. Heat diffusion (thermal conduction between cells)
  // Use simple averaging with neighbors to simulate heat spreading
  const diffusionRate = 0.15; // How fast heat spreads (0-1)
  const newTemperatures = temperatures.map(row => [...row]); // Copy for concurrent update

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = temperatures[y]![x]!;
      let count = 1;

      // Average with 4 neighbors (up, down, left, right)
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          sum += temperatures[ny]![nx]!;
          count++;
        }
      }

      const average = sum / count;
      const current = temperatures[y]![x]!;

      // Blend between current temperature and average with neighbors
      newTemperatures[y]![x] = current + (average - current) * diffusionRate;
    }
  }

  // Update temperatures with diffused values
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      temperatures[y]![x] = newTemperatures[y]![x]!;
    }
  }

  // 3. Cooling (heat dissipation to environment/coolant)
  // Real RBMK reactors use water coolant that removes heat
  const coolingRate = 0.98; // 2% cooling per frame (~60fps = ~100% cooling in 3 seconds)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      temperatures[y]![x]! *= coolingRate;

      // Clamp to [0, 1] range
      temperatures[y]![x] = Math.max(0, Math.min(1, temperatures[y]![x]!));
    }
  }
}

/**
 * Get heat value at a specific position (for visualization)
 */
export function getHeatAtPosition(
  heatGrid: HeatGrid,
  x: number,
  y: number,
  vesselLeft: number,
  vesselTop: number
): number {
  const gridX = Math.floor((x - vesselLeft) / heatGrid.cellSize);
  const gridY = Math.floor((y - vesselTop) / heatGrid.cellSize);

  if (gridX >= 0 && gridX < heatGrid.width && gridY >= 0 && gridY < heatGrid.height) {
    return heatGrid.temperatures[gridY]![gridX]!;
  }

  return 0; // Outside bounds = ambient temperature
}

/**
 * Calculate average reactor temperature from heat grid
 */
export function calculateAverageTemperature(heatGrid: HeatGrid): number {
  const { temperatures, width, height } = heatGrid;
  let sum = 0;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sum += temperatures[y]![x]!;
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}
