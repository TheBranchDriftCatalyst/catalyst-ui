import type { Meta, StoryObj } from '@storybook/react';
import React from "react";
import NavigationItem, { _sampleLinkObjects } from "../NavigationHeader/NavigationItem";
import Header from './CatalystHeader';

const meta = {
  title: 'Components/CatalystHeader',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navigationItems: [
      <NavigationItem title="Components" links={_sampleLinkObjects} />,
      <NavigationItem title="Otherstuff" links={_sampleLinkObjects} />,
    ],
    title: "Catalyst Header",
    breadcrumbs: [
      { href: "/section1", name: "Section 1" },
      { href: "/section1/subsection1", name: "Subsection 1", compact: 3},
      { href: "/section1/subsection1/item1", name: "Item 1" },
      { href: "/section1/subsection1/item1/detail1", name: "Detail 1" },
      { href: "/section1/subsection1/item1/detail1/more", name: "More" },
    ]
  },
};
