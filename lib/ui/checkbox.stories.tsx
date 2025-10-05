import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { useState } from "react";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox />,
};

export const Checked: Story = {
  render: () => <Checkbox checked />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Checkbox disabled />
      <Checkbox disabled checked />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
            Marketing emails
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive emails about new products, features, and more.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="interactive"
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <Label htmlFor="interactive">
            Click to toggle
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Current state: {checked ? "Checked ✓" : "Unchecked"}
        </p>
      </div>
    );
  },
};

export const MultipleOptions: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" defaultChecked />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled />
        <Label htmlFor="option4" className="text-muted-foreground">Option 4 (Disabled)</Label>
      </div>
    </div>
  ),
};
