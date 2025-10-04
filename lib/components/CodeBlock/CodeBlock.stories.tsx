import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CodeBlock from "./CodeBlock";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: "select",
      options: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "python",
        "rust",
        "go",
        "java",
        "c",
        "cpp",
        "bash",
        "json",
        "html",
        "css",
        "markdown",
      ],
    },
    theme: {
      control: "select",
      options: [
        "vitesse-dark",
        "vitesse-light",
        "github-dark",
        "github-light",
        "nord",
        "dracula",
        "monokai",
        "one-dark-pro",
      ],
    },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const javascriptCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 10th Fibonacci number
const result = fibonacci(10);
console.log('Fibonacci(10) =', result);`;

const typescriptCode = `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}`;

const reactCode = `import React, { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

const pythonCode = `def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(sorted_numbers)`;

const bashCode = `#!/bin/bash

# Deploy script with error handling
set -e

echo "Starting deployment..."

# Build the application
npm run build

# Run tests
npm test

# Deploy to production
if [ "$ENVIRONMENT" == "production" ]; then
    echo "Deploying to production..."
    scp -r dist/ user@server:/var/www/app
    echo "Deployment complete!"
else
    echo "Skipping production deployment"
fi`;

export const Default: Story = {
  args: {
    code: javascriptCode,
    language: "javascript",
    fileName: "fibonacci.js",
    theme: "vitesse-dark",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const TypeScript: Story = {
  args: {
    code: typescriptCode,
    language: "typescript",
    fileName: "user.service.ts",
    theme: "github-dark",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const ReactComponent: Story = {
  args: {
    code: reactCode,
    language: "tsx",
    fileName: "Counter.tsx",
    theme: "nord",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const Python: Story = {
  args: {
    code: pythonCode,
    language: "python",
    fileName: "quicksort.py",
    theme: "monokai",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const Bash: Story = {
  args: {
    code: bashCode,
    language: "bash",
    fileName: "deploy.sh",
    theme: "vitesse-dark",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const NoHeader: Story = {
  args: {
    code: javascriptCode,
    language: "javascript",
    theme: "vitesse-dark",
    showLineNumbers: true,
    showCopyButton: false,
  },
};

export const LightTheme: Story = {
  args: {
    code: typescriptCode,
    language: "typescript",
    fileName: "example.ts",
    theme: "github-light",
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const InteractiveViewOnly: Story = {
  render: (args) => {
    const [theme, setTheme] = React.useState(args.theme || "vitesse-dark");
    const [showLineNumbers, setShowLineNumbers] = React.useState(args.showLineNumbers ?? true);

    return (
      <CodeBlock
        {...args}
        theme={theme}
        showLineNumbers={showLineNumbers}
        interactive={true}
        onThemeChange={setTheme}
        onLineNumbersChange={setShowLineNumbers}
      />
    );
  },
  args: {
    code: typescriptCode,
    language: "typescript",
    fileName: "user.service.ts",
    showCopyButton: true,
  },
};

export const FullyInteractive: Story = {
  render: (args) => {
    const [code, setCode] = React.useState(args.code || reactCode);
    const [theme, setTheme] = React.useState(args.theme || "github-dark");
    const [showLineNumbers, setShowLineNumbers] = React.useState(args.showLineNumbers ?? true);

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>✏️ Click the pencil icon to edit the code</p>
          <p>🎨 Change the theme with the dropdown</p>
          <p>#️⃣ Toggle line numbers with the hash button</p>
        </div>
        <CodeBlock
          code={code}
          language="tsx"
          fileName="Counter.tsx"
          theme={theme}
          showLineNumbers={showLineNumbers}
          showCopyButton={true}
          interactive={true}
          editable={true}
          onCodeChange={setCode}
          onThemeChange={setTheme}
          onLineNumbersChange={setShowLineNumbers}
        />
      </div>
    );
  },
  args: {
    code: reactCode,
  },
};

export const EditableOnly: Story = {
  render: (args) => {
    const [code, setCode] = React.useState(args.code || pythonCode);

    return (
      <CodeBlock
        code={code}
        language="python"
        fileName="quicksort.py"
        theme="monokai"
        showLineNumbers={true}
        showCopyButton={true}
        editable={true}
        onCodeChange={setCode}
      />
    );
  },
  args: {
    code: pythonCode,
  },
};
