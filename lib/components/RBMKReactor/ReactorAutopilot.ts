/**
 * ReactorAutopilot — closed-loop reactor power regulation (CUI-r9p)
 *
 * A headless, layered controller that drives a ReactorCore toward a target
 * thermal power while respecting the safety envelope — modeled on how real
 * reactor control actually prioritizes:
 *
 *   1. PROTECTION (overrides everything): temp/void/pressure past limits →
 *      drive rods in and pumps to max; sustained meltdown-range temperature →
 *      latched SCRAM until the core is verifiably cold.
 *   2. REGULATION: a PI controller on relative power error nudges a uniform
 *      rod-bank command in small steps (rods are slow — the controller must be
 *      patient), with a deadband so it doesn't chatter around the setpoint.
 *   3. COMPENSATION: rising xenon biases rods out (anticipating poisoning);
 *      rising void fraction raises pump throughput FIRST — coolant before
 *      reactivity, proper operator doctrine.
 *   4. STARTUP: a cold core cannot self-ignite (honest criticality physics),
 *      so the autopilot stages rods out and fires the neutron startup source
 *      until the chain reaction catches, then hands off to regulation.
 *
 * Every mode transition and meaningful control move is posted to the core's
 * event log tagged source:"autopilot" — rate-limited to CHANGES, not ticks —
 * so the log reads like an operator's logbook.
 *
 * The autopilot acts on a 500ms control cadence (not per frame): call update()
 * after every core.step(); it internally accumulates sim time and only acts on
 * tick boundaries.
 */

import { ReactorCore } from "./ReactorCore";

export type AutopilotMode = "startup" | "regulate" | "protect" | "scram";

/** Control cadence: how often the autopilot acts, in sim milliseconds. */
const CONTROL_TICK_MS = 500;
/** Largest rod-command change per control tick (insertion units). */
const MAX_ROD_STEP = 0.04;
/** Relative power deadband — inside it, hold position and bleed the integral. */
const DEADBAND = 0.05;
/** PI gains on relative power error. */
const KP = 0.12;
const KI = 0.015;
/** Rod command hard limits: never fully out (keeps some shutdown margin). */
const MIN_INSERTION = 0.05;
const MAX_INSERTION = 1.0;

export class ReactorAutopilot {
  targetMW: number;
  mode: AutopilotMode = "startup";
  /** Pump throughput the autopilot is commanding (0–1.5); consumer passes it to core.step. */
  pumpCommand = 1.0;

  private clock = 0; // sim ms since last control tick
  private integral = 0;
  private rodCommand: number | null = null; // uniform insertion command (lazily seeded)
  private lastPosted = ""; // rate-limit: only post when the message changes
  private lowPowerTicks = 0; // regulate-mode watchdog for a died-out reaction

  constructor(targetMW: number) {
    this.targetMW = targetMW;
  }

  /**
   * Advance the controller by `deltaTime` sim milliseconds. Call after every
   * core.step(); control decisions execute every CONTROL_TICK_MS.
   */
  update(core: ReactorCore, deltaTime: number, currentTime: number): void {
    this.clock += deltaTime;
    if (this.clock < CONTROL_TICK_MS) return;
    this.clock = 0;

    // Seed the rod command from the current rod state on first engagement
    if (this.rodCommand === null) {
      const rods = core.controlRods;
      this.rodCommand = rods.length
        ? rods.reduce((s, r) => s + r.targetInsertion, 0) / rods.length
        : 0.5;
    }

    const mw = core.powerOutputMW;
    const temp = core.reactorTemp;
    const voidF = core.voidFraction;
    const pressure = core.reactorPressure;
    const xenon = core.xenonLevel;

    // ---- 1. PROTECTION ----------------------------------------------------
    if (this.mode === "scram") {
      // Latched until the core is verifiably cold and quiet
      core.setRodTargets(1.0);
      this.pumpCommand = 1.5;
      if (temp < 0.35 && mw < this.targetMW * 0.05) {
        this.mode = "startup";
        this.integral = 0;
        this.rodCommand = 1.0;
        this.post(core, currentTime, "info", "AUTO: core cold and stable — restarting");
      }
      return;
    }

    if (temp > 0.85 || pressure > 0.95) {
      this.mode = "scram";
      this.integral = 0;
      core.setRodTargets(1.0);
      this.pumpCommand = 1.5;
      this.post(
        core,
        currentTime,
        "danger",
        `AUTO: SCRAM — core protection (temp ${pct(temp)}, pressure ${pct(pressure)})`
      );
      return;
    }

    if (temp > 0.72 || voidF > 0.55 || pressure > 0.88) {
      this.mode = "protect";
      this.rodCommand = clamp(this.rodCommand + 0.1, MIN_INSERTION, MAX_INSERTION);
      core.setRodTargets(this.rodCommand);
      this.pumpCommand = 1.5;
      this.post(
        core,
        currentTime,
        "warning",
        `AUTO: driving rods in to ${pct(this.rodCommand)} — temp ${pct(temp)}, void ${pct(voidF)}`
      );
      return;
    }
    if (this.mode === "protect") {
      // Envelope cleared — hand back to regulation
      this.mode = "regulate";
      this.post(core, currentTime, "info", "AUTO: envelope clear — resuming regulation");
    }

    // ---- 3. COMPENSATION: coolant before reactivity -----------------------
    const desiredPump = clamp(1 + voidF * 1.2, 1, 1.5);
    if (Math.abs(desiredPump - this.pumpCommand) >= 0.1) {
      this.pumpCommand = desiredPump;
      if (desiredPump > 1.05) {
        this.post(
          core,
          currentTime,
          "info",
          `AUTO: pumps to ${pct(this.pumpCommand / 1.5)} capacity — void ${pct(voidF)}`
        );
      }
    }

    // ---- 4. STARTUP -------------------------------------------------------
    if (this.mode === "startup") {
      // Stage rods out toward a startup position and fire the neutron source
      // v3: the spontaneous background self-ignites the core once k > 1, so a
      // moderate withdrawal is enough — deep withdrawal causes an ignition
      // excursion that trips protection. Regulation takes it from here.
      this.rodCommand = clamp(this.rodCommand - 0.06, 0.45, MAX_INSERTION);
      core.setRodTargets(this.rodCommand);

      // Fire the startup source: CONCENTRATED bursts near the core center (a
      // cold core cannot self-ignite — this is the Cf-252 source, automated).
      // Concentration matters: cold ignition needs sustained LOCAL flux to
      // build a self-heating pocket; scattering bursts across random channels
      // spreads the flux too thin to ever catch.
      const cx = (core.vesselBounds.left + core.vesselBounds.right) / 2;
      const cy = (core.vesselBounds.top + core.vesselBounds.bottom) / 2;
      for (let burst = 0; burst < 4; burst++) {
        const jx = cx + (Math.random() - 0.5) * 50;
        const jy = cy + (Math.random() - 0.5) * 50;
        core.injectNeutrons(jx, jy, 6);
      }
      this.post(
        core,
        currentTime,
        "info",
        `AUTO: startup — rods to ${pct(this.rodCommand)}, neutron source firing`
      );

      if (mw > this.targetMW * 0.15) {
        this.mode = "regulate";
        this.integral = 0;
        this.post(
          core,
          currentTime,
          "info",
          `AUTO: reaction established (${mwFmt(mw)}) — regulating to ${mwFmt(this.targetMW)}`
        );
      }
      return;
    }

    // ---- 2. REGULATION (PI on relative power error) -----------------------
    const error = (this.targetMW - mw) / this.targetMW; // + → need more power

    // Died-out watchdog: if power collapses while regulating, go re-ignite
    if (mw < this.targetMW * 0.05) {
      this.lowPowerTicks += 1;
      if (this.lowPowerTicks >= 6) {
        this.mode = "startup";
        this.lowPowerTicks = 0;
        this.integral = 0;
        this.post(core, currentTime, "warning", "AUTO: reaction lost — re-igniting");
        return;
      }
    } else {
      this.lowPowerTicks = 0;
    }

    if (Math.abs(error) < DEADBAND) {
      this.integral *= 0.9; // bleed the integral inside the deadband
      return; // hold position — no event chatter
    }

    this.integral = clamp(this.integral + error * (CONTROL_TICK_MS / 1000), -2, 2);
    let step = clamp(KP * error + KI * this.integral, -MAX_ROD_STEP, MAX_ROD_STEP);

    // Xenon compensation: poisoning soaks reactivity — bias rods outward
    step += xenon * 0.01;

    // Positive error → withdraw (reduce insertion); negative → insert
    this.rodCommand = clamp(this.rodCommand - step, MIN_INSERTION, MAX_INSERTION);
    core.setRodTargets(this.rodCommand);

    this.post(
      core,
      currentTime,
      "info",
      `AUTO: rods ${step > 0 ? "out" : "in"} to ${pct(this.rodCommand)} — power ${mwFmt(mw)}/${mwFmt(this.targetMW)}`
    );
  }

  /** Post an operator-log event, suppressing consecutive duplicates. */
  private post(
    core: ReactorCore,
    time: number,
    severity: "info" | "warning" | "danger",
    message: string
  ): void {
    if (message === this.lastPosted) return;
    this.lastPosted = message;
    core.postEvent(time, severity, message, "autopilot");
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function mwFmt(mw: number): string {
  return `${Math.round(mw)}MW`;
}
