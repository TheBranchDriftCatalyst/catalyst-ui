/**
 * ThreeDModelsTab - 3D Model Showcase
 *
 * Interactive gallery showcasing all available 3D models with controls
 * for testing and demonstration purposes.
 */

import React from "react";
import { ModelShowcase } from "@/catalyst-ui/components/ThreeJS";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

// Tab metadata
export const TAB_ORDER = 11;
export const TAB_SECTION = "catalyst";
export const TAB_LABEL = "3D Models";

export function ThreeDModelsTab() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          3D Models
        </h1>
        <p className="text-muted-foreground">
          Interactive 3D visualizations built with React Three Fiber. Click the buttons to switch
          between models, drag to rotate, and scroll to zoom.
        </p>
      </div>

      {/* Model Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Model Gallery</CardTitle>
          <CardDescription>
            Switch between different 3D models and interact with them using your mouse or touch
            gestures
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Full-height canvas container */}
          <div className="w-full h-[600px] md:h-[700px] relative rounded-b-lg overflow-hidden bg-gradient-to-b from-background to-background/50">
            <ModelShowcase defaultModel="desktop" showStars={true} />
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Drag to rotate camera</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Auto-rotation available</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Library</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Desktop PC - Tech setup</li>
              <li>• Planet Earth - Space scene</li>
              <li>• More models coming soon</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rendering Tech</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• React Three Fiber</li>
              <li>• GLTF model format</li>
              <li>• Real-time lighting</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Implementation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            These 3D models are rendered using React Three Fiber, a React renderer for Three.js.
            Each model includes custom lighting setups, orbit controls, and responsive scaling.
          </p>
          <p>
            Import models from{" "}
            <code className="text-primary">@/catalyst-ui/components/ThreeJS</code> to use them in
            your own projects.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
