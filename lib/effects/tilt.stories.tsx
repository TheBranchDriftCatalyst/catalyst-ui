import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedTilt } from "./AnimatedTilt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { useState } from "react";
import { usePrefersReducedMotion } from "@/catalyst-ui/hooks/usePrefersReducedMotion";

const meta = {
  title: "Effects/Tilt",
  component: AnimatedTilt,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tiltMaxAngleX: {
      control: { type: "range", min: 0, max: 45, step: 1 },
      description: "Maximum tilt angle on X axis in degrees",
    },
    tiltMaxAngleY: {
      control: { type: "range", min: 0, max: 45, step: 1 },
      description: "Maximum tilt angle on Y axis in degrees",
    },
    scale: {
      control: { type: "range", min: 1, max: 1.5, step: 0.01 },
      description: "Scale factor when hovering",
    },
    perspective: {
      control: { type: "range", min: 300, max: 3000, step: 100 },
      description: "Transform perspective value",
    },
    transitionSpeed: {
      control: { type: "range", min: 100, max: 3000, step: 100 },
      description: "Transition speed in milliseconds",
    },
  },
} satisfies Meta<typeof Tilt>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoCard = ({ children }: { children?: React.ReactNode }) => (
  <Card className="w-[300px]">
    <CardHeader>
      <CardTitle>Tilt Effect Card</CardTitle>
      <CardDescription>Hover over me to see the 3D tilt effect</CardDescription>
    </CardHeader>
    <CardContent>
      {children || (
        <p className="text-sm text-muted-foreground">
          Move your mouse around to see the tilt effect in action. The card responds to your cursor
          position.
        </p>
      )}
    </CardContent>
  </Card>
);

export const Default: Story = {
  args: {
    tiltMaxAngleX: 20,
    tiltMaxAngleY: 20,
    scale: 1.05,
    perspective: 1000,
    transitionSpeed: 400,
  },
  render: args => (
    <AnimatedTilt {...args}>
      <DemoCard />
    </AnimatedTilt>
  ),
};

export const Subtle: Story = {
  render: () => (
    <AnimatedTilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} perspective={1500}>
      <DemoCard>
        <p className="text-sm text-muted-foreground">
          Subtle tilt with minimal angles (5°) and gentle scale (1.02). Perfect for professional
          interfaces.
        </p>
      </DemoCard>
    </AnimatedTilt>
  ),
};

export const Extreme: Story = {
  render: () => (
    <AnimatedTilt tiltMaxAngleX={35} tiltMaxAngleY={35} scale={1.2} perspective={500}>
      <DemoCard>
        <p className="text-sm text-muted-foreground">
          Extreme tilt with high angles (35°) and dramatic scale (1.2). Very noticeable 3D effect.
        </p>
      </DemoCard>
    </AnimatedTilt>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [angleX, setAngleX] = useState(15);
    const [angleY, setAngleY] = useState(15);
    const [scale, setScale] = useState(1.05);
    const [perspective, setPerspective] = useState(1000);

    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <AnimatedTilt
            tiltMaxAngleX={angleX}
            tiltMaxAngleY={angleY}
            scale={scale}
            perspective={perspective}
          >
            <DemoCard>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">Current settings:</p>
                <p className="font-mono text-xs">angleX: {angleX}°</p>
                <p className="font-mono text-xs">angleY: {angleY}°</p>
                <p className="font-mono text-xs">scale: {scale}</p>
                <p className="font-mono text-xs">perspective: {perspective}</p>
              </div>
            </DemoCard>
          </AnimatedTilt>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="text-sm font-medium">Angle X: {angleX}°</label>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={angleX}
              onChange={e => setAngleX(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Angle Y: {angleY}°</label>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={angleY}
              onChange={e => setAngleY(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Scale: {scale}</label>
            <input
              type="range"
              min="1"
              max="1.5"
              step="0.01"
              value={scale}
              onChange={e => setScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Perspective: {perspective}</label>
            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={perspective}
              onChange={e => setPerspective(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Comparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold">Subtle</h3>
        <AnimatedTilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} perspective={1500}>
          <Card className="w-[240px]">
            <CardHeader>
              <CardTitle className="text-base">Subtle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">5° angles, 1.02 scale</p>
            </CardContent>
          </Card>
        </AnimatedTilt>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold">Default</h3>
        <AnimatedTilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.05} perspective={1000}>
          <Card className="w-[240px]">
            <CardHeader>
              <CardTitle className="text-base">Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">20° angles, 1.05 scale</p>
            </CardContent>
          </Card>
        </AnimatedTilt>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold">Extreme</h3>
        <AnimatedTilt tiltMaxAngleX={35} tiltMaxAngleY={35} scale={1.2} perspective={500}>
          <Card className="w-[240px]">
            <CardHeader>
              <CardTitle className="text-base">Extreme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">35° angles, 1.2 scale</p>
            </CardContent>
          </Card>
        </AnimatedTilt>
      </div>
    </div>
  ),
};

export const AccessibilitySupport: Story = {
  render: () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Accessibility Support</h3>
          <p className="text-sm text-muted-foreground">
            AnimatedTilt automatically respects the <code>prefers-reduced-motion</code> setting
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Current preference:{" "}
            <strong>{prefersReducedMotion ? "Reduced Motion" : "Full Motion"}</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-4">
            <h4 className="text-sm font-medium">With AnimatedTilt (Respects Preference)</h4>
            <AnimatedTilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.05} perspective={1000}>
              <Card className="w-[240px]">
                <CardHeader>
                  <CardTitle className="text-base">Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {prefersReducedMotion
                      ? "Tilt disabled (reduced motion)"
                      : "Tilt enabled (full motion)"}
                  </p>
                </CardContent>
              </Card>
            </AnimatedTilt>
          </div>

          <div className="text-center space-y-4">
            <h4 className="text-sm font-medium">Force Disabled</h4>
            <AnimatedTilt
              enabled={false}
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              scale={1.05}
              perspective={1000}
            >
              <Card className="w-[240px]">
                <CardHeader>
                  <CardTitle className="text-base">No Tilt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Tilt always disabled via <code>enabled=false</code>
                  </p>
                </CardContent>
              </Card>
            </AnimatedTilt>
          </div>
        </div>

        <div className="text-center mt-4 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 To test: Enable "Reduce Motion" in your OS accessibility settings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            macOS: System Settings → Accessibility → Display → Reduce Motion
          </p>
        </div>
      </div>
    );
  },
};
