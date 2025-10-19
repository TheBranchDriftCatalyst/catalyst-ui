# 🔮 CATALYST UI

> **NEURAL INTERFACE ENGAGED** · A cyberpunk-styled React component library

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff?logo=vite)](https://vitejs.dev/)
[![Storybook](https://img.shields.io/badge/Storybook-9.1-ff4785?logo=storybook)](https://storybook.js.org/)

[![Deploy to GitHub Pages](https://github.com/TheBranchDriftCatalyst/catalyst-ui/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/TheBranchDriftCatalyst/catalyst-ui/actions/workflows/deploy-pages.yml)
[![Tests](https://github.com/TheBranchDriftCatalyst/catalyst-ui/actions/workflows/test.yml/badge.svg)](https://github.com/TheBranchDriftCatalyst/catalyst-ui/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?logo=vitest)](https://github.com/TheBranchDriftCatalyst/catalyst-ui)
[![Tests Passing](https://img.shields.io/badge/tests-133_passing-success?logo=vitest)](https://github.com/TheBranchDriftCatalyst/catalyst-ui)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Live-success?logo=github)](https://thebranchdriftcatalyst.github.io/catalyst-ui/)

A production-ready React component library featuring cyberpunk aesthetics, built on modern web technologies with comprehensive tooling for development, testing, and documentation.

## ⚡ Features

### 🏗️ Architecture & Build

- 🌲 **Tree Shaking** - Granular ES module exports with per-file entry points for optimal bundle sizes
- 📦 **Zero Config Imports** - Import only what you need: `import { Button } from 'catalyst-ui/ui/button'`
- ✂️ **CSS Code Splitting** - Per-component CSS for lightning-fast page loads
- 🔗 **Source Maps** - Debug original TypeScript source in production builds
- 🚀 **Next.js Ready** - Automatic "use client" directive preservation for App Router compatibility
- 💯 **Full Type Safety** - Zero `@ts-ignore` across entire codebase with strict TypeScript

### 🎨 Components & UI

- 🎭 **Radix UI Primitives** - Accessible, unstyled components as foundation
- 🌈 **7 Synthwave Themes** - Catalyst, Dracula, Gold, Laracon, Nature, Netflix, Nord with dark/light variants
- 🎚️ **Advanced Slider** - Inside/outside labels, custom shapes (circle/rectangle/rounded), text label mapping
- 🍞 **Smart Toast System** - Stack up to 5 toasts with 6 animation variants (slide/fade/bounce/scale/slide-up/slide-down)
- 🎬 **Configurable Animations** - Customizable entrance/exit animations for Dialog, Sheet, and Toast components
- 📊 **Production-Ready Forms** - React Hook Form + Zod validation with accessible error handling

### 📊 Data Visualization

- 🕸️ **ForceGraph Abstraction Layer** - Enterprise-grade D3.js wrapper with 5-phase architecture refactoring
  - 🎯 **Layout Algorithms** - Force-directed, Dagre, ELK hierarchical, and community detection
  - 🎨 **Orthogonal Edge Routing** - Smart collision detection and path optimization
  - 💾 **Position Persistence** - Remember node arrangements per layout type with localStorage
  - 🎭 **Floating Panels** - Unified hook system for draggable/resizable/collapsible panels
  - ⚡ **Performance Optimized** - Memoized graph enrichment, O(1) filter predicates, cached path calculations
  - 🔍 **Advanced Filtering** - Pure filter functions with Set-based lookups for 100+ node graphs

### 🛠️ Developer Experience

- 🎭 **Storybook Integration** - Interactive component development with coverage reporting
- 🧪 **Comprehensive Testing** - 133 tests with 99% coverage using Vitest + Testing Library
- 🔥 **Hot Module Replacement** - Lightning-fast development with Vite
- ✅ **Conventional Commits** - Automated changelog and semantic versioning
- 🔄 **Yarn Link Support** - Real-time concurrent development with auto-rebuild
- 💾 **LocalStorage Persistence** - Theme preferences, panel positions, and graph layouts automatically saved

### 📊 Analytics & Observability

- 📈 **Google Analytics 4** - Production-ready GA4 integration with react-ga4
- 🐛 **Error Tracking** - React Error Boundary with global error handlers and stack traces
- ⚡ **Performance Monitoring** - Web Vitals (LCP, FID, CLS, TTFB, INP) with custom metrics
- 🗺️ **User Journey Tracking** - Session management, click tracking, and navigation history
- 📊 **Real-time Dashboard** - Live observability dashboard at `/catalyst/observability`
- 💾 **Data Export** - Export all analytics data as JSON with auto-rotation
- 🔒 **Privacy First** - No PII collection, GDPR compliant, localStorage-based

### 🔍 SEO & Meta Tags

- 🏷️ **Dynamic Meta Tags** - Automatic updates on navigation with Open Graph and Twitter Cards
- 🌐 **Structured Data** - JSON-LD support for WebSite, Organization, and BreadcrumbList schemas
- 📍 **Canonical URLs** - SEO best practices with automatic canonical tag management
- 🗺️ **Sitemap Generation** - Auto-generate sitemap.xml and robots.txt from tab structure
- 📱 **Social Media Ready** - Rich previews for Facebook, Twitter, LinkedIn, Discord, Slack
- 🎯 **Tab Integration** - Seamless integration with navigation system for per-page SEO
- 🔧 **Zero Dependencies** - Built-in SEO system, no external libraries required

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

### Analytics & Monitoring

- **AnalyticsProvider** - Context provider for comprehensive analytics tracking
- **AnalyticsErrorBoundary** - Error boundary with automatic error tracking
- **ObservabilityTab** - Real-time analytics dashboard component
- **usePageTracking** - Hook for automatic page view tracking
- **useEventTracking** - Hook for custom event tracking
- **usePerformanceTracking** - Hook for component performance monitoring

### SEO Components

- **SEOProvider** - Context provider for dynamic meta tag management
- **useSEO** - Hook for updating SEO metadata programmatically
- **generateSitemapFromTabs** - Utility to generate sitemap.xml from tab structure
- **generateRobotsTxt** - Utility to generate robots.txt file
- **downloadSitemap** - Browser download utility for sitemap.xml
- **downloadRobotsTxt** - Browser download utility for robots.txt

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

## 📊 Analytics & Observability

Catalyst UI includes a comprehensive analytics framework with Google Analytics 4 integration, error tracking, performance monitoring, and user journey tracking.

### Quick Start

```typescript
import { AnalyticsProvider, AnalyticsErrorBoundary } from 'catalyst-ui';

function App() {
  return (
    <AnalyticsProvider
      config={{
        measurementId: "G-XXXXXXXXXX", // Your GA4 measurement ID
        debug: process.env.NODE_ENV === 'development',
        enablePerformance: true,
        enableErrorTracking: true,
        enableUserJourney: true,
      }}
    >
      <AnalyticsErrorBoundary>
        {/* Your app */}
      </AnalyticsErrorBoundary>
    </AnalyticsProvider>
  );
}
```

### Track Events

```typescript
import { useAnalytics, useEventTracking } from 'catalyst-ui';

function MyComponent() {
  const analytics = useAnalytics();
  const { trackClick, trackSearch } = useEventTracking();

  const handleClick = () => {
    analytics.trackEvent('button_click', { button: 'submit' });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

### Observability Dashboard

Access the real-time analytics dashboard at `/catalyst/observability` (in demo app) to view:

- 📊 Live metrics overview (events, errors, performance)
- 📝 Event log with parameters
- ❌ Error log with stack traces
- ⚡ Performance metrics with Web Vitals
- 🗺️ User journey timeline
- 💾 Data export (JSON)

### Google Analytics 4 Setup

1. **Create GA4 Property**
   - Visit [Google Analytics](https://analytics.google.com)
   - Create a new GA4 property
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Configure Environment Variable**

   ```bash
   # .env.production
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Update App Configuration**

   ```typescript
   <AnalyticsProvider
     config={{
       measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
       // ... other config
     }}
   >
   ```

4. **Verify Data Flow**
   - Enable debug mode: `debug: true`
   - Open browser console to see tracked events
   - Check GA4 DebugView (real-time)
   - Wait 24-48 hours for production reports

### Features

- ✅ **Google Analytics 4** - Industry-standard web analytics
- ✅ **Error Tracking** - Automatic error capture with React Error Boundaries
- ✅ **Performance Monitoring** - Web Vitals (LCP, FID, CLS, TTFB, INP)
- ✅ **User Journey Tracking** - Session recording and interaction tracking
- ✅ **Real-time Dashboard** - Live observability with auto-refresh
- ✅ **Data Export** - Export analytics as JSON
- ✅ **Privacy Compliant** - No PII, GDPR ready, localStorage-based
- ✅ **Auto-rotation** - Automatic data cleanup (1000 events, 100 errors, 500 metrics)

See [docs/analytics/README.md](./docs/analytics/README.md) for complete documentation.

## 🔍 SEO & Meta Tag Management

Catalyst UI includes a comprehensive SEO optimization system with dynamic meta tag management, Open Graph support, Twitter Cards, JSON-LD structured data, and automatic sitemap generation.

### Quick Start

```typescript
import { SEOProvider } from 'catalyst-ui';

function App() {
  return (
    <SEOProvider
      config={{
        defaultSEO: {
          title: "My App - Production-Ready React",
          description: "Build amazing web applications",
          keywords: ["react", "typescript", "ui"],
        },
        baseUrl: "https://myapp.com",
        siteName: "My App",
        twitterHandle: "@myapp",
      }}
    >
      {/* Your app */}
    </SEOProvider>
  );
}
```

### Dynamic SEO Updates

```typescript
import { useSEO } from 'catalyst-ui';

function MyPage() {
  const seo = useSEO();

  useEffect(() => {
    seo.updateSEO({
      title: "About Us - My App",
      description: "Learn more about our company",
      canonical: "https://myapp.com/about",
      openGraph: {
        title: "About Us",
        description: "Learn more about our company",
        image: "https://myapp.com/og-about.png",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "About Us",
        image: "https://myapp.com/twitter-about.png",
      },
    });
  }, []);

  return <div>About Page</div>;
}
```

### Tab Integration

The SEO system automatically updates meta tags when navigating between tabs/routes:

- ✅ **Dynamic Titles** - Page title updates on every navigation
- ✅ **Meta Descriptions** - Unique descriptions per page
- ✅ **Canonical URLs** - Prevent duplicate content issues
- ✅ **Open Graph Tags** - Rich social media previews (Facebook, LinkedIn, Slack)
- ✅ **Twitter Cards** - Optimized Twitter sharing with images
- ✅ **JSON-LD Structured Data** - Schema.org markup for search engines

### Generate Sitemap

```typescript
import {
  generateSitemapFromTabs,
  generateRobotsTxt,
  getCurrentDateISO,
  downloadSitemap,
} from "catalyst-ui";
import { tabs } from "./tabs";

// Generate sitemap
const sitemap = generateSitemapFromTabs(tabs, {
  baseUrl: "https://myapp.com",
  lastmod: getCurrentDateISO(),
  defaultChangefreq: "weekly",
  defaultPriority: 0.8,
});

// Generate robots.txt
const robotsTxt = generateRobotsTxt("https://myapp.com/sitemap.xml");

// Download files (browser)
downloadSitemap(sitemap);
downloadRobotsTxt(robotsTxt);
```

### Features

- ✅ **Dynamic Meta Tags** - Automatically update on navigation
- ✅ **Open Graph Protocol** - Facebook, LinkedIn, Discord, Slack previews
- ✅ **Twitter Cards** - Large image cards with custom metadata
- ✅ **JSON-LD Support** - WebSite, Organization, BreadcrumbList schemas
- ✅ **Canonical URLs** - SEO best practices for duplicate content
- ✅ **Sitemap Generation** - Auto-generate sitemap.xml and robots.txt
- ✅ **TypeScript First** - Complete type safety for all metadata
- ✅ **React Context API** - Easy integration with existing apps
- ✅ **Zero Dependencies** - Built-in, no external SEO libraries needed

### Social Media Preview

When you share links on social media, the SEO system ensures your content looks professional:

**Facebook/LinkedIn**:

- Custom title, description, and image
- Proper dimensions (1200x630 recommended)
- Image alt text for accessibility

**Twitter**:

- Summary large image cards
- Site and creator handles
- Optimized image previews

### Structured Data

The SEO system supports JSON-LD structured data for enhanced search results:

```typescript
seo.updateSEO({
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "My App",
      url: "https://myapp.com",
      description: "Production-ready React components",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://myapp.com" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://myapp.com/about" },
      ],
    },
  ],
});
```

See [docs/seo/README.md](./docs/seo/README.md) for complete documentation.

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

# Testing
yarn test             # Run all tests once
yarn test:watch       # Run tests in watch mode
yarn test:ui          # Open Vitest UI
yarn test:coverage    # Run tests with coverage report

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

See [docs/development/workflow.md](./docs/development/workflow.md) for detailed workflow documentation.

## 📚 Documentation

### Version Glossary

Understanding catalyst-ui version terminology:

- **v1.3.0** - Current stable release (October 2025)
  - Includes Phases 1-6 of mass cleanup refactor
  - 99% test coverage, comprehensive testing infrastructure
  - Export pattern standardization and ForceGraph context refactoring

- **v1.4.0** - Next minor release (In Development)
  - Planned: Storybook documentation updates
  - Planned: Logger usage guide
  - Planned: Performance profiling and bundle optimization

- **v2.0.0** - Future major version (Date TBD)
  - Breaking changes: Named exports only (no default exports)
  - Canvas renderer for ForceGraph (large graph performance)
  - Complete accessibility audit remediation
  - Full API documentation with TypeDoc

See [CHANGELOG.md](./CHANGELOG.md) for detailed release notes and [docs/features/mass-cleanup-refactor.md](./docs/features/mass-cleanup-refactor.md) for the refactoring roadmap.

### Getting Started

- **Storybook**: Run `yarn dev:storybook` and visit http://localhost:6006
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

### API Reference

- **TypeDoc API Documentation**: [https://thebranchdriftcatalyst.github.io/catalyst-ui/api/](https://thebranchdriftcatalyst.github.io/catalyst-ui/api/) - Complete API documentation generated from TypeScript/JSDoc
  - Component props and interfaces
  - Hook signatures and usage
  - Utility function references
  - Context provider APIs
  - Usage examples and code snippets

To generate locally: `yarn docs:api`

### Development Guides

- **Developer Workflow**: [docs/development/workflow.md](./docs/development/workflow.md) - Complete development workflow, tooling, and best practices
- **Deployment Guide**: [docs/development/deployment.md](./docs/development/deployment.md) - GitHub Pages deployment and CI/CD setup

### Architecture & Design

- **Design Tokens System**: [docs/architecture/design-tokens.md](./docs/architecture/design-tokens.md) - Theme system and design token architecture
- **ForceGraph Refactor**: [docs/architecture/force-graph-refactor.md](./docs/architecture/force-graph-refactor.md) - 5-phase refactoring documentation

### Features & Roadmaps

- **Design Tokens Auto-Generation**: [docs/features/design-tokens-autogen.md](./docs/features/design-tokens-autogen.md) - Automated token extraction from CSS
- **CodeBlock Roadmap**: [docs/features/codeblock-roadmap.md](./docs/features/codeblock-roadmap.md) - CodeBlock component development plan

### Analytics & Observability

- **Analytics Framework**: [docs/analytics/README.md](./docs/analytics/README.md) - Complete analytics and observability guide
- **Event Tracking Reference**: [docs/analytics/TRACKING.md](./docs/analytics/TRACKING.md) - Comprehensive event tracking documentation
- **Implementation Summary**: [docs/analytics/IMPLEMENTATION_SUMMARY.md](./docs/analytics/IMPLEMENTATION_SUMMARY.md) - Technical implementation details

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

| Technology                                               | Purpose                 |
| -------------------------------------------------------- | ----------------------- |
| [React 18](https://react.dev)                            | UI library              |
| [TypeScript](https://www.typescriptlang.org/)            | Type safety             |
| [Tailwind CSS v4](https://tailwindcss.com/)              | Styling framework       |
| [Radix UI](https://www.radix-ui.com/)                    | Accessible primitives   |
| [shadcn/ui](https://ui.shadcn.com/)                      | Component patterns      |
| [D3.js](https://d3js.org/)                               | Data visualization      |
| [Vite](https://vitejs.dev/)                              | Build tool & dev server |
| [Vitest](https://vitest.dev/)                            | Unit testing framework  |
| [Testing Library](https://testing-library.com/)          | React testing utilities |
| [Storybook](https://storybook.js.org/)                   | Component development   |
| [React Hook Form](https://react-hook-form.com/)          | Form handling           |
| [Zod](https://zod.dev/)                                  | Schema validation       |
| [Lucide Icons](https://lucide.dev/)                      | Icon set                |
| [react-ga4](https://github.com/PriceRunner/react-ga4)    | Google Analytics 4      |
| [web-vitals](https://github.com/GoogleChrome/web-vitals) | Performance metrics     |

## 📄 License

MIT © [TheBranchDriftCatalyst](https://github.com/TheBranchDriftCatalyst)

---

<div align="center">

**🔮 NEURAL INTERFACE DISENGAGED** · _Transmission complete_

[GitHub](https://github.com/TheBranchDriftCatalyst/catalyst-ui) · [Issues](https://github.com/TheBranchDriftCatalyst/catalyst-ui/issues)

</div>
