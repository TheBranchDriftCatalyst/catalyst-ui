import { Typography } from "@/catalyst-ui/ui/typography";

import { EditableText as T } from "@/catalyst-ui/dev/components/EditableText";

export function TypographyDemo() {
  return (
    <div className="space-y-3">
      <Typography variant="h1" className="text-primary border-b-2 border-primary pb-2">
        <T id="heading_1" namespace="TypographyDemo">
          Heading 1
        </T>
      </Typography>
      <Typography variant="h2" className="text-secondary tracking-tight">
        <T id="heading_2" namespace="TypographyDemo">
          Heading 2
        </T>
      </Typography>
      <Typography variant="h3" className="text-accent-foreground font-semibold">
        <T id="heading_3" namespace="TypographyDemo">
          Heading 3
        </T>
      </Typography>
      <Typography variant="h4" className="tracking-wide">
        <T id="heading_4" namespace="TypographyDemo">
          Heading 4
        </T>
      </Typography>
      <Typography variant="p" className="leading-relaxed">
        <T id="this_is_a_paragraph_with_some_text_content_it_demo" namespace="TypographyDemo">
          This is a paragraph with some text content. It demonstrates the default body text styling
          with comfortable line height and spacing.
        </T>
      </Typography>
      <Typography
        variant="blockquote"
        className="text-muted-foreground border-l-4 border-primary pl-4 italic"
      >
        <T id="this_is_a_blockquote_element_for_emphasizing_quote" namespace="TypographyDemo">
          This is a blockquote element for emphasizing quotes or callouts. Perfect for testimonials
          or important statements.
        </T>
      </Typography>
      <Typography variant="code" className="text-primary bg-primary/10 px-2 py-1 rounded">
        <T id="const_code_inline_code" namespace="TypographyDemo">
          const code = "inline code";
        </T>
      </Typography>
      <Typography variant="lead" className="text-secondary font-medium tracking-tight">
        <T id="this_is_lead_text_for_emphasis_use_it_for_introduc" namespace="TypographyDemo">
          This is lead text for emphasis. Use it for introduction paragraphs or to draw attention to
          important information at the start of a section.
        </T>
      </Typography>
      <Typography variant="muted" className="text-xs">
        <T id="this_is_muted_text_for_secondary_information_capti" namespace="TypographyDemo">
          This is muted text for secondary information, captions, or less important details.
        </T>
      </Typography>
    </div>
  );
}
