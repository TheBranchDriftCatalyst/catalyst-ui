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
    // At 60 FPS: 1.5/sec × energyScale = ~667ms emission interval
    // Tuned to reach criticality in ~20-40 seconds (slower, more stable)
    baseEmissionRate: 1.5, // neutrons per second per channel (reduced from 2.0 to prevent spiral waves)
    energyDecay: 0.95, // 5% energy loss per frame (~60fps) - faster cooling for better stability
    // Energy gain from neutron absorption
    // Real: fission releases ~200 MeV, we abstract to 0-1 energy scale
    energyGain: 0.15, // reduced from 0.2 to prevent spiral wave propagation
    emissionThreshold: 0.6, // higher threshold = requires more energy to emit (increased from 0.5)
    // Real U-235 releases 2.43 neutrons per fission
    neutronsPerFission: 1.8, // reduced from 2.0 to prevent spiral wave cascades
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
    trailLength: 8, // number of trail points to render - longer trails
    // Wall bounce limit before neutron escapes containment
    // Real reactors: neutrons escape/absorbed by shielding
    maxWallBounces: 5, // after 5 bounces, neutron leaks through containment
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
    absorptionProbability: 0.02,

    // Base cooling rate: 2% per frame (matches old implicit cooling)
    // This scales with water density: less water = less cooling = positive feedback
    baseCoolingRate: 0.98,
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
      decayHeatFraction: 0.15, // 15% of fission heat continues as decay heat
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
    burnoutRate: 0.0001, // per nearby neutron per frame
    // Maximum poisoning: reduces reactivity by absorbing neutrons
    // Real: Can absorb 30-50% of neutron flux after shutdown
    maxPoisoning: 0.4, // 40% reduction in energy gain when maxed
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
 * Helper to create a custom config by overriding defaults
 */
export function createReactorConfig(overrides: Partial<ReactorConfig>): ReactorConfig {
  return {
    ...DEFAULT_REACTOR_CONFIG,
    ...overrides,
    grid: { ...DEFAULT_REACTOR_CONFIG.grid, ...overrides.grid },
    atom: { ...DEFAULT_REACTOR_CONFIG.atom, ...overrides.atom },
    controlRod: { ...DEFAULT_REACTOR_CONFIG.controlRod, ...overrides.controlRod },
    neutron: { ...DEFAULT_REACTOR_CONFIG.neutron, ...overrides.neutron },
    physics: { ...DEFAULT_REACTOR_CONFIG.physics, ...overrides.physics },
    simulation: { ...DEFAULT_REACTOR_CONFIG.simulation, ...overrides.simulation },
    water: { ...DEFAULT_REACTOR_CONFIG.water, ...overrides.water },
    pressure: { ...DEFAULT_REACTOR_CONFIG.pressure, ...overrides.pressure },
    damage: {
      rod: { ...DEFAULT_REACTOR_CONFIG.damage.rod, ...overrides.damage?.rod },
      fuel: { ...DEFAULT_REACTOR_CONFIG.damage.fuel, ...overrides.damage?.fuel },
    },
    xenon: { ...DEFAULT_REACTOR_CONFIG.xenon, ...overrides.xenon },
    regeneration: {
      water: { ...DEFAULT_REACTOR_CONFIG.regeneration.water, ...overrides.regeneration?.water },
      fuel: { ...DEFAULT_REACTOR_CONFIG.regeneration.fuel, ...overrides.regeneration?.fuel },
      rod: { ...DEFAULT_REACTOR_CONFIG.regeneration.rod, ...overrides.regeneration?.rod },
    },
  };
}

/**
 * Preset configurations for different scenarios
 */
export const REACTOR_PRESETS = {
  /** Normal operation - stable controlled reaction */
  normal: DEFAULT_REACTOR_CONFIG,

  /** Low power test - similar to Chernobyl test conditions */
  lowPowerTest: createReactorConfig({
    atom: {
      ...DEFAULT_REACTOR_CONFIG.atom,
      baseEmissionRate: 0.2, // reduced neutron flux
    },
    controlRod: {
      ...DEFAULT_REACTOR_CONFIG.controlRod,
      insertionSpeed: 0.05, // real slow insertion (20 seconds)
    },
  }),

  /** High reactivity - demonstrates rapid chain reaction */
  highReactivity: createReactorConfig({
    atom: {
      ...DEFAULT_REACTOR_CONFIG.atom,
      baseEmissionRate: 1.5,
      energyGain: 0.5, // higher energy gain per neutron
      neutronsPerFission: 2.8, // upper range of neutron emission
    },
  }),

  /** Scrammed - all control rods inserted (emergency shutdown) */
  scrammed: createReactorConfig({
    controlRod: {
      ...DEFAULT_REACTOR_CONFIG.controlRod,
      absorptionProbability: 0.98, // maximum absorption
      insertionSpeed: 1.0, // faster emergency insertion
    },
  }),

  /** Ultra Realistic - true RBMK physics with spiral waves and instability */
  ultraRealistic: createReactorConfig({
    atom: {
      ...DEFAULT_REACTOR_CONFIG.atom,
      baseEmissionRate: 2.0, // realistic emission rate
      energyDecay: 0.97, // slower decay (3% per frame)
      energyGain: 0.25, // realistic energy gain
      emissionThreshold: 0.5, // lower threshold
      neutronsPerFission: 2.43, // real U-235 value
    },
    water: {
      ...DEFAULT_REACTOR_CONFIG.water,
      voidCoefficient: 4.5, // original dangerous pre-Chernobyl value
    },
  }),

  /** Easy Mode - forgiving physics for learning and experimentation */
  easy: createReactorConfig({
    atom: {
      ...DEFAULT_REACTOR_CONFIG.atom,
      baseEmissionRate: 1.0, // slower emission
      energyDecay: 0.92, // faster cooling (8% per frame)
      energyGain: 0.12, // lower energy gain
      emissionThreshold: 0.7, // much higher threshold
      neutronsPerFission: 1.5, // fewer neutrons per fission
    },
    controlRod: {
      ...DEFAULT_REACTOR_CONFIG.controlRod,
      absorptionProbability: 0.99, // nearly perfect absorption
      insertionSpeed: 0.8, // faster insertion (1.25 seconds)
    },
    water: {
      ...DEFAULT_REACTOR_CONFIG.water,
      voidCoefficient: 2.0, // much safer void coefficient
      baseCoolingRate: 0.96, // faster cooling
    },
  }),
};
