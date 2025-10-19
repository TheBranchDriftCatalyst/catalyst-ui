# SEO System Documentation

Comprehensive SEO optimization system for Catalyst UI with dynamic meta tag management, Open Graph support, Twitter Cards, JSON-LD structured data, and sitemap generation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [SEO Configuration](#seo-configuration)
- [Dynamic Meta Tag Management](#dynamic-meta-tag-management)
- [Open Graph & Twitter Cards](#open-graph--twitter-cards)
- [JSON-LD Structured Data](#json-ld-structured-data)
- [Sitemap Generation](#sitemap-generation)
- [Integration with Tab System](#integration-with-tab-system)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The Catalyst UI SEO system provides enterprise-grade search engine optimization with:

- **Dynamic Meta Tags**: Automatically update meta tags on navigation
- **Open Graph Protocol**: Rich social media sharing on Facebook, LinkedIn, etc.
- **Twitter Cards**: Optimized Twitter sharing with large image cards
- **JSON-LD Structured Data**: Schema.org markup for enhanced search results
- **Sitemap Generation**: Utilities to generate sitemap.xml and robots.txt
- **Tab Integration**: Seamless integration with the tab navigation system

## Features

### Core SEO Features

✅ **Dynamic Title & Description**: Updates on every tab change
✅ **Canonical URLs**: Prevent duplicate content issues
✅ **Keywords Meta Tags**: Legacy but still useful for some search engines
✅ **Robots Directives**: Control search engine crawling behavior
✅ **Multi-Language Support**: i18n-ready with locale metadata

### Social Media Optimization

✅ **Open Graph (Facebook/LinkedIn)**: Title, description, image, type, URL, site name, locale
✅ **Twitter Cards**: Summary large image, site handle, creator handle
✅ **Image Optimization**: Alt text, dimensions for proper rendering

### Structured Data

✅ **JSON-LD Format**: Machine-readable data for search engines
✅ **Schema.org Types**: WebSite, Organization, SoftwareApplication, WebPage, BreadcrumbList
✅ **Rich Snippets**: Enhanced search results with ratings, breadcrumbs, etc.

### Developer Experience

✅ **TypeScript First**: Comprehensive type definitions
✅ **React Context API**: Easy access to SEO utilities
✅ **Automatic Updates**: Integrated with navigation system
✅ **Hot Reload Support**: Works seamlessly in development

## Quick Start

### 1. Wrap Your App with SEOProvider

```tsx
import { SEOProvider } from "@/catalyst-ui/contexts/SEO";
import { DEFAULT_SEO } from "./seo-config";

function App() {
  return (
    <SEOProvider
      config={{
        defaultSEO: DEFAULT_SEO,
        baseUrl: "https://catalyst-ui.dev",
        siteName: "Catalyst UI",
        twitterHandle: "@catalyst_ui",
      }}
    >
      <YourApp />
    </SEOProvider>
  );
}
```

### 2. Use the SEO Hook

```tsx
import { useSEO } from "@/catalyst-ui/contexts/SEO";

function MyComponent() {
  const seo = useSEO();

  // Update SEO for this page
  useEffect(() => {
    seo.updateSEO({
      title: "My Page - Catalyst UI",
      description: "This is my awesome page",
      canonical: "https://catalyst-ui.dev/my-page",
    });
  }, []);

  return <div>My Component</div>;
}
```

### 3. Configure Tab-Specific SEO

```tsx
// app/seo-config.ts
export const TAB_SEO_CONFIG: Record<string, Partial<SEOMetadata>> = {
  overview: {
    title: "Overview - Catalyst UI",
    description: "A production-ready React component library...",
    keywords: ["react", "component library", "ui"],
    openGraph: {
      title: "Catalyst UI - Production-Ready React Components",
      description: "Build modern web applications...",
      type: "website",
      image: "https://catalyst-ui.dev/og-image.png",
    },
    twitter: {
      card: "summary_large_image",
      title: "Catalyst UI - Production-Ready React Components",
      image: "https://catalyst-ui.dev/og-image.png",
    },
  },
  // ... more tabs
};
```

## SEO Configuration

### SEOMetadata Interface

```typescript
interface SEOMetadata {
  // Basic SEO
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  robots?: string;

  // Social Media
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;

  // Structured Data
  structuredData?: StructuredData[];

  // Additional Tags
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  links?: Array<{
    rel: string;
    href: string;
  }>;
}
```

### Open Graph Metadata

```typescript
interface OpenGraphMetadata {
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
```

### Twitter Card Metadata

```typescript
interface TwitterCardMetadata {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}
```

## Dynamic Meta Tag Management

The SEO system automatically manages meta tags in the document `<head>`:

### How It Works

1. **Initial Load**: SEOProvider applies default SEO from config
2. **Navigation**: Tab changes trigger SEO updates via `getSEOForTab()`
3. **DOM Updates**: Meta tags are created or updated automatically
4. **Cleanup**: Old structured data is removed before new data is added

### Meta Tag Creation

```tsx
// SEOProvider automatically handles this
updateMetaTag("name", "description", "My awesome description");
// Creates: <meta name="description" content="My awesome description" />

updateMetaTag("property", "og:title", "My Page");
// Creates: <meta property="og:title" content="My Page" />
```

### Programmatic Updates

```tsx
const seo = useSEO();

// Update multiple fields at once
seo.updateSEO({
  title: "New Page Title",
  description: "New description",
  keywords: ["react", "seo", "optimization"],
  openGraph: {
    title: "Social Media Title",
    description: "Social description",
    image: "https://example.com/image.png",
  },
});

// Get current SEO
const currentSEO = seo.getCurrentSEO();

// Reset to defaults
seo.resetSEO();
```

## Open Graph & Twitter Cards

### Why Open Graph?

Open Graph meta tags control how your links appear when shared on:

- Facebook
- LinkedIn
- Slack
- Discord
- WhatsApp
- And many other platforms

### Example Configuration

```tsx
{
  openGraph: {
    title: "Catalyst UI - Modern React Components",
    description: "Build beautiful applications with our component library",
    type: "website",
    image: "https://catalyst-ui.dev/og-image.png",
    imageAlt: "Catalyst UI Logo",
    imageWidth: 1200,
    imageHeight: 630,
    url: "https://catalyst-ui.dev",
    siteName: "Catalyst UI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@catalyst_ui",
    creator: "@catalyst_ui",
    title: "Catalyst UI - Modern React Components",
    description: "Build beautiful applications",
    image: "https://catalyst-ui.dev/og-image.png",
    imageAlt: "Catalyst UI Logo",
  }
}
```

### Image Recommendations

- **Dimensions**: 1200 x 630 pixels (recommended)
- **Format**: PNG or JPG
- **File Size**: < 5 MB
- **Aspect Ratio**: 1.91:1
- **Content**: Avoid text-heavy images (use actual text instead)

## JSON-LD Structured Data

### What is JSON-LD?

JSON-LD (JavaScript Object Notation for Linked Data) is a method to describe structured data using JSON. Search engines use it to understand your content and display rich results.

### Benefits

- ✅ **Rich Snippets**: Enhanced search results with ratings, prices, breadcrumbs
- ✅ **Knowledge Graph**: Your content can appear in Google's Knowledge Panel
- ✅ **Voice Search**: Better compatibility with voice assistants
- ✅ **Mobile Search**: Enhanced mobile search results

### Supported Schema Types

#### WebSite

```typescript
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Catalyst UI",
  "url": "https://catalyst-ui.dev",
  "description": "Production-ready React component library",
  "inLanguage": "en-US"
}
```

#### Organization

```typescript
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Catalyst UI",
  "url": "https://catalyst-ui.dev",
  "logo": "https://catalyst-ui.dev/logo.png",
  "sameAs": [
    "https://github.com/catalyst-ui",
    "https://twitter.com/catalyst_ui"
  ]
}
```

#### BreadcrumbList

```typescript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://catalyst-ui.dev"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Components",
      "item": "https://catalyst-ui.dev/catalyst/components"
    }
  ]
}
```

## Sitemap Generation

### Generate Sitemap from Tabs

```tsx
import {
  generateSitemapFromTabs,
  generateRobotsTxt,
  getCurrentDateISO,
  downloadSitemap,
  downloadRobotsTxt,
} from "./utils/sitemap-generator";
import { initialTabs } from "./tabs/loader";

// Generate sitemap
const sitemap = generateSitemapFromTabs(initialTabs, {
  baseUrl: "https://catalyst-ui.dev",
  lastmod: getCurrentDateISO(),
  defaultChangefreq: "weekly",
  defaultPriority: 0.8,
});

// Generate robots.txt
const robotsTxt = generateRobotsTxt("https://catalyst-ui.dev/sitemap.xml");

// Download files (browser)
downloadSitemap(sitemap);
downloadRobotsTxt(robotsTxt);
```

### Example sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://catalyst-ui.dev</loc>
    <lastmod>2025-10-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://catalyst-ui.dev/catalyst/overview</loc>
    <lastmod>2025-10-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

### Example robots.txt

```
User-agent: *
Allow: /

Sitemap: https://catalyst-ui.dev/sitemap.xml
```

## Integration with Tab System

The SEO system is fully integrated with the tab navigation system in `app/App.tsx`:

```tsx
// Auto-update SEO on tab changes
useEffect(() => {
  const seoConfig = getSEOForTab(activeTab, activeSection);
  seo.updateSEO(seoConfig);
}, [activeSection, activeTab, seo]);

// Auto-update SEO on browser back/forward
useEffect(() => {
  const handlePopState = () => {
    const seoConfig = getSEOForTab(tab, section);
    seo.updateSEO(seoConfig);
  };
  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [seo]);
```

This means:

- ✅ Every tab navigation updates SEO automatically
- ✅ Browser back/forward updates SEO correctly
- ✅ Direct URL access loads correct SEO metadata
- ✅ Social media crawlers see the right content

## Best Practices

### 1. Title Tags

- **Length**: 50-60 characters
- **Format**: "Page Name - Site Name"
- **Unique**: Every page should have a unique title
- **Keywords**: Include primary keyword near the beginning

### 2. Meta Descriptions

- **Length**: 150-160 characters
- **Actionable**: Include a call to action
- **Unique**: Don't duplicate across pages
- **Keywords**: Include relevant keywords naturally

### 3. Keywords

- **Relevant**: Only use keywords relevant to the page
- **Natural**: Don't keyword stuff
- **Limit**: 5-10 keywords per page maximum
- **Long-tail**: Include long-tail keywords for specificity

### 4. Canonical URLs

- **Always set**: Prevents duplicate content issues
- **Absolute**: Use full URLs, not relative paths
- **Consistent**: Match your preferred URL structure

### 5. Images for Social Sharing

- **Resolution**: 1200 x 630 px minimum
- **File size**: < 5 MB
- **Alt text**: Always provide descriptive alt text
- **Relevant**: Image should relate to page content

### 6. Structured Data

- **Validate**: Use Google's Rich Results Test
- **Relevant**: Only use schema types that match your content
- **Complete**: Fill all required fields
- **Test**: Check how it appears in search results

## Troubleshooting

### SEO Not Updating on Navigation

**Problem**: Meta tags don't change when switching tabs

**Solution**:

1. Check that SEOProvider is wrapping your app
2. Verify useSEO() is being called
3. Ensure seo.updateSEO() is in useEffect
4. Check browser console for errors

### Social Media Preview Not Showing

**Problem**: Link preview is broken on Facebook/Twitter

**Solution**:

1. Verify Open Graph tags are present: `view-source:https://your-site.com`
2. Use Facebook Debugger: https://developers.facebook.com/tools/debug/
3. Use Twitter Card Validator: https://cards-dev.twitter.com/validator
4. Clear social media cache (may take 24-48 hours)
5. Ensure image URLs are absolute and accessible

### Structured Data Errors

**Problem**: Google Search Console shows structured data errors

**Solution**:

1. Use Rich Results Test: https://search.google.com/test/rich-results
2. Check required fields are present
3. Validate JSON syntax
4. Ensure URLs are absolute
5. Match schema types to your content

### Sitemap Not Updating

**Problem**: Sitemap.xml is outdated

**Solution**:

1. Re-generate sitemap using `generateSitemapFromTabs()`
2. Update lastmod date to current date
3. Submit new sitemap to Google Search Console
4. Check that sitemap URL is correct in robots.txt

## Additional Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## Next Steps

1. **Create Open Graph Images**: Design 1200x630 images for each major section
2. **Submit Sitemap**: Submit sitemap.xml to Google Search Console
3. **Monitor Performance**: Track SEO metrics in Google Analytics
4. **Test Social Sharing**: Verify link previews on all platforms
5. **Validate Structured Data**: Use Google's Rich Results Test
6. **Set Up Search Console**: Monitor search performance and indexing

---

For more details on specific features, see:

- [SEO Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Analytics Integration](../analytics/README.md)
