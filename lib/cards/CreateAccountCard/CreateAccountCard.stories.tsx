import type { Meta, StoryObj } from "@storybook/react";
import CreateAccountCard from "./CreateAccountCard";

const meta = {
  title: "Cards/CreateAccountCard",
  component: CreateAccountCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CreateAccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    oidcProviders: [
      {
        name: "GitHub",
        onClick: () => console.log("GitHub login clicked"),
      },
      {
        name: "Google",
        onClick: () => console.log("Google login clicked"),
      },
    ],
  },
};
