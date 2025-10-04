import "../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { ToggleVariantButton } from "@/catalyst-ui/contexts/Theme/ToggleDarkMode";
import { ChangeThemeDropdown } from "@/catalyst-ui/contexts/Theme/ChangeThemeDropdown";
import { Button } from "@/catalyst-ui/ui/button";
import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Checkbox } from "@/catalyst-ui/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/catalyst-ui/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/catalyst-ui/ui/select";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Progress } from "@/catalyst-ui/ui/progress";
import { Toggle } from "@/catalyst-ui/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/catalyst-ui/ui/accordion";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/catalyst-ui/ui/menubar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/catalyst-ui/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/catalyst-ui/ui/table";
import { CreateAccountCard } from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard";
import MultiChoiceQuestionCard from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import { useState } from "react";

function KitchenSink() {
  const [progress, setProgress] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);
  const [codeTheme, setCodeTheme] = useState("vitesse-dark");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [editableCode, setEditableCode] = useState(`async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Usage
const user = await fetchUserData('123');
console.log(user.name);`);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">Catalyst UI Kitchen Sink</Typography>
            <Typography variant="muted" className="mt-2">
              <a href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                → Open Storybook
              </a>
            </Typography>
          </div>
          <div className="flex gap-2 items-center">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Theme</MenubarTrigger>
                <ChangeThemeDropdown />
              </MenubarMenu>
            </Menubar>
            <ToggleVariantButton />
          </div>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Kitchen Sink</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Frameworks & Resources - Moved up */}
        <Card>
          <CardHeader>
            <CardTitle>Frameworks & Resources</CardTitle>
            <CardDescription>External libraries and tools powering this UI library</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Framework</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      React
                    </a>
                  </TableCell>
                  <TableCell>Framework</TableCell>
                  <TableCell>UI library for building component-based interfaces</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://www.radix-ui.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Radix UI
                    </a>
                  </TableCell>
                  <TableCell>Components</TableCell>
                  <TableCell>Unstyled, accessible component primitives</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Tailwind CSS
                    </a>
                  </TableCell>
                  <TableCell>Styling</TableCell>
                  <TableCell>Utility-first CSS framework (v4)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      shadcn/ui
                    </a>
                  </TableCell>
                  <TableCell>Components</TableCell>
                  <TableCell>Component patterns and design system</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://react-hook-form.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      React Hook Form
                    </a>
                  </TableCell>
                  <TableCell>Forms</TableCell>
                  <TableCell>Performant form validation with Zod integration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://d3js.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      D3.js
                    </a>
                  </TableCell>
                  <TableCell>Visualization</TableCell>
                  <TableCell>Data-driven document manipulation and SVG graphics</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Vite
                    </a>
                  </TableCell>
                  <TableCell>Build Tool</TableCell>
                  <TableCell>Fast development server and optimized builds</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Storybook
                    </a>
                  </TableCell>
                  <TableCell>Development</TableCell>
                  <TableCell>Component development and documentation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      TypeScript
                    </a>
                  </TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Type-safe JavaScript with enhanced tooling</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Lucide Icons
                    </a>
                  </TableCell>
                  <TableCell>Icons</TableCell>
                  <TableCell>Open-source icon set with React components</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://shiki.style" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Shiki
                    </a>
                  </TableCell>
                  <TableCell>Syntax Highlighting</TableCell>
                  <TableCell>VS Code-quality syntax highlighting using TextMate grammars</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Various text styles and headings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Typography variant="h1" className="text-primary border-b-2 border-primary pb-2">Heading 1</Typography>
            <Typography variant="h2" className="text-secondary tracking-tight">Heading 2</Typography>
            <Typography variant="h3" className="text-accent-foreground font-semibold">Heading 3</Typography>
            <Typography variant="h4" className="tracking-wide">Heading 4</Typography>
            <Typography variant="p" className="leading-relaxed">This is a paragraph with some text content.</Typography>
            <Typography variant="blockquote" className="text-muted-foreground border-l-4 border-primary pl-4 italic">This is a blockquote element.</Typography>
            <Typography variant="code" className="text-primary bg-primary/10 px-2 py-1 rounded">const code = "inline code";</Typography>
            <Typography variant="lead" className="text-secondary font-medium tracking-tight">This is lead text for emphasis.</Typography>
            <Typography variant="muted" className="text-xs">This is muted text.</Typography>
          </CardContent>
        </Card>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>All button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🔥</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Input fields and form controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm font-normal">Accept terms and conditions</Label>
            </div>
          </CardContent>
        </Card>

        {/* Select & Radio Section */}
        <Card>
          <CardHeader>
            <CardTitle>Select & Radio</CardTitle>
            <CardDescription>Dropdown and radio controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Framework</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Choose an option</Label>
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">Option Three</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Slider & Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Slider & Progress</CardTitle>
            <CardDescription>Interactive controls and progress indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Slider Value: {sliderValue[0]}</Label>
              <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Progress: {progress}%</Label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-</Button>
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+</Button>
                </div>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {/* Avatar & Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars & Toggles</CardTitle>
            <CardDescription>User avatars and toggle switches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-2">
              <Toggle>Toggle 1</Toggle>
              <Toggle>Toggle 2</Toggle>
              <Toggle>Toggle 3</Toggle>
            </div>
          </CardContent>
        </Card>

        {/* Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Accordion</CardTitle>
            <CardDescription>Expandable content sections</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that match the other components.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Data table component</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>Developer</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>Designer</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bob Johnson</TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Away</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Code Block Section */}
        <Card>
          <CardHeader>
            <CardTitle>Code Block</CardTitle>
            <CardDescription>Syntax highlighting with Shiki (VS Code quality)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Typography variant="h4" className="text-sm font-semibold">Static Example</Typography>
              <CodeBlock
                code={`import React from 'react';

export function HelloWorld() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <h1>Hello, Catalyst UI! 🚀</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
                language="tsx"
                fileName="HelloWorld.tsx"
                theme="vitesse-dark"
                showLineNumbers={true}
                showCopyButton={true}
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <Typography variant="h4" className="text-sm font-semibold">Fully Interactive Example</Typography>
                <Typography variant="muted" className="text-xs">
                  ✏️ Click pencil to edit • 🎨 Change theme • #️⃣ Toggle line numbers
                </Typography>
              </div>
              <CodeBlock
                code={editableCode}
                language="typescript"
                fileName="api.ts"
                theme={codeTheme}
                showLineNumbers={showLineNumbers}
                showCopyButton={true}
                interactive={true}
                editable={true}
                onCodeChange={setEditableCode}
                onThemeChange={setCodeTheme}
                onLineNumbersChange={setShowLineNumbers}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <CreateAccountCard
            oidcProviders={[
              { name: "GitHub", onClick: () => alert("GitHub login") },
              { name: "Google", onClick: () => alert("Google login") },
            ]}
          />
          <MultiChoiceQuestionCard
            question="What's your favorite synthwave artist?"
            options={["The Midnight", "Carpenter Brut", "FM-84", "Gunship"]}
            onChange={(value) => console.log("Selected:", value)}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <KitchenSink />
    </ThemeProvider>
  );
}

export default App;
