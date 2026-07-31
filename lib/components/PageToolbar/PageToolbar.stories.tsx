import type { Meta, StoryObj } from "@storybook/react";
import { PageToolbar } from "./PageToolbar";
import { Button } from "@/catalyst-ui/ui/button";

const meta = {
  title: "Components/PageToolbar",
  component: PageToolbar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PageToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { title: "Overview" } };

export const WithActions: Story = {
  render: () => (
    <PageToolbar title="Import">
      <Button variant="outline" size="sm">
        Refresh
      </Button>
      <Button size="sm">Run import</Button>
    </PageToolbar>
  ),
};

export const WithSubtitle: Story = {
  render: () => (
    <PageToolbar
      title="Widgets"
      subtitle="Embeddable public stats widgets — copy the markdown snippet into a README"
    >
      <Button size="sm">Mint new link</Button>
    </PageToolbar>
  ),
};
