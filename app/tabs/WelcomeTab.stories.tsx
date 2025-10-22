/**
 * WelcomeTab Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import WelcomeTab from "./WelcomeTab";

const meta: Meta<typeof WelcomeTab> = {
  title: "Tabs/WelcomeTab",
  component: WelcomeTab,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Synthwave-styled welcome page with interactive 3D models and Twitter-style updates feed. Features Three.js visualization with switchable models (Desktop PC / Planet Earth) and smooth Framer Motion animations.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WelcomeTab>;

/**
 * Default welcome page with all features:
 * - Hero section with 3D model carousel
 * - Gradient title with neon glow
 * - CTA buttons
 * - Twitter-style updates feed
 */
export const Default: Story = {};

/**
 * Mobile viewport preview
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet viewport preview
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
