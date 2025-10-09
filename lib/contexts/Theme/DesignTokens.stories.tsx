import type { Meta, StoryObj } from "@storybook/react";
import { DesignTokenDocBlock } from "storybook-design-token";

const meta = {
  title: "Design System/Design Tokens",
  parameters: {
    layout: "fullscreen",
    designToken: {
      // Parse all theme CSS files for tokens
      files: [
        "lib/contexts/Theme/styles/catalyst.css",
        "lib/contexts/Theme/styles/dracula.css",
        "lib/contexts/Theme/styles/gold.css",
        "lib/contexts/Theme/styles/laracon.css",
        "lib/contexts/Theme/styles/nature.css",
        "lib/contexts/Theme/styles/netflix.css",
        "lib/contexts/Theme/styles/nord.css",
      ],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete design token reference auto-generated from theme CSS files.
 *
 * All CSS custom properties (design tokens) from the Catalyst theme system are
 * documented here, including colors, shadows, glows, typography, and spacing.
 */
export const AllTokens: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Design Tokens Reference</h1>
      <p className="text-muted-foreground mb-8">
        Complete auto-generated documentation of all design tokens across all themes. Tokens are
        extracted from CSS custom properties defined in theme stylesheets.
      </p>
      <DesignTokenDocBlock colorSpace="hex" viewType="table" maxHeight={800} />
    </div>
  ),
};

/**
 * Color tokens filtered view showing only color-related design tokens.
 */
export const ColorTokens: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Color Palette</h1>
      <p className="text-muted-foreground mb-8">
        All color tokens including neon accents, backgrounds, foregrounds, and theme-specific
        colors.
      </p>
      <DesignTokenDocBlock colorSpace="hex" viewType="card" maxHeight={800} />
    </div>
  ),
};

/**
 * Catalyst theme tokens - the default cybersynthpunk theme with neon effects.
 */
export const CatalystTheme: Story = {
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/catalyst.css"],
    },
  },
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Catalyst Theme Tokens</h1>
      <p className="text-muted-foreground mb-8">
        The signature Catalyst theme featuring cyberpunk neon colors, glows, and animations. This
        theme includes unique design tokens for neon effects and shadow systems.
      </p>
      <DesignTokenDocBlock colorSpace="hex" viewType="table" maxHeight={800} />
    </div>
  ),
};

/**
 * Dracula theme tokens - the popular dark theme with purple accents.
 */
export const DraculaTheme: Story = {
  parameters: {
    designToken: {
      files: ["lib/contexts/Theme/styles/dracula.css"],
    },
  },
  render: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Dracula Theme Tokens</h1>
      <p className="text-muted-foreground mb-8">
        Popular Dracula color scheme with purple and pink accents.
      </p>
      <DesignTokenDocBlock colorSpace="hex" viewType="table" maxHeight={800} />
    </div>
  ),
};

/**
 * Usage examples showing how to use design tokens in your components.
 */
export const UsageExamples: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Using Design Tokens</h1>
        <p className="text-muted-foreground mb-8">
          Design tokens can be used in CSS, inline styles, and TypeScript.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">CSS Custom Properties</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`/* In your CSS */
.my-component {
  color: var(--neon-cyan);
  background: var(--background);
  box-shadow: var(--glow-primary);
  font-family: var(--font-heading);
}`}</code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Inline Styles</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// In React/TypeScript
<div style={{
  color: 'var(--neon-purple)',
  boxShadow: 'var(--glow-secondary)',
  fontFamily: 'var(--font-body)'
}}>
  Styled with design tokens
</div>`}</code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tailwind Arbitrary Values</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// In Tailwind classes
<button className="shadow-[var(--shadow-neon-md)] text-[var(--neon-cyan)]">
  Click me
</button>`}</code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">TypeScript Constants</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// Create typed constants
const tokens = {
  colors: {
    primary: 'var(--neon-cyan)',
    secondary: 'var(--neon-purple)',
  },
  shadows: {
    sm: 'var(--shadow-neon-sm)',
    md: 'var(--shadow-neon-md)',
    lg: 'var(--shadow-neon-lg)',
  },
  glows: {
    primary: 'var(--glow-primary)',
    secondary: 'var(--glow-secondary)',
  }
} as const;`}</code>
        </pre>
      </div>

      <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
        <h3 className="text-xl font-bold mb-2">Live Example</h3>
        <p className="mb-4">This card uses design tokens for styling:</p>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-neon-md)",
            color: "var(--foreground)",
          }}
        >
          <div style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-heading)" }}>
            Neon Heading
          </div>
          <div style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
            Body text with theme tokens
          </div>
        </div>
      </div>
    </div>
  ),
};
