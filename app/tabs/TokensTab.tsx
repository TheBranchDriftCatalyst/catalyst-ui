import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import { DesignTokenDocBlock } from "storybook-design-token";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

export function TokensTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Neon Colors */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Neon Color Palette</CardTitle>
            <CardDescription>Cybersynthpunk accent colors with live examples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2 group">
                <div
                  className="h-20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{ backgroundColor: "var(--neon-cyan)", boxShadow: "var(--glow-primary)" }}
                />
                <div className="text-sm font-mono">--neon-cyan</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-purple)",
                    boxShadow: "var(--glow-secondary)",
                  }}
                />
                <div className="text-sm font-mono">--neon-purple</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-pink)",
                    boxShadow: "0 0 20px var(--neon-pink)",
                  }}
                />
                <div className="text-sm font-mono">--neon-pink</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-blue)",
                    boxShadow: "0 0 20px var(--neon-blue)",
                  }}
                />
                <div className="text-sm font-mono">--neon-blue</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-red)",
                    boxShadow: "0 0 20px var(--neon-red)",
                  }}
                />
                <div className="text-sm font-mono">--neon-red</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-yellow)",
                    boxShadow: "0 0 20px var(--neon-yellow)",
                  }}
                />
                <div className="text-sm font-mono">--neon-yellow</div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg"
                  style={{
                    backgroundColor: "var(--neon-gold)",
                    boxShadow: "0 0 20px var(--neon-gold)",
                  }}
                />
                <div className="text-sm font-mono">--neon-gold</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Glow Effects */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Glow Effects</CardTitle>
            <CardDescription>Cyberpunk shadow glows for depth and atmosphere</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div
                  className="h-24 rounded-lg bg-primary/20 flex items-center justify-center"
                  style={{ boxShadow: "var(--glow-primary)" }}
                >
                  <span className="text-sm font-mono">--glow-primary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-24 rounded-lg bg-secondary/20 flex items-center justify-center"
                  style={{ boxShadow: "var(--glow-secondary)" }}
                >
                  <span className="text-sm font-mono">--glow-secondary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-24 rounded-lg bg-accent/20 flex items-center justify-center"
                  style={{ boxShadow: "var(--glow-accent)" }}
                >
                  <span className="text-sm font-mono">--glow-accent</span>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-24 rounded-lg bg-primary/20 flex items-center justify-center"
                  style={{ boxShadow: "var(--glow-hover)" }}
                >
                  <span className="text-sm font-mono">--glow-hover</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Neon Shadows */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Neon Shadow System</CardTitle>
            <CardDescription>Multi-layered elevation shadows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div
                  className="h-32 rounded-lg bg-card flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-neon-sm)" }}
                >
                  <span className="text-sm font-mono">--shadow-neon-sm</span>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-32 rounded-lg bg-card flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-neon-md)" }}
                >
                  <span className="text-sm font-mono">--shadow-neon-md</span>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-32 rounded-lg bg-card flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-neon-lg)" }}
                >
                  <span className="text-sm font-mono">--shadow-neon-lg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Typography Fonts - Dynamic */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Theme Typography</CardTitle>
            <CardDescription>Fonts change with each theme for unique aesthetics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Display Font (Headings)</div>
              <div
                className="text-4xl uppercase tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The Quick Brown Fox
              </div>
              <code className="text-xs">var(--font-heading)</code>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Body Font</div>
              <div className="text-2xl" style={{ fontFamily: "var(--font-body)" }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <code className="text-xs">var(--font-body)</code>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Monospace Font (Code)</div>
              <div className="text-xl" style={{ fontFamily: "var(--font-mono)" }}>
                const code = "monospace";
              </div>
              <code className="text-xs">var(--font-mono)</code>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Auto-Generated Token List */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Complete Design Token Reference</CardTitle>
            <CardDescription>
              Auto-generated from CSS annotations • All tokens documented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DesignTokenDocBlock viewType="table" maxHeight={600} />
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Usage Examples */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Usage in Code</CardTitle>
            <CardDescription>How to use design tokens in your components</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`// Using design tokens with inline styles
<div style={{
  color: 'var(--neon-cyan)',
  boxShadow: 'var(--glow-primary)'
}}>
  Neon text with glow
</div>

// Using in Tailwind classes (custom CSS)
<button className="shadow-[var(--shadow-neon-md)] bg-primary">
  Elevated Button
</button>

// Typography with custom fonts
<h1 className="font-display uppercase tracking-wider">
  Cyberpunk Heading
</h1>

// Accessing in TypeScript
const styles = {
  glowEffect: 'var(--glow-hover)',
  neonAccent: 'var(--neon-purple)',
  elevation: 'var(--shadow-neon-lg)'
};`}
              language="tsx"
              fileName="TokenUsage.tsx"
              theme="catalyst"
              showLineNumbers={true}
              showCopyButton={true}
            />
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
