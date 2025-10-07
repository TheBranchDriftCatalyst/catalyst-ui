import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta = {
  title: "UI/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "blockquote",
        "code",
        "lead",
        "large",
        "small",
        "muted",
      ],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
};

export const Paragraph: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="p">
        The quick brown fox jumps over the lazy dog. This is a standard paragraph with regular text
        styling that demonstrates the default paragraph appearance in the typography system.
      </Typography>
      <Typography variant="p">
        Multiple paragraphs can be used to break up content into digestible sections, making it
        easier for readers to process information and improving overall readability.
      </Typography>
    </div>
  ),
};

export const Lead: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="lead">
        This is lead text, typically used for introductory paragraphs or to emphasize important
        content at the beginning of a section.
      </Typography>
      <Typography variant="p">
        Regular paragraph text follows the lead text, providing additional details and context with
        standard styling.
      </Typography>
    </div>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="p">Consider this wisdom:</Typography>
      <Typography variant="blockquote">
        "The only way to do great work is to love what you do. If you haven't found it yet, keep
        looking. Don't settle."
      </Typography>
      <Typography variant="p" className="text-right">
        — Steve Jobs
      </Typography>
    </div>
  ),
};

export const Code: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="p">
        To install the package, run{" "}
        <Typography variant="code">npm install @catalyst-ui/core</Typography> in your terminal.
      </Typography>
      <Typography variant="p">
        You can also use <Typography variant="code">yarn add @catalyst-ui/core</Typography> if you
        prefer Yarn.
      </Typography>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="large">Large text for emphasis or important callouts.</Typography>
      <Typography variant="p">Regular paragraph text with standard sizing.</Typography>
      <Typography variant="small">
        Small text for fine print, captions, or supplementary information.
      </Typography>
      <Typography variant="muted">
        Muted text with reduced opacity for less important content.
      </Typography>
    </div>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <article className="space-y-6 max-w-3xl">
      <Typography variant="h1">The Typography System</Typography>

      <Typography variant="lead">
        A comprehensive guide to using typography components effectively in your applications.
      </Typography>

      <Typography variant="h2">Introduction</Typography>

      <Typography variant="p">
        Typography is one of the most important aspects of design. It affects readability,
        accessibility, and the overall aesthetic of your application. Our typography system provides
        a consistent set of text styles that work harmoniously together.
      </Typography>

      <Typography variant="blockquote">
        "Typography is two-dimensional architecture, based on experience and imagination, and guided
        by rules and readability."
      </Typography>

      <Typography variant="h3">Getting Started</Typography>

      <Typography variant="p">
        To use a typography component, simply import it and specify the desired variant:
      </Typography>

      <Typography variant="code">{'<Typography variant="h1">Your Heading</Typography>'}</Typography>

      <Typography variant="h4">Available Variants</Typography>

      <Typography variant="p">
        The system includes heading variants (<Typography variant="code">h1</Typography> through{" "}
        <Typography variant="code">h6</Typography>), body text variants (
        <Typography variant="code">p</Typography>, <Typography variant="code">lead</Typography>,{" "}
        <Typography variant="code">large</Typography>), and utility variants like{" "}
        <Typography variant="code">code</Typography> and{" "}
        <Typography variant="code">blockquote</Typography>.
      </Typography>

      <Typography variant="small">Last updated: October 2025</Typography>
    </article>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H1
        </Typography>
        <Typography variant="h1">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H2
        </Typography>
        <Typography variant="h2">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H3
        </Typography>
        <Typography variant="h3">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H4
        </Typography>
        <Typography variant="h4">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H5
        </Typography>
        <Typography variant="h5">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          H6
        </Typography>
        <Typography variant="h6">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Paragraph
        </Typography>
        <Typography variant="p">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Lead
        </Typography>
        <Typography variant="lead">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Large
        </Typography>
        <Typography variant="large">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Small
        </Typography>
        <Typography variant="small">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Muted
        </Typography>
        <Typography variant="muted">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Blockquote
        </Typography>
        <Typography variant="blockquote">The quick brown fox jumps over the lazy dog</Typography>
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-2">
          Code
        </Typography>
        <Typography variant="code">const fox = "quick brown";</Typography>
      </div>
    </div>
  ),
};
