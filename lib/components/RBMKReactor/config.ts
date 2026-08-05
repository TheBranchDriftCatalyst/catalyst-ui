/**
 * Default configuration for RBMK Reactor Simulation
 *
 * Based on real RBMK-1000 specifications from Chernobyl Unit 4 type reactor.
 * Values are scaled appropriately for interactive visualization while maintaining
 * realistic physics ratios and behavior.
 *
 * References:
 * - RBMK-1000: 1,693 fuel channels, 211 control rods
 * - U-235 fission cross-section: 580 barns
 * - B-10 absorption cross-section: 3,840 barns
 * - Neutrons per fission: 2.43 (ν)
 * - Control rod insertion time: 18-21 seconds
 */

import { ReactorConfig } from "./types";

/**
 * Default RBMK reactor configuration
 *
 * Grid scaled down to 20x20 (400 fuel channels) vs real 1,693
 * Control rods scaled to 10 vs real 211
 */
export const DEFAULT_REACTOR_CONFIG: ReactorConfig = {
  grid: {
    // Scaled down from 1,693 channels arranged in ~41x41 grid
    columns: 20,
    rows: 20,
    spacing: 35, // pixels between fuel channels (reduced from 40 to fit in vessel)
  },

  atom: {
    radius: 8, // pixels - visual representation of fuel channel
    // Base emission rate: fast emission for realistic prompt neutron physics
    // Real prompt neutrons: emitted within nanoseconds to microseconds
    // At 3.0/sec × energyScale, the emission interval is ~333ms at threshold energy
    // CRITICALITY REBALANCE (CUI-iwv.16): the previous tuning (rate 1.5, decay
    // 0.95, gain 0.15) could never sustain a chain reaction — fission hits
    // decayed below the emission threshold before the emission interval could
    // elapse; apparent criticality was an artifact of the (fixed) decay-heat
    // bug. Current values make sustained flux hold atoms above threshold while
    // inserted rods still interdict transport and collapse the reaction.
    baseEmissionRate: 3.0, // LEGACY (v2 charge-emit model): no longer drives physics since v3 direct fission emission
    energyDecay: 0.98, // 2% energy loss per frame (~570ms half-life)
    // Energy gain from neutron absorption
    // Real: fission releases ~200 MeV, we abstract to 0-1 energy scale
    energyGain: 0.45, // one hit ignites a warm channel (>=0.15) — background flux converts directly to emitters
    emissionThreshold: 0.6, // higher threshold = requires more energy to emit (increased from 0.5)
    // v3 (CUI-ccq): the REAL U-235 value — fission spawns these directly at the
    // event (prompt share) with the rest banked as delayed precursors
    neutronsPerFission: 2.43,
    // Spontaneous background (CUI-2dq): with 400 channels this yields ~30
    // background neutrons/sec core-wide. Rods OUT: the background multiplies
    // and self-ignites the core in tens of seconds. Rods IN: it is absorbed
    // and nothing builds — criticality is genuinely rod-controlled.
    spontaneousEmissionRate: 0.25, // neutrons per second per channel
    // Fraction of emissions banked as delayed-neutron precursors.
    // Real β ≈ 0.0065; scaled up so delayed neutrons are visible and the
    // reactor is actually steerable (prompt-only kinetics are uncontrollable).
    delayedFraction: 0.15,
    // Precursor decay per reference frame → ~2.4s mean delay at 60fps
    precursorDecayRate: 0.007,
  },

  controlRod: {
    width: 50, // pixels - wider to catch more neutrons (prevent tunneling)
    // Scaled down from 211 rods to 10 for visualization
    count: 10,
    // B-10 cross-section (3,840 barns) vs U-235 fission (580 barns)
    // Ratio: 3840/580 ≈ 6.6x more likely to absorb than cause fission
    // Boosted to 0.98 for near-total absorption when neutron hits rod
    absorptionProbability: 0.98,
    absorptionEffectDuration: 200, // ms - visual feedback duration
    // Real RBMK control rods take 18-21 seconds for full insertion
    // At 60fps, 20 seconds = 0.05 units per second for 0-1 range
    // We'll speed this up 10x for better interactivity: 0.5/sec = 2 sec full travel
    insertionSpeed: 0.5, // 0-1 range per second (2 seconds for full insertion)
    // Graphite follower/displacer length below the boron section (the RBMK flaw)
    graphiteTipLength: 40, // pixels of graphite tip
    // Fraction of water displaced per reference frame while the tip transits a
    // cell (frame-scaled). Creates the transient void that spikes reactivity
    // before boron arrives — the AZ-5 "positive scram" effect.
    graphiteTipDisplacement: 0.25,
  },

  neutron: {
    radius: 3, // pixels - increased for better visibility
    // Thermal neutrons: ~2200 m/s in real reactor
    // Scale to 3-6 pixels per frame at 60fps for visibility
    baseSpeed: 5.0, // pixels per frame - slightly faster
    speedVariation: 0.3, // +/- 30% speed variation
    // Real neutron lifetime in reactor: ~0.1 seconds before absorption/fission
    // We extend this for visualization
    maxAge: 4000, // milliseconds (4 seconds) - live longer
    maxCount: 1000, // performance limit - increased for more visible activity
    // U-235 fission cross-section: 580 barns (thermal neutrons)
    // 86% of absorbed neutrons cause fission, 14% radiative capture
    fissionProbability: 0.86,
    // Trail cap passed to updateNeutronPosition (max trail points rendered)
    trailLength: 8,
    // Wall bounce limit before neutron escapes containment
    // Real reactors: neutrons escape/absorbed by shielding
    // Enforced in processCollisions: once wallBounces reaches this limit the
    // neutron leaks out and is removed (counted as leakedCount)
    maxWallBounces: 5,
    // Fast (unmoderated) neutrons travel 2x their thermal speed, decelerating
    // toward thermal speed as graphite moderates them
    fastSpeedMultiplier: 2.0,
    // Moderation gained per reference frame → fully thermal in ~0.33s at 60fps
    moderationRate: 0.05,
    // Fission effectiveness at moderation 0: fast neutrons rarely fission U-235
    fastFissionFactor: 0.15,
  },

  physics: {
    // Collision detection: sum of radii + small tolerance
    collisionThreshold: 2, // pixels of overlap tolerance
    boundaryDamping: 0.9, // 10% energy loss on boundary bounce
    neutronCollisions: false, // disable neutron-neutron collisions for performance
  },

  simulation: {
    defaultSpeed: 0.5, // 0.5x real-time (slower for observing void coefficient effects)
    targetFPS: 60, // frames per second
    useRAF: true, // use requestAnimationFrame for smooth animation
    // Thermal power per fission/sec, calibrated to the v3 equilibrium: full
    // rod withdrawal settles ~40 fissions/s ≈ 1000 MW; staggered rods ≈ 600 MW;
    // excursions spike well past 2000 MW. (Real RBMK-1000: 3200 MW thermal.)
    megawattsPerFission: 25,
  },

  water: {
    // Boiling point on 0-1 temperature scale
    // 0.5 = moderate threshold, easily reached in high-energy regions
    boilingPoint: 0.5,

    // Positive void coefficient: +3.5 β (reduced from 4.5 to prevent spiral waves)
    // This is the critical design flaw that enabled the Chernobyl disaster
    // Post-Chernobyl safety improvements reduced this to +0.7 β
    // Tuned to allow runaway at extreme conditions without instant cascades
    voidCoefficient: 3.5,

    // Evaporation rate: 2% per frame above boiling point
    // At 60fps, this allows gradual steam void formation
    evaporationRate: 0.02,

    // Condensation rate: 1% per frame below boiling point
    // Slower than evaporation = steam persists longer = more instability
    condensationRate: 0.01,

    // Water neutron absorption probability (per frame at 60fps)
    // Water absorbs neutrons (unlike graphite which moderates)
    // When water boils away, absorption decreases = more neutrons = runaway
    // Reduced from 0.25 to 0.02 to allow neutrons to survive ~100 frames on average
    absorptionProbability: 0.015,

    // Base cooling rate: 4% per frame — the SINGLE cooling pass, applied in
    // updateCoolingAndWater only. (Previously cooling was double-applied: a
    // hardcoded 0.98/frame in updateHeatGrid plus a water-scaled pass here.
    // 0.96 ≈ 0.98² preserves the full-water equilibrium, and steam voids now
    // fully suspend cooling — stronger, more authentic positive-void feedback.)
    // Scales with water density: less water = less cooling = positive feedback
    baseCoolingRate: 0.96,

    // Pump-flow gradient: coolant enters from the bottom, so regen at the top
    // row = (1 - 0.6) = 40% of the bottom-row rate. Voids therefore form
    // top-first, mirroring real RBMK bottom-fed channel flow.
    pumpFlowGradient: 0.6,
  },

  pressure: {
    // Base pressure when cold (atmospheric)
    // Real: 1 bar, normalized to 0.01 (1% of scale)
    basePressure: 0.01,

    // Normal operating pressure
    // Real RBMK: 70 bar (1015 psi), normalized to 0.7
    normalOperatingPressure: 0.7,

    // Critical pressure (rupture risk)
    // Real: 90+ bar, normalized to 1.0 (100 bar on scale)
    criticalPressure: 1.0,

    // Temperature contribution to pressure (ideal gas law: P ∝ T)
    // Higher = temperature affects pressure more
    // Tuned so normal temp (0.5) + base = ~0.7 operating pressure
    temperatureCoefficient: 0.6,

    // Void (steam) contribution to pressure
    // Steam has much higher specific volume than liquid
    // Causes rapid pressure increase when water flashes to steam
    // This creates dangerous pressure spikes during LOCA (Loss of Coolant Accident)
    voidCoefficient: 0.8,
  },

  damage: {
    // Control rod damage parameters
    rod: {
      // Heat damage rate (per frame when temperature > 0.7)
      heatDamageRate: 0.0001, // slow degradation from high temperature
      // Absorption damage rate (per neutron absorbed)
      absorptionDamageRate: 0.00005, // neutron bombardment damage
      // Temperature threshold for heat damage (0-1 scale)
      heatDamageThreshold: 0.7,
    },

    // Fuel damage/meltdown parameters
    fuel: {
      // Meltdown temperature threshold (0-1 scale)
      // Real: 1,200°C for UO2 fuel
      meltdownTemp: 0.85, // on 0-1 scale (corresponds to ~1,200°C)
      // Damage rate when above meltdown temp (per frame)
      meltdownRate: 0.005, // 0.5% per frame = ~3 seconds to full meltdown
      // Decay heat generation from damaged fuel (fraction of normal)
      // Inventory-driven decay heat (CUI-n1h): each fission adds one unit of
      // fission products; products deplete exponentially and each unit adds a
      // sliver of energy per frame. A freshly shut-down working core (~30-60
      // products/atom) stays hot for a minute or two, then genuinely cools —
      // the old damage-fraction model generated heat forever (thermal deadlock).
      decayHeatPerFission: 0.00015, // energy per reference frame per product
      decayHeatDecayRate: 0.0004, // product depletion per reference frame (~29s half-life)
    },
  },

  xenon: {
    // Xenon-135 builds up from fission products (Iodine-135 decay)
    // Real: peaks 10-12 hours after shutdown, fully dissipates in 30-40 hours
    // Scaled: peaks in 30-45 seconds, dissipates in 60-90 seconds (for gameplay)
    buildupRate: 0.003, // 0.3% per fission event
    // Natural decay: Xe-135 half-life = 9.14 hours
    // Scaled to ~60 seconds gameplay time: 0.012 per frame at 60fps
    decayRate: 0.00015, // 0.015% per frame = ~60 seconds to clear
    // Burnout: high neutron flux burns xenon → xenon decreases faster
    // Real: neutron cross-section of Xe-135 = 2.65M barns (massive!)
    // Tuned so at-power equilibrium sits meaningfully ABOVE zero: with ~10
    // nearby neutrons, burnout ≈ 0.0002/frame vs buildup ≈ 0.0015/frame at
    // energy 0.5 → equilibrium xenon ≈ 0.3-0.5. (Was 0.0001: burnout matched
    // buildup wherever neutrons existed, pinning xenon at 0 — the "xenon never
    // moves" bug found by the integration suite, CUI-iwv.14.)
    burnoutRate: 0.00002, // per nearby neutron per frame
    // Maximum poisoning: reduces reactivity by absorbing neutrons
    // Real: Can absorb 30-50% of neutron flux after shutdown
    maxPoisoning: 0.4, // 40% reduction in energy gain when maxed
    // Initial xenon seeded into atoms at startup (0 = fresh, clean core).
    // The iodinePit scenario overrides this to model a poisoned restart.
    initialLevel: 0,
  },

  regeneration: {
    // Water regeneration (coolant circulation)
    water: {
      // Base regeneration rate: 0.1% per frame (slow replenishment)
      // At 60fps: 6% per second, full recovery in ~17 seconds if no evaporation
      baseRate: 0.001,
      // Scale by temperature: less regeneration at high temps (steam blocks flow)
      temperatureScaling: true,
    },

    // Fuel integrity regeneration
    fuel: {
      // Healing rate: very slow (10× slower than damage)
      // Takes ~333 frames (~5.5 seconds) to fully heal at 60fps
      healingRate: 0.0003,
      // Only heal when temperature < 50% of meltdown threshold
      // meltdownTemp = 0.85, so healingThreshold = 0.425
      healingThreshold: 0.5, // fraction of meltdownTemp
    },

    // Control rod health regeneration
    rod: {
      // Healing rate: slow recovery (represents rod replacement during maintenance)
      // Takes ~200 frames (~3.3 seconds) to fully heal
      healingRate: 0.0005,
      // Only heal at safe temperatures (below heat damage threshold)
      healingThreshold: 0.6, // slightly below damage threshold (0.7)
    },
  },
};

/**
 * Deep-partial override shape accepted by createReactorConfig.
 *
 * Every top-level section is optional, with Partial fields inside; the nested
 * `damage` and `regeneration` sub-sections are individually Partial as well.
 * Note: full section objects from Partial<ReactorConfig> remain assignable to
 * this type, so existing call sites keep working.
 */
export type ReactorConfigOverrides = {
  grid?: Partial<ReactorConfig["grid"]>;
  atom?: Partial<ReactorConfig["atom"]>;
  controlRod?: Partial<ReactorConfig["controlRod"]>;
  neutron?: Partial<ReactorConfig["neutron"]>;
  physics?: Partial<ReactorConfig["physics"]>;
  simulation?: Partial<ReactorConfig["simulation"]>;
  water?: Partial<ReactorConfig["water"]>;
  pressure?: Partial<ReactorConfig["pressure"]>;
  damage?: {
    rod?: Partial<ReactorConfig["damage"]["rod"]>;
    fuel?: Partial<ReactorConfig["damage"]["fuel"]>;
  };
  xenon?: Partial<ReactorConfig["xenon"]>;
  regeneration?: {
    water?: Partial<ReactorConfig["regeneration"]["water"]>;
    fuel?: Partial<ReactorConfig["regeneration"]["fuel"]>;
    rod?: Partial<ReactorConfig["regeneration"]["rod"]>;
  };
};

/**
 * Helper to create a custom config by merging overrides into a base config
 * (defaults to DEFAULT_REACTOR_CONFIG).
 *
 * Merging relative to `base` lets scenario deltas stack on top of any physics
 * model variant instead of always resetting to defaults.
 */
export function createReactorConfig(
  overrides: ReactorConfigOverrides,
  base: ReactorConfig = DEFAULT_REACTOR_CONFIG
): ReactorConfig {
  return {
    ...base,
    grid: { ...base.grid, ...overrides.grid },
    atom: { ...base.atom, ...overrides.atom },
    controlRod: { ...base.controlRod, ...overrides.controlRod },
    neutron: { ...base.neutron, ...overrides.neutron },
    physics: { ...base.physics, ...overrides.physics },
    simulation: { ...base.simulation, ...overrides.simulation },
    water: { ...base.water, ...overrides.water },
    pressure: { ...base.pressure, ...overrides.pressure },
    damage: {
      rod: { ...base.damage.rod, ...overrides.damage?.rod },
      fuel: { ...base.damage.fuel, ...overrides.damage?.fuel },
    },
    xenon: { ...base.xenon, ...overrides.xenon },
    regeneration: {
      water: { ...base.regeneration.water, ...overrides.regeneration?.water },
      fuel: { ...base.regeneration.fuel, ...overrides.regeneration?.fuel },
      rod: { ...base.regeneration.rod, ...overrides.regeneration?.rod },
    },
  };
}

/**
 * Scenario override deltas — ONLY the values that differ from the base config.
 *
 * Exported separately so downstream code can apply a scenario on top of ANY
 * base config (e.g., a physics-model variant) via
 * `createReactorConfig(SCENARIO_OVERRIDES.x, base)`. Previously each preset
 * spread full DEFAULT_REACTOR_CONFIG sections into its overrides, which
 * silently clobbered any non-scenario tuning downstream.
 */
export const SCENARIO_OVERRIDES: Record<
  "lowPowerTest" | "highReactivity" | "scrammed" | "iodinePit",
  ReactorConfigOverrides
> = {
  /** Low power test - similar to Chernobyl test conditions */
  lowPowerTest: {
    atom: { spontaneousEmissionRate: 0.05 }, // weak startup source (v3: background drives ignition)
    controlRod: { insertionSpeed: 0.05 }, // real slow insertion (20 seconds)
  },

  /** High reactivity - demonstrates rapid chain reaction */
  highReactivity: {
    atom: {
      // No baseEmissionRate here: it matched the default (1.5) and would
      // clobber physics-model bases (easy 1.0, ultraRealistic 2.0) when layered
      energyGain: 0.5, // higher energy gain per neutron
      neutronsPerFission: 2.8, // upper range of neutron emission
    },
  },

  /** Scrammed - all control rods inserted (emergency shutdown) */
  scrammed: {
    controlRod: {
      // No absorptionProbability here: every base is already >= 0.98 and a
      // default-equal "delta" would LOWER easy's 0.99 when layered
      insertionSpeed: 1.0, // faster emergency insertion
    },
  },

  /**
   * Iodine pit - reactor restarting into pre-existing xenon poisoning.
   * The exact trap at Chernobyl: operators withdrew rods far past limits to
   * fight the poison, leaving no shutdown margin when the void spike hit.
   */
  iodinePit: {
    xenon: { initialLevel: 0.85 },
  },
};

/**
 * Preset configurations for different scenarios
 */
export const REACTOR_PRESETS = {
  /** Normal operation - stable controlled reaction */
  normal: DEFAULT_REACTOR_CONFIG,

  /** Low power test - similar to Chernobyl test conditions */
  lowPowerTest: createReactorConfig(SCENARIO_OVERRIDES.lowPowerTest),

  /** High reactivity - demonstrates rapid chain reaction */
  highReactivity: createReactorConfig(SCENARIO_OVERRIDES.highReactivity),

  /** Scrammed - all control rods inserted (emergency shutdown) */
  scrammed: createReactorConfig(SCENARIO_OVERRIDES.scrammed),

  /** Iodine pit - restart into pre-existing xenon poisoning (Chernobyl trap) */
  iodinePit: createReactorConfig(SCENARIO_OVERRIDES.iodinePit),

  /** Ultra Realistic - true RBMK physics with spiral waves and instability */
  ultraRealistic: createReactorConfig({
    atom: {
      baseEmissionRate: 2.0, // realistic emission rate
      energyDecay: 0.97, // slower decay (3% per frame)
      energyGain: 0.25, // realistic energy gain
      emissionThreshold: 0.5, // lower threshold
      neutronsPerFission: 2.43, // real U-235 value
    },
    water: {
      voidCoefficient: 4.5, // original dangerous pre-Chernobyl value
    },
  }),

  /** Easy Mode - forgiving physics for learning and experimentation */
  easy: createReactorConfig({
    atom: {
      baseEmissionRate: 1.0, // slower emission
      energyDecay: 0.92, // faster cooling (8% per frame)
      energyGain: 0.12, // lower energy gain
      emissionThreshold: 0.7, // much higher threshold
      neutronsPerFission: 1.5, // fewer neutrons per fission
    },
    controlRod: {
      absorptionProbability: 0.99, // nearly perfect absorption
      insertionSpeed: 0.8, // faster insertion (1.25 seconds)
    },
    water: {
      voidCoefficient: 2.0, // much safer void coefficient
      // Faster cooling. Single-pass equivalent of the old double-applied
      // cooling (hardcoded 0.98 × preset 0.96 ≈ 0.94)
      baseCoolingRate: 0.94,
    },
  }),
};
