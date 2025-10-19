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

import React, { useState, useCallback } from "react";
import { RBMKReactor } from "@/catalyst-ui/components/RBMKReactor";
import { SimulationState, REACTOR_PRESETS } from "@/catalyst-ui/components/RBMKReactor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { Label } from "@/catalyst-ui/ui/label";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Badge } from "@/catalyst-ui/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/catalyst-ui/ui/collapsible";
import { Play, Pause, RotateCcw, Settings2, ChevronDown } from "lucide-react";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

export const TAB_ORDER = 100;
export const TAB_SECTION = "projects.misc";

export function RBMKReactorTab() {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1.0);
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

  // Detect catastrophic state (MELTDOWN)
  const isCritical =
    simulationState &&
    (simulationState.reactorTemp > 0.8 || // Temperature critical
      simulationState.neutrons.length > 800); // Neutron count critical (80% of max)

  const handleStateChange = useCallback((state: SimulationState) => {
    setSimulationState(state);
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

  return (
    <div className="space-y-6 mt-0 relative">
      {/* Overview Card */}
      <ScrollSnapItem align="start">
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
      </ScrollSnapItem>

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
              <div className="flex-1 p-4 border-r">
                {/* Statistics Bar with Bullet Graphs */}
                {simulationState && (
                  <div className="space-y-3 mb-4 p-3 bg-accent/10 border border-primary/20 rounded">
                    {/* Active Neutrons - Bullet Graph */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Active Neutrons</Label>
                        <span className="text-sm font-bold">{simulationState.neutrons.length}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${Math.min((simulationState.neutrons.length / 1000) * 100, 100)}%`,
                            backgroundColor: "#60a5fa", // blue-400 for neutrons
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                        <span>0</span>
                        <span>1000</span>
                      </div>
                    </div>

                    {/* Reaction Rate - Bullet Graph */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Reaction Rate</Label>
                        <span className="text-sm font-bold">
                          {simulationState.reactionRate.toFixed(0)}/s
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${Math.min((simulationState.reactionRate / 5000) * 100, 100)}%`,
                            backgroundColor: "#ef4444", // red-500 for reaction rate/danger
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                        <span>0</span>
                        <span>5000/s</span>
                      </div>
                    </div>

                    {/* Reactor Temperature - Bullet Graph */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">Reactor Temp</Label>
                        <span className="text-sm font-bold">
                          {((simulationState.reactorTemp || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${Math.min((simulationState.reactorTemp || 0) * 100, 100)}%`,
                            backgroundColor: "#f97316", // orange-500 for heat
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                        <span>Cold</span>
                        <span>Hot</span>
                      </div>
                    </div>

                    {/* Total Stats Grid with Pie Chart */}
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between gap-4">
                        {/* Pie Chart */}
                        <div className="flex-shrink-0">
                          {(() => {
                            const total =
                              simulationState.totalFissions + simulationState.totalAbsorbed;
                            const fissionPercent =
                              total > 0 ? (simulationState.totalFissions / total) * 100 : 50;
                            const absorbedPercent =
                              total > 0 ? (simulationState.totalAbsorbed / total) * 100 : 50;

                            // SVG pie chart using two arcs
                            const size = 80;
                            const radius = 30;
                            const center = size / 2;

                            // Calculate arc path for fissions (starts at top, goes clockwise)
                            const fissionAngle = (fissionPercent / 100) * 360;
                            const fissionRadians = (fissionAngle * Math.PI) / 180;
                            const fissionX = center + radius * Math.sin(fissionRadians);
                            const fissionY = center - radius * Math.cos(fissionRadians);
                            const fissionLargeArc = fissionAngle > 180 ? 1 : 0;

                            return (
                              <svg width={size} height={size} className="drop-shadow-sm">
                                {/* Fissions slice (vibrant amber) */}
                                <path
                                  d={`M ${center},${center} L ${center},${center - radius} A ${radius},${radius} 0 ${fissionLargeArc},1 ${fissionX},${fissionY} Z`}
                                  fill="#fbbf24"
                                  stroke="#18181b"
                                  strokeWidth="2"
                                />
                                {/* Absorbed slice (vibrant blue) */}
                                <path
                                  d={`M ${center},${center} L ${fissionX},${fissionY} A ${radius},${radius} 0 ${1 - fissionLargeArc},1 ${center},${center - radius} Z`}
                                  fill="#60a5fa"
                                  stroke="#18181b"
                                  strokeWidth="2"
                                />
                                {/* Center circle for donut effect */}
                                <circle cx={center} cy={center} r={radius * 0.5} fill="#18181b" />
                                {/* Center text */}
                                <text
                                  x={center}
                                  y={center}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="#fafafa"
                                  fontSize="12"
                                  fontWeight="bold"
                                >
                                  {total}
                                </text>
                              </svg>
                            );
                          })()}
                        </div>

                        {/* Stats */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-accent"></div>
                              <Label className="text-xs text-muted-foreground">Fissions</Label>
                            </div>
                            <span className="text-sm font-bold">
                              {simulationState.totalFissions}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-muted"></div>
                              <Label className="text-xs text-muted-foreground">Absorbed</Label>
                            </div>
                            <span className="text-sm font-bold">
                              {simulationState.totalAbsorbed}
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
              <div className="w-full lg:w-96 p-4 bg-accent/5 overflow-y-auto max-h-[700px]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reactor Control Panel</h3>
                    <p className="text-xs text-muted-foreground">
                      Adjust control rod positions and simulation parameters
                    </p>
                  </div>

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

                  {/* Master Control Rod */}
                  <div className="space-y-2 p-3 border rounded bg-accent/10">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Master Control</Label>
                      <Badge
                        variant={isMasterControlEngaged ? "default" : "outline"}
                        className="text-xs"
                      >
                        {isMasterControlEngaged ? "Engaged" : "Disengaged"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {(masterControlValue * 100).toFixed(0)}%
                      </span>
                      <Slider
                        value={[masterControlValue]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleMasterControlChange}
                        disabled={!isMasterControlEngaged}
                        className={isMasterControlEngaged ? "" : "opacity-50"}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Controls all rods simultaneously • Disengages when individual rods are moved
                    </p>
                  </div>

                  {/* Control Rods */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Individual Control Rods (10)</Label>
                      <Badge variant="outline" className="text-xs">
                        0% = Raised • 100% = Lowered
                      </Badge>
                    </div>

                    {controlRodInsertions.map((insertion, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Rod {index + 1}</Label>
                          <span className="text-xs text-muted-foreground font-mono">
                            {(insertion * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Slider
                          value={[insertion]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={vals => handleRodChange(index, vals)}
                        />
                      </div>
                    ))}
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

                  {/* Physics Configuration Panel */}
                  <Collapsible open={isPhysicsOpen} onOpenChange={setIsPhysicsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4" />
                          Physics Configuration
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isPhysicsOpen ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-3">
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
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Warning Notice */}
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">⚠️ Historical Note</p>
                    <p>
                      RBMK reactors had a critically slow control rod insertion time (18-21 seconds)
                      which contributed to the Chernobyl disaster. This simulation models that
                      behavior.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
