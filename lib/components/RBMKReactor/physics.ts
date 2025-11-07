/**
 * Physics simulation for RBMK Reactor
 *
 * Handles neutron movement, collision detection, and chain reaction dynamics.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */

import {
  Atom,
  ControlRod,
  Neutron,
  Position,
  Velocity,
  ReactorConfig,
  HeatGrid,
  WaterGrid,
} from "./types";

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
 * @param parentAtomId - Optional ID of the atom that emitted this neutron (prevents immediate re-absorption)
 */
export function createNeutron(
  position: Position,
  config: ReactorConfig,
  speed?: number,
  parentAtomId?: string
): Neutron {
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
    parentAtomId,
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
 * Prevents immediate re-absorption by parent atom during first 50ms of neutron lifetime
 */
export function checkAtomCollision(neutron: Neutron, atom: Atom, config: ReactorConfig): boolean {
  // Parent atom exclusion: newly-emitted neutrons can't collide with their source atom
  // This prevents the common issue where neutrons spawn and immediately get re-absorbed
  // Grace period: 50ms (roughly 3 frames at 60fps)
  const PARENT_EXCLUSION_TIME = 50; // milliseconds

  if (neutron.parentAtomId === atom.id && neutron.age < PARENT_EXCLUSION_TIME) {
    return false; // Skip collision with parent atom during grace period
  }

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
 *
 * XENON POISONING: Reduces energy gain when xenon levels are high
 */
export function handleAtomCollision(
  _neutron: Neutron,
  atom: Atom,
  config: ReactorConfig
): { absorbed: boolean; fission: boolean } {
  // Check if fission occurs based on U-235 cross-section
  const fission = Math.random() < config.neutron.fissionProbability;

  // XENON POISONING EFFECT: Reduces energy gain from neutron absorption
  // Xe-135 competes with U-235 for neutrons (2.65M barn cross-section!)
  // Formula: effectiveGain = baseGain × (1 - xenonLevel × maxPoisoning)
  // At xenonLevel=0: full energy gain
  // At xenonLevel=1: energy gain reduced by maxPoisoning (default 40%)
  const xenonLevel = atom.xenonLevel || 0;
  const poisoningFactor = 1 - xenonLevel * config.xenon.maxPoisoning;
  const effectiveEnergyGain = config.atom.energyGain * poisoningFactor;

  if (fission) {
    // Neutron absorbed, causes fission
    // Increase atom energy (which will lead to neutron emission)
    // Reduced by xenon poisoning
    atom.energy = Math.min(1, atom.energy + effectiveEnergyGain);
    atom.emittedCount += 1;
    return { absorbed: true, fission: true };
  } else {
    // Radiative capture - neutron absorbed but no fission
    atom.energy = Math.min(1, atom.energy + effectiveEnergyGain * 0.3);
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
  // Absorption probability scales with rod health
  // Damaged rods (health < 1.0) have reduced absorption efficiency
  // health = 1.0 → 98% absorption
  // health = 0.5 → 49% absorption
  // health = 0.0 → 0% absorption (rod completely destroyed)
  const effectiveAbsorption = config.controlRod.absorptionProbability * rod.health;

  if (Math.random() < effectiveAbsorption) {
    rod.absorbedCount += 1;
    rod.isAbsorbing = true;
    rod.lastAbsorptionTime = currentTime;
    return true; // neutron absorbed
  }
  return false; // neutron passed through (rod damaged or 2% random chance)
}

/**
 * Update atom state (energy decay, neutron emission)
 *
 * @param neutrons - Current neutrons in simulation (for flux calculation)
 */
export function updateAtom(
  atom: Atom,
  waterGrid: WaterGrid,
  vesselLeft: number,
  vesselTop: number,
  config: ReactorConfig,
  deltaTime: number,
  _currentTime: number,
  neutrons: Neutron[] = []
): Neutron[] {
  const newNeutrons: Neutron[] = [];

  // NEUTRON FLUX-BASED ENERGY DECAY
  // Calculate local neutron flux (count neutrons within collision distance)
  const fluxRadius = atom.radius + config.neutron.radius + config.physics.collisionThreshold + 20;
  const nearbyNeutrons = neutrons.filter(n => {
    const dx = n.position.x - atom.position.x;
    const dy = n.position.y - atom.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= fluxRadius;
  });

  // Neutron flux = neutrons per unit area
  const fluxArea = Math.PI * fluxRadius * fluxRadius;
  const neutronFlux = nearbyNeutrons.length / fluxArea;

  // Energy decay scales with flux:
  // - High flux (active reaction): energy decays slowly (0.97 = 3% decay)
  // - Low flux (SCRAM/shutdown): energy decays faster (0.90 = 10% decay)
  // Formula: decay = baseDecay - flux × 0.00015
  // At flux=0: decay=0.90 (10% per frame)
  // At flux=500: decay=0.975 (2.5% per frame)
  const fluxFactor = Math.min(neutronFlux * 0.00015, 0.075); // Cap at 7.5% bonus retention
  let energyDecayRate = Math.max(0.9, config.atom.energyDecay - fluxFactor);

  // Apply additional decay to prevent spiral wave propagation
  // This simulates spatial heat diffusion / neutron leakage
  // Stronger decay at lower energies prevents cascading waves
  if (atom.energy < 0.3) {
    energyDecayRate *= 0.95; // Extra 5% decay at low energies
  }

  atom.energy *= energyDecayRate;

  // XENON-135 POISONING DYNAMICS
  // Xenon builds up from fission, decays naturally, and burns out under neutron flux
  if (!atom.xenonLevel) atom.xenonLevel = 0; // Initialize if missing

  // Build-up: Fission products (I-135) decay to Xe-135
  // Higher energy = more recent fissions = more xenon buildup
  const xenonBuildupRate = atom.energy * config.xenon.buildupRate;

  // Natural decay: Xe-135 half-life = 9.14 hours
  const xenonDecayRate = config.xenon.decayRate;

  // Burnout: Neutron absorption by Xe-135 (massive cross-section!)
  // High flux burns xenon faster = less poisoning during operation
  // Low flux (post-SCRAM) = xenon persists longer = harder to restart
  const xenonBurnoutRate = neutronFlux * config.xenon.burnoutRate;

  // Net xenon change
  atom.xenonLevel += xenonBuildupRate;
  atom.xenonLevel -= xenonDecayRate;
  atom.xenonLevel -= xenonBurnoutRate;
  atom.xenonLevel = Math.max(0, Math.min(1, atom.xenonLevel)); // Clamp to [0, 1]

  // Update emission timer
  atom.timeSinceEmission += deltaTime;

  // POSITIVE VOID COEFFICIENT: Calculate reactivity boost from steam voids
  // Get local water density at atom position
  const waterDensity = getWaterDensityAtPosition(
    waterGrid,
    atom.position.x,
    atom.position.y,
    vesselLeft,
    vesselTop
  );
  const localVoidFraction = 1 - waterDensity; // 0 = all water, 1 = all steam

  // Apply void coefficient reactivity boost WITH DIMINISHING RETURNS
  // More steam → higher reactivity → more neutron emission
  // voidCoefficient from config (default: 4.5 β = pre-Chernobyl dangerous level)
  // REALISTIC PHYSICS: Steam becomes less effective past 60-70% void fraction
  // Formula: boost = 1 + (void × coeff) × (1 - void × 0.3)
  // This creates a peak around 60-70%, then drops as steam becomes too diffuse
  const reactivityBoost =
    1.0 + localVoidFraction * config.water.voidCoefficient * (1 - localVoidFraction * 0.3);

  // Check for neutron emission
  // Emission rate scales with energy level (higher energy = faster emission)
  // At minimum threshold energy (0.3): baseEmissionRate
  // At maximum energy (1.0): baseEmissionRate * 3.33 (scale factor)
  const energyScaleFactor = atom.energy / config.atom.emissionThreshold;
  const scaledEmissionRate = config.atom.baseEmissionRate * energyScaleFactor * reactivityBoost;
  const emissionInterval = 1000 / scaledEmissionRate; // ms between emissions

  const shouldEmit =
    atom.energy >= config.atom.emissionThreshold && atom.timeSinceEmission >= emissionInterval;

  if (shouldEmit) {
    // U-235 releases average of 2.43 neutrons per fission
    const numNeutrons = Math.round(config.atom.neutronsPerFission + (Math.random() - 0.5) * 0.5);

    for (let i = 0; i < numNeutrons; i++) {
      // Spawn neutron OUTSIDE collision radius to prevent immediate re-absorption
      // Safe distance = atom.radius + neutron.radius + collisionThreshold + buffer
      const safeDistance =
        atom.radius + config.neutron.radius + config.physics.collisionThreshold + 2;
      const angle = (Math.PI * 2 * i) / numNeutrons + Math.random() * 0.3; // Spread evenly with small randomness

      const offset = {
        x: Math.cos(angle) * safeDistance,
        y: Math.sin(angle) * safeDistance,
      };

      newNeutrons.push(
        createNeutron(
          {
            x: atom.position.x + offset.x,
            y: atom.position.y + offset.y,
          },
          config,
          undefined, // use default speed
          atom.id // parentAtomId - prevents immediate re-absorption
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
 *
 * SCRAM MODE: When targetInsertion = 1.0 and rod is not yet fully inserted,
 * activate SCRAM emergency mode with 3x insertion speed (simulates AZ-5 emergency button)
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
    // SCRAM EMERGENCY MODE: 3x faster insertion when target = 1.0 (full insertion)
    // Real RBMK SCRAM (AZ-5): Still takes 18-21 seconds (design flaw)
    // We speed to ~6-7 seconds for gameplay (still slow enough to be challenging)
    const isScramming = rod.targetInsertion >= 0.99 && delta > 0;
    rod.isScramActive = isScramming;

    const speedMultiplier = isScramming ? 3.0 : 1.0;
    const maxChange = (config.controlRod.insertionSpeed * speedMultiplier * deltaTime) / 1000;
    const change = Math.sign(delta) * Math.min(Math.abs(delta), maxChange);
    rod.insertion = Math.max(0, Math.min(1, rod.insertion + change));

    // Update visual position
    rod.y = 0; // Always starts at top
  } else {
    // Rod reached target, deactivate SCRAM
    rod.isScramActive = false;
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
  waterGrid: WaterGrid,
  vesselLeft: number,
  vesselTop: number,
  config: ReactorConfig,
  currentTime: number,
  debugLog: boolean = false
): {
  remainingNeutrons: Neutron[];
  fissionCount: number;
  absorptionCount: number;
  waterAbsorptionCount: number;
} {
  const remainingNeutrons: Neutron[] = [];
  let fissionCount = 0;
  let absorptionCount = 0;
  let waterAbsorptionCount = 0;

  // Create spatial grid for atoms (grid size = 2x spacing for efficiency)
  const spatialGrid = createSpatialGrid(atoms, config.grid.spacing * 2);
  const searchRadius =
    config.atom.radius + config.neutron.radius + config.physics.collisionThreshold;

  // Debug: Check rod insertion levels
  if (debugLog) {
    const avgInsertion = controlRods.reduce((sum, r) => sum + r.insertion, 0) / controlRods.length;
    const avgHealth = controlRods.reduce((sum, r) => sum + r.health, 0) / controlRods.length;
    console.log(`[RBMK Collision Debug]`, {
      neutronCount: neutrons.length,
      avgRodInsertion: avgInsertion.toFixed(2),
      avgRodHealth: avgHealth.toFixed(2),
      rodsFullyInserted: controlRods.filter(r => r.insertion >= 0.99).length,
    });
  }

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

    // WATER ABSORPTION: Spatially-varying based on local water density
    // CRITICAL TUNING: This must be low enough that neutrons survive to cause fissions
    // Water absorbs neutrons more where density is higher (liquid water)
    // Steam voids (low density) allow neutrons to pass = positive void coefficient
    if (!absorbed) {
      const waterDensity = getWaterDensityAtPosition(
        waterGrid,
        n.position.x,
        n.position.y,
        vesselLeft,
        vesselTop
      );

      // Absorption probability scales with water density
      // Base probability is LOW (0.02 from config) to allow neutron survival
      // Full water (density = 1.0) → 2% absorption per frame
      // Steam (density = 0.0) → 0% absorption (neutrons pass through freely)
      const waterAbsorptionProb = config.water.absorptionProbability * waterDensity;

      if (Math.random() < waterAbsorptionProb) {
        absorbed = true;
        waterAbsorptionCount += 1;
      }
    }

    // Keep neutron if not absorbed
    if (!absorbed) {
      remainingNeutrons.push(n);
    }
  }

  return { remainingNeutrons, fissionCount, absorptionCount, waterAbsorptionCount };
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

  // Initialize 2D arrays with zeros (ambient temperature)
  // Double-buffering: eliminates expensive array copies during diffusion
  const temperatures: number[][] = [];
  const backBuffer: number[][] = [];
  for (let y = 0; y < gridHeight; y++) {
    temperatures[y] = new Array(gridWidth).fill(0);
    backBuffer[y] = new Array(gridWidth).fill(0);
  }

  return {
    width: gridWidth,
    height: gridHeight,
    cellSize,
    temperatures,
    backBuffer,
    activeBuffer: 0, // Start with temperatures as active buffer
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

      // Spread heat to nearby cells (atoms radiate heat)
      // Increased radius for smoother gradients (less "atom splitting" visual)
      const spreadRadius = 2;
      for (let dy = -spreadRadius; dy <= spreadRadius; dy++) {
        for (let dx = -spreadRadius; dx <= spreadRadius; dx++) {
          const nx = gridX + dx;
          const ny = gridY + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && (dx !== 0 || dy !== 0)) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const falloff = 1 / (distance + 1); // Inverse distance falloff
            temperatures[ny]![nx]! += heatGeneration * falloff * 0.4;
          }
        }
      }
    }
  }

  // 2. Heat diffusion (thermal conduction between cells)
  // Use simple averaging with neighbors to simulate heat spreading
  const diffusionRate = 0.35; // How fast heat spreads (0-1) - increased for smoother gradients
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

/**
 * Calculate average xenon-135 poisoning level across all atoms
 *
 * @returns Xenon level 0-1, where 0 = no poisoning, 1 = maximum poisoning
 */
export function calculateAverageXenon(atoms: Atom[]): number {
  if (atoms.length === 0) return 0;

  let sum = 0;
  for (const atom of atoms) {
    sum += atom.xenonLevel || 0;
  }

  return sum / atoms.length;
}

// =============================================================================
// WATER COOLANT SYSTEM (Positive Void Coefficient)
// =============================================================================

/**
 * Create a water density grid
 *
 * Initializes a 2D grid matching the heat grid dimensions.
 * All cells start at 1.0 (full liquid water, no steam).
 */
export function createWaterGrid(width: number, height: number, cellSize: number): WaterGrid {
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  // Initialize all cells to 1.0 (full water density)
  const waterDensity: number[][] = [];
  for (let y = 0; y < gridHeight; y++) {
    waterDensity[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      waterDensity[y]![x] = 1.0; // Start with full water
    }
  }

  return {
    width: gridWidth,
    height: gridHeight,
    cellSize,
    waterDensity,
  };
}

/**
 * Get water density at a specific position
 *
 * Used by neutron collision detection to apply spatially-varying absorption.
 */
export function getWaterDensityAtPosition(
  waterGrid: WaterGrid,
  x: number,
  y: number,
  vesselLeft: number,
  vesselTop: number
): number {
  const gridX = Math.floor((x - vesselLeft) / waterGrid.cellSize);
  const gridY = Math.floor((y - vesselTop) / waterGrid.cellSize);

  if (gridX >= 0 && gridX < waterGrid.width && gridY >= 0 && gridY < waterGrid.height) {
    return waterGrid.waterDensity[gridY]![gridX]!;
  }

  return 1.0; // Outside bounds = assume full water density
}

/**
 * Calculate average void fraction (steam percentage) across the reactor
 *
 * @returns Void fraction 0-1, where 0 = all water, 1 = all steam
 */
export function calculateVoidFraction(waterGrid: WaterGrid): number {
  const { waterDensity, width, height } = waterGrid;
  let voidSum = 0;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const water = waterDensity[y]![x]!;
      const voidFrac = 1 - water; // Steam = 1 - water
      voidSum += voidFrac;
      count++;
    }
  }

  return count > 0 ? voidSum / count : 0;
}

/**
 * Calculate reactor pressure based on temperature and void fraction
 *
 * Uses ideal gas law approximation: P = basePressure + T×tempCoeff + void×voidCoeff
 *
 * @param temperature Average reactor temperature (0-1)
 * @param voidFraction Average void fraction (0-1)
 * @param config Reactor configuration
 * @returns Pressure (0-1 scale, where 0.7 = normal, 1.0 = critical)
 */
export function calculatePressure(
  temperature: number,
  voidFraction: number,
  config: ReactorConfig
): number {
  const { basePressure, temperatureCoefficient, voidCoefficient } = config.pressure;

  // P = base + T×Ct + void×Cv
  const pressure =
    basePressure + temperature * temperatureCoefficient + voidFraction * voidCoefficient;

  // Clamp to [0, 1] range
  return Math.max(0, Math.min(1, pressure));
}

/**
 * Update heat cooling and water state (evaporation/condensation)
 *
 * This function implements two coupled processes in a single pass:
 * 1. Water-cooled heat dissipation (less water = less cooling = positive feedback)
 * 2. Water phase change (hot water → steam, cool steam → water)
 *
 * RBMK Positive Void Coefficient:
 * - High temperature → water boils → steam voids form
 * - Steam has lower density → less neutron absorption
 * - More neutrons → more fissions → higher temperature
 * - THIS IS THE RUNAWAY FEEDBACK THAT CAUSED CHERNOBYL
 *
 * @param heatGrid Heat grid to cool
 * @param waterGrid Water grid to update
 * @param config Reactor configuration
 */
export function updateCoolingAndWater(
  heatGrid: HeatGrid,
  waterGrid: WaterGrid,
  config: ReactorConfig
): void {
  const { width, height } = heatGrid;
  const { boilingPoint, evaporationRate, condensationRate, baseCoolingRate } = config.water;
  const { baseRate, temperatureScaling } = config.regeneration.water;

  // Use active buffer for reading temperatures
  const temperatures = heatGrid.activeBuffer === 0 ? heatGrid.temperatures : heatGrid.backBuffer;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const temp = temperatures[y]![x]!;
      const water = waterGrid.waterDensity[y]![x]!;

      // 1. Water-based cooling (scales with water density)
      // Less water = less cooling = heat stays higher = positive feedback
      const coolingFactor = baseCoolingRate + (1 - baseCoolingRate) * (1 - water);
      temperatures[y]![x] = temp * coolingFactor;

      // 2. Water phase change (evaporation/condensation)
      let newWaterDensity = water;
      if (temp > boilingPoint) {
        // Above boiling point: water → steam (water density decreases)
        newWaterDensity = Math.max(0, water - evaporationRate);
      } else {
        // Below boiling point: steam → water (water density increases)
        newWaterDensity = Math.min(1, water + condensationRate);
      }

      // 3. Water regeneration (coolant circulation)
      // Simulates continuous coolant pump flow replenishing water
      // Lower regeneration at high temps (steam blocks coolant flow)
      if (newWaterDensity < 1.0) {
        const regenRate = temperatureScaling
          ? baseRate * (1.0 - temp) // Less regen at high temps
          : baseRate;
        newWaterDensity = Math.min(1.0, newWaterDensity + regenRate);
      }

      waterGrid.waterDensity[y]![x] = newWaterDensity;
    }
  }
}

// =============================================================================
// DAMAGE AND SAFETY SYSTEMS
// =============================================================================

/**
 * Update fuel integrity based on temperature
 *
 * Fuel damage occurs when temperature exceeds meltdown threshold (~1,200°C).
 * Damaged fuel generates decay heat even without fission (makes shutdown harder).
 *
 * @param atom Fuel atom to update
 * @param temperature Current temperature at atom position (0-1)
 * @param config Reactor configuration
 * @returns Decay heat contribution from damaged fuel
 */
export function updateFuelIntegrity(
  atom: Atom,
  temperature: number,
  config: ReactorConfig
): number {
  const { meltdownTemp, meltdownRate, decayHeatFraction } = config.damage.fuel;
  const { healingRate, healingThreshold } = config.regeneration.fuel;

  // Store temperature for tracking
  atom.lastTemperature = temperature;

  // Damage fuel if temperature exceeds meltdown threshold
  if (temperature > meltdownTemp) {
    atom.integrity = Math.max(0, atom.integrity - meltdownRate);
  }

  // Heal damaged fuel when temperature is LOW (simulates operational maintenance)
  // Only heal when T < healingThreshold × meltdownTemp (safe operating range)
  const healingTempThreshold = meltdownTemp * healingThreshold;
  if (temperature < healingTempThreshold && atom.integrity < 1.0) {
    // Very slow healing (10× slower than damage)
    atom.integrity = Math.min(1.0, atom.integrity + healingRate);
  }

  // Damaged fuel generates decay heat
  const damageLevel = 1 - atom.integrity; // 0 = intact, 1 = fully damaged
  const decayHeat = damageLevel * atom.energy * decayHeatFraction;

  return decayHeat;
}

/**
 * Update control rod health based on temperature and neutron absorption
 *
 * Control rods degrade from:
 * 1. High temperature (heat damage)
 * 2. Neutron bombardment (absorption damage)
 *
 * Damaged rods have reduced absorption efficiency.
 *
 * @param rod Control rod to update
 * @param temperature Current temperature at rod position (0-1)
 * @param config Reactor configuration
 */
export function updateControlRodHealth(
  rod: ControlRod,
  temperature: number,
  config: ReactorConfig
): void {
  const { heatDamageRate, heatDamageThreshold, absorptionDamageRate } = config.damage.rod;
  const { healingRate, healingThreshold } = config.regeneration.rod;

  // Heat damage when temperature exceeds threshold
  if (temperature > heatDamageThreshold) {
    rod.health = Math.max(0, rod.health - heatDamageRate);
  }

  // Heal damaged rods when temperature is SAFE (simulates rod replacement during maintenance)
  // Only heal when T < healingThreshold (below damage threshold)
  if (temperature < healingThreshold && rod.health < 1.0) {
    // Slow healing (represents gradual rod replacement)
    rod.health = Math.min(1.0, rod.health + healingRate);
  }

  // Absorption damage (neutron bombardment causes gradual rod degradation)
  // Track absorptions since last health update to avoid double-counting
  if (!rod.lastAbsorbedCount) {
    rod.lastAbsorbedCount = 0;
  }
  const newAbsorptions = rod.absorbedCount - rod.lastAbsorbedCount;
  if (newAbsorptions > 0) {
    rod.health = Math.max(0, rod.health - newAbsorptions * absorptionDamageRate);
    rod.lastAbsorbedCount = rod.absorbedCount;
  }
}
