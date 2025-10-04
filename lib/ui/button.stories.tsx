import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from "@storybook/test";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      options: ["default", "destructive", "outline", "secondary", "link"],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "xxxs", "xxs", "xs", "sm", "lg", "icon"],
      control: { type: "radio" },
    },
    onClick: { action: "clicked" },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const IconSize: Story = {
  args: {
    size: "icon",
    children: "Icon Button",
  },
};
