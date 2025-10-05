import "../lib/global.css";
import { ThemeProvider } from "@/catalyst-ui/contexts/Theme/ThemeProvider";
import { ToggleVariantButton } from "@/catalyst-ui/contexts/Theme/ToggleDarkMode";
import { ChangeThemeDropdown } from "@/catalyst-ui/contexts/Theme/ChangeThemeDropdown";
import { CatalystHeader } from "@/catalyst-ui/components/CatalystHeader/CatalystHeader";
import { HeaderProvider } from "@/catalyst-ui/components/CatalystHeader/HeaderProvider";
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
import { Menubar } from "@/catalyst-ui/ui/menubar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/catalyst-ui/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { CreateAccountCard } from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard";
import MultiChoiceQuestionCard from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import { ForceGraph } from "@/catalyst-ui/components/ForceGraph";
import type { GraphData } from "@/catalyst-ui/components/ForceGraph";
import JsonTreeView from "@/catalyst-ui/components/ForceGraph/components/JsonTreeView";
import { MermaidFlowChartGraph } from "@/catalyst-ui/components/MermaidForceGraph";
import { DesignTokenDocBlock } from "storybook-design-token";
import { useState, useEffect } from "react";

function KitchenSink() {
  // Read initial tab from URL params
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [progress, setProgress] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);
  const [codeTheme, setCodeTheme] = useState("catalyst");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [selectedMermaid, setSelectedMermaid] = useState("solar");
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

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'overview';
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigationItems = [
    <a key="storybook" href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
      Storybook
    </a>,
    <Menubar key="theme">
      <ChangeThemeDropdown />
    </Menubar>,
    <ToggleVariantButton key="variant" />,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CatalystHeader
        title="Catalyst UI Kitchen Sink"
        navigationItems={navigationItems}
      />
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        {/* Tabbed Component Library */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forcegraph">Force Graph</TabsTrigger>
            <TabsTrigger value="mermaid">Mermaid</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
        {/* Frameworks & Resources */}
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
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4">
            {/* Neon Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Neon Color Palette</CardTitle>
                <CardDescription>Cybersynthpunk accent colors with live examples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-cyan)', boxShadow: 'var(--glow-primary)' }} />
                    <div className="text-sm font-mono">--neon-cyan</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-purple)', boxShadow: 'var(--glow-secondary)' }} />
                    <div className="text-sm font-mono">--neon-purple</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-pink)', boxShadow: '0 0 20px var(--neon-pink)' }} />
                    <div className="text-sm font-mono">--neon-pink</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-blue)', boxShadow: '0 0 20px var(--neon-blue)' }} />
                    <div className="text-sm font-mono">--neon-blue</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-red)', boxShadow: '0 0 20px var(--neon-red)' }} />
                    <div className="text-sm font-mono">--neon-red</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-yellow)', boxShadow: '0 0 20px var(--neon-yellow)' }} />
                    <div className="text-sm font-mono">--neon-yellow</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--neon-gold)', boxShadow: '0 0 20px var(--neon-gold)' }} />
                    <div className="text-sm font-mono">--neon-gold</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Glow Effects */}
            <Card>
              <CardHeader>
                <CardTitle>Glow Effects</CardTitle>
                <CardDescription>Cyberpunk shadow glows for depth and atmosphere</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-24 rounded-lg bg-primary/20 flex items-center justify-center" style={{ boxShadow: 'var(--glow-primary)' }}>
                      <span className="text-sm font-mono">--glow-primary</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-24 rounded-lg bg-secondary/20 flex items-center justify-center" style={{ boxShadow: 'var(--glow-secondary)' }}>
                      <span className="text-sm font-mono">--glow-secondary</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-24 rounded-lg bg-accent/20 flex items-center justify-center" style={{ boxShadow: 'var(--glow-accent)' }}>
                      <span className="text-sm font-mono">--glow-accent</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-24 rounded-lg bg-primary/20 flex items-center justify-center" style={{ boxShadow: 'var(--glow-hover)' }}>
                      <span className="text-sm font-mono">--glow-hover</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Neon Shadows */}
            <Card>
              <CardHeader>
                <CardTitle>Neon Shadow System</CardTitle>
                <CardDescription>Multi-layered elevation shadows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-32 rounded-lg bg-card flex items-center justify-center" style={{ boxShadow: 'var(--shadow-neon-sm)' }}>
                      <span className="text-sm font-mono">--shadow-neon-sm</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 rounded-lg bg-card flex items-center justify-center" style={{ boxShadow: 'var(--shadow-neon-md)' }}>
                      <span className="text-sm font-mono">--shadow-neon-md</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-32 rounded-lg bg-card flex items-center justify-center" style={{ boxShadow: 'var(--shadow-neon-lg)' }}>
                      <span className="text-sm font-mono">--shadow-neon-lg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography Fonts */}
            <Card>
              <CardHeader>
                <CardTitle>Cybersynthpunk Typography</CardTitle>
                <CardDescription>Custom Google Fonts for unique aesthetic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Display Font (Headings)</div>
                  <div className="text-4xl font-display uppercase tracking-wider">Orbitron - Futuristic & Bold</div>
                  <code className="text-xs">font-family: 'Orbitron', sans-serif</code>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Body Font</div>
                  <div className="text-2xl font-sans">Rajdhani - Condensed & Modern</div>
                  <code className="text-xs">font-family: 'Rajdhani', sans-serif</code>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monospace Font (Code)</div>
                  <div className="text-xl font-mono">Space Mono - Technical & Retro</div>
                  <code className="text-xs">font-family: 'Space Mono', monospace</code>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Generated Token List */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Design Token Reference</CardTitle>
                <CardDescription>Auto-generated from CSS annotations • All tokens documented</CardDescription>
              </CardHeader>
              <CardContent>
                <DesignTokenDocBlock
                  viewType="table"
                  maxHeight={600}
                />
              </CardContent>
            </Card>

            {/* Usage Examples */}
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
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4">
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
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-4">
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
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4">
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
            <CardDescription>
              Syntax highlighting with Shiki (VS Code quality) • ✏️ Click pencil to edit • 🎨 Change theme • #️⃣ Toggle line numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* JSON Tree View Section */}
        <Card>
          <CardHeader>
            <CardTitle>JSON Tree View</CardTitle>
            <CardDescription>
              Collapsible JSON viewer with syntax highlighting • Click arrows to expand/collapse nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JsonTreeView
              data={{
                name: "catalyst-ui",
                version: "0.2.0",
                type: "library",
                features: {
                  components: ["ForceGraph", "CodeBlock", "JsonTreeView"],
                  themes: ["catalyst", "dracula", "gold", "nature", "netflix", "nord", "laracon"],
                  ui_primitives: ["button", "dialog", "tooltip", "dropdown-menu", "toast"],
                },
                config: {
                  storybook: true,
                  typescript: true,
                  tailwind_version: "v4",
                },
                stats: {
                  components_count: 15,
                  stories_count: 12,
                  themes_count: 7,
                },
              }}
              rootName="package"
              initialExpanded={["package", "package.features"]}
            />
          </CardContent>
        </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
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
          </TabsContent>

          {/* Force Graph Tab */}
          <TabsContent value="forcegraph" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Force Graph Visualization</CardTitle>
            <CardDescription>
              Interactive graph with D3.js force simulation, advanced filtering, and Docker resource visualization.
              Click the ⚙️ icon to open the filter panel and experiment with all filtering features!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[800px] w-full relative">
              <ForceGraph data={(() => {
                // Comprehensive dataset demonstrating all filtering features
                const nodes: GraphData['nodes'] = {};
                const edges: any[] = [];

                // Running containers
                for (let i = 0; i < 3; i++) {
                  nodes[`running-${i}`] = {
                    id: `running-${i}`,
                    kind: 'container',
                    name: `prod-service-${i}`,
                    attributes: {
                      status: 'running',
                      image: `service:v${i}`,
                    },
                  };
                }

                // Stopped containers
                for (let i = 0; i < 2; i++) {
                  nodes[`stopped-${i}`] = {
                    id: `stopped-${i}`,
                    kind: 'container',
                    name: `old-service-${i}`,
                    attributes: {
                      status: 'stopped',
                      image: `old:v${i}`,
                    },
                  };
                }

                // Images (some orphaned)
                for (let i = 0; i < 5; i++) {
                  nodes[`image-${i}`] = {
                    id: `image-${i}`,
                    kind: 'image',
                    name: `image-${i}`,
                    attributes: {
                      tags: `image-${i}:latest`,
                      size: '150000000',
                    },
                  };
                }

                // Networks (including system)
                nodes['network-user'] = {
                  id: 'network-user',
                  kind: 'network',
                  name: 'app_network',
                  attributes: { driver: 'bridge', scope: 'local' },
                };
                nodes['network-bridge'] = {
                  id: 'network-bridge',
                  kind: 'network',
                  name: 'bridge',
                  attributes: { driver: 'bridge', scope: 'local', system: true },
                };

                // Volumes (some in-use)
                nodes['volume-active'] = {
                  id: 'volume-active',
                  kind: 'volume',
                  name: 'data_volume',
                  attributes: {
                    driver: 'local',
                    status: 'in-use',
                    mountpoint: '/var/lib/docker/volumes/data_volume/_data',
                  },
                };
                nodes['volume-orphaned'] = {
                  id: 'volume-orphaned',
                  kind: 'volume',
                  name: 'old_volume',
                  attributes: {
                    driver: 'local',
                    mountpoint: '/var/lib/docker/volumes/old_volume/_data',
                  },
                };

                // Connect running containers
                for (let i = 0; i < 3; i++) {
                  edges.push({
                    src: `running-${i}`,
                    dst: `image-${i}`,
                    kind: 'derived_from',
                    source: nodes[`running-${i}`],
                    target: nodes[`image-${i}`],
                  });
                  edges.push({
                    src: `running-${i}`,
                    dst: 'network-user',
                    kind: 'connected_to',
                    attributes: { ip: `172.25.0.${i + 2}` },
                    source: nodes[`running-${i}`],
                    target: nodes['network-user'],
                  });
                }

                // Mount volume to first running container
                edges.push({
                  src: 'running-0',
                  dst: 'volume-active',
                  kind: 'mounted_into',
                  attributes: { target: '/data', rw: 'true' },
                  source: nodes['running-0'],
                  target: nodes['volume-active'],
                });

                // image-3 and image-4 are orphaned (no containers using them)
                // volume-orphaned is orphaned (no containers mounting it)

                return { nodes, edges };
              })()} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
            <Typography variant="h4" className="text-sm font-semibold">Features to Try:</Typography>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Filter Panel</strong> - Click ⚙️ to open advanced filtering options</li>
              <li><strong>Quick Presets</strong> - Try "🔍 Orphaned", "▶️ Running", or "🎯 Minimal" filters</li>
              <li><strong>Search</strong> - Search nodes by name or ID in the filter panel</li>
              <li><strong>Node Types</strong> - Toggle visibility of containers, images, networks, volumes</li>
              <li><strong>Edge Types</strong> - Show/hide derived_from, connected_to, mounted_into relationships</li>
              <li><strong>Status Filters</strong> - Filter containers by running/stopped status</li>
              <li><strong>Advanced Filters</strong> - Hide system resources, show in-use only, etc.</li>
              <li><strong>Interactions</strong> - Drag nodes, zoom/pan, click for details, right-click to exclude</li>
            </ul>
          </CardFooter>
        </Card>
          </TabsContent>

          {/* Mermaid Graphs Tab */}
          <TabsContent value="mermaid" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Mermaid Flowchart → ForceGraph</CardTitle>
            <CardDescription>
              Convert Mermaid flowchart diagrams to interactive force-directed graphs automatically.
              Select an example below or create your own .mmd file!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Select Example:</Label>
              <Select value={selectedMermaid} onValueChange={setSelectedMermaid}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">Solar Power System</SelectItem>
                  <SelectItem value="basic">Basic Flowchart</SelectItem>
                  <SelectItem value="network">Network Topology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[700px] w-full relative border-2 border-primary/20 rounded-lg overflow-hidden">
              {selectedMermaid === "solar" && (
                <MermaidFlowChartGraph
                  filename="/mermaid/solar-system.mmd"
                  configuratorOptions={{
                    title: "SOLAR POWER SYSTEM",
                    colorStrategy: 'subgraph',
                  }}
                />
              )}
              {selectedMermaid === "basic" && (
                <MermaidFlowChartGraph
                  mermaidText={`flowchart TB
      A[Start] --> B{Is it working?}
      B -->|Yes| C[Great!]
      B -->|No| D[Fix it]
      D --> B
      C --> E[End]`}
                  configuratorOptions={{
                    title: "BASIC FLOWCHART",
                  }}
                />
              )}
              {selectedMermaid === "network" && (
                <MermaidFlowChartGraph
                  mermaidText={`flowchart TB
      subgraph "DMZ"
        LB[Load Balancer]
        Web1[Web Server 1]
        Web2[Web Server 2]
      end

      subgraph "Internal Network"
        App1[App Server 1]
        App2[App Server 2]
        DB[(Database Cluster)]
        Cache[(Redis Cache)]
      end

      Internet[Internet] --> LB
      LB --> Web1
      LB --> Web2
      Web1 --> App1
      Web2 --> App2
      App1 --> DB
      App2 --> DB
      App1 --> Cache
      App2 --> Cache`}
                  configuratorOptions={{
                    title: "NETWORK TOPOLOGY",
                    colorStrategy: 'subgraph',
                  }}
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
            <Typography variant="h4" className="text-sm font-semibold">How it Works:</Typography>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Auto-Detection</strong> - Node types detected from Mermaid shapes (rectangles, diamonds, circles, etc.)</li>
              <li><strong>Subgraph Grouping</strong> - Subgraphs become node categories with coordinated colors</li>
              <li><strong>Edge Types</strong> - Solid ({'-->'}{')'} and dotted ({'.->'}{')'} arrows mapped to different edge styles</li>
              <li><strong>Fully Interactive</strong> - Drag nodes, zoom/pan, filter, and explore just like regular ForceGraph</li>
              <li><strong>Custom Styling</strong> - Override colors, icons, and labels via configuratorOptions prop</li>
            </ul>
          </CardFooter>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <KitchenSink />
      </HeaderProvider>
    </ThemeProvider>
  );
}

export default App;
