import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Typography } from "../../ui/typography";
import { THEME_REGISTRY, type ThemeVariant } from "./registry";

/**
 * Minimal inline Badge — catalyst-ui doesn't ship a dedicated Badge primitive
 * yet, so we render one locally using the same CSS custom-property tokens
 * every theme defines (background / foreground / primary / secondary).
 */
const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "destructive";
  }
> = ({ variant = "default", className = "", children, ...rest }) => {
  const styles: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <span
      {...rest}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * Minimal inline CodeBlock — same rationale as Badge. Uses muted/foreground
 * tokens so every theme renders it consistently.
 */
const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-foreground overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const ThemeCell: React.FC<{ themeName: string; variant: ThemeVariant }> = ({
  themeName,
  variant,
}) => (
  <div
    className={`theme-${themeName} ${variant} bg-background text-foreground p-4 rounded-lg border border-border space-y-3`}
    data-testid={`theme-cell-${themeName}-${variant}`}
    data-theme={themeName}
    data-variant={variant}
  >
    <div className="flex items-center justify-between">
      <Typography tag="h3" size="lg" className="font-semibold">
        {themeName}
      </Typography>
      <Badge variant="secondary">{variant}</Badge>
    </div>

    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Card title</CardTitle>
        <CardDescription className="text-xs">Sample card surface</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <Input placeholder="Input field" />
        <div className="flex gap-2 flex-wrap">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="destructive">destructive</Badge>
        </div>
        <CodeBlock>{`theme: ${themeName}\nvariant: ${variant}`}</CodeBlock>
      </CardContent>
    </Card>
  </div>
);

const ThemeDungeonGrid: React.FC = () => {
  const variants: ThemeVariant[] = ["dark", "light"];
  return (
    <div
      className="grid gap-4 p-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}
      data-testid="theme-dungeon-grid"
      data-theme-count={THEME_REGISTRY.length}
      data-variant-count={variants.length}
    >
      {THEME_REGISTRY.flatMap(t =>
        variants.map(v => <ThemeCell key={`${t.name}-${v}`} themeName={t.name} variant={v} />)
      )}
    </div>
  );
};

const meta: Meta<typeof ThemeDungeonGrid> = {
  title: "Theme/Dungeon",
  component: ThemeDungeonGrid,
  parameters: {
    layout: "fullscreen",
    // Disable the addon-themes decorator for this story — we render every
    // theme×variant scope locally and don't want the global toolbar swap.
    themes: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof ThemeDungeonGrid>;

/**
 * Full dungeon: every theme × {dark, light}. Useful as a visual regression
 * surface — if a token goes missing in one theme, it shows up here first.
 *
 * The `play` function asserts the live DOM actually contains
 * registry.length × 2 cells. This is a behavioral check, not an
 * implementation one — it queries the rendered output, not the registry.
 */
export const AllThemes: Story = {
  render: () => <ThemeDungeonGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByTestId("theme-dungeon-grid");

    const expectedThemeCount = THEME_REGISTRY.length;
    const expectedVariants: ThemeVariant[] = ["dark", "light"];
    const expectedCells = expectedThemeCount * expectedVariants.length;

    // Sanity: registry actually contains the dungeon theme.
    expect(THEME_REGISTRY.some(t => t.name === "dungeon")).toBe(true);

    // Every theme × variant must be present in the rendered grid.
    for (const t of THEME_REGISTRY) {
      for (const v of expectedVariants) {
        const cell = within(grid).getByTestId(`theme-cell-${t.name}-${v}`);
        expect(cell.getAttribute("data-theme")).toBe(t.name);
        expect(cell.getAttribute("data-variant")).toBe(v);
      }
    }

    // And no extras.
    const cells = grid.querySelectorAll('[data-testid^="theme-cell-"]');
    expect(cells.length).toBe(expectedCells);
  },
};
