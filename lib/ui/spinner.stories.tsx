import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";
import { Button } from "./button";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "default", "lg"] },
    fill: { control: "boolean" },
  },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };

export const InlineWithButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="mr-2 text-current" />
      Saving…
    </Button>
  ),
};

export const CenteredInBlock: Story = {
  render: () => (
    <div className="h-64 w-96 rounded-md border">
      <Spinner fill />
    </div>
  ),
};
