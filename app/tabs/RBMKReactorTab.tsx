/**
 * RBMK Reactor Simulation Tab
 *
 * Interactive nuclear reactor simulation showing:
 * - Uranium fuel atoms in grid layout
 * - Control rods (raise/lower to regulate reaction)
 * - Neutron particles with realistic physics
 * - Real-time statistics and controls
 *
 * Based on RBMK-1000 reactor specifications (Chernobyl Unit 4 type).
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { RBMKReactor } from "@/catalyst-ui/components/RBMKReactor";
import {
  SimulationState,
  SimEvent,
  REACTOR_PRESETS,
  createReactorConfig,
  SCENARIO_OVERRIDES,
} from "@/catalyst-ui/components/RBMKReactor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { Label } from "@/catalyst-ui/ui/label";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Badge } from "@/catalyst-ui/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { CircularGauge } from "@/catalyst-ui/ui/circular-gauge";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

export const TAB_ORDER = 100;
export const TAB_SECTION = "projects.misc";

// Matches the reactor component's documented flux-stabilizing startup pattern:
// even rods at 65% insertion, odd rods at 45%.
const STAGGERED_INSERTIONS = Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? 0.65 : 0.45));

// Scenario preset identifiers (physics deltas layered over the base config).
type ScenarioPreset = "normal" | "lowPowerTest" | "highReactivity" | "scrammed" | "iodinePit";

// Fixed operator target bands for the "Operator Mode" panel (MW).
const OPERATOR_BANDS = {
  low: { label: "Low", min: 300, max: 600 },
  nominal: { label: "Nominal", min: 600, max: 1000 },
  high: { label: "High", min: 1000, max: 1600 },
} as const;
type OperatorBandKey = keyof typeof OPERATOR_BANDS;

// Strip-chart sample retained in a ref buffer (see handleStateChange).
interface ChartSample {
  t: number;
  mw: number;
  temp: number;
  voidF: number;
  xenon: number;
  neutrons: number;
  rate: number;
  pressure: number;
}
const CHART_WINDOW_MS = 60_000;
const CHART_MAX_SAMPLES = 400;
const CHART_MAX_POINTS = 120;

// Annunciator alarm tiles. Each `active` reads the live sim + derived fuel integrity.
type AnnunKey = "temp" | "press" | "coolant" | "xenon" | "fuel" | "rod";

export function RBMKReactorTab() {
  const [isRunning, setIsRunning] = useState(false); // Start paused to prevent immediate criticality
  const [speed, setSpeed] = useState(0.5); // Start at half speed to observe void coefficient effects
  const [controlRodInsertions, setControlRodInsertions] = useState<number[]>([
    ...STAGGERED_INSERTIONS,
  ]);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset>("normal");
  const [physicsConfig, setPhysicsConfig] = useState<"normal" | "ultraRealistic" | "easy">(
    "normal"
  );
  const [resetKey, setResetKey] = useState(0); // Key to force component remount
  const [masterControlValue, setMasterControlValue] = useState(0.5); // Master control slider value
  const [isMasterControlEngaged, setIsMasterControlEngaged] = useState(false); // Rods start staggered, so master is not in control

  // Recirc pump throughput (0–1.5, 1 = nominal). Scales coolant regeneration in the sim.
  const [pumpPower, setPumpPower] = useState(1.0);

  // Rod banks: A drives even-index rods, B drives odd — initial values match the stagger.
  const [bankA, setBankA] = useState(0.65);
  const [bankB, setBankB] = useState(0.45);

  // Operator mode: fixed target band + in-band tracking derived from the chart buffer.
  const [operatorMode, setOperatorMode] = useState(false);
  // Autopilot: closed-loop controller in the sim owns rods+pumps while engaged.
  const [autopilotOn, setAutopilotOn] = useState(false);
  const [operatorBand, setOperatorBand] = useState<OperatorBandKey>("nominal");

  // Annunciator latch/ack state. A tile stays lit until its condition clears AND is acknowledged.
  const [annun, setAnnun] = useState<{ latched: Set<AnnunKey>; acked: Set<AnnunKey> }>({
    latched: new Set(),
    acked: new Set(),
  });

  // Strip-chart ring buffer. Sampled from onStateChange (~200ms throttle in the component);
  // read directly during render since each sample triggers a re-render via setSimulationState.
  const chartBufferRef = useRef<ChartSample[]>([]);

  // Delta tracking for rate-of-change indicators
  const previousValuesRef = useRef<{
    neutrons: number;
    reactionRate: number;
    reactorTemp: number;
    voidFraction: number;
    reactorPressure: number;
    fuelIntegrity: number;
    leakage: number;
    rodHealths: number[];
  } | null>(null);

  const [deltas, setDeltas] = useState<{
    neutrons: number;
    reactionRate: number;
    reactorTemp: number;
    voidFraction: number;
    reactorPressure: number;
    fuelIntegrity: number;
    leakage: number;
    rodHealths: number[];
  }>({
    neutrons: 0,
    reactionRate: 0,
    reactorTemp: 0,
    voidFraction: 0,
    reactorPressure: 0,
    fuelIntegrity: 0,
    leakage: 0,
    rodHealths: Array(10).fill(0),
  });

  // Detect catastrophic state (MELTDOWN)
  const isCritical =
    simulationState &&
    (simulationState.reactorTemp > 0.8 || // Temperature critical
      simulationState.neutrons.length > 800); // Neutron count critical (80% of max)

  const handleStateChange = useCallback((state: SimulationState) => {
    setSimulationState(state);

    // Sample the strip-chart buffer: evict >60s old, cap at 400 entries.
    const now = Date.now();
    const buf = chartBufferRef.current;
    buf.push({
      t: now,
      mw: state.powerOutputMW ?? 0,
      temp: state.reactorTemp ?? 0,
      voidF: state.voidFraction ?? 0,
      xenon: state.xenonLevel ?? 0,
      neutrons: state.neutrons.length,
      rate: state.reactionRate ?? 0,
      pressure: state.reactorPressure ?? 0,
    });
    while (buf.length && now - buf[0].t > CHART_WINDOW_MS) buf.shift();
    if (buf.length > CHART_MAX_SAMPLES) buf.splice(0, buf.length - CHART_MAX_SAMPLES);

    // Calculate current values
    const fuelIntegrity =
      (state.atoms.reduce((sum, atom) => sum + atom.integrity, 0) / state.atoms.length) * 100;
    const rodHealths = state.controlRods.map(rod => (rod.health ?? 1.0) * 100);

    // Calculate deltas if we have previous values
    if (previousValuesRef.current) {
      setDeltas({
        neutrons: state.neutrons.length - previousValuesRef.current.neutrons,
        reactionRate: state.reactionRate - previousValuesRef.current.reactionRate,
        reactorTemp: (state.reactorTemp || 0) * 100 - previousValuesRef.current.reactorTemp,
        voidFraction: (state.voidFraction || 0) * 100 - previousValuesRef.current.voidFraction,
        reactorPressure:
          (state.reactorPressure || 0) * 100 - previousValuesRef.current.reactorPressure,
        fuelIntegrity: fuelIntegrity - previousValuesRef.current.fuelIntegrity,
        leakage: (state.totalLeaked || 0) - previousValuesRef.current.leakage,
        rodHealths: rodHealths.map(
          (health, idx) => health - (previousValuesRef.current?.rodHealths[idx] ?? 100)
        ),
      });
    }

    // Store current values for next delta calculation
    previousValuesRef.current = {
      neutrons: state.neutrons.length,
      reactionRate: state.reactionRate,
      reactorTemp: (state.reactorTemp || 0) * 100,
      voidFraction: (state.voidFraction || 0) * 100,
      reactorPressure: (state.reactorPressure || 0) * 100,
      fuelIntegrity,
      leakage: state.totalLeaked || 0,
      rodHealths,
    };
  }, []);

  const handleRodChange = (index: number, value: number[]) => {
    const newInsertions = [...controlRodInsertions];
    newInsertions[index] = value[0] ?? 0.5;
    setControlRodInsertions(newInsertions);
    setIsMasterControlEngaged(false); // Disengage master control when individual rod is moved
  };

  const handleMasterControlChange = (value: number[]) => {
    const newValue = value[0] ?? 0.5;
    setMasterControlValue(newValue);
    setControlRodInsertions(Array(10).fill(newValue)); // Set all rods to same value
    setIsMasterControlEngaged(true); // Engage master control
  };

  // Rod banks: parity 0 = even-index rods (Bank A), parity 1 = odd-index rods (Bank B).
  const handleBankChange = (parity: 0 | 1, value: number[]) => {
    const v = value[0] ?? 0.5;
    if (parity === 0) setBankA(v);
    else setBankB(v);
    setControlRodInsertions(prev => prev.map((ins, i) => (i % 2 === parity ? v : ins)));
    setIsMasterControlEngaged(false); // Bank control overrides the master
  };

  const handleReset = () => {
    setControlRodInsertions([...STAGGERED_INSERTIONS]);
    setMasterControlValue(0.5);
    setIsMasterControlEngaged(false);
    setBankA(0.65);
    setBankB(0.45);
    const wasRunning = isRunning;
    setIsRunning(false);
    setResetKey(prev => prev + 1); // Force remount for a full simulation reset
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 100);
    }
  };

  const handleResetStats = () => {
    // Reset simulation by toggling running state
    const wasRunning = isRunning;
    setIsRunning(false);
    setResetKey(prev => prev + 1); // Force remount to reset all stats
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 100);
    }
  };

  const handleScram = () => {
    // Emergency shutdown - insert all rods (without remounting).
    // Manual SCRAM is the highest authority: it also disengages the autopilot.
    setAutopilotOn(false);
    setControlRodInsertions(Array(10).fill(1.0));
    setMasterControlValue(1.0);
    setIsMasterControlEngaged(true);
  };

  const handleWithdrawAll = () => {
    // Withdraw all rods (dangerous!)
    setControlRodInsertions(Array(10).fill(0.0));
    setMasterControlValue(0.0);
    setIsMasterControlEngaged(true);
  };

  const handlePresetChange = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setResetKey(prev => prev + 1); // Force remount to apply new config
    // Reset control rods based on preset
    if (preset === "scrammed") {
      setControlRodInsertions(Array(10).fill(1.0));
      setMasterControlValue(1.0);
      setIsMasterControlEngaged(true);
    } else {
      // Match the freshly-remounted simulation's staggered startup pattern
      setControlRodInsertions([...STAGGERED_INSERTIONS]);
      setMasterControlValue(0.5);
      setIsMasterControlEngaged(false);
      setBankA(0.65);
      setBankB(0.45);
    }
  };

  // Get base config from physics preset, then layer scenario preset deltas on top.
  // Memoized so the config prop identity stays stable across unrelated re-renders.
  const config = useMemo(() => {
    const base = REACTOR_PRESETS[physicsConfig];
    return selectedPreset === "normal"
      ? base
      : createReactorConfig(SCENARIO_OVERRIDES[selectedPreset], base);
  }, [physicsConfig, selectedPreset]);

  // Average fuel integrity (0 = fully melted, 1 = pristine). No || fallback:
  // zero is a meaningful value and must not display as full health.
  const avgFuelIntegrity =
    simulationState && simulationState.atoms.length > 0
      ? simulationState.atoms.reduce((sum, atom) => sum + atom.integrity, 0) /
        simulationState.atoms.length
      : 1;

  // Annunciator alarm definitions. `active` reads the live sim + derived fuel integrity.
  const annunciatorDefs: {
    key: AnnunKey;
    label: string;
    active: (s: SimulationState) => boolean;
  }[] = [
    { key: "temp", label: "HIGH TEMP", active: s => (s.reactorTemp || 0) > 0.8 },
    { key: "press", label: "HIGH PRESS", active: s => (s.reactorPressure || 0) > 0.9 },
    { key: "coolant", label: "LOW COOLANT", active: s => (s.voidFraction || 0) > 0.5 },
    { key: "xenon", label: "XENON", active: s => (s.xenonLevel || 0) > 0.6 },
    { key: "fuel", label: "FUEL DMG", active: () => avgFuelIntegrity < 0.9 },
    { key: "rod", label: "ROD DMG", active: s => s.controlRods.some(r => (r.health ?? 1) < 0.5) },
  ];

  // Latch newly-active alarms; unlatch only when the condition has cleared AND been acknowledged.
  useEffect(() => {
    if (!simulationState) return;
    const currentlyActive = new Set<AnnunKey>(
      annunciatorDefs.filter(d => d.active(simulationState)).map(d => d.key)
    );
    setAnnun(prev => {
      const latched = new Set(prev.latched);
      const acked = new Set(prev.acked);
      let changed = false;
      currentlyActive.forEach(k => {
        if (!latched.has(k)) {
          latched.add(k);
          changed = true;
        }
      });
      latched.forEach(k => {
        if (!currentlyActive.has(k) && acked.has(k)) {
          latched.delete(k);
          acked.delete(k);
          changed = true;
        }
      });
      return changed ? { latched, acked } : prev;
    });
    // annunciatorDefs is recomputed each render; simulationState drives the meaningful change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState]);

  const handleAckAll = () => {
    setAnnun(prev => {
      const acked = new Set(prev.acked);
      prev.latched.forEach(k => acked.add(k));
      return { latched: prev.latched, acked };
    });
  };

  // Keep the latest control handlers reachable from the (mount-once) keyboard listener.
  const shortcutHandlersRef = useRef({
    togglePlay: () => setIsRunning(r => !r),
    scram: handleScram,
    reset: handleReset,
  });
  shortcutHandlersRef.current = {
    togglePlay: () => setIsRunning(r => !r),
    scram: handleScram,
    reset: handleReset,
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.code === "Space") {
        e.preventDefault();
        shortcutHandlersRef.current.togglePlay();
      } else if (e.code === "KeyS") {
        shortcutHandlersRef.current.scram();
      } else if (e.code === "KeyR") {
        shortcutHandlersRef.current.reset();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Operator-mode metrics derived from the strip-chart buffer over the last 60s.
  const currentMW = simulationState?.powerOutputMW ?? 0;
  const activeBand = OPERATOR_BANDS[operatorBand];
  const inBandNow = currentMW >= activeBand.min && currentMW <= activeBand.max;
  const percentInBand = (() => {
    const buf = chartBufferRef.current;
    if (buf.length === 0) return 0;
    const hits = buf.filter(s => s.mw >= activeBand.min && s.mw <= activeBand.max).length;
    return (hits / buf.length) * 100;
  })();

  // One consolidated trend row: label | live value | delta | threshold status dot | sparkline.
  // Downsamples the buffer to ≤120 points and normalizes to [domainMin, domainMax].
  type TrendStatus = "danger" | "warning" | "info" | "normal";
  const MetricRow = ({
    label,
    value,
    delta = 0,
    decimals = 0,
    status,
    accessor,
    domainMin,
    domainMax,
    autoMax,
    stroke,
  }: {
    label: string;
    value: string;
    delta?: number;
    decimals?: number;
    status: TrendStatus;
    accessor: (s: ChartSample) => number;
    domainMin: number;
    domainMax: number;
    autoMax?: number; // when set, domainMax = max(autoMax, observed max)
    stroke: string;
  }) => {
    const buf = chartBufferRef.current;
    const w = 240;
    const h = 24;
    let series = buf.map(accessor);
    if (series.length > CHART_MAX_POINTS) {
      const step = series.length / CHART_MAX_POINTS;
      const sampled: number[] = [];
      for (let i = 0; i < CHART_MAX_POINTS; i++) sampled.push(series[Math.floor(i * step)] ?? 0);
      series = sampled;
    }
    let hi = domainMax;
    if (autoMax !== undefined) hi = Math.max(autoMax, ...series, domainMin + 1);
    const span = hi - domainMin || 1;
    const points = series
      .map((v, i) => {
        const x = series.length > 1 ? (i / (series.length - 1)) * w : 0;
        const norm = (v - domainMin) / span;
        const y = h - Math.min(1, Math.max(0, norm)) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
    // Status drives both the value text and the dot color (color-blind-safe: text carries it too).
    const tone =
      status === "danger"
        ? "text-destructive"
        : status === "warning"
          ? "text-yellow-500"
          : status === "info"
            ? "text-primary"
            : "text-muted-foreground";
    const showDelta = Math.abs(delta) >= 0.01;
    const deltaColor = delta > 0 ? "text-green-500" : "text-red-500";
    return (
      <div className="flex items-center gap-2 h-[30px]">
        <div className="w-14 flex-shrink-0 text-[10px] text-muted-foreground leading-tight">
          {label}
        </div>
        <div
          className={`w-11 flex-shrink-0 text-right text-[11px] font-mono font-semibold ${tone}`}
        >
          {value}
        </div>
        <div className="w-9 flex-shrink-0 text-right">
          {showDelta && (
            <span className={`text-[9px] font-mono font-bold ${deltaColor}`}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(decimals)}
            </span>
          )}
        </div>
        <span
          className={`h-2 w-2 flex-shrink-0 rounded-full ${tone}`}
          style={{ backgroundColor: "currentColor" }}
          aria-hidden
        />
        <svg
          width="100%"
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          className="flex-1 rounded bg-muted/30"
        >
          {series.length > 1 && (
            <polyline
              points={points}
              fill="none"
              style={{ stroke }}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    );
  };

  // Delta indicator component for showing rate of change
  const DeltaIndicator = ({ value, decimals = 0 }: { value: number; decimals?: number }) => {
    if (Math.abs(value) < 0.01) return null; // Don't show very small changes

    const isPositive = value > 0;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const bgColor = isPositive ? "bg-green-500/10" : "bg-red-500/10";
    const sign = isPositive ? "+" : "";

    return (
      <span
        className={`absolute -top-1 -right-1 text-[9px] font-mono font-bold ${color} ${bgColor} px-1 py-0.5 rounded border border-current/20 shadow-sm`}
      >
        {sign}
        {value.toFixed(decimals)}
      </span>
    );
  };

  return (
    <div className="space-y-6 mt-0 relative">
      {/* Overview Card */}
      {/* <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>RBMK-1000 Reactor Simulation</CardTitle>
            <CardDescription>
              Interactive visualization of a graphite-moderated boiling water reactor with control
              rod dynamics and neutron physics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Reactor Specifications</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• 1,693 fuel channels (scaled to 20x20 grid)</li>
                  <li>• 211 control rods (scaled to 10)</li>
                  <li>• Boron-10 carbide absorbers</li>
                  <li>• 7m active zone height</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Physics Model</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• U-235 fission cross-section: 580 barns</li>
                  <li>• B-10 absorption: 3,840 barns</li>
                  <li>• Average neutrons/fission: 2.43</li>
                  <li>• Thermal neutron velocity: ~2200 m/s</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Controls</h4>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Raise/lower individual control rods</li>
                  <li>• Adjust simulation speed</li>
                  <li>• Emergency SCRAM function</li>
                  <li>• Real-time reaction statistics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem> */}

      {/* Simulation Card - side by side with control panel */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Reactor Core Visualization</CardTitle>
            <CardDescription>
              Yellow atoms emit neutrons • Blue particles are free neutrons • Gray bars are control
              rods
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row gap-0">
              {/* Left side: Simulation */}
              <div className="flex-1 p-4 border-r relative">
                {/* Reset Stats Button (top right corner) */}
                {simulationState && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetStats}
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-destructive/10"
                    title="Reset Statistics"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {/* Compact Gauge Metrics */}
                {simulationState && (
                  <div className="space-y-4 mb-4">
                    {/* Reactor Trends — consolidated live metrics + strip-chart sparklines */}
                    <div className="p-3 bg-accent/10 border border-primary/20 rounded">
                      <div className="flex items-start justify-between mb-2 gap-4">
                        <h4 className="text-xs font-semibold text-muted-foreground">
                          Reactor Trends (60s)
                        </h4>
                        {/* Events pie (fissions vs rod absorptions) */}
                        {(() => {
                          const total =
                            simulationState.totalFissions + simulationState.totalAbsorbed;
                          const fissionPercent =
                            total > 0 ? (simulationState.totalFissions / total) * 100 : 50;

                          // SVG pie chart
                          const size = 48;
                          const radius = 18;
                          const center = size / 2;

                          const fissionAngle = (fissionPercent / 100) * 360;
                          const fissionRadians = (fissionAngle * Math.PI) / 180;
                          const fissionX = center + radius * Math.sin(fissionRadians);
                          const fissionY = center - radius * Math.cos(fissionRadians);
                          const fissionLargeArc = fissionAngle > 180 ? 1 : 0;

                          return (
                            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                              <svg width={size} height={size} className="drop-shadow-sm">
                                <path
                                  d={`M ${center},${center} L ${center},${center - radius} A ${radius},${radius} 0 ${fissionLargeArc},1 ${fissionX},${fissionY} Z`}
                                  fill="#fbbf24"
                                  stroke="#18181b"
                                  strokeWidth="2"
                                />
                                <path
                                  d={`M ${center},${center} L ${fissionX},${fissionY} A ${radius},${radius} 0 ${1 - fissionLargeArc},1 ${center},${center - radius} Z`}
                                  fill="#60a5fa"
                                  stroke="#18181b"
                                  strokeWidth="2"
                                />
                                <circle cx={center} cy={center} r={radius * 0.5} fill="#18181b" />
                                <text
                                  x={center}
                                  y={center}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="#fafafa"
                                  fontSize="9"
                                  fontWeight="bold"
                                >
                                  {total}
                                </text>
                              </svg>
                              <span className="text-[9px] text-muted-foreground">Events</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="space-y-0.5">
                        <MetricRow
                          label="Power MW"
                          value={(simulationState.powerOutputMW || 0).toFixed(0)}
                          status={
                            (simulationState.powerOutputMW || 0) > 2400
                              ? "danger"
                              : (simulationState.powerOutputMW || 0) > 1600
                                ? "warning"
                                : "normal"
                          }
                          accessor={s => s.mw}
                          domainMin={0}
                          domainMax={1600}
                          autoMax={1600}
                          stroke="var(--primary)"
                        />
                        <MetricRow
                          label="Neutrons"
                          value={simulationState.neutrons.length.toString()}
                          delta={deltas.neutrons}
                          decimals={0}
                          status={
                            simulationState.neutrons.length > 800
                              ? "danger"
                              : simulationState.neutrons.length > 600
                                ? "warning"
                                : "info"
                          }
                          accessor={s => s.neutrons}
                          domainMin={0}
                          domainMax={1000}
                          stroke="var(--muted-foreground)"
                        />
                        <MetricRow
                          label="Rate/s"
                          value={simulationState.reactionRate.toFixed(0)}
                          delta={deltas.reactionRate}
                          decimals={0}
                          status={simulationState.reactionRate > 600 ? "danger" : "normal"}
                          accessor={s => s.rate}
                          domainMin={0}
                          domainMax={1000}
                          stroke="var(--muted-foreground)"
                        />
                        <MetricRow
                          label="Temp"
                          value={((simulationState.reactorTemp || 0) * 100).toFixed(0) + "%"}
                          delta={deltas.reactorTemp}
                          decimals={1}
                          status={
                            (simulationState.reactorTemp || 0) > 0.8
                              ? "danger"
                              : (simulationState.reactorTemp || 0) > 0.6
                                ? "warning"
                                : "normal"
                          }
                          accessor={s => s.temp}
                          domainMin={0}
                          domainMax={1}
                          stroke="var(--destructive)"
                        />
                        <MetricRow
                          label="Void"
                          value={((simulationState.voidFraction || 0) * 100).toFixed(0) + "%"}
                          delta={deltas.voidFraction}
                          decimals={1}
                          status={(simulationState.voidFraction || 0) > 0.5 ? "warning" : "normal"}
                          accessor={s => s.voidF}
                          domainMin={0}
                          domainMax={1}
                          stroke="var(--muted-foreground)"
                        />
                        <MetricRow
                          label="Pressure"
                          value={((simulationState.reactorPressure || 0) * 100).toFixed(0) + "%"}
                          delta={deltas.reactorPressure}
                          decimals={1}
                          status={
                            (simulationState.reactorPressure || 0) >= 0.9
                              ? "danger"
                              : (simulationState.reactorPressure || 0) >= 0.7
                                ? "warning"
                                : "normal"
                          }
                          accessor={s => s.pressure}
                          domainMin={0}
                          domainMax={1}
                          stroke="var(--muted-foreground)"
                        />
                        <MetricRow
                          label="Xenon"
                          value={((simulationState.xenonLevel || 0) * 100).toFixed(0) + "%"}
                          status={
                            (simulationState.xenonLevel || 0) > 0.6
                              ? "warning"
                              : (simulationState.xenonLevel || 0) > 0.1
                                ? "info"
                                : "normal"
                          }
                          accessor={s => s.xenon}
                          domainMin={0}
                          domainMax={1}
                          stroke="var(--muted-foreground)"
                        />
                      </div>
                    </div>

                    {/* Annunciator Panel */}
                    <div className="p-3 bg-accent/10 border border-primary/20 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground">Annunciator</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={handleAckAll}
                          disabled={annun.latched.size === 0}
                        >
                          ACK ALL
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {annunciatorDefs.map(def => {
                          const lit = annun.latched.has(def.key);
                          const isAcked = annun.acked.has(def.key);
                          const tone = !lit
                            ? "border-border bg-muted/30 text-muted-foreground/50"
                            : isAcked
                              ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-500"
                              : "border-red-500/70 bg-red-500/20 text-red-500 animate-pulse";
                          return (
                            <div
                              key={def.key}
                              className={`rounded border px-2 py-1.5 text-center text-[10px] font-mono font-bold tracking-tight ${tone}`}
                            >
                              {def.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Control Rods & Safety */}
                    <div className="p-3 bg-accent/10 border border-primary/20 rounded">
                      <h4 className="text-xs font-semibold mb-3 text-muted-foreground">
                        Control Rods & Safety
                      </h4>
                      <Label className="text-xs text-muted-foreground mb-3 block">
                        Control Rods (0% = Raised • 100% = Lowered)
                      </Label>
                      <div className="flex items-end gap-3 justify-center">
                        {/* Fuel & Leakage Stacked (Far Left) */}
                        <div className="flex flex-col items-center gap-3 pr-3 border-r-2 border-primary/20">
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={avgFuelIntegrity * 100}
                              label="Fuel"
                              variant={
                                avgFuelIntegrity < 0.7
                                  ? "danger"
                                  : avgFuelIntegrity < 0.9
                                    ? "warning"
                                    : "success"
                              }
                              size={48}
                            />
                            <DeltaIndicator value={deltas.fuelIntegrity} decimals={2} />
                          </div>
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={simulationState.totalLeaked || 0}
                              max={100}
                              label="Leakage"
                              variant={
                                (simulationState.totalLeaked || 0) > 50
                                  ? "danger"
                                  : (simulationState.totalLeaked || 0) > 20
                                    ? "warning"
                                    : "default"
                              }
                              size={48}
                              showPercent={false}
                            />
                            <DeltaIndicator value={deltas.leakage} decimals={0} />
                          </div>
                        </div>

                        {/* Individual Rods */}
                        {simulationState.controlRods.map((rod, idx) => (
                          <div key={rod.id} className="flex flex-col items-center gap-2">
                            {/* Health Gauge */}
                            <div className="relative flex flex-col items-center">
                              <CircularGauge
                                value={(rod.health ?? 1.0) * 100}
                                label={`R${idx + 1}`}
                                variant={
                                  (rod.health ?? 1.0) < 0.5
                                    ? "danger"
                                    : (rod.health ?? 1.0) < 0.8
                                      ? "warning"
                                      : "success"
                                }
                                size={48}
                              />
                              <DeltaIndicator value={deltas.rodHealths[idx] ?? 0} decimals={2} />
                            </div>
                            {/* Vertical Slider */}
                            <div className="flex flex-col items-center gap-1">
                              <Slider
                                value={[controlRodInsertions[idx] ?? 0.5]}
                                min={0}
                                max={1}
                                step={0.01}
                                onValueChange={vals => handleRodChange(idx, vals)}
                                orientation="vertical"
                                disabled={autopilotOn}
                                className="h-24"
                              />
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {((controlRodInsertions[idx] ?? 0.5) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Rod Banks (A = even rods, B = odd rods) */}
                        <div className="flex items-end gap-2 pl-3 border-l-2 border-primary/20">
                          <div className="flex flex-col items-center gap-1">
                            <Label className="text-[10px] font-semibold">Bank A</Label>
                            <Slider
                              value={[bankA]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={vals => handleBankChange(0, vals)}
                              orientation="vertical"
                              disabled={autopilotOn}
                              className="h-24"
                            />
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(bankA * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Label className="text-[10px] font-semibold">Bank B</Label>
                            <Slider
                              value={[bankB]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={vals => handleBankChange(1, vals)}
                              orientation="vertical"
                              disabled={autopilotOn}
                              className="h-24"
                            />
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(bankB * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Master Control (Far Right) */}
                        <div className="flex flex-col items-center gap-2 pl-3 border-l-2 border-primary/20">
                          <div className="flex flex-col items-center">
                            <Label className="text-xs font-semibold mb-1">Master</Label>
                            <Badge
                              variant={isMasterControlEngaged ? "default" : "outline"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {isMasterControlEngaged ? "ON" : "OFF"}
                            </Badge>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Slider
                              value={[masterControlValue]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={handleMasterControlChange}
                              orientation="vertical"
                              disabled={autopilotOn}
                              className={`h-24 ${isMasterControlEngaged ? "" : "opacity-50"}`}
                            />
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(masterControlValue * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reactor Visualization */}
                <div className="flex justify-center mb-4 h-[700px] w-full relative">
                  <div style={isCritical ? { animation: "shake 0.5s infinite" } : undefined}>
                    <RBMKReactor
                      key={resetKey}
                      config={config}
                      width={1100}
                      height={850}
                      onStateChange={handleStateChange}
                      controlRodInsertions={controlRodInsertions}
                      isRunning={isRunning}
                      speed={speed}
                      pumpPower={pumpPower}
                      autopilot={{
                        enabled: autopilotOn,
                        targetMW: Math.round((activeBand.min + activeBand.max) / 2),
                      }}
                    />
                  </div>

                  {/* MELTDOWN WARNING OVERLAY */}
                  {isCritical && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Pulsing red overlay */}
                      <div className="absolute inset-0 bg-destructive opacity-20 animate-pulse" />

                      {/* Warning text */}
                      <div className="relative z-10 text-center space-y-4 select-none">
                        <div className="text-6xl animate-pulse">☢️</div>
                        <div className="text-4xl font-bold text-destructive drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
                          REACTOR CRITICAL
                        </div>
                        <div className="text-xl text-destructive-foreground bg-destructive/90 px-4 py-2 rounded font-mono">
                          CORE TEMPERATURE EXCEEDING LIMITS
                        </div>
                        <div className="text-sm text-muted-foreground italic">
                          "3.6 roentgen... not great, not terrible"
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Controls */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant={isRunning ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleScram}>
                    SCRAM
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleWithdrawAll}>
                    Withdraw All
                  </Button>
                </div>
              </div>

              {/* Right side: Control Panel (always visible) */}
              <div className="w-full lg:w-96 p-4 bg-accent/5 flex flex-col">
                <div className="space-y-4 flex flex-col flex-1">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reactor Control Panel</h3>
                    <p className="text-xs text-muted-foreground">
                      Adjust control rod positions and simulation parameters
                    </p>
                  </div>

                  {/* Multi-tab interface: Controls vs Physics Config */}
                  <Tabs defaultValue="controls" className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="controls">Controls</TabsTrigger>
                      <TabsTrigger value="physics">Physics Config</TabsTrigger>
                    </TabsList>

                    {/* Controls Tab */}
                    <TabsContent value="controls" className="flex-1 space-y-4 overflow-y-auto">
                      {/* Preset Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm">Scenario Preset</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={selectedPreset === "normal" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePresetChange("normal")}
                          >
                            Normal
                          </Button>
                          <Button
                            variant={selectedPreset === "lowPowerTest" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePresetChange("lowPowerTest")}
                          >
                            Low Power
                          </Button>
                          <Button
                            variant={selectedPreset === "highReactivity" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePresetChange("highReactivity")}
                          >
                            High
                          </Button>
                          <Button
                            variant={selectedPreset === "scrammed" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePresetChange("scrammed")}
                          >
                            Scrammed
                          </Button>
                          <Button
                            variant={selectedPreset === "iodinePit" ? "destructive" : "outline"}
                            size="sm"
                            className="col-span-2"
                            onClick={() => handlePresetChange("iodinePit")}
                          >
                            Iodine Pit
                          </Button>
                        </div>
                      </div>

                      {/* Simulation Speed */}
                      <div className="space-y-2">
                        <Label className="text-sm">Simulation Speed: {speed.toFixed(1)}x</Label>
                        <Slider
                          value={[speed]}
                          min={0.1}
                          max={3.0}
                          step={0.1}
                          onValueChange={vals => setSpeed(vals[0] ?? 0.5)}
                        />
                      </div>

                      {/* Recirc Pumps */}
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Recirc Pumps: {(pumpPower * 100).toFixed(0)}%
                        </Label>
                        <Slider
                          value={[pumpPower]}
                          disabled={autopilotOn}
                          min={0}
                          max={1.5}
                          step={0.05}
                          onValueChange={vals => setPumpPower(vals[0] ?? 1.0)}
                        />
                      </div>

                      {/* Operator Mode */}
                      <div className="space-y-2 p-3 border rounded bg-muted/30">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Operator Mode</Label>
                          <Button
                            variant={operatorMode ? "default" : "outline"}
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => setOperatorMode(v => !v)}
                          >
                            {operatorMode ? "ON" : "OFF"}
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(Object.keys(OPERATOR_BANDS) as OperatorBandKey[]).map(key => (
                            <Button
                              key={key}
                              variant={operatorBand === key ? "default" : "outline"}
                              size="sm"
                              className="text-[10px]"
                              onClick={() => setOperatorBand(key)}
                            >
                              {OPERATOR_BANDS[key].label}
                            </Button>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Target: {activeBand.min}–{activeBand.max} MW
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-border/50">
                          <Label className="text-xs font-semibold">Autopilot</Label>
                          <Button
                            variant={autopilotOn ? "default" : "outline"}
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => setAutopilotOn(v => !v)}
                          >
                            {autopilotOn ? "ENGAGED" : "ENGAGE"}
                          </Button>
                        </div>
                        {autopilotOn && (
                          <p className="text-[10px] text-primary font-mono">
                            AUTO holding {Math.round((activeBand.min + activeBand.max) / 2)} MW —
                            rod/pump controls locked (SCRAM overrides)
                          </p>
                        )}
                        {operatorMode && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">% time in band (60s)</span>
                              <span className="font-mono font-semibold">
                                {percentInBand.toFixed(0)}%
                              </span>
                            </div>
                            <div
                              className={`text-center text-xs font-mono font-bold rounded py-1 ${
                                inBandNow
                                  ? "bg-green-500/15 text-green-500"
                                  : "bg-red-500/15 text-red-500"
                              }`}
                            >
                              {inBandNow ? "IN BAND" : "OUT OF BAND"}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <Label className="text-sm">Quick Actions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setControlRodInsertions(Array(10).fill(0.0));
                              setMasterControlValue(0.0);
                              setIsMasterControlEngaged(true);
                            }}
                          >
                            Raise All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setControlRodInsertions(Array(10).fill(0.5));
                              setMasterControlValue(0.5);
                              setIsMasterControlEngaged(true);
                            }}
                          >
                            50% All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setControlRodInsertions(Array(10).fill(1.0));
                              setMasterControlValue(1.0);
                              setIsMasterControlEngaged(true);
                            }}
                          >
                            Lower All
                          </Button>
                          <Button variant="destructive" size="sm" onClick={handleScram}>
                            SCRAM
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Space = pause · S = SCRAM · R = reset · Shift+click atom = pin inspector
                        </p>
                      </div>

                      {/* Event Log */}
                      <div className="space-y-2">
                        <Label className="text-sm">Event Log</Label>
                        <div className="border rounded bg-muted/30 divide-y divide-border/50">
                          {simulationState && simulationState.events.length > 0 ? (
                            [...simulationState.events]
                              .reverse()
                              .slice(0, 8)
                              .map((e: SimEvent, i) => (
                                <div
                                  key={`${e.time}-${i}`}
                                  className="flex items-start gap-2 px-2 py-1 text-[10px] font-mono"
                                >
                                  <span className="text-muted-foreground flex-shrink-0">
                                    T+{(e.time / 1000).toFixed(1)}s
                                  </span>
                                  <span
                                    className={
                                      e.severity === "danger"
                                        ? "text-destructive"
                                        : e.severity === "warning"
                                          ? "text-yellow-500"
                                          : e.source === "autopilot"
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    }
                                  >
                                    {e.message}
                                  </span>
                                </div>
                              ))
                          ) : (
                            <div className="px-2 py-2 text-[10px] font-mono text-muted-foreground">
                              No events logged.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Warning Notice */}
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-muted-foreground">
                        <p className="font-semibold mb-1">⚠️ Historical Note</p>
                        <p>
                          RBMK reactors had a critically slow control rod insertion time (18-21
                          seconds) which contributed to the Chernobyl disaster. This simulation
                          models that behavior.
                        </p>
                      </div>
                    </TabsContent>

                    {/* Physics Config Tab */}
                    <TabsContent value="physics" className="flex-1 space-y-4 overflow-y-auto">
                      {/* Physics Model Selection */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Physics Model</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={physicsConfig === "easy" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPhysicsConfig("easy");
                              setResetKey(prev => prev + 1);
                            }}
                            className="text-xs"
                          >
                            Easy
                          </Button>
                          <Button
                            variant={physicsConfig === "normal" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPhysicsConfig("normal");
                              setResetKey(prev => prev + 1);
                            }}
                            className="text-xs"
                          >
                            Normal
                          </Button>
                          <Button
                            variant={physicsConfig === "ultraRealistic" ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setPhysicsConfig("ultraRealistic");
                              setResetKey(prev => prev + 1);
                            }}
                            className="text-xs"
                          >
                            Ultra Real
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {physicsConfig === "easy" &&
                            "Stable physics, fast control rods, low void coefficient"}
                          {physicsConfig === "normal" &&
                            "Balanced physics with moderate instability"}
                          {physicsConfig === "ultraRealistic" &&
                            "True RBMK physics with spiral waves & positive void coefficient"}
                        </p>
                      </div>

                      <div className="p-3 bg-muted/50 border rounded space-y-2">
                        {/* Fuel Properties */}
                        <div>
                          <Label className="text-xs font-semibold">Fuel (U-235)</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Neutrons/Fission:</span>
                              <span className="font-mono">{config.atom.neutronsPerFission}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Base Emission Rate:</span>
                              <span className="font-mono">
                                {config.atom.baseEmissionRate.toFixed(1)}/s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Energy Gain:</span>
                              <span className="font-mono">{config.atom.energyGain.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Energy Decay:</span>
                              <span className="font-mono">
                                {(config.atom.energyDecay * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Emission Threshold:</span>
                              <span className="font-mono">
                                {config.atom.emissionThreshold.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Control Rod Properties */}
                        <div>
                          <Label className="text-xs font-semibold">Control Rods (B-10)</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Absorption Rate:</span>
                              <span className="font-mono">
                                {(config.controlRod.absorptionProbability * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Insertion Speed:</span>
                              <span className="font-mono">
                                {config.controlRod.insertionSpeed.toFixed(2)}/s
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Neutron Properties */}
                        <div>
                          <Label className="text-xs font-semibold">Neutrons</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Fission Probability:</span>
                              <span className="font-mono">
                                {(config.neutron.fissionProbability * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Base Speed:</span>
                              <span className="font-mono">
                                {config.neutron.baseSpeed.toFixed(1)} px/f
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Lifetime:</span>
                              <span className="font-mono">
                                {(config.neutron.maxAge / 1000).toFixed(1)}s
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Water Coolant Properties */}
                        <div>
                          <Label className="text-xs font-semibold">
                            Water Coolant (RBMK Critical Flaw)
                          </Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Boiling Point:</span>
                              <span className="font-mono">
                                {(config.water.boilingPoint * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-destructive font-semibold">
                                Void Coefficient:
                              </span>
                              <span className="font-mono text-destructive">
                                +{config.water.voidCoefficient.toFixed(1)}β
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Evaporation Rate:</span>
                              <span className="font-mono">
                                {(config.water.evaporationRate * 100).toFixed(1)}%/f
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Absorption Probability:</span>
                              <span className="font-mono">
                                {(config.water.absorptionProbability * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Base Cooling Rate:</span>
                              <span className="font-mono">
                                {(config.water.baseCoolingRate * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pressure System */}
                        <div>
                          <Label className="text-xs font-semibold">Pressure</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Base Pressure:</span>
                              <span className="font-mono">
                                {(config.pressure.basePressure * 100).toFixed(0)} bar
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Operating Pressure:</span>
                              <span className="font-mono">
                                {(config.pressure.normalOperatingPressure * 100).toFixed(0)} bar
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-destructive">Critical Pressure:</span>
                              <span className="font-mono text-destructive">
                                {(config.pressure.criticalPressure * 100).toFixed(0)} bar
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Temp Coefficient:</span>
                              <span className="font-mono">
                                {config.pressure.temperatureCoefficient.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Damage Parameters */}
                        <div>
                          <Label className="text-xs font-semibold">Damage & Safety</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Fuel Meltdown Temp:</span>
                              <span className="font-mono text-destructive">
                                {(config.damage.fuel.meltdownTemp * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Meltdown Rate:</span>
                              <span className="font-mono">
                                {(config.damage.fuel.meltdownRate * 100).toFixed(2)}%/f
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rod Heat Damage:</span>
                              <span className="font-mono">
                                {(config.damage.rod.heatDamageRate * 10000).toFixed(2)}e-4/f
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rod Damage Threshold:</span>
                              <span className="font-mono">
                                {(config.damage.rod.heatDamageThreshold * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Xenon-135 Poisoning */}
                        <div>
                          <Label className="text-xs font-semibold">Xenon-135 Poisoning</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Buildup Rate:</span>
                              <span className="font-mono">
                                {(config.xenon.buildupRate * 100).toFixed(2)}%/fission
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Decay Rate:</span>
                              <span className="font-mono">
                                {(config.xenon.decayRate * 10000).toFixed(2)}e-4/f
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Burnout Rate:</span>
                              <span className="font-mono">
                                {(config.xenon.burnoutRate * 10000).toFixed(2)}e-4/n
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max Poisoning:</span>
                              <span className="font-mono">
                                {(config.xenon.maxPoisoning * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Physics Constants */}
                        <div>
                          <Label className="text-xs font-semibold">Physics Constants</Label>
                          <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                            <div className="flex justify-between">
                              <span>Collision Threshold:</span>
                              <span className="font-mono">
                                {config.physics.collisionThreshold}px
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Boundary Damping:</span>
                              <span className="font-mono">
                                {(config.physics.boundaryDamping * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 text-xs text-muted-foreground italic border-t">
                          Based on real RBMK-1000 reactor physics (U-235 fission: 580 barns, B-10
                          absorption: 3,840 barns). Positive void coefficient was the critical
                          design flaw that enabled the Chernobyl disaster.
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
