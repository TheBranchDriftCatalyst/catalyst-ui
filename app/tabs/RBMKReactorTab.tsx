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

import React, { useState, useCallback, useRef } from "react";
import { RBMKReactor } from "@/catalyst-ui/components/RBMKReactor";
import { SimulationState, REACTOR_PRESETS } from "@/catalyst-ui/components/RBMKReactor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { Label } from "@/catalyst-ui/ui/label";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Badge } from "@/catalyst-ui/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/catalyst-ui/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { CircularGauge } from "@/catalyst-ui/ui/circular-gauge";
import { Play, Pause, RotateCcw, Settings2, ChevronDown, X } from "lucide-react";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

export const TAB_ORDER = 100;
export const TAB_SECTION = "projects.misc";

export function RBMKReactorTab() {
  const [isRunning, setIsRunning] = useState(false); // Start paused to prevent immediate criticality
  const [speed, setSpeed] = useState(0.5); // Start at half speed to observe void coefficient effects
  const [controlRodInsertions, setControlRodInsertions] = useState<number[]>(
    Array(10).fill(0.5) // 10 rods, all at 50% insertion
  );
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<
    "normal" | "lowPowerTest" | "highReactivity" | "scrammed"
  >("normal");
  const [resetKey, setResetKey] = useState(0); // Key to force component remount
  const [isPhysicsOpen, setIsPhysicsOpen] = useState(false); // Physics configuration panel
  const [masterControlValue, setMasterControlValue] = useState(0.5); // Master control slider value
  const [isMasterControlEngaged, setIsMasterControlEngaged] = useState(true); // Whether master control is active

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

    // Calculate current values
    const fuelIntegrity =
      (state.atoms.reduce((sum, atom) => sum + atom.integrity, 0) / state.atoms.length) * 100;
    const rodHealths = state.controlRods.map(rod => (rod.health || 1.0) * 100);

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
          (health, idx) => health - (previousValuesRef.current?.rodHealths[idx] || 100)
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

  const handleReset = () => {
    setControlRodInsertions(Array(10).fill(0.5));
    setMasterControlValue(0.5);
    setIsMasterControlEngaged(true);
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 100);
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
    // Emergency shutdown - insert all rods (without remounting)
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

  const handlePresetChange = (
    preset: "normal" | "lowPowerTest" | "highReactivity" | "scrammed"
  ) => {
    setSelectedPreset(preset);
    setResetKey(prev => prev + 1); // Force remount to apply new config
    // Reset control rods based on preset
    if (preset === "scrammed") {
      setControlRodInsertions(Array(10).fill(1.0));
      setMasterControlValue(1.0);
    } else {
      setControlRodInsertions(Array(10).fill(0.5));
      setMasterControlValue(0.5);
    }
    setIsMasterControlEngaged(true);
  };

  const config = REACTOR_PRESETS[selectedPreset];

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
                    {/* Reactor State + Coolant/Pressure Combined Row */}
                    <div className="p-3 bg-accent/10 border border-primary/20 rounded">
                      <h4 className="text-xs font-semibold mb-3 text-muted-foreground">
                        Reactor Metrics
                      </h4>
                      <div className="flex justify-between items-center gap-4">
                        {/* Gauges */}
                        <div className="flex justify-around items-start gap-3 flex-1">
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={simulationState.neutrons.length}
                              max={1000}
                              label="Neutrons"
                              variant="info"
                              size={60}
                            />
                            <DeltaIndicator value={deltas.neutrons} decimals={0} />
                          </div>
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={simulationState.reactionRate}
                              max={5000}
                              label="Rate/s"
                              variant={simulationState.reactionRate > 3000 ? "danger" : "default"}
                              size={60}
                            />
                            <DeltaIndicator value={deltas.reactionRate} decimals={0} />
                          </div>
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={(simulationState.reactorTemp || 0) * 100}
                              label="Temp"
                              variant={
                                (simulationState.reactorTemp || 0) > 0.8
                                  ? "danger"
                                  : (simulationState.reactorTemp || 0) > 0.6
                                    ? "warning"
                                    : "default"
                              }
                              size={60}
                            />
                            <DeltaIndicator value={deltas.reactorTemp} decimals={1} />
                          </div>
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={(simulationState.voidFraction || 0) * 100}
                              label="Void %"
                              variant={
                                (simulationState.voidFraction || 0) > 0.5 ? "warning" : "success"
                              }
                              size={60}
                            />
                            <DeltaIndicator value={deltas.voidFraction} decimals={1} />
                          </div>
                          <div className="relative flex flex-col items-center">
                            <CircularGauge
                              value={(simulationState.reactorPressure || 0) * 100}
                              label="Pressure"
                              variant={
                                (simulationState.reactorPressure || 0) >= 0.9
                                  ? "danger"
                                  : (simulationState.reactorPressure || 0) >= 0.7
                                    ? "warning"
                                    : "success"
                              }
                              size={60}
                            />
                            <DeltaIndicator value={deltas.reactorPressure} decimals={1} />
                          </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="flex-shrink-0 pl-4 border-l">
                          {(() => {
                            const total =
                              simulationState.totalFissions + simulationState.totalAbsorbed;
                            const fissionPercent =
                              total > 0 ? (simulationState.totalFissions / total) * 100 : 50;

                            // SVG pie chart
                            const size = 70;
                            const radius = 26;
                            const center = size / 2;

                            const fissionAngle = (fissionPercent / 100) * 360;
                            const fissionRadians = (fissionAngle * Math.PI) / 180;
                            const fissionX = center + radius * Math.sin(fissionRadians);
                            const fissionY = center - radius * Math.cos(fissionRadians);
                            const fissionLargeArc = fissionAngle > 180 ? 1 : 0;

                            return (
                              <div className="flex flex-col items-center gap-1">
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
                                    fontSize="11"
                                    fontWeight="bold"
                                  >
                                    {total}
                                  </text>
                                </svg>
                                <span className="text-[10px] text-muted-foreground">Events</span>
                              </div>
                            );
                          })()}
                        </div>
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
                              value={
                                (simulationState.atoms.reduce(
                                  (sum, atom) => sum + atom.integrity,
                                  0
                                ) /
                                  simulationState.atoms.length) *
                                  100 || 100
                              }
                              label="Fuel"
                              variant={
                                (simulationState.atoms.reduce(
                                  (sum, atom) => sum + atom.integrity,
                                  0
                                ) / simulationState.atoms.length || 1.0) < 0.7
                                  ? "danger"
                                  : (simulationState.atoms.reduce(
                                        (sum, atom) => sum + atom.integrity,
                                        0
                                      ) / simulationState.atoms.length || 1.0) < 0.9
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
                                value={(rod.health || 1.0) * 100}
                                label={`R${idx + 1}`}
                                variant={
                                  (rod.health || 1.0) < 0.5
                                    ? "danger"
                                    : (rod.health || 1.0) < 0.8
                                      ? "warning"
                                      : "success"
                                }
                                size={48}
                              />
                              <DeltaIndicator value={deltas.rodHealths[idx] || 0} decimals={2} />
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
                                className="h-24"
                              />
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {((controlRodInsertions[idx] ?? 0.5) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}

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
                        <Label className="text-sm">Reactor Preset</Label>
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
                          onValueChange={vals => setSpeed(vals[0] ?? 1.0)}
                        />
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
                              <span>Energy Gain:</span>
                              <span className="font-mono">{config.atom.energyGain.toFixed(2)}</span>
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

                        {/* Physics Constants */}
                        <div>
                          <Label className="text-xs font-semibold">Physics</Label>
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
                          absorption: 3,840 barns)
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
