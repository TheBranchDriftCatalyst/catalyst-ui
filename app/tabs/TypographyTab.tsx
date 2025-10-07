import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

// Import demo component and source code
import { TypographyDemo } from "../demos/TypographyDemo";
import TypographyDemoSource from "../demos/TypographyDemo.tsx?raw";

export function TypographyTab() {
  return (
    <div className="space-y-4 mt-0">
      <ScrollSnapItem align="start">
        <CodeFlipCard
          sourceCode={TypographyDemoSource}
          fileName="TypographyDemo.tsx"
          language="tsx"
        >
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Various text styles, headings, and semantic elements • Click to view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyDemo />
            </CardContent>
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>
    </div>
  );
}
