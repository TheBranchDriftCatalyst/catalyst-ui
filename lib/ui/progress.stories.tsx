import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";
import { useState, useEffect } from "react";
import { Button } from "./button";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
    className: "w-[400px]",
  },
};

export const Zero: Story = {
  args: {
    value: 0,
    className: "w-[400px]",
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    className: "w-[400px]",
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-2 w-[400px]">
        <div className="flex justify-between text-sm">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [progress, setProgress] = useState(33);

    return (
      <div className="space-y-4 w-[400px]">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setProgress(Math.max(0, progress - 10))}
          >
            -10
          </Button>
          <Button
            size="sm"
            onClick={() => setProgress(Math.min(100, progress + 10))}
          >
            +10
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setProgress(0)}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 1: Account Setup</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 2: Profile Information</span>
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 3: Preferences</span>
          <span>25%</span>
        </div>
        <Progress value={25} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step 4: Confirmation</span>
          <span>0%</span>
        </div>
        <Progress value={0} />
      </div>
    </div>
  ),
};
