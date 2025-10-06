import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/catalyst-ui/ui/table";

export function OverviewTab() {
  return (
    <div className="space-y-4 mt-0">
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
    </div>
  );
}
