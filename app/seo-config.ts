/**
 * SEO Configuration
 * Tab-specific SEO metadata for dynamic page optimization
 */

import type { SEOMetadata } from "@/catalyst-ui/contexts/SEO";

// Use env variable from CI build, fallback to GitHub Pages URL
const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://thebranchdriftcatalyst.github.io/catalyst-ui";
const SITE_NAME = "Catalyst UI";
const DEFAULT_IMAGE = `${BASE_URL}/og/overview.png`; // Auto-generated OG image
const TWITTER_HANDLE = "@catalyst_ui";

/**
 * Get OG image URL for a tab
 */
const getOGImageUrl = (tabValue: string): string => {
  return `${BASE_URL}/og/${tabValue}.png`;
};

/**
 * Tab-specific SEO configurations
 * Maps tab values to their SEO metadata
 */
export const TAB_SEO_CONFIG: Record<string, Partial<SEOMetadata>> = {
  overview: {
    title: "Overview - Catalyst UI",
    description:
      "A production-ready React component library with Storybook, Radix UI primitives, and Tailwind CSS. Build modern web applications with beautiful, accessible components.",
    keywords: [
      "react",
      "component library",
      "ui",
      "tailwind",
      "radix ui",
      "storybook",
      "typescript",
    ],
    canonical: `${BASE_URL}/catalyst/overview`,
    openGraph: {
      title: "Catalyst UI - Production-Ready React Components",
      description:
        "Build modern web applications with beautiful, accessible React components. Features Storybook, Radix UI, and Tailwind CSS.",
      type: "website",
      image: getOGImageUrl("overview"),
      imageAlt: "Catalyst UI Component Library - Overview",
      url: `${BASE_URL}/catalyst/overview`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title: "Catalyst UI - Production-Ready React Components",
      description: "Build modern web applications with beautiful, accessible React components.",
      image: getOGImageUrl("overview"),
      imageAlt: "Catalyst UI Component Library - Overview",
    },
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
        description: "Production-ready React component library",
        inLanguage: "en-US",
      },
    ],
  },

  cards: {
    title: "Card Components - Catalyst UI",
    description:
      "Explore interactive card components including CreateAccountCard, MultiChoiceQuestion, and more. Built with React, TypeScript, and Tailwind CSS.",
    keywords: ["react cards", "card components", "ui cards", "interactive cards", "form cards"],
    canonical: `${BASE_URL}/catalyst/cards`,
    openGraph: {
      title: "Card Components - Catalyst UI",
      description: "Interactive card components for modern web applications",
      type: "website",
      image: getOGImageUrl("cards"),
      url: `${BASE_URL}/catalyst/cards`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Card Components - Catalyst UI",
      description: "Interactive card components for modern web applications",
      image: getOGImageUrl("cards"),
    },
  },

  components: {
    title: "Components - Catalyst UI",
    description:
      "Browse the complete catalog of Catalyst UI components: headers, navigation, tables, grids, breadcrumbs, and more. All components are accessible and production-ready.",
    keywords: ["react components", "ui components", "component library", "accessible components"],
    canonical: `${BASE_URL}/catalyst/components`,
    openGraph: {
      title: "Components - Catalyst UI",
      description: "Complete catalog of accessible, production-ready React components",
      type: "website",
      image: getOGImageUrl("components"),
      url: `${BASE_URL}/catalyst/components`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Components - Catalyst UI",
      description: "Complete catalog of accessible, production-ready React components",
      image: getOGImageUrl("components"),
    },
  },

  animations: {
    title: "Animation Effects - Catalyst UI",
    description:
      "Discover animation HOCs and CSS keyframe effects: AnimatedFlip, AnimatedFade, AnimatedSlide, AnimatedBounce. Hardware-accelerated, TypeScript-first animations.",
    keywords: [
      "react animations",
      "animation components",
      "css animations",
      "flip animation",
      "fade animation",
    ],
    canonical: `${BASE_URL}/catalyst/animations`,
    openGraph: {
      title: "Animation Effects - Catalyst UI",
      description: "Hardware-accelerated animation HOCs for interactive React components",
      type: "website",
      image: getOGImageUrl("animations"),
      url: `${BASE_URL}/catalyst/animations`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Animation Effects - Catalyst UI",
      description: "Hardware-accelerated animation HOCs for interactive React components",
      image: getOGImageUrl("animations"),
    },
  },

  forcegraph: {
    title: "Force Graph - Catalyst UI",
    description:
      "Interactive D3.js force-directed graph visualization component. Visualize networks, relationships, and hierarchies with customizable nodes and edges.",
    keywords: [
      "d3.js",
      "force graph",
      "graph visualization",
      "network visualization",
      "data visualization",
    ],
    canonical: `${BASE_URL}/catalyst/forcegraph`,
    openGraph: {
      title: "Force Graph - Catalyst UI",
      description: "Interactive D3.js force-directed graph visualization",
      type: "website",
      image: getOGImageUrl("forcegraph"),
      url: `${BASE_URL}/catalyst/forcegraph`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Force Graph - Catalyst UI",
      description: "Interactive D3.js force-directed graph visualization",
      image: getOGImageUrl("forcegraph"),
    },
  },

  theming: {
    title: "Theming System - Catalyst UI",
    description:
      "Explore multi-theme support with CSS custom properties. Choose from Catalyst, Dracula, Gold, Laracon, Nature, Netflix, and Nord themes with light/dark variants.",
    keywords: [
      "react theming",
      "css themes",
      "dark mode",
      "theme switching",
      "css custom properties",
    ],
    canonical: `${BASE_URL}/catalyst/theming`,
    openGraph: {
      title: "Theming System - Catalyst UI",
      description: "Multi-theme support with light/dark variants and CSS custom properties",
      type: "website",
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/catalyst/theming`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Theming System - Catalyst UI",
      description: "Multi-theme support with light/dark variants and CSS custom properties",
      image: DEFAULT_IMAGE,
    },
  },

  forms: {
    title: "Forms & Validation - Catalyst UI",
    description:
      "Form components with React Hook Form and Zod validation. Build type-safe forms with comprehensive validation and error handling.",
    keywords: [
      "react forms",
      "form validation",
      "react hook form",
      "zod validation",
      "form components",
    ],
    canonical: `${BASE_URL}/catalyst/forms`,
    openGraph: {
      title: "Forms & Validation - Catalyst UI",
      description: "Type-safe form components with React Hook Form and Zod",
      type: "website",
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/catalyst/forms`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Forms & Validation - Catalyst UI",
      description: "Type-safe form components with React Hook Form and Zod",
      image: DEFAULT_IMAGE,
    },
  },

  observability: {
    title: "Analytics & Observability - Catalyst UI",
    description:
      "Real-time analytics dashboard with Google Analytics 4 integration. Track events, errors, performance metrics, and user journeys.",
    keywords: [
      "google analytics",
      "analytics dashboard",
      "observability",
      "performance monitoring",
      "error tracking",
    ],
    canonical: `${BASE_URL}/catalyst/observability`,
    openGraph: {
      title: "Analytics & Observability - Catalyst UI",
      description: "Real-time analytics dashboard with GA4 integration",
      type: "website",
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/catalyst/observability`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Analytics & Observability - Catalyst UI",
      description: "Real-time analytics dashboard with GA4 integration",
      image: DEFAULT_IMAGE,
    },
  },

  internationalization: {
    title: "Internationalization (i18n) - Catalyst UI",
    description:
      "Multi-language support with i18next integration. Translate your application into multiple languages with ease.",
    keywords: ["i18n", "internationalization", "translation", "multi-language", "localization"],
    canonical: `${BASE_URL}/catalyst/internationalization`,
    openGraph: {
      title: "Internationalization (i18n) - Catalyst UI",
      description: "Multi-language support with i18next integration",
      type: "website",
      image: DEFAULT_IMAGE,
      url: `${BASE_URL}/catalyst/internationalization`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: "Internationalization (i18n) - Catalyst UI",
      description: "Multi-language support with i18next integration",
      image: DEFAULT_IMAGE,
    },
  },
};

/**
 * Default SEO configuration for fallback
 */
export const DEFAULT_SEO: SEOMetadata = {
  title: SITE_NAME,
  description:
    "A production-ready React component library with Storybook, Radix UI primitives, and Tailwind CSS.",
  canonical: BASE_URL,
  keywords: ["react", "component library", "ui", "tailwind", "typescript"],
  robots: "index, follow",
  openGraph: {
    title: SITE_NAME,
    description: "Production-ready React component library",
    type: "website",
    image: DEFAULT_IMAGE,
    imageAlt: "Catalyst UI Component Library",
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    title: SITE_NAME,
    description: "Production-ready React component library",
    image: DEFAULT_IMAGE,
    imageAlt: "Catalyst UI Component Library",
  },
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
      description:
        "Production-ready React component library with Storybook, Radix UI, and Tailwind CSS",
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: ["https://github.com/catalyst-ui", "https://twitter.com/catalyst_ui"],
    },
  ],
};

/**
 * Get SEO configuration for a specific tab
 */
export const getSEOForTab = (
  tabValue: string,
  section: string = "catalyst"
): Partial<SEOMetadata> => {
  const tabConfig = TAB_SEO_CONFIG[tabValue];

  if (!tabConfig) {
    // Generate dynamic SEO for unknown tabs
    const tabLabel = tabValue
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${tabLabel} - ${SITE_NAME}`,
      description: `Explore ${tabLabel} in Catalyst UI component library`,
      canonical: `${BASE_URL}/${section}/${tabValue}`,
      openGraph: {
        title: `${tabLabel} - ${SITE_NAME}`,
        description: `Explore ${tabLabel} in Catalyst UI component library`,
        type: "website",
        url: `${BASE_URL}/${section}/${tabValue}`,
        siteName: SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: `${tabLabel} - ${SITE_NAME}`,
        description: `Explore ${tabLabel} in Catalyst UI component library`,
      },
    };
  }

  return tabConfig;
};
