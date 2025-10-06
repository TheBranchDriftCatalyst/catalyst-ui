import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";

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
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
          <CardDescription>
            Dynamic overlay components with CodeFlipCard wrappers • Click cards to view source code • Try the interactive demos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dialog Component */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
          <CardDescription>
            A modal dialog component with overlay and focus management • Click card to view source
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <CodeFlipCard
            sourceCode={DialogDemoSource}
            fileName="DialogDemo.tsx"
            language="tsx"
            minHeight={100}
          >
            <DialogDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Dropdown Menu Component */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Menu</CardTitle>
          <CardDescription>
            A menu component with keyboard navigation and portal rendering • Click card to view source
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <CodeFlipCard
            sourceCode={DropdownMenuDemoSource}
            fileName="DropdownMenuDemo.tsx"
            language="tsx"
            minHeight={100}
          >
            <DropdownMenuDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Tooltip Component */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltip</CardTitle>
          <CardDescription>
            A popup that displays information when hovering over an element • Click card to view source
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CodeFlipCard
            sourceCode={TooltipDemoSource}
            fileName="TooltipDemo.tsx"
            language="tsx"
            minHeight={100}
          >
            <TooltipDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Toast Component */}
      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
          <CardDescription>
            Temporary notifications that appear and auto-dismiss • Click card to view source
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CodeFlipCard
            sourceCode={ToastDemoSource}
            fileName="ToastDemo.tsx"
            language="tsx"
            minHeight={100}
          >
            <ToastDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Sheet Component */}
      <Card>
        <CardHeader>
          <CardTitle>Sheet</CardTitle>
          <CardDescription>
            Slide-out panel from any side with overlay • Click card to view source
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <CodeFlipCard
            sourceCode={SheetDemoSource}
            fileName="SheetDemo.tsx"
            language="tsx"
            minHeight={100}
          >
            <SheetDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>
    </div>
  );
}
