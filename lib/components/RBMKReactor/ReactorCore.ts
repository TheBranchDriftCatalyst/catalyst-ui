/**
 * ReactorCore — headless RBMK simulation core (CUI-iwv.13)
 *
 * A pure, framework-free orchestrator for the RBMK reactor simulation. No React,
 * no D3, no DOM — just state plus a fixed-timestep step() that advances it. This
 * is the single source of truth for simulation behavior, consumed by BOTH the
 * RBMKReactor React component (rendering + interaction on top) and the
 * integration-test harness (scenario builders + assertions on top). Extracting
 * it here removes the duplicated step loop that previously lived in both places
 * and makes the sim Web-Worker ready (nothing it touches is browser-bound).
 *
 * ReactorCore ORCHESTRATES the pure functions in physics.ts in the exact order
 * the component's animate() used to; it does not reimplement any physics. It is
 * deliberately silent (no console logging) — the component supplies its own
 * diagnostic logging from the per-step StepStats this returns.
 */

import { Atom, ControlRod, Neutron, ReactorConfig, SimEvent } from "./types";
import {
  FRAME_MS,
  updateNeutronPosition,
  updateAtom,
  updateControlRod,
  applyGraphiteTipDisplacement,
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

/**
 * Construction options for a ReactorCore.
 *
 * `rodInsertion` controls the initial rod pattern:
 *  - omitted        → the component's staggered startup (even rods 0.65, odd 0.45)
 *  - number         → every rod at that uniform insertion
 *  - number[]       → per-rod insertion (index-aligned, falls back to staggered)
 * `seedNeutrons` seeds that many thermal source neutrons (like Cf-252 startup).
 */
export interface ReactorCoreOptions {
  width: number;
  height: number;
  seedNeutrons?: number;
  rodInsertion?: number | number[];
}

/**
 * Per-step accounting returned by step(). A superset of the raw collision
 * counts plus the substep count and age-out count, so a consumer (the React
 * component) can reproduce its frame-level diagnostic logging without the core
 * ever touching the console.
 */
export interface StepStats {
  emitted: number;
  fissions: number;
  rodAbsorbed: number;
  waterAbsorbed: number;
  leaked: number;
  neutronCount: number;
  substeps: number;
  removedByAge: number;
}

/** Running totals over the reactor's lifetime (mirrors the old SimulationState counters). */
export interface ReactorTotals {
  emitted: number;
  fissions: number;
  rodAbsorbed: number;
  waterAbsorbed: number;
  leaked: number;
  /** Number of source neutrons seeded at construction (for neutron accounting). */
  seeds: number;
}

export class ReactorCore {
  readonly config: ReactorConfig;
  readonly width: number;
  readonly height: number;

  // --- Vessel geometry (inner 8% containment; the physics boundary) ---
  readonly vesselLeft: number;
  readonly vesselTop: number;
  readonly vesselBounds: { left: number; top: number; right: number; bottom: number };

  // --- Simulation state (mutated in place by step) ---
  atoms: Atom[] = [];
  controlRods: ControlRod[] = [];
  neutrons: Neutron[] = [];
  heatGrid: ReturnType<typeof createHeatGrid>;
  waterGrid: ReturnType<typeof createWaterGrid>;

  // --- Lifetime totals ---
  totals: ReactorTotals = {
    emitted: 0,
    fissions: 0,
    rodAbsorbed: 0,
    waterAbsorbed: 0,
    leaked: 0,
    seeds: 0,
  };

  // --- Derived metrics (recomputed each step) ---
  reactionRate = 0;
  powerOutputMW = 0;
  reactorTemp = 0;
  voidFraction = 0;
  reactorPressure: number;
  xenonLevel = 0;
  events: SimEvent[] = [];

  // Inert UI/control fields carried for SimulationState fidelity. The core never
  // mutates these — the React component owns run/pause and speed; they exist so
  // the component's uncontrolled-prop fallback and onStateChange payload match
  // the old initializeSimulation defaults exactly.
  isRunning = false;
  speed: number;

  /**
   * Wall-clock timestamp of the last step (the currentTime argument passed in).
   * The component tracks its own RAF timing; the test harness uses this as an
   * accumulating sim clock.
   */
  lastFrameTime = 0;
  /** Sim-time accumulator used by the headless harness (never touched by the component). */
  simTime = 0;

  // Rising-edge tracking for alarm events (keyed by condition) so each alarm
  // fires once per crossing. Lives in the core now — event detection moved here
  // from the component's animate() (CUI-iwv.13).
  private prevAlarmFlags: Record<string, boolean> = {};

  constructor(config: ReactorConfig, opts: ReactorCoreOptions) {
    this.config = config;
    this.width = opts.width;
    this.height = opts.height;

    const cfg = config;
    const w = opts.width;
    const h = opts.height;

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

    this.vesselLeft = vesselLeft;
    this.vesselTop = vesselTop;
    this.vesselBounds = {
      left: vesselLeft,
      top: vesselTop,
      right: w * (1 - vesselPadding),
      bottom: h * (1 - vesselPadding),
    };

    // Heat + water grids sized to the vessel (one cell per ~25px)
    const heatCellSize = 25;
    this.heatGrid = createHeatGrid(vesselWidth, vesselHeight, heatCellSize);
    this.waterGrid = createWaterGrid(vesselWidth, vesselHeight, heatCellSize);

    // Grid centering within the vessel
    const gridWidth = (cfg.grid.columns - 1) * cfg.grid.spacing;
    const gridHeight = (cfg.grid.rows - 1) * cfg.grid.spacing;
    const offsetX = vesselLeft + (vesselWidth - gridWidth) / 2;
    const offsetY = vesselTop + (vesselHeight - gridHeight) / 2;

    // Create fuel atoms in grid
    for (let row = 0; row < cfg.grid.rows; row++) {
      for (let col = 0; col < cfg.grid.columns; col++) {
        this.atoms.push({
          id: `atom-${row}-${col}`,
          position: {
            x: offsetX + col * cfg.grid.spacing,
            y: offsetY + row * cfg.grid.spacing,
          },
          gridX: col,
          gridY: row,
          energy: 0.1 + Math.random() * 0.15, // Start at 0.1-0.25 energy (mostly below emission threshold)
          radius: cfg.atom.radius,
          emittedCount: 0,
          integrity: 1.0, // Start with intact fuel
          lastTemperature: 0, // Cold startup
          xenonLevel: cfg.xenon.initialLevel, // Seed poisoning (models an "iodine pit" restart)
          precursorInventory: 0, // No banked delayed-neutron precursors yet
          precursorBank: 0, // Fractional precursor emission accumulator
          fissionProductInventory: 0, // Decay-heat driver: builds with fissions, depletes ~29s half-life
        });
      }
    }

    // Seed "neutron source" neutrons — like californium-252 in real reactors.
    const numSeedNeutrons = opts.seedNeutrons ?? 0;
    this.totals.seeds = numSeedNeutrons;
    for (let i = 0; i < numSeedNeutrons; i++) {
      const randomAtomIndex = Math.floor(Math.random() * this.atoms.length);
      const randomAtom = this.atoms[randomAtomIndex];
      if (randomAtom) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = cfg.neutron.baseSpeed;
        // Spawn just outside the parent atom's collision radius so seed neutrons travel
        // instead of being absorbed on frame 1; parentAtomId marks the emitting atom so
        // collision handling can ignore it
        const safeDistance =
          cfg.atom.radius + cfg.neutron.radius + cfg.physics.collisionThreshold + 2;
        const spawnX = randomAtom.position.x + Math.cos(angle) * safeDistance;
        const spawnY = randomAtom.position.y + Math.sin(angle) * safeDistance;
        this.neutrons.push({
          id: `initial-neutron-${i}`,
          position: { x: spawnX, y: spawnY },
          velocity: {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
          },
          age: 0,
          speed,
          radius: cfg.neutron.radius,
          isNew: true,
          parentAtomId: randomAtom.id,
          trail: [{ x: spawnX, y: spawnY }],
          wallBounces: 0,
          moderation: 1, // Seed neutrons are deliberately thermal (ready to fission)
          thermalSpeed: speed,
        });
      }
    }

    // Create control rods centered in gaps between atom columns.
    const rodInsertionOpt = opts.rodInsertion;
    for (let i = 0; i < cfg.controlRod.count; i++) {
      // Rod i is centered between columns (2*i) and (2*i + 1)
      const gapCenterX = (i * 2 + 0.5) * cfg.grid.spacing;

      // Insertion pattern: explicit opt (uniform number or per-rod array) or the
      // component's staggered startup default (even rods 0.65, odd rods 0.45),
      // which creates a checkerboard absorption pattern for flux stability.
      let insertion: number;
      if (typeof rodInsertionOpt === "number") {
        insertion = rodInsertionOpt;
      } else if (Array.isArray(rodInsertionOpt)) {
        insertion = rodInsertionOpt[i] ?? (i % 2 === 0 ? 0.65 : 0.45);
      } else {
        insertion = i % 2 === 0 ? 0.65 : 0.45;
      }

      this.controlRods.push({
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

    // Pressure starts at atmospheric (cold shutdown)
    this.reactorPressure = cfg.pressure.basePressure;
    // Default speed multiplier (cold-shutdown / paused startup)
    this.speed = cfg.simulation.defaultSpeed;
  }

  /**
   * Advance the simulation by exactly one fixed reference frame's worth of time.
   *
   * `deltaTime` is milliseconds (already speed-scaled by the caller) — the
   * component always passes FRAME_MS and drains a fixed-timestep accumulator, so
   * physics advances in whole reference frames decoupled from RAF cadence.
   * `currentTime` is the wall-clock timestamp used for time-based physics
   * (absorption cooldowns, parent-neutron exclusion) and event timestamps.
   * `pumpPower` (0–1.5) scales coolant regeneration.
   *
   * Returns per-step accounting. Behavior is verbatim to the component's old
   * inner stepSimulation() plus the rising-edge alarm detection that used to run
   * once per RAF in animate().
   */
  step(deltaTime: number, currentTime: number, pumpPower: number = 1): StepStats {
    const cfg = this.config;
    const vesselLeft = this.vesselLeft;
    const vesselTop = this.vesselTop;
    const vesselBounds = this.vesselBounds;

    // Update atoms and collect emitted neutrons
    const emittedNeutrons: Neutron[] = [];
    for (const atom of this.atoms) {
      const newNeutrons = updateAtom(
        atom,
        this.waterGrid,
        vesselLeft,
        vesselTop,
        cfg,
        deltaTime,
        currentTime,
        this.neutrons // Pass current neutrons for flux calculation
      );
      emittedNeutrons.push(...newNeutrons);

      // Get temperature at atom position for fuel damage calculation
      const temperature = getHeatAtPosition(
        this.heatGrid,
        atom.position.x,
        atom.position.y,
        vesselLeft,
        vesselTop
      );

      // Update fuel integrity and get decay heat contribution
      const decayHeat = updateFuelIntegrity(atom, temperature, cfg, deltaTime);
      // Decay heat keeps damaged fuel WARM but must never drive fission itself:
      // cap decay-heat contributions just below the emission threshold. Without
      // the cap, energy → decayHeat → energy is a positive feedback loop and a
      // sufficiently damaged atom becomes a self-powered neutron fountain that
      // no SCRAM can stop (retention + 0.15×damage exceeds 1). Real decay heat
      // is ~7% thermal output — it makes shutdown harder, not impossible.
      const decayHeatCeiling = cfg.atom.emissionThreshold * 0.9;
      if (atom.energy < decayHeatCeiling) {
        atom.energy = Math.min(decayHeatCeiling, atom.energy + decayHeat);
      }
    }

    // Update control rods
    for (const rod of this.controlRods) {
      updateControlRod(rod, cfg, deltaTime, currentTime);

      // Sample temperature at the rod's inserted tip for heat damage calculation.
      // (rod.y sits at/above the vessel top, where heat is always 0 — sampling there
      // would mean rods never take heat damage.) Clamp the sample inside the vessel.
      const rodTipY = rod.y + rod.maxHeight * rod.insertion;
      const temperature =
        rodTipY > vesselTop
          ? getHeatAtPosition(
              this.heatGrid,
              rod.x,
              Math.min(rodTipY, vesselBounds.bottom - 1),
              vesselLeft,
              vesselTop
            )
          : 0;

      updateControlRodHealth(rod, temperature, cfg, deltaTime);
    }

    // Graphite tip displacement: the rod's graphite follower displaces water as it transits,
    // opening a local void ahead of the boron — the RBMK design flaw. Must run after rod
    // motion (so tip positions are current) and before the heat/water update consumes them.
    applyGraphiteTipDisplacement(
      this.waterGrid,
      this.controlRods,
      cfg,
      deltaTime,
      vesselLeft,
      vesselTop
    );

    // OPTIMIZED: Update heat and water in two steps for better performance
    // Step 1: Heat generation and diffusion (atom energy -> heat spreading)
    updateHeatGrid(this.heatGrid, this.atoms, deltaTime, vesselLeft, vesselTop);

    // Step 2: Coupled cooling + water updates in single pass
    // - Cooling rate depends on water density (less water = less cooling)
    // - Water boils/condenses based on temperature
    // - Pump throughput scales coolant regeneration
    // This drives the positive void coefficient feedback loop
    updateCoolingAndWater(this.heatGrid, this.waterGrid, cfg, deltaTime, pumpPower);

    // SUBSTEPPED MOVEMENT + COLLISION
    // Each fixed step is one reference frame, so a neutron rarely outruns the collision disc —
    // this usually resolves to 1 substep. It remains as a guard for fast (energized) neutrons.
    // Frame-scaled probabilities in processCollisions compose correctly across substeps:
    // applying p over K slices of deltaTime equals applying it once.
    const maxSafeStep = cfg.atom.radius + cfg.neutron.radius; // px per substep
    const fastestSpeed = cfg.neutron.baseSpeed * cfg.neutron.fastSpeedMultiplier; // fast-born ceiling, px per reference frame
    const maxTravel = (fastestSpeed * deltaTime) / FRAME_MS; // px this step
    const substeps = Math.min(6, Math.max(1, Math.ceil(maxTravel / maxSafeStep)));
    const subDelta = deltaTime / substeps;

    let spawnedCount = 0;
    const collisionResults = {
      fissionCount: 0,
      absorptionCount: 0,
      waterAbsorptionCount: 0,
      leakedCount: 0,
    };

    for (let s = 0; s < substeps; s++) {
      // Move neutrons (and their motion trails) and age them by the substep
      for (const neutron of this.neutrons) {
        updateNeutronPosition(neutron, subDelta, cfg);
        neutron.age += subDelta;
      }

      const stepResults = processCollisions(
        this.neutrons,
        this.atoms,
        this.controlRods,
        this.waterGrid,
        vesselLeft,
        vesselTop,
        cfg,
        currentTime,
        subDelta,
        false // core is silent; the component supplies its own diagnostics
      );

      this.neutrons = stepResults.remainingNeutrons;
      // v3 direct emission (CUI-ccq): fission events spawn their prompt neutrons
      // here; they begin moving on the next substep (movement runs first).
      // Counted separately — pushing them into emittedNeutrons would append twice.
      for (const spawned of stepResults.spawnedNeutrons) {
        this.neutrons.push(spawned);
      }
      spawnedCount += stepResults.spawnedNeutrons.length;
      collisionResults.fissionCount += stepResults.fissionCount;
      collisionResults.absorptionCount += stepResults.absorptionCount;
      collisionResults.waterAbsorptionCount += stepResults.waterAbsorptionCount;
      collisionResults.leakedCount += stepResults.leakedCount;
    }

    // Accumulate neutrons that escaped containment (leakage detected in processCollisions)
    this.totals.leaked += collisionResults.leakedCount;

    // OPTIMIZATION: In-place filtering to remove old neutrons (eliminates array allocation)
    // Use a write index to compact the array in-place
    let writeIndex = 0;
    for (let i = 0; i < this.neutrons.length; i++) {
      if (this.neutrons[i]!.age < cfg.neutron.maxAge) {
        if (writeIndex !== i) {
          this.neutrons[writeIndex] = this.neutrons[i]!;
        }
        writeIndex++;
      }
    }
    const removedByAge = this.neutrons.length - writeIndex;
    // Truncate array to new length (no allocation, just updates length property)
    this.neutrons.length = writeIndex;

    // OPTIMIZATION: Append emitted neutrons in-place (no spread operator allocation)
    for (const neutron of emittedNeutrons) {
      this.neutrons.push(neutron);
    }

    // Check vessel boundary collisions and reflect neutrons off containment walls
    for (const neutron of this.neutrons) {
      // Left wall
      if (neutron.position.x - neutron.radius <= vesselBounds.left) {
        neutron.position.x = vesselBounds.left + neutron.radius;
        neutron.velocity.vx = Math.abs(neutron.velocity.vx) * cfg.physics.boundaryDamping; // energy loss per bounce (config)
        neutron.wallBounces += 1;
      }
      // Right wall
      if (neutron.position.x + neutron.radius >= vesselBounds.right) {
        neutron.position.x = vesselBounds.right - neutron.radius;
        neutron.velocity.vx = -Math.abs(neutron.velocity.vx) * cfg.physics.boundaryDamping;
        neutron.wallBounces += 1;
      }
      // Top wall
      if (neutron.position.y - neutron.radius <= vesselBounds.top) {
        neutron.position.y = vesselBounds.top + neutron.radius;
        neutron.velocity.vy = Math.abs(neutron.velocity.vy) * cfg.physics.boundaryDamping;
        neutron.wallBounces += 1;
      }
      // Bottom wall
      if (neutron.position.y + neutron.radius >= vesselBounds.bottom) {
        neutron.position.y = vesselBounds.bottom - neutron.radius;
        neutron.velocity.vy = -Math.abs(neutron.velocity.vy) * cfg.physics.boundaryDamping;
        neutron.wallBounces += 1;
      }
    }

    // Note: Neutron leakage is handled in processCollisions, which removes neutrons that
    // exceed the wall-bounce limit and reports them via leakedCount (accumulated into
    // this.totals.leaked above)

    // OPTIMIZATION: In-place truncation to max count (eliminates slice allocation)
    if (this.neutrons.length > cfg.neutron.maxCount) {
      this.neutrons.length = cfg.neutron.maxCount;
    }

    // Calculate reactor metrics
    const reactorTemp = calculateAverageTemperature(this.heatGrid);
    const voidFraction = calculateVoidFraction(this.waterGrid);
    const reactorPressure = calculatePressure(reactorTemp, voidFraction, cfg);
    const xenonLevel = calculateAverageXenon(this.atoms);

    // Update state metrics (this.neutrons already updated in-place above)
    this.totals.emitted += emittedNeutrons.length + spawnedCount;
    this.totals.rodAbsorbed += collisionResults.absorptionCount;
    this.totals.fissions += collisionResults.fissionCount;
    this.totals.waterAbsorbed += collisionResults.waterAbsorptionCount;
    // Reaction rate: instantaneous fissions/sec from this step, smoothed with an EMA.
    // deltaTime is the fixed FRAME_MS, so the smoothing time-constant is constant per step.
    const instantRate = calculateReactionRate(collisionResults.fissionCount, deltaTime);
    const emaAlpha = 1 - Math.pow(0.9, deltaTime / FRAME_MS);
    this.reactionRate += (instantRate - this.reactionRate) * emaAlpha;
    // Thermal power output derived from the (smoothed) fission rate
    this.powerOutputMW = this.reactionRate * cfg.simulation.megawattsPerFission;
    this.reactorTemp = reactorTemp;
    this.voidFraction = voidFraction;
    this.reactorPressure = reactorPressure;
    this.xenonLevel = xenonLevel;
    this.lastFrameTime = currentTime;

    // EVENT/ALARM EVALUATION — on the post-step state. Rising edges push an event;
    // falling edges just reset the flag. Events form a bounded ring buffer (most
    // recent 50). Moved into the core from animate() (CUI-iwv.13); timestamps come
    // from the currentTime argument.
    this.evaluateAlarms(currentTime);

    return {
      emitted: emittedNeutrons.length + spawnedCount,
      fissions: collisionResults.fissionCount,
      rodAbsorbed: collisionResults.absorptionCount,
      waterAbsorbed: collisionResults.waterAbsorptionCount,
      leaked: collisionResults.leakedCount,
      neutronCount: this.neutrons.length,
      substeps,
      removedByAge,
    };
  }

  /**
   * Rising-edge alarm detection over the current post-step metrics. Each alarm
   * fires once per crossing (rising edge); falling edges just reset the flag.
   */
  private evaluateAlarms(currentTime: number): void {
    const flags = this.prevAlarmFlags;
    const edge = (
      key: string,
      condition: boolean,
      severity: SimEvent["severity"],
      message: string
    ) => {
      if (condition && !flags[key]) this.postEvent(currentTime, severity, message);
      flags[key] = condition;
    };

    const rodCount = this.controlRods.length || 1;
    const avgRodHealth = this.controlRods.reduce((s, r) => s + r.health, 0) / rodCount;
    const atomCount = this.atoms.length || 1;
    const avgFuelIntegrity = this.atoms.reduce((s, a) => s + a.integrity, 0) / atomCount;
    const anyScram = this.controlRods.some(r => r.isScramActive);

    edge("coreTempHigh", this.reactorTemp > 0.8, "danger", "CORE TEMPERATURE HIGH");
    edge("meltdown", this.reactorTemp > 0.85, "danger", "FUEL MELTDOWN THRESHOLD EXCEEDED");
    edge("pressure", this.reactorPressure > 0.9, "danger", "PRESSURE CRITICAL");
    edge("voiding", this.voidFraction > 0.5, "warning", "COOLANT VOIDING — POSITIVE REACTIVITY");
    edge("xenon", this.xenonLevel > 0.6, "warning", "XENON POISONING HIGH");
    edge("scram", anyScram, "info", "AZ-5 SCRAM ENGAGED");
    edge("rodDegradation", avgRodHealth < 0.5, "warning", "CONTROL ROD DEGRADATION");
    edge("cladding", avgFuelIntegrity < 0.9, "danger", "FUEL CLADDING DAMAGE");
  }

  /**
   * Append an event to the bounded ring buffer (most recent 50). Used by the
   * internal alarm detection and by external controllers (e.g. the autopilot)
   * posting their control actions to the operator log.
   */
  postEvent(
    time: number,
    severity: SimEvent["severity"],
    message: string,
    source?: SimEvent["source"]
  ): void {
    this.events.push(source ? { time, severity, message, source } : { time, severity, message });
    if (this.events.length > 50) this.events.shift();
  }

  /**
   * Set control rod target insertions (rods interpolate toward these over time).
   * A single number targets every rod; an array targets rods index-aligned,
   * leaving unspecified rods at their current target.
   */
  setRodTargets(insertions: number | number[]): void {
    if (typeof insertions === "number") {
      for (const rod of this.controlRods) rod.targetInsertion = insertions;
    } else {
      this.controlRods.forEach((rod, index) => {
        rod.targetInsertion = insertions[index] ?? rod.targetInsertion;
      });
    }
  }

  /**
   * Inject energized (thermal) neutrons at a position — the click/hold operator
   * interaction. Neutrons spawn thermal (moderation 1, immediately fission-capable)
   * and 50% faster than base speed, spread evenly around the injection point.
   */
  injectNeutrons(x: number, y: number, count: number = 3): void {
    const cfg = this.config;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = cfg.neutron.baseSpeed * 1.5; // 50% faster for energized neutrons

      this.neutrons.push({
        id: `energized-neutron-${Date.now()}-${Math.random()}`,
        position: { x, y },
        velocity: {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        },
        age: 0,
        speed,
        radius: cfg.neutron.radius * 1.2, // Slightly larger
        isNew: true,
        trail: [{ x, y }],
        wallBounces: 0,
        moderation: 1, // User-injected neutrons spawn thermal (immediately fission-capable)
        thermalSpeed: speed,
      });
    }
  }
}
