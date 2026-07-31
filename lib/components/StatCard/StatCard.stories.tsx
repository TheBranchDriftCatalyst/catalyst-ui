import type { Meta, StoryObj } from "@storybook/react";
import { Clock, Crown, Code, Calculator } from "lucide-react";
import { StatCard } from "./StatCard";

const meta = {
  title: "Components/StatCard",
  component: StatCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    accent: {
      control: "radio",
      options: ["primary", "info", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Total tracked time",
    value: "13h 42m",
    icon: <Clock className="h-6 w-6" />,
  },
};

export const WithSubtitle: Story = {
  args: {
    name: "Most active project",
    value: "boomtime",
    icon: <Crown className="h-6 w-6" />,
    accent: "success",
    subtitle: "+34% vs last week",
  },
};

export const NoIcon: Story = {
  args: {
    name: "Total projects",
    value: 17,
  },
};

export const AccentPalette: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        name="Primary"
        value="13h 42m"
        icon={<Clock className="h-6 w-6" />}
        accent="primary"
      />
      <StatCard name="Info" value="python" icon={<Code className="h-6 w-6" />} accent="info" />
      <StatCard
        name="Success"
        value="boomtime"
        icon={<Crown className="h-6 w-6" />}
        accent="success"
      />
      <StatCard
        name="Warning"
        value="4 flaky tests"
        icon={<Calculator className="h-6 w-6" />}
        accent="warning"
      />
    </div>
  ),
};

export const LongValueTruncates: Story = {
  args: {
    name: "Repository",
    value: "TheBranchDriftCatalyst/boomtime-with-a-very-long-tail",
    icon: <Code className="h-6 w-6" />,
  },
};
