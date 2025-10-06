import { Typography } from "@/catalyst-ui/ui/typography";

export function TypographyDemo() {
  return (
    <div className="space-y-3">
      <Typography variant="h1" className="text-primary border-b-2 border-primary pb-2">
        Heading 1
      </Typography>

      <Typography variant="h2" className="text-secondary tracking-tight">
        Heading 2
      </Typography>

      <Typography variant="h3" className="text-accent-foreground font-semibold">
        Heading 3
      </Typography>

      <Typography variant="h4" className="tracking-wide">
        Heading 4
      </Typography>

      <Typography variant="p" className="leading-relaxed">
        This is a paragraph with some text content. It demonstrates the default body text styling
        with comfortable line height and spacing.
      </Typography>

      <Typography variant="blockquote" className="text-muted-foreground border-l-4 border-primary pl-4 italic">
        This is a blockquote element for emphasizing quotes or callouts. Perfect for testimonials
        or important statements.
      </Typography>

      <Typography variant="code" className="text-primary bg-primary/10 px-2 py-1 rounded">
        const code = "inline code";
      </Typography>

      <Typography variant="lead" className="text-secondary font-medium tracking-tight">
        This is lead text for emphasis. Use it for introduction paragraphs or to draw attention
        to important information at the start of a section.
      </Typography>

      <Typography variant="muted" className="text-xs">
        This is muted text for secondary information, captions, or less important details.
      </Typography>
    </div>
  );
}
