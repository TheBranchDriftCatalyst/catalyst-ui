import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ThemeProvider } from ".";
import { Button } from "../../ui/button";

const meta = {
  title: "Contexts/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <div className="space-y-4">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
    </ThemeProvider>
  ),
};
