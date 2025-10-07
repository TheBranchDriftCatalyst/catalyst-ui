import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";
import { Label } from "./label";
import { useState } from "react";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-[400px]",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-4">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={[33]} max={100} step={1} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState([50]);

    return (
      <div className="grid w-full max-w-sm items-center gap-4">
        <div className="flex justify-between">
          <Label>Value: {value[0]}</Label>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState([25, 75]);

    return (
      <div className="grid w-full max-w-sm items-center gap-4">
        <div className="flex justify-between">
          <Label>
            Range: {value[0]} - {value[1]}
          </Label>
        </div>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
      </div>
    );
  },
};

export const Steps: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid w-full max-w-sm items-center gap-4">
        <Label>Step: 10</Label>
        <Slider defaultValue={[50]} max={100} step={10} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-4">
        <Label>Step: 25</Label>
        <Slider defaultValue={[50]} max={100} step={25} />
      </div>
    </div>
  ),
};

export const PriceRange: Story = {
  render: () => {
    const [value, setValue] = useState([100, 500]);
    const min = 0;
    const max = 1000;

    return (
      <div className="grid w-full max-w-sm items-center gap-4">
        <div className="flex justify-between">
          <Label>Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${value[0]} - ${value[1]}
          </span>
        </div>
        <Slider value={value} onValueChange={setValue} min={min} max={max} step={10} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${min}</span>
          <span>${max}</span>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    className: "w-[400px]",
  },
};
