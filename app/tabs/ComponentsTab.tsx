import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { ImportFooter } from "@/catalyst-ui/components/CodeFlipCard/ImportFooter";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

// Import demo components and their source code
import { DialogDemo } from "../demos/DialogDemo";
import DialogDemoSource from "../demos/DialogDemo.tsx?raw";

import { DropdownMenuDemo } from "../demos/DropdownMenuDemo";
import DropdownMenuDemoSource from "../demos/DropdownMenuDemo.tsx?raw";

import { TooltipDemo } from "../demos/TooltipDemo";
import TooltipDemoSource from "../demos/TooltipDemo.tsx?raw";

import { ToastDemo } from "../demos/ToastDemo";
import ToastDemoSource from "../demos/ToastDemo.tsx?raw";

import { SheetDemo } from "../demos/SheetDemo";
import SheetDemoSource from "../demos/SheetDemo.tsx?raw";

export function ComponentsTab() {
  return (
    <div className="space-y-4 mt-0">
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
            <CardDescription>
              Dynamic overlay components with CodeFlipCard wrappers • Click cards to view source
              code • Try the interactive demos
            </CardDescription>
          </CardHeader>
        </Card>
      </ScrollSnapItem>

      {/* Dialog Component */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={DialogDemoSource} fileName="DialogDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
              <CardDescription>
                A modal dialog component with overlay and focus management • Click card to view
                source
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <DialogDemo />
            </CardContent>
            <ImportFooter sourceCode={DialogDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Dropdown Menu Component */}
      <ScrollSnapItem align="start">
        <CodeFlipCard
          sourceCode={DropdownMenuDemoSource}
          fileName="DropdownMenuDemo.tsx"
          language="tsx"
        >
          <Card>
            <CardHeader>
              <CardTitle>Dropdown Menu</CardTitle>
              <CardDescription>
                A menu component with keyboard navigation and portal rendering • Click card to view
                source
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <DropdownMenuDemo />
            </CardContent>
            <ImportFooter sourceCode={DropdownMenuDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Tooltip Component */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={TooltipDemoSource} fileName="TooltipDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Tooltip</CardTitle>
              <CardDescription>
                A popup that displays information when hovering over an element • Click card to view
                source
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <TooltipDemo />
            </CardContent>
            <ImportFooter sourceCode={TooltipDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Toast Component */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={ToastDemoSource} fileName="ToastDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Toast</CardTitle>
              <CardDescription>
                Temporary notifications that appear and auto-dismiss • Click card to view source
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ToastDemo />
            </CardContent>
            <ImportFooter sourceCode={ToastDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Sheet Component */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={SheetDemoSource} fileName="SheetDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Sheet</CardTitle>
              <CardDescription>
                Slide-out panel from any side with overlay • Click card to view source
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <SheetDemo />
            </CardContent>
            <ImportFooter sourceCode={SheetDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>
    </div>
  );
}
