import type { Meta, StoryObj } from "@storybook/react";
import { StatBar } from "./StatBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

const meta = {
  title: "Components/StatBar",
  component: StatBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: "number" },
    },
    showValue: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof StatBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "React",
    value: 85,
    max: 100,
  },
};

export const HighSkill: Story = {
  args: {
    label: "TypeScript Mastery",
    value: 95,
    max: 100,
  },
};

export const MediumSkill: Story = {
  args: {
    label: "GraphQL",
    value: 60,
    max: 100,
  },
};

export const LowSkill: Story = {
  args: {
    label: "Rust",
    value: 25,
    max: 100,
  },
};

export const WithoutValue: Story = {
  args: {
    label: "Experience Level",
    value: 80,
    showValue: false,
  },
};

export const CustomMax: Story = {
  args: {
    label: "Projects Completed",
    value: 42,
    max: 50,
  },
};

export const SkillGrid: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
      <StatBar label="React Mastery" value={92} />
      <StatBar label="TypeScript Power" value={88} />
      <StatBar label="Node.js Strength" value={85} />
      <StatBar label="GraphQL Intelligence" value={78} />
      <StatBar label="DevOps Endurance" value={72} />
      <StatBar label="UI/UX Charisma" value={90} />
    </div>
  ),
};

export const RPGStyleCard: Story = {
  render: () => (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Core Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <StatBar label="Frontend Prowess" value={95} />
          <StatBar label="Backend Mastery" value={82} />
          <StatBar label="Database Knowledge" value={78} />
          <StatBar label="Cloud Architecture" value={70} />
          <StatBar label="Testing Discipline" value={88} />
          <StatBar label="Code Quality" value={92} />
        </div>
      </CardContent>
    </Card>
  ),
};

export const VariousValues: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <StatBar label="Beginner" value={15} />
      <StatBar label="Intermediate" value={50} />
      <StatBar label="Advanced" value={85} />
      <StatBar label="Expert" value={98} />
      <StatBar label="Legendary" value={100} />
    </div>
  ),
};
