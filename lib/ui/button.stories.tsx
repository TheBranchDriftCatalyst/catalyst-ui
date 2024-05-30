import { fn, userEvent, within } from "@storybook/test";
import { Button } from "./button";

export default {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "destructive", "outline", "secondary", "link"],
      control: { type: "radio" },
      defaultValue: "default",
    },
    size: {
      options: ["default", "xxxs", "xxs", "xs", "sm", "lg", "icon"],
      control: { type: "radio" },
      defaultValue: "default",
    },
    onClick: { action: "clicked" },
  },
  args: {
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
  },
};

export const Default = {
  args: {
    children: "Button",
  },
};

export const Destructive = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link = {
  args: {
    variant: "link",
    children: "Link",
  },
};

// You can also add stories for different sizes if needed
export const SmallSize = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const LargeSize = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const IconSize = {
  args: {
    size: "icon",
    children: "Icon Button",
  },
};
