import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { useState } from "react";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Toggle",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Toggle",
  },
};

export const WithText: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle>Bold</Toggle>
      <Toggle>Italic</Toggle>
      <Toggle>Underline</Toggle>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <span className="font-bold">B</span>
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <span className="italic">I</span>
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <span className="underline">U</span>
      </Toggle>
      <Toggle aria-label="Toggle strikethrough">
        <span className="line-through">S</span>
      </Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="default">Default</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Interactive: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);

    return (
      <div className="space-y-4">
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          {pressed ? "Pressed" : "Not Pressed"}
        </Toggle>
        <p className="text-sm text-muted-foreground">State: {pressed ? "Active ✓" : "Inactive"}</p>
      </div>
    );
  },
};

export const TextFormatting: Story = {
  render: () => {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    const textStyle = {
      fontWeight: bold ? "bold" : "normal",
      fontStyle: italic ? "italic" : "normal",
      textDecoration: underline ? "underline" : "none",
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
            <span className="font-bold">B</span>
          </Toggle>
          <Toggle pressed={italic} onPressedChange={setItalic} aria-label="Toggle italic">
            <span className="italic">I</span>
          </Toggle>
          <Toggle pressed={underline} onPressedChange={setUnderline} aria-label="Toggle underline">
            <span className="underline">U</span>
          </Toggle>
        </div>
        <p className="text-sm" style={textStyle}>
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    );
  },
};

export const ToggleGroup: Story = {
  render: () => {
    const [alignment, setAlignment] = useState("left");

    return (
      <div className="space-y-4">
        <div className="flex gap-1">
          <Toggle
            pressed={alignment === "left"}
            onPressedChange={() => setAlignment("left")}
            aria-label="Align left"
          >
            ⬅
          </Toggle>
          <Toggle
            pressed={alignment === "center"}
            onPressedChange={() => setAlignment("center")}
            aria-label="Align center"
          >
            ↔
          </Toggle>
          <Toggle
            pressed={alignment === "right"}
            onPressedChange={() => setAlignment("right")}
            aria-label="Align right"
          >
            ➡
          </Toggle>
        </div>
        <p className="text-sm text-muted-foreground">Alignment: {alignment}</p>
      </div>
    );
  },
};
