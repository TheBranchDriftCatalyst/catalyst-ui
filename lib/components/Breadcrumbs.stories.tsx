import type { Meta, StoryObj } from "@storybook/react";
import { BreadCrumbs } from "./Breadcrumbs";

const meta = {
  title: "Components/Breadcrumbs",
  component: BreadCrumbs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    crumbs: {
      control: "object",
      description: "Array of breadcrumb items with href, name, and optional compact property",
    },
  },
} satisfies Meta<typeof BreadCrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    crumbs: [
      { href: "/", name: "Home" },
      { href: "/docs", name: "Documentation" },
      { href: "/docs/components", name: "Components" },
      { href: "/docs/components/breadcrumbs", name: "Breadcrumbs" },
    ],
  },
};

export const WithCompactSection: Story = {
  args: {
    crumbs: [
      { href: "/", name: "Home" },
      { href: "/section1", name: "Section 1", compact: 3 },
      { href: "/section1/subsection1", name: "Subsection 1" },
      { href: "/section1/subsection1/item1", name: "Item 1" },
      { href: "/section1/subsection1/item1/detail1", name: "Detail 1" },
      { href: "/section1/subsection1/item1/detail1/more", name: "More Details" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Uses the `compact` property to collapse multiple breadcrumb items into a dropdown menu (ellipsis icon). Click the … to reveal hidden items.",
      },
    },
  },
};

export const DeepNavigation: Story = {
  args: {
    crumbs: [
      { href: "/", name: "Home" },
      { href: "/projects", name: "Projects" },
      { href: "/projects/catalyst-ui", name: "Catalyst UI" },
      { href: "/projects/catalyst-ui/components", name: "Components" },
      { href: "/projects/catalyst-ui/components/display", name: "Display" },
      { href: "/projects/catalyst-ui/components/display/breadcrumbs", name: "Breadcrumbs" },
    ],
  },
};

export const MultipleCompactSections: Story = {
  args: {
    crumbs: [
      { href: "/", name: "Root" },
      { href: "/level1", name: "Level 1", compact: 2 },
      { href: "/level1/level2", name: "Level 2" },
      { href: "/level1/level2/level3", name: "Level 3", compact: 2 },
      { href: "/level1/level2/level3/level4", name: "Level 4" },
      { href: "/level1/level2/level3/level4/current", name: "Current Page" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates multiple compact sections in a single breadcrumb trail for very deep navigation hierarchies.",
      },
    },
  },
};
