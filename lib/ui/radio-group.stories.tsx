import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { useState } from "react";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <div className="grid gap-1.5">
          <Label htmlFor="r1">Default</Label>
          <p className="text-sm text-muted-foreground">The default spacing and sizing.</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <div className="grid gap-1.5">
          <Label htmlFor="r2">Comfortable</Label>
          <p className="text-sm text-muted-foreground">
            More relaxed spacing for better readability.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <div className="grid gap-1.5">
          <Label htmlFor="r3">Compact</Label>
          <p className="text-sm text-muted-foreground">Tighter spacing to fit more content.</p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-1" />
        <Label htmlFor="disabled-1">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-2" disabled />
        <Label htmlFor="disabled-2" className="text-muted-foreground">
          Option Two (Disabled)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="disabled-3" />
        <Label htmlFor="disabled-3">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("comfortable");

    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="int-1" />
            <Label htmlFor="int-1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="int-2" />
            <Label htmlFor="int-2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="int-3" />
            <Label htmlFor="int-3">Compact</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium">{value}</span>
        </p>
      </div>
    );
  },
};

export const PaymentMethod: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div>
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred payment method.</p>
      </div>
      <RadioGroup defaultValue="card">
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="card" id="card" />
          <div className="grid gap-1.5">
            <Label htmlFor="card" className="font-medium">
              Credit Card
            </Label>
            <p className="text-sm text-muted-foreground">Pay with your credit or debit card</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="paypal" id="paypal" />
          <div className="grid gap-1.5">
            <Label htmlFor="paypal" className="font-medium">
              PayPal
            </Label>
            <p className="text-sm text-muted-foreground">Pay using your PayPal account</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <RadioGroupItem value="apple" id="apple" />
          <div className="grid gap-1.5">
            <Label htmlFor="apple" className="font-medium">
              Apple Pay
            </Label>
            <p className="text-sm text-muted-foreground">Fast and secure with Apple Pay</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};
