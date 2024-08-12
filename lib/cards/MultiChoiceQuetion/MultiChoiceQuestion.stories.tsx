import { Meta, StoryObj } from '@storybook/react';
import MultiChoiceQuestionCard from './MultiChoiceQuestion';

const meta: Meta<typeof MultiChoiceQuestionCard> = {
  title: 'Components/MultiChoiceQuestionCard',
  component: MultiChoiceQuestionCard,
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    options: { control: 'array' },
  },
};

export default meta;

type Story = StoryObj<typeof MultiChoiceQuestionCard>;

export const Primary: Story = {
  args: {
    question: 'What is your favorite synthwave artist?',
    options: ['The Midnight', 'Carpenter Brut', 'FM-84', 'Gunship'],
  },
  render: (args) => <MultiChoiceQuestionCard {...args} onChange={(value) => console.log('Selected:', value)} />,
};
