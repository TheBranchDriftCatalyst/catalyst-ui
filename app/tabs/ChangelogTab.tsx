import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { MarkdownRenderer } from "@/catalyst-ui/components/MarkdownRenderer";
import { Timeline, TimelineItem } from "@/catalyst-ui/components/Timeline";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseChangelog, changelogEntryToTimelineData } from "@/catalyst-ui/utils/markdown";

export const TAB_ORDER = 999;

// Fallback changelog DTO for when CHANGELOG.md is not found
const FALLBACK_CHANGELOG = `# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - ${new Date().toISOString().split("T")[0]}

### Added
- Initial release of Catalyst UI component library
- React components with TypeScript support
- Tailwind CSS styling
- Radix UI primitives integration
- Storybook documentation

### Features
- **Card Components**: Flexible card layouts with multiple variants
- **Form Components**: Accessible form controls with validation
- **Animation HOCs**: Reusable animation wrappers (Flip, Fade, Slide, Bounce)
- **Timeline Component**: Visual timeline for displaying chronological events
- **Theme System**: Multi-theme support with dark/light variants
- **Markdown Renderer**: Custom markdown rendering with syntax highlighting

### Developer Experience
- Full TypeScript support
- Component stories in Storybook
- Comprehensive documentation
- Web Vitals monitoring integration

---

*This is a generated example changelog. Create a CHANGELOG.md file in your project root to see your actual changelog.*
`;

/**
 * Render achievement text with linked commit hashes
 * Converts (abc1234) -> clickable link to commit
 */
function renderAchievementWithLinks(text: string, repoBaseUrl?: string): React.ReactNode {
  if (!repoBaseUrl) return text;

  // Find commit hashes in format (abc1234) and convert to links
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const hashRegex = /\(([a-f0-9]{7})\)/g;
  let match;

  while ((match = hashRegex.exec(text)) !== null) {
    const [fullMatch, hash] = match;
    const matchIndex = match.index;

    // Add text before the hash
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Add the linked hash
    parts.push(
      <span key={matchIndex}>
        (
        <a
          href={`${repoBaseUrl}/commit/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          onClick={e => e.stopPropagation()}
        >
          {hash}
        </a>
        )
      </span>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export function ChangelogTab() {
  const [changelog, setChangelog] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch CHANGELOG.md from the root of the project
    fetch("/CHANGELOG.md")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch CHANGELOG.md");
        return res.text();
      })
      .then(text => {
        setChangelog(text);
        setLoading(false);
      })
      .catch(err => {
        // Use fallback changelog when file is not found
        console.warn(
          "⚠️ CHANGELOG.md not found - using generated example changelog.",
          "\nCreate a CHANGELOG.md file in your project's public directory to see your actual changelog.",
          "\nOriginal error:",
          err.message
        );
        setChangelog(FALLBACK_CHANGELOG);
        setLoading(false);
      });
  }, []);

  // Parse changelog into timeline data
  const timelineData = useMemo(() => {
    if (!changelog) return [];
    return parseChangelog(changelog).map(changelogEntryToTimelineData);
  }, [changelog]);

  if (loading) {
    return (
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Loading Changelog...</CardTitle>
          </CardHeader>
        </Card>
      </ScrollSnapItem>
    );
  }

  return (
    <div className="space-y-4 mt-0">
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>📝 Changelog</CardTitle>
            <CardDescription>
              View release history and changes. Toggle between custom-rendered and GitHub-style
              views.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="rendered">Custom Rendered</TabsTrigger>
                <TabsTrigger value="github">GitHub Style</TabsTrigger>
              </TabsList>

              {/* Timeline View - Visual changelog timeline */}
              <TabsContent value="timeline" className="mt-6">
                {timelineData.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No changelog entries found.
                  </div>
                ) : (
                  <Timeline>
                    {timelineData.map((entry, idx) => (
                      <TimelineItem
                        key={entry.version}
                        date={entry.date}
                        title={
                          entry.url ? (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              Version {entry.version}
                            </a>
                          ) : (
                            `Version ${entry.version}`
                          )
                        }
                        achievements={entry.achievements.map((achievement, aidx) => (
                          <span key={aidx}>
                            {renderAchievementWithLinks(achievement.text, achievement.repoBaseUrl)}
                          </span>
                        ))}
                        isLast={idx === timelineData.length - 1}
                      />
                    ))}
                  </Timeline>
                )}
              </TabsContent>

              {/* Custom Rendered View - Uses our component mapper */}
              <TabsContent value="rendered" className="mt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={changelog} />
                </div>
              </TabsContent>

              {/* GitHub Style View - Uses react-markdown */}
              <TabsContent value="github" className="mt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Style links
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-primary hover:underline transition-all"
                          target={props.href?.startsWith("http") ? "_blank" : undefined}
                          rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        />
                      ),
                      // Style code blocks
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code
                            {...props}
                            className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm"
                          />
                        ) : (
                          <code
                            {...props}
                            className="block bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto"
                          />
                        ),
                      // Style tables
                      table: ({ node, ...props }) => (
                        <div className="my-4 rounded-md border overflow-hidden">
                          <table {...props} className="w-full" />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th {...props} className="border-b px-4 py-2 text-left font-medium" />
                      ),
                      td: ({ node, ...props }) => <td {...props} className="border-b px-4 py-2" />,
                      // Style blockquotes
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          {...props}
                          className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground"
                        />
                      ),
                    }}
                  >
                    {changelog}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
