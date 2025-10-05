import type { Meta, StoryObj } from "@storybook/react";
import { DataTableDemo } from "./SimpleTable";

const meta = {
  title: "Components/SimpleTable",
  component: DataTableDemo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground space-y-2">
        <p>✨ Full-featured data table powered by TanStack Table</p>
        <p>🔍 Filter emails with the search input</p>
        <p>↕️ Sort by clicking column headers</p>
        <p>👁️ Toggle column visibility with the "Columns" dropdown</p>
        <p>☑️ Select rows and see selection count</p>
        <p>⚡ Paginate through data with Previous/Next</p>
        <p>⚙️ Right-click row actions to copy IDs or view details</p>
      </div>
      <DataTableDemo />
    </div>
  ),
};
