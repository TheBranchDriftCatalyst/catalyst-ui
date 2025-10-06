import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { CreateAccountCard } from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard";
import MultiChoiceQuestionCard from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion";

// Import card source code as raw strings
import CreateAccountCardSource from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard.tsx?raw";
import MultiChoiceQuestionSource from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion.tsx?raw";

const cardPrimitiveExample = `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";

export function CardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Footer Action</Button>
      </CardFooter>
    </Card>
  );
}`;

const codeFlipCardExample = `import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";

const sourceCode = \`function HelloWorld() {
  return <div>Hello World!</div>;
}\`;

export function CodeFlipCardDemo() {
  return (
    <CodeFlipCard
      sourceCode={sourceCode}
      fileName="HelloWorld.tsx"
      language="tsx"
      flipTrigger="click" // or "hover"
      stripImports={false}
      extractFunction="HelloWorld" // optional: extract specific function
    >
      <div>Your component here</div>
    </CodeFlipCard>
  );
}`;

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
            sourceCode={cardPrimitiveExample}
            fileName="CardDemo.tsx"
            language="tsx"
            className="group"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                  <CardDescription>Basic card with title and description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is a simple card with some content. Cards can contain any React components.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>With Footer</CardTitle>
                  <CardDescription>Card with footer actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards can have footers for actions or additional information.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Deploy</Button>
                </CardFooter>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">Styled Card</CardTitle>
                  <CardDescription>Custom styling with Tailwind</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards can be styled using Tailwind classes for custom borders, backgrounds, and more.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">Action</Button>
                </CardFooter>
              </Card>
            </div>
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
              sourceCode={codeFlipCardExample}
              fileName="CodeFlipCardDemo.tsx"
              language="tsx"
              className="group"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Click to Flip</CardTitle>
                  <CardDescription>View the complete source code including imports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    CodeFlipCard wraps any component and shows its source code when flipped.
                    Perfect for documentation and component showcases.
                  </p>
                </CardContent>
              </Card>
            </CodeFlipCard>
          </div>

          {/* Without Imports */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Source Without Imports</h4>
            <CodeFlipCard
              sourceCode={codeFlipCardExample}
              fileName="CodeFlipCardDemo.tsx"
              language="tsx"
              stripImports={true}
              className="group"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stripped Imports</CardTitle>
                  <CardDescription>stripImports prop removes import statements for cleaner view</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use <code className="text-primary">stripImports={'{true}'}</code> to show only the component logic.
                  </p>
                </CardContent>
              </Card>
            </CodeFlipCard>
          </div>

          {/* Hover to Flip */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Hover to Flip</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <CodeFlipCard
                sourceCode={codeFlipCardExample}
                fileName="CodeFlipCardDemo.tsx"
                language="tsx"
                stripImports={true}
                flipTrigger="hover"
                className="group"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Hover Me</CardTitle>
                    <CardDescription>flipTrigger="hover" for instant code preview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover over this card to see the code flip animation.
                    </p>
                  </CardContent>
                </Card>
              </CodeFlipCard>

              <CodeFlipCard
                sourceCode={codeFlipCardExample}
                fileName="CodeFlipCardDemo.tsx"
                language="tsx"
                stripImports={true}
                flipTrigger="hover"
                flipDirection="vertical"
                className="group"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Vertical Flip</CardTitle>
                    <CardDescription>flipDirection="vertical" for up/down animation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hover to see a vertical flip animation instead of horizontal.
                    </p>
                  </CardContent>
                </Card>
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
