# SEO Implementation Summary

Technical documentation for the Catalyst UI SEO system implementation.

## Architecture Overview

```
lib/contexts/SEO/
├── types.ts           # TypeScript type definitions
├── SEOContext.tsx     # React context definition
├── SEOProvider.tsx    # SEO provider with meta tag management
└── index.ts           # Public exports

app/
├── seo-config.ts      # Tab-specific SEO configurations
├── App.tsx            # SEO integration with tab navigation
└── utils/
    └── sitemap-generator.ts  # Sitemap and robots.txt utilities
```

## File Structure

### lib/contexts/SEO/types.ts

**Purpose**: Comprehensive TypeScript type definitions for SEO system

**Key Types**:

```typescript
// Open Graph metadata for social media
export interface OpenGraphMetadata {
  title: string;
  description: string;
  type?: "website" | "article" | "profile" | "video.other";
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  siteName?: string;
  locale?: string;
}

// Twitter Card metadata
export interface TwitterCardMetadata {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

// Structured data types (JSON-LD)
export type StructuredData =
  | StructuredDataWebSite
  | StructuredDataWebPage
  | StructuredDataBreadcrumb
  | Record<string, any>;

// Complete SEO metadata
export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  robots?: string;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
  structuredData?: StructuredData[];
  meta?: Array<{ name?: string; property?: string; content: string }>;
  links?: Array<{ rel: string; href: string; [key: string]: string }>;
}

// SEO configuration
export interface SEOConfig {
  defaultSEO: SEOMetadata;
  routeSEO?: Record<string, Partial<SEOMetadata>>;
  baseUrl: string;
  siteName: string;
  defaultImage?: string;
  twitterHandle?: string;
}

// Context value
export interface SEOContextValue {
  updateSEO: (metadata: Partial<SEOMetadata>) => void;
  getCurrentSEO: () => SEOMetadata;
  resetSEO: () => void;
  metadata: SEOMetadata;
}
```

### lib/contexts/SEO/SEOProvider.tsx

**Purpose**: React provider component for SEO management with automatic DOM manipulation

**Key Features**:

- Updates `document.title` on metadata changes
- Creates/updates meta tags dynamically
- Manages canonical link tags
- Handles JSON-LD structured data
- Supports partial updates with deep merging

**Implementation Details**:

```typescript
export const SEOProvider: React.FC<SEOProviderProps> = ({ children, config }) => {
  const [metadata, setMetadata] = useState<SEOMetadata>(config.defaultSEO || DEFAULT_METADATA);

  // Update document title
  useEffect(() => {
    if (metadata.title) {
      document.title = metadata.title;
    }
  }, [metadata.title]);

  // Update meta tags
  useEffect(() => {
    // Description, keywords, robots
    if (metadata.description) {
      updateMetaTag("name", "description", metadata.description);
    }
    if (metadata.keywords && metadata.keywords.length > 0) {
      updateMetaTag("name", "keywords", metadata.keywords.join(", "));
    }
    if (metadata.robots) {
      updateMetaTag("name", "robots", metadata.robots);
    }

    // Open Graph tags
    if (metadata.openGraph) {
      const og = metadata.openGraph;
      updateMetaTag("property", "og:title", og.title);
      updateMetaTag("property", "og:description", og.description);
      if (og.type) updateMetaTag("property", "og:type", og.type);
      if (og.image) {
        updateMetaTag("property", "og:image", og.image);
        if (og.imageAlt) updateMetaTag("property", "og:image:alt", og.imageAlt);
        if (og.imageWidth) updateMetaTag("property", "og:image:width", og.imageWidth.toString());
        if (og.imageHeight) updateMetaTag("property", "og:image:height", og.imageHeight.toString());
      }
      if (og.url) updateMetaTag("property", "og:url", og.url);
      if (og.siteName) updateMetaTag("property", "og:site_name", og.siteName);
      if (og.locale) updateMetaTag("property", "og:locale", og.locale);
    }

    // Twitter Card tags
    if (metadata.twitter) {
      const tw = metadata.twitter;
      if (tw.card) updateMetaTag("name", "twitter:card", tw.card);
      if (tw.site) updateMetaTag("name", "twitter:site", tw.site);
      if (tw.creator) updateMetaTag("name", "twitter:creator", tw.creator);
      if (tw.title) updateMetaTag("name", "twitter:title", tw.title);
      if (tw.description) updateMetaTag("name", "twitter:description", tw.description);
      if (tw.image) updateMetaTag("name", "twitter:image", tw.image);
      if (tw.imageAlt) updateMetaTag("name", "twitter:image:alt", tw.imageAlt);
    }

    // Additional meta tags
    if (metadata.meta) {
      metadata.meta.forEach(tag => {
        if (tag.name) {
          updateMetaTag("name", tag.name, tag.content);
        } else if (tag.property) {
          updateMetaTag("property", tag.property, tag.content);
        }
      });
    }
  }, [metadata]);

  // Update canonical link
  useEffect(() => {
    if (metadata.canonical) {
      updateLinkTag("canonical", metadata.canonical);
    }
  }, [metadata.canonical]);

  // Update JSON-LD structured data
  useEffect(() => {
    if (metadata.structuredData && metadata.structuredData.length > 0) {
      updateStructuredData(metadata.structuredData);
    }
  }, [metadata.structuredData]);

  // Helper functions
  const updateMetaTag = (attribute: string, key: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", rel);
      document.head.appendChild(element);
    }
    element.setAttribute("href", href);
  };

  const updateStructuredData = (data: any[]) => {
    // Remove existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add new JSON-LD scripts
    data.forEach(item => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  };

  const updateSEO = useCallback((newMetadata: Partial<SEOMetadata>) => {
    setMetadata(prev => ({
      ...prev,
      ...newMetadata,
      openGraph: newMetadata.openGraph
        ? { ...prev.openGraph, ...newMetadata.openGraph } as any
        : prev.openGraph,
      twitter: newMetadata.twitter
        ? { ...prev.twitter, ...newMetadata.twitter } as any
        : prev.twitter,
    }));
  }, []);

  const getCurrentSEO = useCallback(() => metadata, [metadata]);
  const resetSEO = useCallback(() => {
    setMetadata(config.defaultSEO || DEFAULT_METADATA);
  }, [config.defaultSEO]);

  const contextValue: SEOContextValue = {
    updateSEO,
    getCurrentSEO,
    resetSEO,
    metadata,
  };

  return <SEOContext.Provider value={contextValue}>{children}</SEOContext.Provider>;
};
```

**Key Methods**:

1. **updateMetaTag(attribute, key, content)**: Creates or updates meta tags
2. **updateLinkTag(rel, href)**: Creates or updates link tags
3. **updateStructuredData(data)**: Manages JSON-LD scripts
4. **updateSEO(newMetadata)**: Partial update with deep merging
5. **getCurrentSEO()**: Returns current metadata
6. **resetSEO()**: Resets to default configuration

### app/seo-config.ts

**Purpose**: Centralized SEO configuration for all tabs

**Structure**:

```typescript
const BASE_URL = "https://catalyst-ui.dev";
const SITE_NAME = "Catalyst UI";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = "@catalyst_ui";

export const TAB_SEO_CONFIG: Record<string, Partial<SEOMetadata>> = {
  overview: {
    title: "Overview - Catalyst UI",
    description: "...",
    keywords: ["react", "component library", ...],
    canonical: `${BASE_URL}/catalyst/overview`,
    openGraph: { /* ... */ },
    twitter: { /* ... */ },
    structuredData: [ /* ... */ ],
  },
  // ... more tabs
};

export const DEFAULT_SEO: SEOMetadata = {
  // Fallback SEO for unknown tabs
};

export const getSEOForTab = (tabValue: string, section: string): Partial<SEOMetadata> => {
  // Returns tab-specific config or generates dynamic SEO
};
```

**Dynamic SEO Generation**:

For tabs without explicit configuration, `getSEOForTab()` generates SEO metadata automatically:

```typescript
const tabLabel = tabValue
  .split(/(?=[A-Z])/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
return {
  title: `${tabLabel} - ${SITE_NAME}`,
  description: `Explore ${tabLabel} in Catalyst UI component library`,
  canonical: `${BASE_URL}/${section}/${tabValue}`,
  // ... auto-generated Open Graph and Twitter Cards
};
```

### app/App.tsx Integration

**SEO Provider Wrapper**:

```tsx
function App() {
  return (
    <I18nProvider>
      <SEOProvider
        config={{
          defaultSEO: DEFAULT_SEO,
          baseUrl: "https://catalyst-ui.dev",
          siteName: "Catalyst UI",
          twitterHandle: "@catalyst_ui",
        }}
      >
        <AnalyticsProvider
          config={
            {
              /* ... */
            }
          }
        >
          {/* ... rest of app */}
        </AnalyticsProvider>
      </SEOProvider>
    </I18nProvider>
  );
}
```

**Tab Navigation Integration**:

```tsx
function KitchenSink() {
  const seo = useSEO();
  const analytics = useAnalytics();

  // Update SEO on tab changes
  useEffect(() => {
    const seoConfig = getSEOForTab(activeTab, activeSection);
    seo.updateSEO(seoConfig);
  }, [activeSection, activeTab, seo]);

  // Update SEO on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const seoConfig = getSEOForTab(tab, section);
      seo.updateSEO(seoConfig);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [seo]);
}
```

### app/utils/sitemap-generator.ts

**Purpose**: Generate sitemap.xml and robots.txt from tab structure

**Key Functions**:

```typescript
// Generate sitemap XML from URLs
export const generateSitemapXml = (urls: SitemapUrl[]): string;

// Generate sitemap from tab structure
export const generateSitemapFromTabs = (
  tabs: Array<{ value: string; section: string }>,
  options: SitemapOptions
): string;

// Generate robots.txt content
export const generateRobotsTxt = (sitemapUrl: string): string;

// Browser download utilities
export const downloadSitemap = (content: string, filename?: string): void;
export const downloadRobotsTxt = (content: string): void;

// Get current date in ISO format
export const getCurrentDateISO = (): string;
```

**Usage**:

```typescript
import { initialTabs } from "./tabs/loader";
import {
  generateSitemapFromTabs,
  generateRobotsTxt,
  getCurrentDateISO,
  downloadSitemap,
} from "./utils/sitemap-generator";

const sitemap = generateSitemapFromTabs(initialTabs, {
  baseUrl: "https://catalyst-ui.dev",
  lastmod: getCurrentDateISO(),
  defaultChangefreq: "weekly",
  defaultPriority: 0.8,
});

const robotsTxt = generateRobotsTxt("https://catalyst-ui.dev/sitemap.xml");

downloadSitemap(sitemap);
downloadRobotsTxt(robotsTxt);
```

## HTML Integration

### app/index.html

Enhanced with comprehensive SEO meta tags:

**Primary Meta Tags**:

- `<title>`: Page title
- `<meta name="title">`: Duplicate for some crawlers
- `<meta name="description">`: Page description
- `<meta name="keywords">`: Comma-separated keywords
- `<meta name="author">`: Author/organization
- `<meta name="robots">`: Crawling directives
- `<link rel="canonical">`: Canonical URL

**Open Graph**:

- `og:type`, `og:url`, `og:title`, `og:description`
- `og:image`, `og:image:alt`, `og:site_name`, `og:locale`

**Twitter Cards**:

- `twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`
- `twitter:image`, `twitter:image:alt`, `twitter:site`, `twitter:creator`

**Additional**:

- `<meta name="theme-color">`: Browser theme color
- `<meta name="color-scheme">`: Dark/light support
- `<meta name="application-name">`: App name

**JSON-LD Structured Data**:

- WebSite schema
- Organization schema
- SoftwareApplication schema

## Data Flow

```
User Navigation
    ↓
Tab Change Event
    ↓
getSEOForTab(tabValue, section)
    ↓
seo.updateSEO(seoConfig)
    ↓
SEOProvider State Update
    ↓
useEffect Triggers
    ↓
DOM Manipulation
    ↓
Meta Tags Updated in <head>
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: `useCallback` for context methods
2. **Selective Updates**: Only update changed meta tags
3. **Batched DOM Mutations**: useEffect batches updates
4. **Lazy Evaluation**: Tab SEO configs loaded on-demand

### Bundle Size Impact

- **SEOProvider**: ~3 KB (minified)
- **seo-config.ts**: ~5 KB (tab configs)
- **sitemap-generator.ts**: ~2 KB
- **Total**: ~10 KB added to bundle

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ⚠️ IE11 (requires polyfills for `document.head`)

## Testing

### Manual Testing

1. **View Source**: Check meta tags in page source
2. **DevTools**: Inspect `<head>` element in Elements tab
3. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **Google Rich Results Test**: https://search.google.com/test/rich-results

### Automated Testing (Future)

```typescript
// Example test
describe("SEOProvider", () => {
  it("updates document title", () => {
    const { result } = renderHook(() => useSEO(), { wrapper: SEOProvider });
    act(() => {
      result.current.updateSEO({ title: "New Title" });
    });
    expect(document.title).toBe("New Title");
  });

  it("creates meta description tag", () => {
    const { result } = renderHook(() => useSEO(), { wrapper: SEOProvider });
    act(() => {
      result.current.updateSEO({ description: "Test description" });
    });
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBe("Test description");
  });
});
```

## Migration Guide

### From No SEO to Catalyst SEO

1. **Install Dependencies**: None required (all built-in)
2. **Wrap App**: Add `<SEOProvider>` wrapper
3. **Configure**: Create `seo-config.ts`
4. **Integrate**: Add `useSEO()` hook where needed
5. **Update HTML**: Enhance `index.html` with default meta tags
6. **Generate Sitemap**: Use sitemap utilities
7. **Validate**: Test with social media validators

### From react-helmet to Catalyst SEO

```tsx
// Before (react-helmet)
import { Helmet } from "react-helmet";

function MyPage() {
  return (
    <>
      <Helmet>
        <title>My Page</title>
        <meta name="description" content="..." />
      </Helmet>
      <div>Content</div>
    </>
  );
}

// After (Catalyst SEO)
import { useSEO } from "@/catalyst-ui/contexts/SEO";

function MyPage() {
  const seo = useSEO();

  useEffect(() => {
    seo.updateSEO({
      title: "My Page",
      description: "...",
    });
  }, []);

  return <div>Content</div>;
}
```

**Benefits**:

- ✅ No additional dependencies
- ✅ Integrated with navigation system
- ✅ TypeScript first
- ✅ Smaller bundle size

## Future Enhancements

### Planned Features

1. **Server-Side Rendering**: Pre-render meta tags on server
2. **Automatic Testing**: Unit tests for SEO provider
3. **SEO Monitoring**: Track SEO metrics over time
4. **A/B Testing**: Test different meta descriptions
5. **Auto-generation**: Generate Open Graph images automatically
6. **Internationalization**: Multi-language SEO support
7. **Schema Generator**: UI for building structured data

### Integration Opportunities

- **CMS Integration**: Dynamic SEO from content management system
- **Analytics Integration**: Track SEO performance in GA4
- **Monitoring**: Alert on missing/broken meta tags
- **CI/CD**: Validate SEO in build pipeline

---

For usage examples and best practices, see [README.md](./README.md).
