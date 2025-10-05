import type { Meta, StoryObj } from "@storybook/react";
import { CatalystCard } from "./CatalystCard";
import { Button } from "@/catalyst-ui/ui/button";

const meta = {
  title: "Components/CatalystCard",
  component: CatalystCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Card title (string or ReactNode)",
    },
    description: {
      control: "text",
      description: "Card description (string or ReactNode)",
    },
    content: {
      control: false,
      description: "Card content (ReactNode or ReactNode[])",
    },
    footer: {
      control: false,
      description: "Optional footer content (ReactNode or ReactNode[])",
    },
  },
} satisfies Meta<typeof CatalystCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Catalyst Card",
    description: "A simple wrapper around the base Card component with convenient props.",
    content: (
      <p className="text-sm text-muted-foreground">
        This is the main content area. You can put any React nodes here.
      </p>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: "Card with Footer",
    description: "Demonstrating a card with action buttons in the footer",
    content: (
      <div className="space-y-2">
        <p className="text-sm">This card has buttons in the footer for actions.</p>
        <p className="text-sm text-muted-foreground">The footer uses flexbox justify-between layout.</p>
      </div>
    ),
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </>
    ),
  },
};

export const ContentOnly: Story = {
  args: {
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold">No Header or Footer</h3>
        <p className="text-sm text-muted-foreground">
          Sometimes you just need content without a header or footer.
          This card demonstrates that simple use case.
        </p>
      </div>
    ),
  },
};

export const RichContent: Story = {
  args: {
    title: "Project Status",
    description: "Overview of current development tasks",
    content: (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Tasks Completed</span>
          <span className="font-semibold text-primary">7/10</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }} />
        </div>
        <ul className="space-y-1 text-sm">
          <li>✅ Component library setup</li>
          <li>✅ Theme system implementation</li>
          <li>✅ Storybook configuration</li>
          <li>⏳ Additional UI primitives</li>
        </ul>
      </div>
    ),
    footer: (
      <Button className="w-full">View All Tasks</Button>
    ),
  },
};

export const CustomTitleNode: Story = {
  args: {
    title: (
      <div className="flex items-center gap-2">
        <span className="text-xl">🚀</span>
        <span>Custom Title with Icon</span>
      </div>
    ),
    description: (
      <span className="text-xs">
        Both title and description accept <code className="bg-muted px-1 rounded">ReactNode</code>,
        not just strings!
      </span>
    ),
    content: (
      <p className="text-sm">
        This flexibility allows for rich, interactive headers and descriptions.
      </p>
    ),
  },
};
