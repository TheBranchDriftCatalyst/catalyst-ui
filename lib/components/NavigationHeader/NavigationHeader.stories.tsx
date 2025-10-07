import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import NavigationHeader from "./NavigationHeader";
import NavigationItem, { NavigationListItem, _sampleLinkObjects } from "./NavigationItem";

const meta = {
  title: "Components/NavigationHeader",
  component: NavigationHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NavigationHeader>;

export default meta;

// Define mock navigation items
const navItems = [
  <NavigationItem title="Components" links={_sampleLinkObjects} />,
  <NavigationItem title="About">
    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
      {/* <li className="row-span-3"> */}
      <NavigationMenuLink asChild>
        <a
          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
          href="/"
        >
          <img
            src="https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="shadcn/ui"
          />
          {/* <LucideAlarmClock className="h-6 w-6" /> */}
          <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
          <p className="text-sm leading-tight text-muted-foreground">
            Beautifully designed components built with Radix UI and Tailwind CSS.
          </p>
        </a>
      </NavigationMenuLink>
      {/* </li> */}
      <NavigationListItem href="/docs" title="Introduction">
        Re-usable components built using Radix UI and Tailwind CSS.
      </NavigationListItem>
      <NavigationListItem href="/docs/installation" title="Installation">
        How to install dependencies and structure your app.
      </NavigationListItem>
      <NavigationListItem href="/docs/primitives/typography" title="Typography">
        Styles for headings, paragraphs, lists...etc
      </NavigationListItem>
    </ul>
  </NavigationItem>,
];

// Create the default story
export const Default: StoryObj<typeof NavigationHeader> = {
  args: {
    children: navItems,
  },
};
