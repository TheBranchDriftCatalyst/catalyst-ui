import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const File: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div>
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Text input" />
      </div>
      <div>
        <Label htmlFor="email-type">Email</Label>
        <Input id="email-type" type="email" placeholder="email@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
      <div>
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="0" />
      </div>
      <div>
        <Label htmlFor="tel">Telephone</Label>
        <Input id="tel" type="tel" placeholder="+1 (555) 000-0000" />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="https://example.com" />
      </div>
      <div>
        <Label htmlFor="search">Search</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">Email</Label>
      <Input type="email" id="email-2" placeholder="Email" />
      <p className="text-sm text-muted-foreground">Enter your email address.</p>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error" className="text-destructive">Email</Label>
      <Input
        type="email"
        id="email-error"
        placeholder="Email"
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
};
