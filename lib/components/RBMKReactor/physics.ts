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
 * Reference frame duration in milliseconds (60fps).
 *
 * Global time model: deltaTime (milliseconds, already multiplied by the user
 * speed slider) is the single sim clock. Per-frame rates in config are defined
 * relative to this reference frame; each function receiving deltaTime computes
 * `frameScale = deltaTime / FRAME_MS` so that 60fps@1x behavior is unchanged,
 * the speed slider dilates all subsystems uniformly, and high-refresh displays
 * don't run fast. Conversion rules:
 * - multiplicative per-frame retention factor r → Math.pow(r, frameScale)
 * - additive per-frame rate a → a * frameScale
 * - per-frame probability p → 1 - Math.pow(1 - p, frameScale)
 */
export const FRAME_MS = 1000 / 60;

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
 *
 * Neutrons are born FAST (moderation = 0): the initial velocity magnitude is
 * the thermal speed scaled by config.neutron.fastSpeedMultiplier, and the
 * neutron decelerates toward thermalSpeed as graphite moderates it (see
 * updateNeutronPosition). thermalSpeed captures the per-neutron speed variance
 * so moderation converges to a stable thermal velocity.
 *
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
  const thermalSpeed = baseSpeed * (1 + (Math.random() - 0.5) * variance * 2);
  // Born fast: current magnitude = thermalSpeed × fastSpeedMultiplier
  const fastSpeed = thermalSpeed * config.neutron.fastSpeedMultiplier;

  return {
    id: generateId(),
    position: { ...position },
    velocity: randomVelocity(fastSpeed),
    age: 0,
    speed: fastSpeed,
    radius: config.neutron.radius,
    isNew: true,
    trail: [{ ...position }],
    wallBounces: 0,
    parentAtomId,
    moderation: 0,
    thermalSpeed,
  };
}

/**
 * Update neutron position based on velocity and delta time
 *
 * MODERATION: fast neutrons thermalize as graphite slows them. Each frame the
 * moderation level rises toward 1, and the neutron's speed is interpolated from
 * fast (thermalSpeed × fastSpeedMultiplier at moderation 0) down to thermalSpeed
 * (at moderation 1). The velocity vector is rescaled to the new magnitude,
 * preserving direction.
 *
 * @param config - Reactor config (reads neutron.trailLength + moderation params)
 */
export function updateNeutronPosition(
  neutron: Neutron,
  deltaTime: number,
  config: ReactorConfig
): void {
  // deltaTime is in milliseconds (already speed-scaled); velocity is in pixels
  // per reference frame (60fps), so scale movement by frames elapsed.
  const frameDelta = deltaTime / FRAME_MS;

  // Thermalize: raise moderation toward 1 (additive per-frame rate, frame-scaled)
  // then rescale velocity to the interpolated speed for the new moderation level.
  if ((neutron.moderation ?? 0) < 1) {
    const { moderationRate, fastSpeedMultiplier } = config.neutron;
    neutron.moderation = Math.min(1, (neutron.moderation ?? 0) + moderationRate * frameDelta);

    const targetSpeed =
      neutron.thermalSpeed * (1 + (fastSpeedMultiplier - 1) * (1 - neutron.moderation));
    const mag = Math.sqrt(
      neutron.velocity.vx * neutron.velocity.vx + neutron.velocity.vy * neutron.velocity.vy
    );
    if (mag > 0) {
      const scale = targetSpeed / mag;
      neutron.velocity.vx *= scale;
      neutron.velocity.vy *= scale;
    }
    neutron.speed = targetSpeed;
  }

  neutron.position.x += neutron.velocity.vx * frameDelta;
  neutron.position.y += neutron.velocity.vy * frameDelta;

  // Update trail (capped at config.neutron.trailLength points)
  neutron.trail.unshift({ ...neutron.position });
  if (neutron.trail.length > config.neutron.trailLength) {
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
  neutron: Neutron,
  atom: Atom,
  config: ReactorConfig
): { absorbed: boolean; fission: boolean } {
  // Fission probability scales with moderation: fast neutrons (moderation → 0)
  // rarely fission U-235; thermal neutrons (moderation → 1) fission at the full
  // cross-section rate. This is why RBMK needs a graphite moderator.
  const moderation = neutron.moderation ?? 1;
  const { fissionProbability, fastFissionFactor } = config.neutron;

  // XENON POISONING (v3, CUI-ccq): Xe-135 competes with U-235 for the neutron
  // (2.65M barn cross-section!) — modeled as a FISSION-probability penalty, so
  // poisoning suppresses the chain reaction itself, not merely heat deposition.
  const xenonLevel = atom.xenonLevel || 0;
  const poisoningFactor = 1 - xenonLevel * config.xenon.maxPoisoning;

  const pFission =
    fissionProbability *
    (fastFissionFactor + (1 - fastFissionFactor) * moderation) *
    poisoningFactor;
  const fission = Math.random() < pFission;

  // Energy deposited is THERMAL only in the v3 direct-emission model: fission
  // neutrons are spawned at the fission event (processCollisions), and atom
  // energy drives heat/xenon/visuals — never neutron production.
  const effectiveEnergyGain = config.atom.energyGain;

  if (fission) {
    // Neutron absorbed, causes fission — heat deposited into the channel
    atom.energy = Math.min(1, atom.energy + effectiveEnergyGain);
    atom.emittedCount += 1;
    // Fission products accumulate and later drive (depleting) decay heat
    atom.fissionProductInventory = (atom.fissionProductInventory ?? 0) + 1;
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
  // Water/vessel params unused since v3 (the void reactivity boost moved to the
  // fission site in processCollisions) — kept for call-site API stability.
  _waterGrid: WaterGrid,
  _vesselLeft: number,
  _vesselTop: number,
  config: ReactorConfig,
  deltaTime: number,
  _currentTime: number,
  neutrons: Neutron[] = []
): Neutron[] {
  const newNeutrons: Neutron[] = [];
  const frameScale = deltaTime / FRAME_MS;

  // Initialize delayed-neutron precursor fields for atoms created by older code
  // paths (they may predate these fields).
  if (atom.precursorInventory === undefined) atom.precursorInventory = 0;
  if (atom.precursorBank === undefined) atom.precursorBank = 0;

  // NEUTRON FLUX-BASED ENERGY DECAY
  // Local flux = RAW COUNT of neutrons within fluxRadius (squared-distance
  // comparison avoids a sqrt per neutron). Config rates like xenon.burnoutRate
  // ("per nearby neutron per frame") assume this raw count.
  const fluxRadius = atom.radius + config.neutron.radius + config.physics.collisionThreshold + 20;
  const fluxRadiusSq = fluxRadius * fluxRadius;
  let nearbyNeutronCount = 0;
  for (const n of neutrons) {
    const dx = n.position.x - atom.position.x;
    const dy = n.position.y - atom.position.y;
    if (dx * dx + dy * dy <= fluxRadiusSq) {
      nearbyNeutronCount++;
    }
  }

  // Energy retention scales with flux:
  // - High flux (active reaction): energy decays slower (retention bonus)
  // - Low flux (SCRAM/shutdown): energy decays at the base rate
  // Each nearby neutron adds 0.25% retention, capped at +2.5% bonus.
  const fluxBonus = Math.min(nearbyNeutronCount * 0.0025, 0.025);
  // Cap must sit ABOVE the base decay (0.98 post-rebalance) or the flux bonus
  // would invert into a penalty; 0.995 keeps a hard floor of 0.5% decay/frame.
  let energyDecayRate = Math.min(config.atom.energyDecay + fluxBonus, 0.995);

  // Apply additional decay to prevent spiral wave propagation
  // NOTE (CUI-2dq): the old "extra 5% decay below 0.3 energy" anti-spiral-wave
  // penalty was removed here — it made cold atoms shed their first neutron hit
  // before a second could arrive, which blocked background-driven self-ignition
  // when rods are withdrawn. Spiral waves were retuned away in the criticality
  // rebalance (CUI-iwv.16); the penalty only suppressed legitimate startups.

  // Multiplicative retention factor → frame-scaled via Math.pow
  atom.energy *= Math.pow(energyDecayRate, frameScale);

  // XENON-135 POISONING DYNAMICS (additive per-frame rates, frame-scaled)
  // Xenon builds up from fission, decays naturally, and burns out under neutron flux
  if (!atom.xenonLevel) atom.xenonLevel = 0; // Initialize if missing

  // Build-up: Fission products (I-135) decay to Xe-135
  // Higher energy = more recent fissions = more xenon buildup
  const xenonBuildupRate = atom.energy * config.xenon.buildupRate * frameScale;

  // Natural decay: Xe-135 half-life = 9.14 hours (scaled for gameplay)
  const xenonDecayRate = config.xenon.decayRate * frameScale;

  // Burnout: Neutron absorption by Xe-135 (massive cross-section!)
  // High flux burns xenon faster = less poisoning during operation
  // Low flux (post-SCRAM) = xenon persists longer = harder to restart
  const xenonBurnoutRate = nearbyNeutronCount * config.xenon.burnoutRate * frameScale;

  // Net xenon change
  atom.xenonLevel += xenonBuildupRate;
  atom.xenonLevel -= xenonDecayRate;
  atom.xenonLevel -= xenonBurnoutRate;
  atom.xenonLevel = Math.max(0, Math.min(1, atom.xenonLevel)); // Clamp to [0, 1]

  // NEUTRONICS v3 (CUI-ccq): the charge-then-emit machinery that lived here
  // (emission timer, void reactivity boost on emission rate, threshold-gated
  // prompt emission) was removed. Prompt fission neutrons are now spawned at
  // the fission event itself in processCollisions — so rod withdrawal raises
  // criticality immediately, as it should. Atom energy is purely thermal
  // (heat, xenon production, visuals). This function still emits the
  // spontaneous background and releases banked delayed-neutron precursors.

  // SPONTANEOUS BACKGROUND (CUI-2dq): U-238 spontaneous fission + cosmic rays.
  // Energy-independent, timer-independent, always on. This is the seed flux
  // that makes rod withdrawal itself start the reaction: with rods out, k > 1
  // amplifies the background into criticality; with rods in, it is absorbed.
  const spontaneousP = config.atom.spontaneousEmissionRate * (deltaTime / 1000);
  if (Math.random() < spontaneousP) {
    const safeDistance =
      atom.radius + config.neutron.radius + config.physics.collisionThreshold + 2;
    const angle = Math.random() * Math.PI * 2;
    newNeutrons.push(
      createNeutron(
        {
          x: atom.position.x + Math.cos(angle) * safeDistance,
          y: atom.position.y + Math.sin(angle) * safeDistance,
        },
        config,
        undefined, // use default speed (spontaneous neutrons are fast-born)
        atom.id // parentAtomId - prevents immediate re-absorption
      )
    );
  }

  // DELAYED-NEUTRON RELEASE: precursors decay each frame, releasing banked
  // neutrons on a mean delay of ~1/precursorDecayRate frames. These delayed
  // neutrons are what make the chain reaction controllable — and their slow
  // decay is why a scrammed reactor keeps producing neutrons for a while.
  const release = atom.precursorInventory * config.atom.precursorDecayRate * frameScale;
  // Clamp: float drift at tiny inventories must never go negative
  atom.precursorInventory = Math.max(0, atom.precursorInventory - release);
  atom.precursorBank += release;
  while (atom.precursorBank >= 1) {
    const safeDistance =
      atom.radius + config.neutron.radius + config.physics.collisionThreshold + 2;
    const angle = Math.random() * Math.PI * 2;
    newNeutrons.push(
      createNeutron(
        {
          x: atom.position.x + Math.cos(angle) * safeDistance,
          y: atom.position.y + Math.sin(angle) * safeDistance,
        },
        config,
        undefined, // use default speed (delayed neutrons are also born fast)
        atom.id // parentAtomId - prevents immediate re-absorption
      )
    );
    atom.precursorBank -= 1;
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

    // NOTE: rod.y is set once at initialization (vessel top) and must NOT be
    // written here — insertion depth is expressed via rod.insertion alone.
    // (A previous `rod.y = 0` assignment shifted moving rods above the vessel
    // and broke rod-temperature sampling.)
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
 *
 * Also enforces containment leakage: neutrons that have exhausted their wall
 * bounce budget (config.neutron.maxWallBounces) escape the vessel and are
 * removed, reported via leakedCount.
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
  deltaTime: number,
  debugLog: boolean = false
): {
  remainingNeutrons: Neutron[];
  fissionCount: number;
  absorptionCount: number;
  waterAbsorptionCount: number;
  leakedCount: number;
  /** Prompt fission neutrons spawned at fission events (v3 direct emission, CUI-ccq) */
  spawnedNeutrons: Neutron[];
} {
  const remainingNeutrons: Neutron[] = [];
  let fissionCount = 0;
  let absorptionCount = 0;
  let waterAbsorptionCount = 0;
  let leakedCount = 0;
  const spawnedNeutrons: Neutron[] = [];
  const frameScale = deltaTime / FRAME_MS;

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
    // CONTAINMENT LEAKAGE: neutrons that have bounced off the vessel walls too
    // many times escape through the shielding and are removed from the sim.
    if (n.wallBounces >= config.neutron.maxWallBounces) {
      leakedCount += 1;
      continue;
    }

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

            // DIRECT FISSION EMISSION (v3, CUI-ccq): the fission event itself
            // releases its prompt neutrons — rod withdrawal therefore raises
            // criticality immediately (k = nu x survival, and rods set survival).
            // POSITIVE VOID COEFFICIENT: local steam boosts effective nu with
            // diminishing returns past ~60-70% void (steam too diffuse) — this is
            // where config.water.voidCoefficient lives in the v3 model, and what
            // the graphite-tip displacement exploits during a SCRAM.
            const localVoid =
              1 -
              getWaterDensityAtPosition(
                waterGrid,
                atom.position.x,
                atom.position.y,
                vesselLeft,
                vesselTop
              );
            const nuBoost =
              1 + localVoid * config.water.voidCoefficient * (1 - localVoid * 0.3) * 0.12;
            const numNeutrons = Math.round(
              config.atom.neutronsPerFission * nuBoost + (Math.random() - 0.5) * 0.5
            );
            if (numNeutrons >= 1) {
              // Delayed share banks into precursors (released over ~2.4s by updateAtom)
              atom.precursorInventory =
                (atom.precursorInventory ?? 0) + numNeutrons * config.atom.delayedFraction;
              const promptCount = Math.max(
                1,
                Math.round(numNeutrons * (1 - config.atom.delayedFraction))
              );
              const safeDistance =
                atom.radius + config.neutron.radius + config.physics.collisionThreshold + 2;
              for (let i = 0; i < promptCount; i++) {
                const angle = (Math.PI * 2 * i) / promptCount + Math.random() * 0.3;
                spawnedNeutrons.push(
                  createNeutron(
                    {
                      x: atom.position.x + Math.cos(angle) * safeDistance,
                      y: atom.position.y + Math.sin(angle) * safeDistance,
                    },
                    config,
                    undefined, // fission neutrons are fast-born
                    atom.id // parent exclusion prevents instant re-absorption
                  )
                );
              }
            }
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

      // Absorption probability scales with water density, frame-scaled so the
      // per-reference-frame probability holds at any deltaTime
      // Base probability is LOW (0.02 from config) to allow neutron survival
      // Full water (density = 1.0) → 2% absorption per reference frame
      // Steam (density = 0.0) → 0% absorption (neutrons pass through freely)
      const waterAbsorptionProb =
        1 - Math.pow(1 - config.water.absorptionProbability * waterDensity, frameScale);

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

  return {
    remainingNeutrons,
    fissionCount,
    absorptionCount,
    waterAbsorptionCount,
    leakedCount,
    spawnedNeutrons,
  };
}

/**
 * Calculate instantaneous reaction rate (fissions per simulated second)
 *
 * Extrapolates this frame's fission count to a full second of sim time.
 * The raw value is noisy frame-to-frame; the caller smooths it with an EMA.
 */
export function calculateReactionRate(fissionCount: number, deltaTime: number): number {
  return deltaTime > 0 ? (fissionCount * 1000) / deltaTime : 0;
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
 * - Heat is proportional to atom energy level (written into the active buffer)
 *
 * Heat diffusion (double-buffered):
 * - Reads the active buffer, writes EVERY cell into the inactive buffer,
 *   then swaps buffers — no per-frame array allocation.
 *
 * Cooling is NOT applied here: updateCoolingAndWater is the single,
 * water-density-scaled cooling path and also owns the [0, 1] clamp.
 * (Previously a hardcoded 0.98/frame cooling here double-applied cooling.)
 */
export function updateHeatGrid(
  heatGrid: HeatGrid,
  atoms: Atom[],
  deltaTime: number,
  vesselLeft: number,
  vesselTop: number
): void {
  const { width, height, cellSize } = heatGrid;
  const frameScale = deltaTime / FRAME_MS;
  const src = getActiveTemperatures(heatGrid);
  const dst = heatGrid.activeBuffer === 0 ? heatGrid.backBuffer : heatGrid.temperatures;

  // 1. Heat generation from atoms (into the active buffer)
  for (const atom of atoms) {
    // Convert atom position to grid coordinates
    const gridX = Math.floor((atom.position.x - vesselLeft) / cellSize);
    const gridY = Math.floor((atom.position.y - vesselTop) / cellSize);

    // Check bounds
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      // Heat generated is proportional to atom energy
      // High energy atoms (0.7-1.0) generate significant heat
      // Scale: energy 1.0 = temperature increase of 0.05 per reference frame
      const heatGeneration = atom.energy * 0.05 * frameScale;
      src[gridY]![gridX]! += heatGeneration;

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
            src[ny]![nx]! += heatGeneration * falloff * 0.4;
          }
        }
      }
    }
  }

  // 2. Heat diffusion (thermal conduction between cells)
  // Simple averaging with neighbors; frame-scaled blend rate capped below 1
  // for numerical stability at large deltaTime.
  const effectiveDiffusion = Math.min(0.35 * frameScale, 0.9);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = src[y]![x]!;
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
          sum += src[ny]![nx]!;
          count++;
        }
      }

      const avg = sum / count;
      const current = src[y]![x]!;

      // Blend between current temperature and neighbor average,
      // writing into the inactive buffer (every cell — no stale values)
      dst[y]![x] = current + (avg - current) * effectiveDiffusion;
    }
  }

  // 3. Swap buffers: the freshly-written buffer becomes active
  heatGrid.activeBuffer = heatGrid.activeBuffer === 0 ? 1 : 0;
}

/**
 * Get the currently-active temperature buffer.
 *
 * updateHeatGrid double-buffers and swaps every frame, so consumers must never
 * read heatGrid.temperatures directly — always go through this helper.
 */
export function getActiveTemperatures(heatGrid: HeatGrid): number[][] {
  return heatGrid.activeBuffer === 0 ? heatGrid.temperatures : heatGrid.backBuffer;
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
    return getActiveTemperatures(heatGrid)[gridY]![gridX]!;
  }

  return 0; // Outside bounds = ambient temperature
}

/**
 * Calculate average reactor temperature from heat grid (active buffer)
 */
export function calculateAverageTemperature(heatGrid: HeatGrid): number {
  const { width, height } = heatGrid;
  const temperatures = getActiveTemperatures(heatGrid);
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
 * This is now the SINGLE cooling path for the heat grid. (Bug fix: cooling
 * used to be double-applied — a hardcoded 0.98/frame pass in updateHeatGrid
 * plus this water-scaled pass. updateHeatGrid no longer cools, and this
 * function absorbed the [0, 1] temperature clamp. Steam voids now fully
 * suspend cooling — a stronger, more authentic positive-void feedback.)
 *
 * Two coupled processes in a single pass:
 * 1. Water-cooled heat dissipation (less water = less cooling = positive feedback)
 * 2. Water phase change (hot water → steam, cool steam → water)
 *
 * RBMK Positive Void Coefficient:
 * - High temperature → water boils → steam voids form
 * - Steam has lower density → less neutron absorption
 * - More neutrons → more fissions → higher temperature
 * - THIS IS THE RUNAWAY FEEDBACK THAT CAUSED CHERNOBYL
 *
 * BOTTOM-FED COOLANT: the recirculation pumps feed water in from the bottom of
 * the core, so regeneration is strongest at the bottom row and weakest at the
 * top (scaled by config.water.pumpFlowGradient). Steam voids therefore form
 * top-first, before the coolant has worked its way up. pumpPower (0–1.5) is the
 * recirc-pump control: 0 = pumps tripped (no fresh coolant), 1 = nominal.
 *
 * @param heatGrid Heat grid to cool
 * @param waterGrid Water grid to update
 * @param config Reactor configuration
 * @param deltaTime Elapsed sim time in milliseconds (already speed-scaled)
 * @param pumpPower Recirculation pump control (0–1.5, default 1 = nominal flow)
 */
export function updateCoolingAndWater(
  heatGrid: HeatGrid,
  waterGrid: WaterGrid,
  config: ReactorConfig,
  deltaTime: number,
  pumpPower: number = 1
): void {
  const { width, height } = heatGrid;
  const { boilingPoint, evaporationRate, condensationRate, baseCoolingRate, pumpFlowGradient } =
    config.water;
  const { baseRate, temperatureScaling } = config.regeneration.water;
  const frameScale = deltaTime / FRAME_MS;

  // Always read/write the currently-active temperature buffer
  const temperatures = getActiveTemperatures(heatGrid);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const temp = temperatures[y]![x]!;
      const water = waterGrid.waterDensity[y]![x]!;

      // 1. Water-based cooling (scales with water density), frame-scaled
      // Less water = less cooling = heat stays higher = positive feedback
      // Radiative floor (CUI-n1h): even a fully steam-blanketed cell (water = 0)
      // sheds at least 0.5%/frame via radiation/conduction — without the floor,
      // coolingFactor hits exactly 1.0 at zero water and voided hot zones can
      // never cool, deadlocking post-shutdown recovery.
      const coolingFactor = Math.min(baseCoolingRate + (1 - baseCoolingRate) * (1 - water), 0.995);
      const cooled = temp * Math.pow(coolingFactor, frameScale);
      // Clamp to [0, 1] (single clamp site, moved here from updateHeatGrid)
      temperatures[y]![x] = Math.max(0, Math.min(1, cooled));

      // 2. Water phase change (evaporation/condensation), frame-scaled rates
      let newWaterDensity = water;
      if (temp > boilingPoint) {
        // Above boiling point: water → steam (water density decreases)
        newWaterDensity = Math.max(0, water - evaporationRate * frameScale);
      } else {
        // Below boiling point: steam → water (water density increases)
        newWaterDensity = Math.min(1, water + condensationRate * frameScale);
      }

      // 3. Water regeneration (coolant circulation), frame-scaled
      // Simulates continuous coolant pump flow replenishing water.
      // Bottom-fed: rowFactor is 1.0 at the bottom row (y = height-1) and
      // (1 - pumpFlowGradient) at the top row, so voids form top-first.
      // Scaled by pumpPower (recirc pump control) and, if enabled, by
      // temperature (steam blocks coolant flow at high temps).
      if (newWaterDensity < 1.0) {
        const rowFactor = 1 - pumpFlowGradient * (1 - y / (height - 1));
        // Clamped at 0: the PRE-cooling temp read above can exceed 1 (heat
        // generation is unclamped until the cooling pass writes back), and a
        // negative "regen" would silently drain water below zero.
        const tempFactor = temperatureScaling ? Math.max(0, 1.0 - temp) : 1.0;
        const regenRate = baseRate * rowFactor * pumpPower * tempFactor * frameScale;
        newWaterDensity = Math.min(1.0, newWaterDensity + regenRate);
      }

      waterGrid.waterDensity[y]![x] = newWaterDensity;
    }
  }
}

/**
 * Apply graphite-tip water displacement (the Chernobyl AZ-5 "positive scram").
 *
 * RBMK control rods have a graphite follower/displacer below the boron section.
 * When a raised rod begins to lower, the graphite tip enters the channel FIRST,
 * pushing out neutron-absorbing water before any boron arrives. The resulting
 * local void — via the positive void coefficient — briefly INCREASES reactivity
 * at the bottom of the core. On 26 April 1986, pressing AZ-5 to shut the reactor
 * down inserted enough positive reactivity from all rods at once to trigger the
 * power excursion that destroyed Unit 4.
 *
 * Only rods actively moving DOWN (targetInsertion > insertion) displace water.
 * For each such rod, the graphite tip spans [tipY, tipY + graphiteTipLength];
 * water cells intersecting that vertical span within the rod's x extent lose
 * graphiteTipDisplacement × frameScale of density per frame (clamped at 0).
 */
export function applyGraphiteTipDisplacement(
  waterGrid: WaterGrid,
  rods: ControlRod[],
  config: ReactorConfig,
  deltaTime: number,
  vesselLeft: number,
  vesselTop: number
): void {
  const frameScale = deltaTime / FRAME_MS;
  const { cellSize, width, height } = waterGrid;
  const { graphiteTipLength, graphiteTipDisplacement } = config.controlRod;

  for (const rod of rods) {
    // Only rods moving DOWN drive the graphite tip into fresh water
    if (rod.targetInsertion <= rod.insertion + 0.001) continue;

    // Graphite follower spans from the current rod tip downward
    const tipY = rod.y + rod.maxHeight * rod.insertion;
    const tipBottom = tipY + graphiteTipLength;
    const rodLeft = rod.x - rod.width / 2;
    const rodRight = rod.x + rod.width / 2;

    // Convert world extents to water-grid cell ranges
    const minCol = Math.floor((rodLeft - vesselLeft) / cellSize);
    const maxCol = Math.floor((rodRight - vesselLeft) / cellSize);
    const minRow = Math.floor((tipY - vesselTop) / cellSize);
    const maxRow = Math.floor((tipBottom - vesselTop) / cellSize);

    for (let row = minRow; row <= maxRow; row++) {
      if (row < 0 || row >= height) continue;
      for (let col = minCol; col <= maxCol; col++) {
        if (col < 0 || col >= width) continue;
        waterGrid.waterDensity[row]![col] = Math.max(
          0,
          waterGrid.waterDensity[row]![col]! - graphiteTipDisplacement * frameScale
        );
      }
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
 * @param deltaTime Elapsed sim time in milliseconds (already speed-scaled)
 * @returns Decay heat contribution from damaged fuel (frame-scaled additive rate)
 */
export function updateFuelIntegrity(
  atom: Atom,
  temperature: number,
  config: ReactorConfig,
  deltaTime: number
): number {
  const { meltdownTemp, meltdownRate, decayHeatPerFission, decayHeatDecayRate } =
    config.damage.fuel;
  const { healingRate, healingThreshold } = config.regeneration.fuel;
  const frameScale = deltaTime / FRAME_MS;

  // Store temperature for tracking
  atom.lastTemperature = temperature;

  // Damage fuel if temperature exceeds meltdown threshold (frame-scaled rate)
  if (temperature > meltdownTemp) {
    atom.integrity = Math.max(0, atom.integrity - meltdownRate * frameScale);
  }

  // Heal damaged fuel when temperature is LOW (simulates operational maintenance)
  // Only heal when T < healingThreshold × meltdownTemp (safe operating range)
  const healingTempThreshold = meltdownTemp * healingThreshold;
  if (temperature < healingTempThreshold && atom.integrity < 1.0) {
    // Very slow healing (10× slower than damage), frame-scaled
    atom.integrity = Math.min(1.0, atom.integrity + healingRate * frameScale);
  }

  // DECAY HEAT (inventory-driven, CUI-n1h): fission products accumulated during
  // operation deplete exponentially (~29s half-life) while each remaining unit
  // adds a sliver of energy per frame. The caller adds the return value to the
  // atom's energy (capped below the emission threshold), which then radiates
  // into the heat grid. Because the inventory DEPLETES, a shut-down core stays
  // hot for a while and then genuinely cools — unlike the old damage-fraction
  // model, which generated heat forever and deadlocked the thermal recovery.
  if (atom.fissionProductInventory === undefined) atom.fissionProductInventory = 0;
  atom.fissionProductInventory *= Math.pow(1 - decayHeatDecayRate, frameScale);
  return atom.fissionProductInventory * decayHeatPerFission * frameScale;
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
 * @param deltaTime Elapsed sim time in milliseconds (already speed-scaled)
 */
export function updateControlRodHealth(
  rod: ControlRod,
  temperature: number,
  config: ReactorConfig,
  deltaTime: number
): void {
  const { heatDamageRate, heatDamageThreshold, absorptionDamageRate } = config.damage.rod;
  const { healingRate, healingThreshold } = config.regeneration.rod;
  const frameScale = deltaTime / FRAME_MS;

  // Heat damage when temperature exceeds threshold (frame-scaled rate)
  if (temperature > heatDamageThreshold) {
    rod.health = Math.max(0, rod.health - heatDamageRate * frameScale);
  }

  // Heal damaged rods when temperature is SAFE (simulates rod replacement during maintenance)
  // Only heal when T < healingThreshold (below damage threshold)
  if (temperature < healingThreshold && rod.health < 1.0) {
    // Slow healing (represents gradual rod replacement), frame-scaled
    rod.health = Math.min(1.0, rod.health + healingRate * frameScale);
  }

  // Absorption damage (neutron bombardment causes gradual rod degradation)
  // Per-event rate — intentionally NOT frame-scaled (each absorption is a
  // discrete event whose frequency already scales with sim time)
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
