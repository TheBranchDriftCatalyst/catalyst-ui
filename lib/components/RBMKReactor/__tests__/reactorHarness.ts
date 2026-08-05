/**
 * Test harness for the RBMK whole-model integration suite.
 *
 * Since the headless sim-core extraction (CUI-iwv.13) landed, this is a thin
 * layer over the real ReactorCore: a seeded RNG for deterministic runs plus
 * scenario builders/helpers. The simulation step loop is no longer duplicated
 * here — buildReactor returns an actual ReactorCore and step/run drive it, so
 * the tests exercise the same code path the React component does.
 *
 * Determinism: install a seeded RNG over Math.random via seedRandom() so every
 * run of a scenario takes the same stochastic path.
 */

import { ReactorCore, StepStats } from "../ReactorCore";
import {
  FRAME_MS,
  calculateAverageTemperature,
  calculateAverageXenon,
  calculateVoidFraction,
} from "../physics";
import { DEFAULT_REACTOR_CONFIG, createReactorConfig, ReactorConfigOverrides } from "../config";

// ---------------------------------------------------------------------------
// Seeded RNG (mulberry32) — patched over Math.random for deterministic runs
// ---------------------------------------------------------------------------

const realRandom = Math.random;

export function seedRandom(seed: number): void {
  let a = seed >>> 0;
  Math.random = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function restoreRandom(): void {
  Math.random = realRandom;
}

// ---------------------------------------------------------------------------
// Reactor construction (delegates to ReactorCore)
// ---------------------------------------------------------------------------

/** The harness reactor IS a ReactorCore now; alias kept for readability. */
export type HarnessReactor = ReactorCore;

export const VESSEL_W = 1100;
export const VESSEL_H = 850;

export function buildReactor(
  overrides: ReactorConfigOverrides = {},
  opts: { seedNeutrons?: number; rodInsertion?: number } = {}
): HarnessReactor {
  const config = createReactorConfig(overrides);
  // rodInsertion defaults to 0 (uniform, rods raised) so scenarios opt into
  // insertion explicitly; seedNeutrons defaults to 0 (no source neutrons).
  return new ReactorCore(config, {
    width: VESSEL_W,
    height: VESSEL_H,
    seedNeutrons: opts.seedNeutrons ?? 0,
    rodInsertion: opts.rodInsertion ?? 0,
  });
}

// ---------------------------------------------------------------------------
// Stepping (drives ReactorCore.step, tracking a sim clock)
// ---------------------------------------------------------------------------

export type { StepStats };

export function step(
  r: HarnessReactor,
  deltaTime: number = FRAME_MS,
  pumpPower: number = 1
): StepStats {
  // Pass the pre-increment sim time as the step's currentTime (matches the old
  // harness ordering), then advance the sim clock.
  const stats = r.step(deltaTime, r.simTime, pumpPower);
  r.simTime += deltaTime;
  return stats;
}

/** Run N sim-seconds at a fixed step size; returns per-second aggregates. */
export function run(
  r: HarnessReactor,
  seconds: number,
  opts: { deltaTime?: number; pumpPower?: number } = {}
): Array<{
  second: number;
  fissions: number;
  emitted: number;
  neutrons: number;
  avgTemp: number;
  avgXenon: number;
  voidFraction: number;
}> {
  const dt = opts.deltaTime ?? FRAME_MS;
  const stepsPerSecond = Math.round(1000 / dt);
  const out: Array<{
    second: number;
    fissions: number;
    emitted: number;
    neutrons: number;
    avgTemp: number;
    avgXenon: number;
    voidFraction: number;
  }> = [];
  for (let s = 0; s < seconds; s++) {
    let fissions = 0;
    let emitted = 0;
    for (let i = 0; i < stepsPerSecond; i++) {
      const st = step(r, dt, opts.pumpPower ?? 1);
      fissions += st.fissions;
      emitted += st.emitted;
    }
    out.push({
      second: s + 1,
      fissions,
      emitted,
      neutrons: r.neutrons.length,
      avgTemp: calculateAverageTemperature(r.heatGrid),
      avgXenon: calculateAverageXenon(r.atoms),
      voidFraction: calculateVoidFraction(r.waterGrid),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Scenario helpers (operate on the core's exposed state)
// ---------------------------------------------------------------------------

export function setRodTargets(r: HarnessReactor, insertion: number): void {
  r.setRodTargets(insertion);
}

export function chargeAtoms(r: HarnessReactor, energy: number): void {
  for (const atom of r.atoms) {
    atom.energy = energy;
  }
}

export function floodWater(r: HarnessReactor, density: number): void {
  for (let y = 0; y < r.waterGrid.height; y++) {
    for (let x = 0; x < r.waterGrid.width; x++) {
      r.waterGrid.waterDensity[y]![x] = density;
    }
  }
}

export { DEFAULT_REACTOR_CONFIG, FRAME_MS };
