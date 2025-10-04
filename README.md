# 🔮 CATALYST UI

> **NEURAL INTERFACE ENGAGED** · A cyberpunk-styled React component library

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff?logo=vite)](https://vitejs.dev/)
[![Storybook](https://img.shields.io/badge/Storybook-9.1-ff4785?logo=storybook)](https://storybook.js.org/)

A production-ready React component library featuring cyberpunk aesthetics, built on modern web technologies with comprehensive tooling for development, testing, and documentation.

## ⚡ Features

- 🎨 **Radix UI Primitives** - Accessible, unstyled components
- 🌈 **7 Synthwave Themes** - Catalyst, Dracula, Gold, Laracon, Nature, Netflix, Nord
- 📊 **D3.js Visualizations** - Force graphs and data visualization components
- 🎭 **Storybook Integration** - Interactive component development and documentation
- 🔥 **Hot Module Replacement** - Lightning-fast development with Vite
- 📦 **TypeScript** - Full type safety and IntelliSense support
- 🧪 **Conventional Commits** - Automated changelog and versioning
- 🔗 **Source Maps** - Debug to original source, not dist files

## 📦 Installation

```bash
# npm
npm install catalyst-ui

# yarn
yarn add catalyst-ui

# pnpm
pnpm add catalyst-ui
```

## 🚀 Quick Start

```typescript
import { Button, Card, ThemeProvider } from 'catalyst-ui';
import 'catalyst-ui/dist/assets/global.css';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <Button variant="default">Click me</Button>
      </Card>
    </ThemeProvider>
  );
}
```

## 🎨 Components

### UI Components
- **Forms**: Button, Input, Label, Checkbox, Radio, Select, Slider
- **Layout**: Card, Accordion, Dialog, Dropdown Menu, Menubar
- **Navigation**: Navigation Menu, Breadcrumb
- **Data Display**: Table, Avatar, Progress, Toast
- **Overlays**: Tooltip, Hover Card, Scroll Area
- **Typography**: Typography component with variants

### Advanced Components
- **ForceGraph** - D3.js-powered force-directed graph visualization
- **CatalystHeader** - Themed application header with navigation
- **NavigationHeader** - Customizable navigation with dropdown support
- **MultiChoiceQuestion** - Interactive card-based question component
- **CreateAccountCard** - Pre-styled authentication card with OIDC support

## 🎭 Theming

Catalyst UI includes 7 built-in synthwave/cyberpunk themes:

```typescript
import { ThemeProvider, ChangeThemeDropdown } from 'catalyst-ui';

function App() {
  return (
    <ThemeProvider>
      <ChangeThemeDropdown />
      {/* Your app */}
    </ThemeProvider>
  );
}
```

**Available themes:**
- `catalyst` - Default cyberpunk theme
- `dracula` - Dark purple vampire vibes
- `gold` - Warm golden accent
- `laracon` - Conference-inspired red
- `nature` - Green earth tones
- `netflix` - Iconic red and black
- `nord` - Cool arctic palette

## 🔧 Development

### Prerequisites
- Node.js 18+
- Yarn 1.22+

### Setup

```bash
# Clone the repository
git clone https://github.com/TheBranchDriftCatalyst/catalyst-ui
cd catalyst-ui

# Install dependencies
yarn install

# Start development environment (Storybook + App + Build Watch)
yarn dev
```

### Available Scripts

```bash
# Development
yarn dev              # Start all dev services (Storybook + App + Build Watch)
yarn dev:app          # Kitchen sink demo app
yarn dev:storybook    # Storybook only
yarn dev:lib          # Build library in watch mode (for linked development)

# Building
yarn build            # Build library for production
yarn build:storybook  # Build Storybook for deployment

# Quality
yarn lint             # Run ESLint

# Releases
yarn release:first    # Initial release (v0.0.1)
yarn release:patch    # Patch release (0.0.1 → 0.0.2)
yarn release:minor    # Minor release (0.0.1 → 0.1.0)
yarn release:major    # Major release (0.0.1 → 1.0.0)
```

## 🔗 Concurrent Development (Yarn Link)

Develop Catalyst UI while using it in another project:

```bash
# In catalyst-ui directory
yarn link
yarn dev:lib

# In your consuming app
yarn link catalyst-ui
yarn dev
```

Changes in `lib/` will auto-rebuild and appear in your app in real-time! Source maps will point to the original source files for debugging.

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed workflow documentation.

## 📚 Documentation

- **Storybook**: Run `yarn dev:storybook` and visit http://localhost:6006
- **Development Guide**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

## 🤝 Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```bash
# Examples
git commit -m "feat(ui): add tooltip component"
git commit -m "fix(theme): resolve dark mode background issue"
git commit -m "docs: update installation instructions"
```

Commitlint will validate your commit messages automatically via git hooks.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling framework |
| [Radix UI](https://www.radix-ui.com/) | Accessible primitives |
| [shadcn/ui](https://ui.shadcn.com/) | Component patterns |
| [D3.js](https://d3js.org/) | Data visualization |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Storybook](https://storybook.js.org/) | Component development |
| [React Hook Form](https://react-hook-form.com/) | Form handling |
| [Zod](https://zod.dev/) | Schema validation |
| [Lucide Icons](https://lucide.dev/) | Icon set |

## 📄 License

MIT © [TheBranchDriftCatalyst](https://github.com/TheBranchDriftCatalyst)

---

<div align="center">

**🔮 NEURAL INTERFACE DISENGAGED** · *Transmission complete*

[GitHub](https://github.com/TheBranchDriftCatalyst/catalyst-ui) · [Issues](https://github.com/TheBranchDriftCatalyst/catalyst-ui/issues)

</div>
