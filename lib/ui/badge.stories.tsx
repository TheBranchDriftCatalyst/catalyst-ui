import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const SkillTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Badge variant="secondary">React</Badge>
      <Badge variant="secondary">TypeScript</Badge>
      <Badge variant="secondary">Node.js</Badge>
      <Badge variant="secondary">GraphQL</Badge>
      <Badge variant="secondary">Docker</Badge>
      <Badge variant="secondary">AWS</Badge>
      <Badge variant="secondary">PostgreSQL</Badge>
      <Badge variant="secondary">Redis</Badge>
      <Badge variant="secondary">TailwindCSS</Badge>
      <Badge variant="secondary">Storybook</Badge>
    </div>
  ),
};
