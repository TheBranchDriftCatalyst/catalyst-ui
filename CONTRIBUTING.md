# Contributing to Catalyst UI

Thank you for your interest in contributing to Catalyst UI! This guide will help you get started with development and ensure smooth collaboration.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Development](#component-development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project follows standard open-source collaboration practices:

- **Be respectful** - Treat all contributors with respect
- **Be constructive** - Provide helpful feedback and suggestions
- **Be collaborative** - Work together to improve the project
- **Be patient** - Remember that everyone is learning

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **Yarn**: 1.22.22 (package manager)
- **Task**: [go-task](https://taskfile.dev/) for automation (optional but recommended)

### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TheBranchDriftCatalyst/catalyst-ui.git
   cd catalyst-ui
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start development environment:**

   ```bash
   yarn dev          # Starts Storybook + preview (uses Foreman)
   # or
   yarn dev:storybook  # Storybook only (port 6006)
   ```

4. **Verify setup:**
   - Open http://localhost:6006 (Storybook)
   - Browse existing components and stories
   - Try switching themes and dark mode

## Development Workflow

### Branch Strategy

- `main` - Production-ready code, auto-deploys to GitHub Pages
- `feature/*` - New features or components
- `fix/*` - Bug fixes
- `docs/*` - Documentation improvements
- `refactor/*` - Code refactoring without behavior changes

### Typical Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/my-new-component
   ```

2. **Make changes and test:**

   ```bash
   yarn dev:storybook    # Live development
   yarn lint             # Check code style
   yarn build            # Test production build
   ```

3. **Commit changes:**

   ```bash
   git add .
   git commit -m "feat: add MyNewComponent with interactive variants"
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/my-new-component
   ```
   Then create a Pull Request on GitHub.

### Commit Message Conventions

We follow conventional commits for clarity and automated changelog generation:

- `feat:` - New feature or component
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process, tooling, or dependency updates

**Examples:**

```bash
git commit -m "feat(Button): add loading state with spinner"
git commit -m "fix(ThemeProvider): persist theme selection to localStorage"
git commit -m "docs(README): update installation instructions"
git commit -m "refactor(effects): rename animation folder to effects"
```

## Code Style Guidelines

### TypeScript

- **Use TypeScript** for all new code
- **Export types** for public APIs
- **Document complex types** with JSDoc comments
- **Prefer interfaces** over type aliases for object shapes

### React Components

**Component Structure:**

```tsx
import { useState } from "react";
import { cn } from "@/catalyst-ui/lib/utils";

export interface MyComponentProps {
  /** Description of prop */
  title: string;
  /** Description with default value */
  variant?: "default" | "primary" | "secondary";
  /** Optional callback */
  onClick?: () => void;
}

export const MyComponent = ({ title, variant = "default", onClick }: MyComponentProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={cn(
        "base-classes",
        variant === "primary" && "primary-classes",
        isActive && "active-classes"
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
```

**Best Practices:**

- Use functional components with hooks
- Export component interfaces separately
- Document props with JSDoc comments
- Use `cn()` utility for conditional className composition
- Prefer named exports over default exports

### CSS and Styling

- **Tailwind CSS** - Primary styling approach
- **CSS Modules** - For complex component-specific styles
- **CSS Custom Properties** - For theme variables

**Tailwind Best Practices:**

```tsx
// Good - Readable, organized
<div className={cn(
  "flex flex-col gap-4",
  "p-6 rounded-lg border",
  "bg-background text-foreground",
  "hover:shadow-lg transition-shadow"
)}>

// Avoid - Hard to read
<div className="flex flex-col gap-4 p-6 rounded-lg border bg-background text-foreground hover:shadow-lg transition-shadow">
```

### File Organization

```
lib/
├── components/         # General components
│   ├── MyComponent/
│   │   ├── MyComponent.tsx
│   │   ├── MyComponent.stories.tsx
│   │   └── index.ts
├── cards/             # Card-based components
├── contexts/          # React contexts
├── effects/           # Animation HOCs
├── hooks/             # Custom hooks
└── ui/                # Base UI primitives (shadcn/ui)
```

## Component Development

### Creating a New Component

**Option 1: Use Task Command (Recommended)**

```bash
task new-component
```

This interactive command:

- Prompts for component directory (using fzf)
- Creates both `.tsx` and `.stories.tsx` files from templates
- Sets up proper imports and structure

**Option 2: Manual Creation**

1. Create component file:

   ```bash
   mkdir -p lib/components/MyComponent
   touch lib/components/MyComponent/MyComponent.tsx
   ```

2. Create Storybook story:

   ```bash
   touch lib/components/MyComponent/MyComponent.stories.tsx
   ```

3. Create barrel export:
   ```bash
   echo "export * from './MyComponent';" > lib/components/MyComponent/index.ts
   ```

### Component Checklist

- [ ] TypeScript interfaces exported
- [ ] Props documented with JSDoc
- [ ] Default values for optional props
- [ ] Accessible markup (ARIA attributes, semantic HTML)
- [ ] Keyboard navigation support
- [ ] Storybook story with multiple variants
- [ ] Dark mode support (via theme variables)
- [ ] Responsive design (mobile-first)
- [ ] Added to `lib/catalyst.ts` exports if public API

### Storybook Stories

**Story Structure:**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Default MyComponent",
    variant: "default",
  },
};

export const Primary: Story = {
  args: {
    title: "Primary MyComponent",
    variant: "primary",
  },
};

export const WithAction: Story = {
  args: {
    title: "Interactive MyComponent",
    onClick: () => alert("Clicked!"),
  },
};
```

**Story Best Practices:**

- Include `Default` story
- Show all variants
- Demonstrate interactive states
- Use `tags: ["autodocs"]` for auto-generated documentation
- Add `parameters.layout` for proper positioning

## Testing

### Running Tests

```bash
yarn dev:test              # Storybook test runner with coverage
```

### Test Coverage

- Tests run via Storybook test runner
- Snapshots stored alongside stories
- Coverage reports generated in `coverage/`

### Writing Tests

Stories serve as visual regression tests. For interaction testing:

```tsx
export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and interact with elements
    const button = canvas.getByRole("button");
    await userEvent.click(button);

    // Assert results
    expect(canvas.getByText("Clicked!")).toBeInTheDocument();
  },
};
```

## Documentation

### Component Documentation

- **JSDoc comments** on interfaces and props
- **Storybook stories** with `autodocs` tag
- **README.md** for complex components
- **Architecture docs** in `docs/architecture/` for systems

### Documentation Style

````typescript
/**
 * A reusable card component with multiple variants.
 *
 * @example
 * ```tsx
 * <MyComponent
 *   title="Hello"
 *   variant="primary"
 *   onClick={() => console.log("clicked")}
 * />
 * ```
 */
export interface MyComponentProps {
  /** The main title text displayed in the component */
  title: string;

  /** Visual variant of the component
   * @default "default"
   */
  variant?: "default" | "primary" | "secondary";

  /** Callback fired when component is clicked */
  onClick?: () => void;
}
````

### Updating Documentation

- Architecture changes → Update `docs/architecture/`
- New features → Update `docs/features/`
- Development process changes → Update `docs/development/`
- Always update `docs/features/documentation-improvement.md` tracking

## Pull Request Process

### Before Submitting PR

1. **Lint your code:**

   ```bash
   yarn lint
   ```

2. **Build successfully:**

   ```bash
   yarn build
   yarn build:storybook
   ```

3. **Test your changes:**

   ```bash
   yarn dev:test
   ```

4. **Update documentation:**
   - Add/update Storybook stories
   - Update JSDoc comments
   - Update relevant docs/ files

5. **Commit with conventional messages:**
   ```bash
   git commit -m "feat(MyComponent): add interactive variant"
   ```

### PR Template

When creating a PR, include:

**Description:**

- What does this PR do?
- Why is this change needed?

**Changes:**

- List of files changed
- Components added/modified
- Breaking changes (if any)

**Testing:**

- How to test the changes
- Screenshots/videos for UI changes

**Checklist:**

- [ ] Code follows style guidelines
- [ ] TypeScript types exported
- [ ] Storybook story added/updated
- [ ] Documentation updated
- [ ] Build succeeds
- [ ] Tests pass

### Review Process

1. Automated checks run (build, lint)
2. Maintainer reviews code
3. Address feedback with new commits
4. Once approved, maintainer merges to `main`
5. GitHub Actions auto-deploys to GitHub Pages

## Issue Reporting

### Bug Reports

**Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Version: [e.g., 1.2.3]
```

### Feature Requests

**Template:**

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Solution**
How you envision this working.

**Alternatives**
Other approaches you've considered.
```

## Additional Resources

- [README.md](./README.md) - Project overview and quick start
- [docs/architecture/](./docs/architecture/) - Architecture documentation
- [docs/development/](./docs/development/) - Development guides
- [Storybook](https://storybook.js.org/) - Component development environment
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Questions?

- Check [existing documentation](./docs/)
- Search [GitHub Issues](https://github.com/TheBranchDriftCatalyst/catalyst-ui/issues)
- Create a new issue for questions

## License

By contributing to Catalyst UI, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing to Catalyst UI!** 🎉
