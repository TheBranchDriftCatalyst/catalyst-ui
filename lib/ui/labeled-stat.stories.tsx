import type { Meta, StoryObj } from "@storybook/react";
import { LabeledStat } from "./labeled-stat";

const meta = {
  title: "UI/LabeledStat",
  component: LabeledStat,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    align: { control: "radio", options: ["left", "right"] },
    variant: { control: "radio", options: ["mono", "text"] },
  },
} satisfies Meta<typeof LabeledStat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Rows imported", value: "12,441" },
};

export const RightAligned: Story = {
  args: { label: "Elapsed", value: "3h 17m", align: "right" },
};

export const TextVariant: Story = {
  args: { label: "Provider", value: "wakatime.com", variant: "text" },
};

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-md grid-cols-2 gap-4">
      <LabeledStat label="gap_seconds" value="3h 17m" />
      <LabeledStat label="Rows" value="12,441" align="right" />
      <LabeledStat label="Refreshed" value="2 min ago" variant="text" />
      <LabeledStat label="Table size" value="512 MB" align="right" />
    </div>
  ),
};
