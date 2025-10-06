import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import JsonTreeView from "@/catalyst-ui/components/ForceGraph/components/JsonTreeView";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";

// Import demo components and their source code
import { AccordionDemo } from "../demos/AccordionDemo";
import AccordionDemoSource from "../demos/AccordionDemo.tsx?raw";

import { TableDemo } from "../demos/TableDemo";
import TableDemoSource from "../demos/TableDemo.tsx?raw";

export function DisplayTab() {
  const [codeTheme, setCodeTheme] = useState("catalyst");
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
    <div className="space-y-4 mt-0">
      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>Expandable content sections with smooth animations • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={AccordionDemoSource}
            fileName="AccordionDemo.tsx"
            language="tsx"
            minHeight={150}
          >
            <AccordionDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Data table component with hover effects and row highlighting • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={TableDemoSource}
            fileName="TableDemo.tsx"
            language="tsx"
            minHeight={200}
          >
            <TableDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Code Block */}
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

      {/* JSON Tree View */}
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
    </div>
  );
}
