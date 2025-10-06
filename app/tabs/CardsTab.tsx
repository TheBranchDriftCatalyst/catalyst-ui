import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { CreateAccountCard } from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard";
import MultiChoiceQuestionCard from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion";

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
      <Card>
        <CardHeader>
          <CardTitle>Card Components</CardTitle>
          <CardDescription>
            Base card primitives, flip card components, and complex card implementations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* SECTION 1: Card Primitive */}
      <Card>
        <CardHeader>
          <CardTitle>Card Primitive</CardTitle>
          <CardDescription>
            Base card component with header, content, and footer slots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeFlipCard
            sourceCode={CardPrimitiveDemoSource}
            fileName="CardPrimitiveDemo.tsx"
            language="tsx"
            className="group"
          >
            <CardPrimitiveDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* SECTION 2: CodeFlipCard Component */}
      <Card>
        <CardHeader>
          <CardTitle>CodeFlipCard Component</CardTitle>
          <CardDescription>
            Interactive card that flips to show source code • Click cards below to see their implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Source */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Full Source Code</h4>
            <CodeFlipCard
              sourceCode={CodeFlipCardExampleDemoSource}
              fileName="CodeFlipCardExampleDemo.tsx"
              language="tsx"
              className="group"
            >
              <CodeFlipCardExampleDemo />
            </CodeFlipCard>
          </div>

          {/* Without Imports */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Source Without Imports</h4>
            <CodeFlipCard
              sourceCode={CodeFlipCardExampleDemoSource}
              fileName="CodeFlipCardExampleDemo.tsx"
              language="tsx"
              stripImports={true}
              className="group"
            >
              <CodeFlipCardExampleDemo />
            </CodeFlipCard>
          </div>

          {/* Hover to Flip */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Hover to Flip</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={CodeFlipCardExampleDemoSource}
                fileName="CodeFlipCardExampleDemo.tsx"
                language="tsx"
                stripImports={true}
                flipTrigger="hover"
                className="group"
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
                className="group"
              >
                <CodeFlipCardExampleDemo />
              </CodeFlipCard>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Complex Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Complex Card Components</CardTitle>
          <CardDescription>
            Full-featured card components with forms, validation, and interactive elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CreateAccountCard - Full Source */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">CreateAccountCard - Full Source</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={CreateAccountCardSource}
                fileName="CreateAccountCard.tsx"
                language="tsx"
                className="group"
              >
                <CreateAccountCard
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
                className="group"
              >
                <MultiChoiceQuestionCard
                  question="What's your favorite synthwave artist?"
                  options={["The Midnight", "Carpenter Brut", "FM-84", "Gunship"]}
                  onChange={(value) => console.log("Selected:", value)}
                />
              </CodeFlipCard>
            </div>
          </div>

          {/* Without Imports */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Without Imports</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={CreateAccountCardSource}
                fileName="CreateAccountCard.tsx"
                language="tsx"
                stripImports={true}
                className="group"
              >
                <CreateAccountCard
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
                className="group"
              >
                <MultiChoiceQuestionCard
                  question="What's your favorite synthwave artist?"
                  options={["The Midnight", "Carpenter Brut", "FM-84", "Gunship"]}
                  onChange={(value) => console.log("Selected:", value)}
                />
              </CodeFlipCard>
            </div>
          </div>

          {/* Extracted Component Only */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Extracted Component Function</h4>
            <div className="flex justify-center">
              <CodeFlipCard
                sourceCode={CreateAccountCardSource}
                fileName="CreateAccountCard.tsx"
                language="tsx"
                extractFunction="CreateAccountCard"
                className="group"
              >
                <CreateAccountCard
                  oidcProviders={[
                    { name: "GitHub", onClick: () => alert("GitHub login") },
                    { name: "Google", onClick: () => alert("Google login") },
                  ]}
                  onLogin={(values) => console.log("Login:", values)}
                  onCreateAccount={() => alert("Create account")}
                />
              </CodeFlipCard>
            </div>
          </div>

          {/* Hover to Flip */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Hover to Flip</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={CreateAccountCardSource}
                fileName="CreateAccountCard.tsx"
                language="tsx"
                stripImports={true}
                flipTrigger="hover"
                className="group"
              >
                <CreateAccountCard
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
                flipTrigger="hover"
                className="group"
              >
                <MultiChoiceQuestionCard
                  question="What's your favorite synthwave artist?"
                  options={["The Midnight", "Carpenter Brut", "FM-84", "Gunship"]}
                  onChange={(value) => console.log("Selected:", value)}
                />
              </CodeFlipCard>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
