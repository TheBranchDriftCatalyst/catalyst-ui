import type { Meta, StoryObj } from "@storybook/react";
import MultiChoiceQuestionCard from "./MultiChoiceQuestion";
import React from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("MultiChoiceQuestion.stories");

const meta = {
  title: "Cards/MultiChoiceQuestionCard",
  component: MultiChoiceQuestionCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    question: { control: "text" },
    options: { control: "array" },
  },
} satisfies Meta<typeof MultiChoiceQuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    question: "What is your favorite synthwave artist?",
    options: ["The Midnight", "Carpenter Brut", "FM-84", "Gunship"],
  },
  render: args => (
    <MultiChoiceQuestionCard {...args} onChange={value => log.debug("Selected:", value)} />
  ),
};
