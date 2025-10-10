import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { MarkdownRenderer } from "@/catalyst-ui/components/MarkdownRenderer";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { Button } from "@/catalyst-ui/ui/button";

// Metadata for tabs manifest
export const TAB_SECTION = "projects";
export const TAB_LABEL = "GitHub Profile";
export const TAB_ORDER = 7;

const GITHUB_README_URL =
  "https://raw.githubusercontent.com/TheBranchDriftCatalyst/TheBranchDriftCatalyst/main/README.md";
const GITHUB_REPO_URL = "https://github.com/TheBranchDriftCatalyst/TheBranchDriftCatalyst";

// Fallback content if README fetch fails
const FALLBACK_CONTENT = `# TheBranchDriftCatalyst

> Building tools, breaking conventions, shipping code 🚀

## 📊 Stats

[![GitHub Streak](https://streak-stats.demolab.com?user=TheBranchDriftCatalyst&theme=synthwave)](https://git.io/streak-stats)

## 🚀 Projects

Visit the GitHub repository to see the latest projects and updates.

---

*Unable to load README from GitHub. Please check your connection or visit the repository directly.*
`;

export function GitHubProfileTab() {
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(GITHUB_README_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch README: ${response.statusText}`);
        }

        const text = await response.text();
        setReadme(text);
      } catch (err) {
        console.error("Failed to fetch GitHub README:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setReadme(FALLBACK_CONTENT);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, []);

  if (loading) {
    return (
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Loading GitHub Profile...</CardTitle>
            <CardDescription>
              Fetching README from TheBranchDriftCatalyst repository
            </CardDescription>
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle>🌊 GitHub Profile</CardTitle>
                <CardDescription>
                  Auto-generated profile page with project listings, stats, and documentation •
                  Powered by Python and YAML magic
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">
                  ⚠️ Could not fetch live README from GitHub. Showing fallback content.
                </p>
              </div>
            )}

            <Tabs defaultValue="rendered" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rendered">Custom Rendered</TabsTrigger>
                <TabsTrigger value="github">GitHub Style</TabsTrigger>
              </TabsList>

              {/* Custom Rendered View - Uses our component mapper */}
              <TabsContent value="rendered" className="mt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={readme} />
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
                      // Style headings with proper spacing
                      h1: ({ node, ...props }) => (
                        <h1 {...props} className="text-4xl font-bold mt-8 mb-4" />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 {...props} className="text-3xl font-bold mt-6 mb-3" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 {...props} className="text-2xl font-bold mt-4 mb-2" />
                      ),
                      // Style images
                      img: ({ node, ...props }) => (
                        <img
                          {...props}
                          className="rounded-lg max-w-full h-auto my-4"
                          loading="lazy"
                        />
                      ),
                    }}
                  >
                    {readme}
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
