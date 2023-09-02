// Button.stories.tsx

import React from "react";
import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      control: { type: "radio" },
      defaultValue: "default",
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      control: { type: "radio" },
      defaultValue: "default",
    },
    onClick: { action: "clicked" },
  },
};

export const Default = {
  args: {
    children: 'Button',
  },
};

export const Destructive = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

// You can also add stories for different sizes if needed
export const SmallSize = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const LargeSize = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const IconSize = {
  args: {
    size: 'icon',
    children: 'Icon Button',
  }
};