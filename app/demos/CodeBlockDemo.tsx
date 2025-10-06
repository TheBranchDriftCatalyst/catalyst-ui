import { useState } from "react";
import { CodeBlock } from "@/catalyst-ui/components/CodeBlock";
import CodeBlockDemoSource from "./CodeBlockDemo.tsx?raw";

export function CodeBlockDemo() {
  const [codeTheme, setCodeTheme] = useState("catalyst");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [editableCode, setEditableCode] = useState(CodeBlockDemoSource);

  return (
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
  );
}
