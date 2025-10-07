import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { CreateAccountCard } from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard";
import MultiChoiceQuestionCard from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion";
import { ImportFooter } from "../shared/ImportFooter";
import { ScrollSnapItem } from "@/catalyst-ui/components/AnimationHOC";

// Import demo components
import { CardPrimitiveDemo } from "../demos/CardPrimitiveDemo";
import CardPrimitiveDemoSource from "../demos/CardPrimitiveDemo.tsx?raw";

import { CodeFlipCardExampleDemo } from "../demos/CodeFlipCardExampleDemo";
import CodeFlipCardExampleDemoSource from "../demos/CodeFlipCardExampleDemo.tsx?raw";

// Import card source code as raw strings
import CreateAccountCardSource from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard.tsx?raw";
import MultiChoiceQuestionSource from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion.tsx?raw";

export function CardsTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Introduction */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Card Components</CardTitle>
            <CardDescription>
              Base card primitives, flip card components, and complex card implementations
            </CardDescription>
          </CardHeader>
        </Card>
      </ScrollSnapItem>

      {/* SECTION 1: Card Primitive */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Card Primitive</CardTitle>
            <CardDescription>
              Base card component with header, content, and footer slots • Click to view source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeFlipCard
              sourceCode={CardPrimitiveDemoSource}
              fileName="CardPrimitiveDemo.tsx"
              language="tsx"
              stripImports={true}
            >
              <CardPrimitiveDemo />
            </CodeFlipCard>
          </CardContent>
          <ImportFooter sourceCode={CardPrimitiveDemoSource} />
        </Card>
      </ScrollSnapItem>

      {/* SECTION 2: CodeFlipCard Features */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>CodeFlipCard Component</CardTitle>
            <CardDescription>
              Interactive card that flips to show source code • Click to flip, or hover over the examples below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Click to Flip */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Click to Flip</h4>
              <CodeFlipCard
                sourceCode={CodeFlipCardExampleDemoSource}
                fileName="CodeFlipCardExampleDemo.tsx"
                language="tsx"
                stripImports={true}
              >
                <CodeFlipCardExampleDemo />
              </CodeFlipCard>
            </div>

            {/* Hover to Flip Examples */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Hover to Flip (Horizontal & Vertical)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <CodeFlipCard
                  sourceCode={CodeFlipCardExampleDemoSource}
                  fileName="CodeFlipCardExampleDemo.tsx"
                  language="tsx"
                  stripImports={true}
                  flipTrigger="hover"
                >
                  <CodeFlipCardExampleDemo />
                </CodeFlipCard>

                <CodeFlipCard
                  sourceCode={CodeFlipCardExampleDemoSource}
                  fileName="CodeFlipCardExampleDemo.tsx"
                  language="tsx"
                  stripImports={true}
                  flipTrigger="hover"
                  flipDirection="vertical"
                >
                  <CodeFlipCardExampleDemo />
                </CodeFlipCard>
              </div>
            </div>
          </CardContent>
          <ImportFooter sourceCode={CodeFlipCardExampleDemoSource} />
        </Card>
      </ScrollSnapItem>

      {/* SECTION 3: Complex Cards */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Complex Card Components</CardTitle>
            <CardDescription>
              Full-featured card components with forms, validation, and interactive elements • Click to view implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={CreateAccountCardSource}
                fileName="CreateAccountCard.tsx"
                language="tsx"
                stripImports={true}
              >
                <CreateAccountCard
                  enableTilt={false}
                  oidcProviders={[
                    { name: "GitHub", onClick: () => alert("GitHub login") },
                    { name: "Google", onClick: () => alert("Google login") },
                  ]}
                  onLogin={(values) => console.log("Login:", values)}
                  onCreateAccount={() => alert("Create account")}
                />
              </CodeFlipCard>

              <CodeFlipCard
                sourceCode={MultiChoiceQuestionSource}
                fileName="MultiChoiceQuestion.tsx"
                language="tsx"
                stripImports={true}
              >
                <MultiChoiceQuestionCard
                  enableTilt={false}
                  question="What's your favorite synthwave artist?"
                  options={["The Midnight", "Carpenter Brut", "FM-84", "Gunship"]}
                  onChange={(value) => console.log("Selected:", value)}
                />
              </CodeFlipCard>
            </div>
          </CardContent>
          <ImportFooter sourceCode={CreateAccountCardSource} />
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
