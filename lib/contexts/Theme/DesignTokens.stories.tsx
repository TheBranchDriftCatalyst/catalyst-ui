import type { Meta, StoryObj } from "@storybook/react";
import { DesignTokenDocBlock } from "storybook-design-token";

const meta = {
  title: "Design System/Design Tokens",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CatalystThemeTokens: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Catalyst Theme Design Tokens</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Cybersynthpunk Color System</h2>
        <p className="text-muted-foreground mb-8">
          Our design tokens power the entire Catalyst theme system, from base colors to complex neon glow effects.
          All tokens are automatically documented from our CSS files.
        </p>
      </div>

      <DesignTokenDocBlock
        colorSpace="hex"
        viewType="table"
        maxHeight={800}
      />
    </div>
  ),
  parameters: {
    designToken: {
      // Parse the catalyst theme CSS file for tokens
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};

export const ColorPalette: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Color Palette</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Neon Colors</h2>
        <p className="text-muted-foreground mb-6">
          Vibrant cyberpunk colors for accents and highlights
        </p>
      </div>

      <DesignTokenDocBlock
        colorSpace="hex"
        viewType="card"
        categoryFilter="Colors/Neon"
        maxHeight={600}
      />
    </div>
  ),
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};

export const GlowEffects: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Glow Effects</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Cyberpunk Glows</h2>
        <p className="text-muted-foreground mb-6">
          Neon glow effects that create depth and atmosphere
        </p>
      </div>

      <DesignTokenDocBlock
        viewType="table"
        categoryFilter="Effects/Glow"
        maxHeight={600}
      />
    </div>
  ),
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};

export const ShadowSystem: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Shadow System</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Neon Shadows</h2>
        <p className="text-muted-foreground mb-6">
          Multi-layered shadows with neon accents for elevation
        </p>
      </div>

      <DesignTokenDocBlock
        viewType="table"
        categoryFilter="Effects/Shadows"
        maxHeight={600}
      />
    </div>
  ),
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};

export const LightModePalette: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Light Mode Colors</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Opulent Synthwave Palette</h2>
        <p className="text-muted-foreground mb-6">
          Warm, luxurious colors for light mode with vibrant accents
        </p>
      </div>

      <DesignTokenDocBlock
        colorSpace="hsl"
        viewType="card"
        categoryFilter="Colors"
        maxHeight={800}
      />
    </div>
  ),
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};

export const DarkModePalette: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dark Mode Colors</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Cyberpunk Palette</h2>
        <p className="text-muted-foreground mb-6">
          Professional cyberpunk colors with neon accents
        </p>
      </div>

      <DesignTokenDocBlock
        colorSpace="hex"
        viewType="card"
        categoryFilter="Dark/Colors"
        maxHeight={800}
      />
    </div>
  ),
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
};
