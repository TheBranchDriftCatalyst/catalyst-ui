import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { ImportFooter } from "../shared/ImportFooter";

// Import demo components and their source code
import { AccordionDemo } from "../demos/AccordionDemo";
import AccordionDemoSource from "../demos/AccordionDemo.tsx?raw";

import { TableDemo } from "../demos/TableDemo";
import TableDemoSource from "../demos/TableDemo.tsx?raw";

import { CodeBlockDemo } from "../demos/CodeBlockDemo";
import CodeBlockDemoSource from "../demos/CodeBlockDemo.tsx?raw";

import { JsonTreeViewDemo } from "../demos/JsonTreeViewDemo";
import JsonTreeViewDemoSource from "../demos/JsonTreeViewDemo.tsx?raw";

export function DisplayTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Accordion */}
      <CodeFlipCard
        sourceCode={AccordionDemoSource}
        fileName="AccordionDemo.tsx"
        language="tsx"
      >
        <Card>
          <CardHeader>
            <CardTitle>Accordion</CardTitle>
            <CardDescription>Expandable content sections with smooth animations • Click to view source</CardDescription>
          </CardHeader>
          <CardContent>
            <AccordionDemo />
          </CardContent>
          <ImportFooter sourceCode={AccordionDemoSource} />
        </Card>
      </CodeFlipCard>

      {/* Table */}
      <CodeFlipCard
        sourceCode={TableDemoSource}
        fileName="TableDemo.tsx"
        language="tsx"
      >
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Data table component with hover effects and row highlighting • Click to view source</CardDescription>
          </CardHeader>
          <CardContent>
            <TableDemo />
          </CardContent>
          <ImportFooter sourceCode={TableDemoSource} />
        </Card>
      </CodeFlipCard>

      {/* Code Block */}
      <CodeFlipCard
        sourceCode={CodeBlockDemoSource}
        fileName="CodeBlockDemo.tsx"
        language="tsx"
      >
        <Card>
          <CardHeader>
            <CardTitle>Code Block</CardTitle>
            <CardDescription>
              Syntax highlighting with Shiki (VS Code quality) • ✏️ Click pencil to edit • 🎨 Change theme • #️⃣ Toggle line numbers • Click to view source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlockDemo />
          </CardContent>
          <ImportFooter sourceCode={CodeBlockDemoSource} />
        </Card>
      </CodeFlipCard>

      {/* JSON Tree View */}
      <CodeFlipCard
        sourceCode={JsonTreeViewDemoSource}
        fileName="JsonTreeViewDemo.tsx"
        language="tsx"
      >
        <Card>
          <CardHeader>
            <CardTitle>JSON Tree View</CardTitle>
            <CardDescription>
              Collapsible JSON viewer with syntax highlighting • Click arrows to expand/collapse nodes • Click to view source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JsonTreeViewDemo />
          </CardContent>
          <ImportFooter sourceCode={JsonTreeViewDemoSource} />
        </Card>
      </CodeFlipCard>
    </div>
  );
}
