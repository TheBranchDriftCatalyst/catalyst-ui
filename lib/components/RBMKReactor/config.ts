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
    // Base emission rate: start with low spontaneous fission
    // Real reactors have initial neutron source for startup
    baseEmissionRate: 1.0, // neutrons per second per channel (increased for visibility)
    energyDecay: 0.99, // 1% energy loss per frame (~60fps) - slower cooling
    // Energy gain from neutron absorption
    // Real: fission releases ~200 MeV, we abstract to 0-1 energy scale
    energyGain: 0.4, // increased energy gain
    emissionThreshold: 0.3, // lower threshold for easier emission
    // Real U-235 releases 2.43 neutrons per fission
    neutronsPerFission: 2.43,
  },

  controlRod: {
    width: 30, // pixels - widened to prevent neutron tunneling
    // Scaled down from 211 rods to 10 for visualization
    count: 10,
    // B-10 cross-section (3,840 barns) vs U-235 fission (580 barns)
    // Ratio: 3840/580 ≈ 6.6x more likely to absorb than cause fission
    // Convert to probability: ~0.95 absorption when neutron hits rod (boosted from 0.92)
    absorptionProbability: 0.95,
    absorptionEffectDuration: 200, // ms - visual feedback duration
    // Real RBMK control rods take 18-21 seconds for full insertion
    // At 60fps, 20 seconds = 0.05 units per second for 0-1 range
    // We'll speed this up 10x for better interactivity: 0.5/sec = 2 sec full travel
    insertionSpeed: 0.5, // 0-1 range per second (2 seconds for full insertion)
  },

  neutron: {
    radius: 5, // pixels - increased for better visibility
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
  },

  physics: {
    // Collision detection: sum of radii + small tolerance
    collisionThreshold: 2, // pixels of overlap tolerance
    boundaryDamping: 0.9, // 10% energy loss on boundary bounce
    neutronCollisions: false, // disable neutron-neutron collisions for performance
  },

  simulation: {
    defaultSpeed: 1.0, // 1x real-time (can be adjusted by user)
    targetFPS: 60, // frames per second
    useRAF: true, // use requestAnimationFrame for smooth animation
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
};
