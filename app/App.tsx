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
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";

// Import card source code as raw strings
import CreateAccountCardSource from "@/catalyst-ui/cards/CreateAccountCard/CreateAccountCard.tsx?raw";
import MultiChoiceQuestionSource from "@/catalyst-ui/cards/MultiChoiceQuetion/MultiChoiceQuestion.tsx?raw";
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
  const [selectedGraphExample, setSelectedGraphExample] = useState("docker");
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CatalystHeader
          title="CATALYST"
          navigationItems={navigationItems}
          tabs={
            <TabsList className="inline-flex h-auto items-center gap-1 bg-transparent p-0">
              <TabsTrigger value="overview" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tokens" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Tokens
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Type
              </TabsTrigger>
              <TabsTrigger value="forms" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Forms
              </TabsTrigger>
              <TabsTrigger value="display" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Display
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Cards
              </TabsTrigger>
              <TabsTrigger value="forcegraph" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                ForceGraph
              </TabsTrigger>
              <TabsTrigger value="animations" className="text-xs md:text-sm px-2 md:px-3 py-1.5 data-[state=active]:shadow-[0_2px_0_0_var(--primary)]">
                Animations
              </TabsTrigger>
            </TabsList>
          }
        />
        <div className="w-full p-6 md:p-8">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-0">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Catalyst UI 👋</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="lead" className="text-foreground/90">
              Hey there! I'm building a component library that brings together modern React patterns with a cybersynthpunk aesthetic.
              This is my playground for experimenting with UI primitives, data visualization, and developer experience.
            </Typography>
            <Typography variant="p" className="text-muted-foreground leading-relaxed">
              <strong>What you'll find here:</strong> Accessible components built on Radix UI, styled with Tailwind v4,
              complete with interactive D3.js visualizations, multiple theme variants (from synthwave to nature-inspired palettes),
              and a robust development workflow powered by Storybook and Vite. Everything is TypeScript-first with form validation via React Hook Form + Zod.
            </Typography>
            <Typography variant="p" className="text-muted-foreground leading-relaxed">
              <strong>Why I built this:</strong> I wanted a reusable component system that doesn't compromise on accessibility,
              performance, or aesthetics. This library is part of my larger catalyst-devspace monorepo where I explore
              infrastructure automation, Python utilities, and full-stack development patterns. It's open-source, constantly evolving,
              and built with real-world use cases in mind.
            </Typography>
            <Typography variant="muted" className="text-xs italic">
              Feel free to explore the tabs above to see design tokens, interactive cards, force graph visualizations, and more.
              The source code is available on GitHub if you want to dive deeper or contribute!
            </Typography>
          </CardContent>
        </Card>

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
                <TableRow className="transition-colors hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">
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
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://zod.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Zod
                    </a>
                  </TableCell>
                  <TableCell>Validation</TableCell>
                  <TableCell>TypeScript-first schema validation with static type inference</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/UX-and-I/storybook-design-token" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Storybook Design Token
                    </a>
                  </TableCell>
                  <TableCell>Documentation</TableCell>
                  <TableCell>Auto-generates design token documentation from CSS annotations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://eclipse.dev/elk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ELKjs
                    </a>
                  </TableCell>
                  <TableCell>Graph Layout</TableCell>
                  <TableCell>Hierarchical graph layout engine from Eclipse Layout Kernel</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/dagrejs/dagre" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Dagre
                    </a>
                  </TableCell>
                  <TableCell>Graph Layout</TableCell>
                  <TableCell>Directed graph layout library for network visualizations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://cva.style" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      CVA
                    </a>
                  </TableCell>
                  <TableCell>Styling</TableCell>
                  <TableCell>Class Variance Authority for type-safe component variants</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/ddsol/tailwind-merge" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Tailwind Merge
                    </a>
                  </TableCell>
                  <TableCell>Utilities</TableCell>
                  <TableCell>Intelligently merges Tailwind CSS classes without conflicts</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/ddollar/foreman" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Foreman
                    </a>
                  </TableCell>
                  <TableCell>Development</TableCell>
                  <TableCell>Process manager for running multiple dev services (Procfile.dev)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      TanStack Table
                    </a>
                  </TableCell>
                  <TableCell>Components</TableCell>
                  <TableCell>Headless UI for building powerful tables & datagrids</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/nodeca/js-yaml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      js-yaml
                    </a>
                  </TableCell>
                  <TableCell>Parsing</TableCell>
                  <TableCell>YAML parser for Mermaid diagram files and configuration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://typicode.github.io/husky" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Husky
                    </a>
                  </TableCell>
                  <TableCell>Git Hooks</TableCell>
                  <TableCell>Modern Git hooks for enforcing code quality on commits</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://commitlint.js.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Commitlint
                    </a>
                  </TableCell>
                  <TableCell>Git Hooks</TableCell>
                  <TableCell>Lint commit messages to follow conventional commit format</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://github.com/conventional-changelog/standard-version" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Standard Version
                    </a>
                  </TableCell>
                  <TableCell>Versioning</TableCell>
                  <TableCell>Automated semantic versioning and CHANGELOG generation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://eslint.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ESLint
                    </a>
                  </TableCell>
                  <TableCell>Code Quality</TableCell>
                  <TableCell>Pluggable linting utility for JavaScript and TypeScript</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a href="https://prettier.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Prettier
                    </a>
                  </TableCell>
                  <TableCell>Code Quality</TableCell>
                  <TableCell>Opinionated code formatter for consistent style</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4 mt-0">
            {/* Neon Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Neon Color Palette</CardTitle>
                <CardDescription>Cybersynthpunk accent colors with live examples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 group">
                    <div className="h-20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer" style={{ backgroundColor: 'var(--neon-cyan)', boxShadow: 'var(--glow-primary)' }} />
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

            {/* Typography Fonts - Dynamic */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Typography</CardTitle>
                <CardDescription>Fonts change with each theme for unique aesthetics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Display Font (Headings)</div>
                  <div className="text-4xl uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                    The Quick Brown Fox
                  </div>
                  <code className="text-xs">var(--font-heading)</code>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Body Font</div>
                  <div className="text-2xl" style={{ fontFamily: 'var(--font-body)' }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <code className="text-xs">var(--font-body)</code>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monospace Font (Code)</div>
                  <div className="text-xl" style={{ fontFamily: 'var(--font-mono)' }}>
                    const code = "monospace";
                  </div>
                  <code className="text-xs">var(--font-mono)</code>
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
          <TabsContent value="typography" className="space-y-4 mt-0">
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
          <TabsContent value="forms" className="space-y-4 mt-0">
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
          <TabsContent value="display" className="space-y-4 mt-0">
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
          <TabsContent value="cards" className="space-y-4 mt-0">
        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Card Components</CardTitle>
            <CardDescription>
              Click any card to flip and view its source code • Try different examples with various configurations
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Cards Section - Full Source */}
        <Card>
          <CardHeader>
            <CardTitle>Full Source Code</CardTitle>
            <CardDescription>Click cards to view complete source code</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Cards Section - Without Imports */}
        <Card>
          <CardHeader>
            <CardTitle>Source Without Imports</CardTitle>
            <CardDescription>Same cards with imports stripped for cleaner view</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Cards Section - Component Only */}
        <Card>
          <CardHeader>
            <CardTitle>Extracted Component</CardTitle>
            <CardDescription>View only the main component function (CreateAccountCard)</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Cards Section - Hover to Flip */}
        <Card>
          <CardHeader>
            <CardTitle>Hover to Flip</CardTitle>
            <CardDescription>These cards flip on hover instead of click</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-4 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>CSS Animations</CardTitle>
            <CardDescription>
              Ultra-subtle animations from the Catalyst theme • Hover to see effects • Best viewed in dark mode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Border Shimmer */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Border Shimmer</Label>
              <div
                className="h-32 rounded-lg border-2 flex items-center justify-center text-sm"
                style={{
                  borderColor: 'var(--primary)',
                  animation: 'border-shimmer 8s linear infinite',
                  background: 'linear-gradient(90deg, transparent, rgba(var(--neon-cyan-rgb), 0.05), transparent)'
                }}
              >
                Subtle shimmer animation (8s loop)
              </div>
              <code className="text-xs text-muted-foreground">animation: border-shimmer 8s linear infinite</code>
            </div>

            {/* Laser Pulse */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Laser Pulse</Label>
              <div
                className="h-32 rounded-lg bg-card flex items-center justify-center text-sm"
                style={{
                  animation: 'laser-pulse 8s ease-in-out infinite'
                }}
              >
                Ultra-subtle pulsing glow (8s loop)
              </div>
              <code className="text-xs text-muted-foreground">animation: laser-pulse 8s ease-in-out infinite</code>
            </div>

            {/* Glitter */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Glitter / Sparkle</Label>
              <div
                className="h-32 rounded-lg bg-primary/10 border border-primary flex items-center justify-center text-sm relative overflow-hidden"
                style={{
                  animation: 'glitter 8s ease-in-out infinite'
                }}
              >
                Glimmer effect (8s loop)
              </div>
              <code className="text-xs text-muted-foreground">animation: glitter 8s ease-in-out infinite</code>
            </div>

            {/* Border Scan */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Border Scan</Label>
              <div
                className="h-32 rounded-lg border-2 border-primary/30 flex items-center justify-center text-sm relative"
                style={{
                  animation: 'border-scan 4s linear infinite'
                }}
              >
                Traveling light along border (4s loop)
              </div>
              <code className="text-xs text-muted-foreground">animation: border-scan 4s linear infinite</code>
            </div>

            {/* Neon Underline */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Neon Underline (for links)</Label>
              <div className="h-32 flex items-center justify-center">
                <a
                  href="#"
                  className="text-2xl relative inline-block"
                  style={{
                    animation: 'neon-underline 4s ease-in-out infinite'
                  }}
                >
                  Hover me for subtle glow
                </a>
              </div>
              <code className="text-xs text-muted-foreground">animation: neon-underline 4s ease-in-out infinite</code>
            </div>

            {/* Hover Card Demo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Card Hover Effect</Label>
              <Card className="hover:shadow-[var(--shadow-neon-lg)] transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Hover to see the laser-pulse animation</CardDescription>
                </CardHeader>
                <CardContent>
                  In the Catalyst dark theme, cards automatically get the laser-pulse animation on hover.
                  This creates a very subtle, almost imperceptible glow that adds depth.
                </CardContent>
              </Card>
              <code className="text-xs text-muted-foreground">.theme-catalyst.dark [class*="card"]:hover</code>
            </div>

            {/* Button Shimmer */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Button Shimmer on Hover</Label>
              <div className="flex gap-4">
                <Button className="relative overflow-hidden">
                  Hover for shimmer
                </Button>
                <Button variant="outline" className="relative overflow-hidden">
                  Outline variant
                </Button>
                <Button variant="secondary" className="relative overflow-hidden">
                  Secondary variant
                </Button>
              </div>
              <code className="text-xs text-muted-foreground">Buttons get button-shimmer animation on hover (applied via theme CSS)</code>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
            <Typography variant="h4" className="text-sm font-semibold">Animation Design Philosophy:</Typography>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Ultra-Subtle</strong> - Opacity values reduced by 60-85% for barely perceptible effects</li>
              <li><strong>Slow Timing</strong> - 4-10 second durations to avoid being distracting</li>
              <li><strong>Theme-Specific</strong> - Only applied in Catalyst theme for cybersynthpunk aesthetic</li>
              <li><strong>Performance</strong> - Uses GPU-accelerated properties (box-shadow, opacity, transform)</li>
              <li><strong>Contextual</strong> - Applied on hover or specific elements to add depth without overwhelming</li>
            </ul>
          </CardFooter>
        </Card>
          </TabsContent>

          {/* Force Graph Tab */}
          <TabsContent value="forcegraph" className="space-y-4 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Force Graph Visualization</CardTitle>
            <CardDescription>
              Interactive graph with D3.js force simulation • Docker resource visualization • Mermaid flowchart converter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Select Example:</Label>
              <Select value={selectedGraphExample} onValueChange={setSelectedGraphExample}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docker">Docker Resources (Advanced Filtering)</SelectItem>
                  <SelectItem value="mermaid-solar">Mermaid: Solar Power System</SelectItem>
                  <SelectItem value="mermaid-basic">Mermaid: Basic Flowchart</SelectItem>
                  <SelectItem value="mermaid-network">Mermaid: Network Topology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[800px] w-full relative border-2 border-primary/20 rounded-lg overflow-hidden">
              {selectedGraphExample === "docker" && (
              <ForceGraph
                storageKey={`catalyst-ui.forcegraph.${selectedGraphExample}`}
                data={(() => {
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
              )}

              {selectedGraphExample === "mermaid-solar" && (
                <MermaidFlowChartGraph
                  filename="/mermaid/solar-system.mmd"
                  configuratorOptions={{
                    title: "SOLAR POWER SYSTEM",
                    colorStrategy: 'subgraph',
                  }}
                  forceGraphProps={{
                    storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                  }}
                />
              )}

              {selectedGraphExample === "mermaid-basic" && (
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
                  forceGraphProps={{
                    storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                  }}
                />
              )}

              {selectedGraphExample === "mermaid-network" && (
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
                  forceGraphProps={{
                    storageKey: `catalyst-ui.forcegraph.${selectedGraphExample}`
                  }}
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
            {selectedGraphExample === "docker" && (
              <>
                <Typography variant="h4" className="text-sm font-semibold">Docker Resources Features:</Typography>
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
              </>
            )}
            {selectedGraphExample.startsWith("mermaid") && (
              <>
                <Typography variant="h4" className="text-sm font-semibold">Mermaid Converter Features:</Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>Auto-Detection</strong> - Node types detected from Mermaid shapes (rectangles, diamonds, circles, etc.)</li>
                  <li><strong>Subgraph Grouping</strong> - Subgraphs become node categories with coordinated colors</li>
                  <li><strong>Edge Types</strong> - Solid ({'-->'}{')'} and dotted ({'.->'}{')'} arrows mapped to different edge styles</li>
                  <li><strong>Fully Interactive</strong> - Drag nodes, zoom/pan, filter, and explore just like regular ForceGraph</li>
                  <li><strong>Custom Styling</strong> - Override colors, icons, and labels via configuratorOptions prop</li>
                  <li><strong>File Support</strong> - Load from .mmd files or provide inline mermaidText</li>
                </ul>
              </>
            )}
          </CardFooter>
        </Card>
          </TabsContent>
        </div>
      </Tabs>
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
