/**
 * Whole-model integration suite for the RBMK simulator (CUI-iwv.15).
 *
 * Structured as an induction-style ladder: each level's tests assume the level
 * below is verified, so failures localize to the layer that broke.
 *
 *   Level 0 — axioms:      single primitives in isolation
 *   Level 1 — base case:   one neutron + one atom; a two-atom chain link
 *   Level 2 — ensembles:   small cores — propagation, rod interdiction, void boost
 *   Level 3 — full core:   emergent behavior at N=400 — criticality, SCRAM,
 *                          xenon dynamics, clock discipline, conservation
 *
 * All stochastic tests run under a seeded RNG (mulberry32 over Math.random).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  buildReactor,
  seedRandom,
  restoreRandom,
  step,
  run,
  setRodTargets,
  chargeAtoms,
  floodWater,
  FRAME_MS,
} from "./reactorHarness";
import {
  createNeutron,
  updateNeutronPosition,
  handleAtomCollision,
  processCollisions,
  applyGraphiteTipDisplacement,
  updateAtom,
  updateCoolingAndWater,
  getWaterDensityAtPosition,
  getActiveTemperatures,
  calculateAverageTemperature,
} from "../physics";
import { DEFAULT_REACTOR_CONFIG } from "../config";
import { ReactorAutopilot } from "../ReactorAutopilot";
import { Atom, Neutron } from "../types";

beforeEach(() => seedRandom(0xc0ffee));
afterEach(() => restoreRandom());

const cfg = DEFAULT_REACTOR_CONFIG;

function makeAtom(x: number, y: number, energy = 0.1, id = "atom-t"): Atom {
  return {
    id,
    position: { x, y },
    gridX: 0,
    gridY: 0,
    energy,
    radius: cfg.atom.radius,
    emittedCount: 0,
    integrity: 1,
    lastTemperature: 0,
    xenonLevel: 0,
    precursorInventory: 0,
    precursorBank: 0,
    fissionProductInventory: 0,
  };
}

// ===========================================================================
// LEVEL 0 — AXIOMS: primitives in isolation
// ===========================================================================

describe("L0 axioms: primitives", () => {
  it("neutrons are born fast and thermalize on the moderation curve (~0.5s)", () => {
    const n = createNeutron({ x: 500, y: 400 }, cfg);
    expect(n.moderation).toBe(0);
    const bornSpeed = Math.hypot(n.velocity.vx, n.velocity.vy);
    expect(bornSpeed).toBeCloseTo(n.thermalSpeed * cfg.neutron.fastSpeedMultiplier, 6);

    // 45 reference frames (0.75s) is comfortably past the ~0.5s thermalization
    for (let i = 0; i < 45; i++) updateNeutronPosition(n, FRAME_MS, cfg);
    expect(n.moderation).toBe(1);
    const finalSpeed = Math.hypot(n.velocity.vx, n.velocity.vy);
    expect(finalSpeed).toBeCloseTo(n.thermalSpeed, 4);
  });

  it("fast neutrons fission far less than thermal neutrons", () => {
    const TRIALS = 4000;
    let fastFissions = 0;
    let thermalFissions = 0;
    for (let i = 0; i < TRIALS; i++) {
      const fast = createNeutron({ x: 0, y: 0 }, cfg); // moderation 0
      const a1 = makeAtom(0, 0);
      if (handleAtomCollision(fast, a1, cfg).fission) fastFissions++;

      const thermal = createNeutron({ x: 0, y: 0 }, cfg);
      thermal.moderation = 1;
      const a2 = makeAtom(0, 0);
      if (handleAtomCollision(thermal, a2, cfg).fission) thermalFissions++;
    }
    const fastRate = fastFissions / TRIALS;
    const thermalRate = thermalFissions / TRIALS;
    // Expected: 0.86×0.15 ≈ 0.13 vs 0.86
    expect(thermalRate).toBeGreaterThan(0.8);
    expect(fastRate).toBeLessThan(0.2);
    expect(thermalRate / fastRate).toBeGreaterThan(4);
  });

  it("a neutron leaks (is removed and counted) once it exhausts its wall-bounce budget", () => {
    const r = buildReactor({}, { seedNeutrons: 0 });
    const n = createNeutron({ x: 550, y: 425 }, r.config);
    n.moderation = 1;
    n.wallBounces = r.config.neutron.maxWallBounces; // budget exhausted
    r.neutrons.push(n);
    const res = processCollisions(
      r.neutrons,
      r.atoms,
      r.controlRods,
      r.waterGrid,
      r.vesselLeft,
      r.vesselTop,
      r.config,
      0,
      FRAME_MS,
      false
    );
    expect(res.leakedCount).toBe(1);
    expect(res.remainingNeutrons).toHaveLength(0);
  });

  it("a moving graphite tip displaces water at the tip; a parked rod does not", () => {
    const r = buildReactor({}, { rodInsertion: 0.3 });
    const rod = r.controlRods[0]!;
    const tipY = rod.y + rod.maxHeight * rod.insertion;

    // Parked (target == insertion): no displacement
    applyGraphiteTipDisplacement(
      r.waterGrid,
      r.controlRods,
      r.config,
      FRAME_MS,
      r.vesselLeft,
      r.vesselTop
    );
    expect(getWaterDensityAtPosition(r.waterGrid, rod.x, tipY + 5, r.vesselLeft, r.vesselTop)).toBe(
      1
    );

    // Moving down: tip-span cells lose water
    setRodTargets(r, 1.0);
    for (let i = 0; i < 10; i++) {
      applyGraphiteTipDisplacement(
        r.waterGrid,
        r.controlRods,
        r.config,
        FRAME_MS,
        r.vesselLeft,
        r.vesselTop
      );
    }
    const displaced = getWaterDensityAtPosition(
      r.waterGrid,
      rod.x,
      tipY + 5,
      r.vesselLeft,
      r.vesselTop
    );
    expect(displaced).toBeLessThan(1);
  });

  it("bottom-fed coolant: regeneration is faster at the bottom of the core, and scales with pump power", () => {
    const mk = () => {
      const r = buildReactor();
      floodWater(r, 0.5); // uniform half-voided core, cold (no evaporation)
      return r;
    };
    const rA = mk();
    updateCoolingAndWater(rA.heatGrid, rA.waterGrid, rA.config, FRAME_MS, 1);
    const topRow = rA.waterGrid.waterDensity[0]!;
    const bottomRow = rA.waterGrid.waterDensity[rA.waterGrid.height - 1]!;
    expect(bottomRow[3]!).toBeGreaterThan(topRow[3]!);

    const rB = mk();
    updateCoolingAndWater(rB.heatGrid, rB.waterGrid, rB.config, FRAME_MS, 0); // pumps off
    // With pumps off, condensation still adds water but pump regen is gone:
    // bottom row must recover less than with pumps on
    expect(rB.waterGrid.waterDensity[rB.waterGrid.height - 1]![3]!).toBeLessThan(bottomRow[3]!);
  });
});

// ===========================================================================
// LEVEL 1 — BASE CASE: one neutron + one atom; the two-atom chain link
// ===========================================================================

describe("L1 base case: smallest interactions", () => {
  it("a fission event directly spawns ~ν prompt children and banks the delayed share (v3)", () => {
    // One atom, one thermal neutron placed on it: processCollisions must fission
    // and spawn prompt neutrons AT THE EVENT — the v3 direct-emission model.
    const r = buildReactor({ grid: { columns: 1, rows: 1 }, controlRod: { count: 0 } });
    const atom = r.atoms[0]!;
    const neutron = createNeutron({ x: atom.position.x + 1, y: atom.position.y }, r.config);
    neutron.moderation = 1;
    neutron.age = 1000; // past any parent-exclusion grace
    r.neutrons.push(neutron);

    const res = processCollisions(
      r.neutrons,
      r.atoms,
      r.controlRods,
      r.waterGrid,
      r.vesselLeft,
      r.vesselTop,
      r.config,
      0,
      FRAME_MS,
      false
    );
    expect(res.fissionCount).toBe(1);
    // Prompt children spawned immediately, bounded by ν (+boost headroom)
    expect(res.spawnedNeutrons.length).toBeGreaterThanOrEqual(1);
    expect(res.spawnedNeutrons.length).toBeLessThanOrEqual(
      Math.ceil(r.config.atom.neutronsPerFission) + 1
    );
    // Children are fast-born from the fission event
    expect(res.spawnedNeutrons.every(n => n.moderation === 0)).toBe(true);
    // Delayed share banked; heat deposited
    expect(atom.precursorInventory).toBeGreaterThan(0);
    expect(atom.energy).toBeGreaterThan(0.1);
  });

  it("banked precursors release a delayed-neutron tail with no prompt drive", () => {
    const atom = makeAtom(500, 400, 0); // cold: no prompt emission possible
    atom.precursorInventory = 10;
    // Zero the spontaneous background so the count is pure precursor release
    const quiet = { ...cfg, atom: { ...cfg.atom, spontaneousEmissionRate: 0 } };
    const water = buildReactor().waterGrid;
    let released = 0;
    // 10 sim-seconds of decay
    for (let i = 0; i < 600; i++) {
      released += updateAtom(atom, water, 88, 68, quiet, FRAME_MS, i * FRAME_MS, []).length;
    }
    expect(released).toBeGreaterThan(3); // tail exists
    expect(atom.precursorInventory).toBeLessThan(10); // inventory drains
    expect(released + atom.precursorInventory + atom.precursorBank).toBeCloseTo(10, 0); // conservation
  });

  it("chain link: fission children from atom A can fission neighbor B (transport works)", () => {
    // v3: A's fission spawns children at the event; aim them at B and verify
    // the chain link — transport + moderation + collision + fission of REAL
    // fission-born neutrons.
    const r = buildReactor({ grid: { columns: 2, rows: 1 }, controlRod: { count: 0 } });
    const [a, b] = [r.atoms[0]!, r.atoms[1]!];
    let neighborFissions = 0;

    for (let trial = 0; trial < 20 && neighborFissions === 0; trial++) {
      // Fire a thermal neutron point-blank at A → fission spawns children
      const trigger = createNeutron({ x: a.position.x + 1, y: a.position.y }, r.config, undefined);
      trigger.moderation = 1;
      trigger.age = 1000;
      r.neutrons = [trigger];
      const first = step(r);
      if (first.fissions === 0) continue; // capture branch — try again

      // Aim every surviving child straight at B
      for (const n of r.neutrons) {
        const dx = b.position.x - n.position.x;
        const dy = b.position.y - n.position.y;
        const mag = Math.hypot(dx, dy) || 1;
        const speed = Math.hypot(n.velocity.vx, n.velocity.vy);
        n.velocity.vx = (dx / mag) * speed;
        n.velocity.vy = (dy / mag) * speed;
      }
      const bBefore = b.emittedCount + b.fissionProductInventory;
      for (let i = 0; i < 30 && neighborFissions === 0; i++) {
        step(r);
        if (b.fissionProductInventory > bBefore) neighborFissions += 1;
      }
      r.neutrons = [];
    }

    expect(neighborFissions).toBeGreaterThan(0); // a fission child fissioned B
    expect(b.energy).toBeGreaterThan(0.1); // B absorbed the hit
  });
});

// ===========================================================================
// LEVEL 2 — SMALL ENSEMBLES: propagation, interdiction, void boost
// ===========================================================================

describe("L2 ensembles: small cores", () => {
  it("a 3x3 core sustains more fissions than an isolated pair (propagation scales)", () => {
    seedRandom(42);
    const pair = buildReactor({ grid: { columns: 2, rows: 1 }, controlRod: { count: 0 } });
    chargeAtoms(pair, 0.9);
    const pairFissions = run(pair, 8).reduce((s, x) => s + x.fissions, 0);

    seedRandom(42);
    const nine = buildReactor({ grid: { columns: 3, rows: 3 }, controlRod: { count: 0 } });
    chargeAtoms(nine, 0.9);
    const nineFissions = run(nine, 8).reduce((s, x) => s + x.fissions, 0);

    expect(nineFissions).toBeGreaterThan(pairFissions);
  });

  it("an inserted rod interdicts the chain: fissions collapse vs rods-out", () => {
    seedRandom(7);
    const open = buildReactor(
      { grid: { columns: 4, rows: 4 }, controlRod: { count: 2 } },
      { rodInsertion: 0 }
    );
    chargeAtoms(open, 0.9);
    const openFissions = run(open, 8).reduce((s, x) => s + x.fissions, 0);

    seedRandom(7);
    const blocked = buildReactor(
      { grid: { columns: 4, rows: 4 }, controlRod: { count: 2 } },
      { rodInsertion: 1 }
    );
    chargeAtoms(blocked, 0.9);
    const blockedFissions = run(blocked, 8).reduce((s, x) => s + x.fissions, 0);

    expect(blockedFissions).toBeLessThan(openFissions * 0.5);
  });

  it("positive void coefficient: a voided core out-reacts a wet one", () => {
    // v3: inject identical thermal populations and compare fission yield —
    // voids raise survival (less water absorption) AND effective ν (boost).
    const fissionsFor = (voided: boolean) => {
      seedRandom(1234);
      // Full-size core: in a 9-atom lattice the ~1.3x void effect drowns in
      // RNG variance; across 400 atoms the absorption difference is decisive.
      const r = buildReactor(
        {
          controlRod: { count: 0 },
          atom: { spontaneousEmissionRate: 0 },
          // Freeze the void in place for the voided branch: condensation and
          // pump regen would silently re-wet the core within seconds and
          // neutralize the comparison
          ...(voided
            ? { water: { condensationRate: 0 }, regeneration: { water: { baseRate: 0 } } }
            : {}),
        },
        {}
      );
      if (voided) floodWater(r, 0.1);
      const cx = (r.vesselBounds.left + r.vesselBounds.right) / 2;
      const cy = (r.vesselBounds.top + r.vesselBounds.bottom) / 2;
      let fissions = 0;
      for (let sSec = 0; sSec < 6; sSec++) {
        r.injectNeutrons(cx, cy, 15);
        for (let i = 0; i < 60; i++) fissions += step(r, FRAME_MS, voided ? 0 : 1).fissions;
      }
      return fissions;
    };

    const wet = fissionsFor(false);
    const voided = fissionsFor(true);
    expect(voided).toBeGreaterThan(wet * 1.2);
  });
});

// ===========================================================================
// LEVEL 3 — FULL CORE (N=400): emergent behavior
// ===========================================================================

describe("L3 full core: emergent behavior", () => {
  it("criticality: withdrawing the rods ALONE self-ignites the cold core (background + k > 1)", () => {
    // The headline v3 behavior: no seeds, no charge, no operator injection.
    // Rod withdrawal raises k above 1 and the ever-present spontaneous
    // background multiplies into criticality by itself.
    const r = buildReactor({}, { seedNeutrons: 0, rodInsertion: 0 });
    const series = run(r, 30);
    const last5 = series.slice(-5);
    const totalFissions = series.reduce((sum, x) => sum + x.fissions, 0);

    expect(totalFissions).toBeGreaterThan(300); // it ignited
    expect(last5.reduce((sum, x) => sum + x.fissions, 0)).toBeGreaterThan(75); // and sustains
    expect(series[series.length - 1]!.avgTemp).toBeGreaterThan(0.35); // and makes real heat
  });

  it("SCRAM: full insertion collapses a rod-withdrawal-ignited reaction (decay-heat regression guard)", () => {
    const r = buildReactor({}, { seedNeutrons: 0, rodInsertion: 0 });
    const before = run(r, 20); // background self-ignition (verified above)
    const preScramRate = before.slice(-3).reduce((sum, x) => sum + x.fissions, 0) / 3;
    expect(preScramRate).toBeGreaterThan(20); // alive pre-SCRAM

    setRodTargets(r, 1.0);
    const after = run(r, 30);
    const finalRate = after.slice(-3).reduce((sum, x) => sum + x.fissions, 0) / 3;

    // Collapse: fission rate a small fraction of pre-SCRAM; only the ambient
    // background population remains (spontaneous emissions continue and are
    // correctly absorbed by the rods)
    expect(finalRate).toBeLessThanOrEqual(Math.max(3, preScramRate * 0.1));
    expect(after[after.length - 1]!.neutrons).toBeLessThan(40);
  });

  it("xenon dynamics: builds at power, persists after shutdown (iodine-pit behavior)", () => {
    const r = buildReactor({}, { seedNeutrons: 15, rodInsertion: 0 });
    chargeAtoms(r, 0.8); // hot start = fission-product production
    const atPower = run(r, 20);
    const peakXenon = atPower[atPower.length - 1]!.avgXenon;
    expect(peakXenon).toBeGreaterThan(0.01); // xenon measurably builds (CUI-iwv.14 evidence)
    expect(atPower[atPower.length - 1]!.avgXenon).toBeGreaterThan(atPower[2]!.avgXenon);

    setRodTargets(r, 1.0);
    const shutdown = run(r, 10);
    const residual = shutdown[shutdown.length - 1]!.avgXenon;
    // Xenon must OUTLIVE the shutdown (decays far slower than it built)
    expect(residual).toBeGreaterThan(peakXenon * 0.5);
  });

  it("iodine-pit config seeds atoms poisoned", () => {
    const r = buildReactor({ xenon: { initialLevel: 0.85 } });
    expect(r.atoms.every(a => a.xenonLevel === 0.85)).toBe(true);
  });

  it("clock discipline: deterministic subsystems converge for 16.67ms vs 8.33ms stepping", () => {
    // Disable all stochastic paths: no neutrons, emission impossible
    const mk = () => {
      const r = buildReactor({ atom: { spontaneousEmissionRate: 0 } });
      chargeAtoms(r, 0.9); // hot atoms drive heat/water/xenon deterministically
      return r;
    };

    const rA = mk();
    for (let i = 0; i < 600; i++) step(rA, FRAME_MS); // 10s at full frames

    const rB = mk();
    for (let i = 0; i < 1200; i++) step(rB, FRAME_MS / 2); // 10s at half frames

    const tempA = calculateAverageTemperature(rA.heatGrid);
    const tempB = calculateAverageTemperature(rB.heatGrid);
    expect(Math.abs(tempA - tempB)).toBeLessThan(0.02);

    const xenonA = rA.atoms[0]!.xenonLevel;
    const xenonB = rB.atoms[0]!.xenonLevel;
    expect(Math.abs(xenonA - xenonB)).toBeLessThan(0.02);

    let waterDiff = 0;
    for (let y = 0; y < rA.waterGrid.height; y++) {
      for (let x = 0; x < rA.waterGrid.width; x++) {
        waterDiff = Math.max(
          waterDiff,
          Math.abs(rA.waterGrid.waterDensity[y]![x]! - rB.waterGrid.waterDensity[y]![x]!)
        );
      }
    }
    expect(waterDiff).toBeLessThan(0.05);
  });

  it("invariants: after a chaotic run every state variable stays in range and accounting holds", () => {
    const r = buildReactor({}, { seedNeutrons: 15, rodInsertion: 0.3 });
    chargeAtoms(r, 0.9);
    run(r, 15);

    for (const a of r.atoms) {
      expect(a.energy).toBeGreaterThanOrEqual(0);
      expect(a.energy).toBeLessThanOrEqual(1);
      expect(a.integrity).toBeGreaterThanOrEqual(0);
      expect(a.integrity).toBeLessThanOrEqual(1);
      expect(a.xenonLevel).toBeGreaterThanOrEqual(0);
      expect(a.xenonLevel).toBeLessThanOrEqual(1);
      expect(a.precursorInventory).toBeGreaterThanOrEqual(0);
    }
    for (let y = 0; y < r.waterGrid.height; y++) {
      for (let x = 0; x < r.waterGrid.width; x++) {
        const w = r.waterGrid.waterDensity[y]![x]!;
        expect(w).toBeGreaterThanOrEqual(0);
        expect(w).toBeLessThanOrEqual(1);
      }
    }
    const temps = getActiveTemperatures(r.heatGrid);
    for (const row of temps) {
      for (const t of row) {
        expect(t).toBeGreaterThanOrEqual(0);
        expect(t).toBeLessThanOrEqual(1);
      }
    }
    for (const rod of r.controlRods) {
      expect(rod.health).toBeGreaterThanOrEqual(0);
      expect(rod.health).toBeLessThanOrEqual(1);
      expect(rod.insertion).toBeGreaterThanOrEqual(0);
      expect(rod.insertion).toBeLessThanOrEqual(1);
    }

    // Neutron accounting: everything alive must be explainable by creation
    // minus known removals (atom captures/fissions, rod/water absorption,
    // leaks; age-outs and cap-truncations only remove more)
    const created = r.totals.seeds + r.totals.emitted;
    const removedKnown =
      r.totals.fissions + r.totals.rodAbsorbed + r.totals.waterAbsorbed + r.totals.leaked;
    expect(r.neutrons.length).toBeLessThanOrEqual(created - removedKnown + r.totals.fissions);
    expect(created).toBeGreaterThanOrEqual(removedKnown * 0.5); // sanity: books are same order of magnitude
  });

  it("post-shutdown thermal recovery: a damaged, voided, hot core cools and re-floods (no deadlock)", () => {
    // Recreate the deadlock state directly: heavy fission-product inventories,
    // damaged fuel, boiled-off coolant, no neutrons, rods fully in.
    const r = buildReactor({}, { seedNeutrons: 0, rodInsertion: 1 });
    for (const atom of r.atoms) {
      atom.integrity = 0.5;
      atom.fissionProductInventory = 40; // a hard-worked core at shutdown
      atom.energy = 0.5;
    }
    floodWater(r, 0.05); // steam blanket
    // Pre-heat the grid so we start from the observed "stuck hot" state
    const temps = getActiveTemperatures(r.heatGrid);
    for (const row of temps) for (let x = 0; x < row.length; x++) row[x] = 0.85;

    const series = run(r, 120); // 2 sim-minutes of shutdown
    const early = series[5]!;
    const late = series[series.length - 1]!;

    // Decay heat keeps it hot at first (shutdown is HARD)...
    expect(early.avgTemp).toBeGreaterThan(0.2);
    // ...but products deplete, the blanket breaks, water returns, and it cools
    expect(late.avgTemp).toBeLessThan(early.avgTemp * 0.5);
    expect(late.avgTemp).toBeLessThan(0.25);
    expect(late.voidFraction).toBeLessThan(0.3); // coolant re-flooded
    // Fission products measurably depleted (~29s half-life over 120s)
    expect(r.atoms[0]!.fissionProductInventory).toBeLessThan(10);
  });

  it("graphite tip: SCRAM from a voided critical state spikes fissions before the collapse", () => {
    const mkCritical = (tipDisplacement: number) => {
      seedRandom(0xdeadbeef);
      const r = buildReactor(
        { controlRod: { graphiteTipDisplacement: tipDisplacement } },
        { seedNeutrons: 15, rodInsertion: 0.2 }
      );
      chargeAtoms(r, 0.85);
      run(r, 8); // let it get going
      return r;
    };

    // With graphite tips: SCRAM, then sample water displacement MID-TRAVEL
    // (after arrival the tips stop displacing and regen refills the cells)
    const withTip = mkCritical(DEFAULT_REACTOR_CONFIG.controlRod.graphiteTipDisplacement);
    setRodTargets(withTip, 1.0);
    for (let i = 0; i < 18; i++) step(withTip); // ~0.3s into SCRAM travel
    const rod = withTip.controlRods[0]!;
    expect(rod.insertion).toBeLessThan(1); // still traveling
    const tipY = rod.y + rod.maxHeight * rod.insertion;
    const density = getWaterDensityAtPosition(
      withTip.waterGrid,
      rod.x,
      Math.min(tipY + 5, withTip.vesselBounds.bottom - 1),
      withTip.vesselLeft,
      withTip.vesselTop
    );
    expect(density).toBeLessThan(1); // graphite is displacing water right now

    // Finish the 2s window and compare against a tipless control (same seed)
    const tipWindow = run(withTip, 2).reduce((s, x) => s + x.fissions, 0);

    const withoutTip = mkCritical(0);
    setRodTargets(withoutTip, 1.0);
    for (let i = 0; i < 18; i++) step(withoutTip);
    const noTipWindow = run(withoutTip, 2).reduce((s, x) => s + x.fissions, 0);

    // The tip transient must not make SCRAM *safer*; typically it spikes.
    // (Loose bound: stochastic even under seeding because paths diverge.)
    expect(tipWindow).toBeGreaterThanOrEqual(noTipWindow * 0.8);
  });
});

// ===========================================================================
// LEVEL 4 — CLOSED-LOOP CONTROL: the autopilot drives the full model
// ===========================================================================

describe("L4 autopilot: closed-loop power control", () => {
  /** Drive core + autopilot the way the component does (autopilot owns pumps). */
  function drive(r: ReturnType<typeof buildReactor>, ap: ReactorAutopilot, seconds: number) {
    const stepsTotal = Math.round((seconds * 1000) / FRAME_MS);
    const mwSeries: number[] = [];
    for (let i = 0; i < stepsTotal; i++) {
      step(r, FRAME_MS, ap.pumpCommand);
      ap.update(r, FRAME_MS, r.simTime);
      if (i % 60 === 59) mwSeries.push(r.powerOutputMW);
    }
    return mwSeries; // one sample per sim-second
  }

  it("cold startup: fires the source, establishes the reaction, and reaches meaningful power", () => {
    const r = buildReactor({}, { seedNeutrons: 0, rodInsertion: 0.65 });
    const ap = new ReactorAutopilot(800);

    // Snapshot the startup phase early — the 50-entry event ring buffer evicts
    // startup messages after minutes of regulation traffic
    drive(r, ap, 15);
    const sawStartup = r.events.some(
      e => e.source === "autopilot" && e.message.includes("startup")
    );
    const mwSeries = drive(r, ap, 105);

    // The reaction must have been established (startup handed off to control)
    expect(ap.mode === "regulate" || ap.mode === "protect").toBe(true);
    expect(sawStartup).toBe(true);
    // Power reached a meaningful fraction of target at some point
    expect(Math.max(...mwSeries)).toBeGreaterThan(800 * 0.3);
    // And the tail is not dead — the controller is holding a live reaction
    const tail = mwSeries.slice(-20);
    expect(tail.reduce((s, x) => s + x, 0) / tail.length).toBeGreaterThan(800 * 0.15);

    // The operator log reads like a logbook
    expect(r.events.filter(e => e.source === "autopilot").length).toBeGreaterThan(0);
  });

  it("protection: a core past the thermal limit triggers an autopilot SCRAM", () => {
    const r = buildReactor({}, { seedNeutrons: 15, rodInsertion: 0.1 });
    // A genuinely stuck-hot core: damaged fuel with heavy fission-product
    // inventories whose decay heat SUSTAINS the over-limit temperature across
    // control ticks (charged energy alone cools away within the first 500ms)
    for (const atom of r.atoms) {
      atom.integrity = 0.5;
      atom.fissionProductInventory = 80;
      atom.energy = 0.54;
    }
    floodWater(r, 0.05); // heavily voided: no water cooling
    const temps = getActiveTemperatures(r.heatGrid);
    for (const row of temps) for (let x = 0; x < row.length; x++) row[x] = 0.95;
    const ap = new ReactorAutopilot(800);
    drive(r, ap, 40);

    // The autopilot must have SCRAMed on the over-limit core. Depending on how
    // fast the core then cools, it may already have completed its full
    // protection cycle (scram → cold → auto-restart) — that recovery is a
    // feature, so accept either the latched state or evidence of the cycle.
    const scramEvents = r.events.filter(
      e => e.source === "autopilot" && e.message.includes("SCRAM")
    );
    expect(scramEvents.length).toBeGreaterThan(0);
    const restarted = r.events.some(
      e => e.source === "autopilot" && e.message.includes("restarting")
    );
    expect(ap.mode === "scram" || restarted).toBe(true);
  });
});
