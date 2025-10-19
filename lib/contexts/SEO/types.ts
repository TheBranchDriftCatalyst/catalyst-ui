/**
 * SEO Type Definitions
 * Comprehensive SEO metadata types for dynamic meta tag management
 */

export interface OpenGraphMetadata {
  /** Open Graph title */
  title: string;
  /** Open Graph description */
  description: string;
  /** Open Graph type (website, article, etc.) */
  type?: "website" | "article" | "profile" | "video.other";
  /** Open Graph image URL */
  image?: string;
  /** Open Graph image alt text */
  imageAlt?: string;
  /** Open Graph image width */
  imageWidth?: number;
  /** Open Graph image height */
  imageHeight?: number;
  /** Open Graph URL (canonical) */
  url?: string;
  /** Open Graph site name */
  siteName?: string;
  /** Open Graph locale */
  locale?: string;
}

export interface TwitterCardMetadata {
  /** Twitter card type */
  card?: "summary" | "summary_large_image" | "app" | "player";
  /** Twitter site handle */
  site?: string;
  /** Twitter creator handle */
  creator?: string;
  /** Twitter title (defaults to og:title if not provided) */
  title?: string;
  /** Twitter description (defaults to og:description if not provided) */
  description?: string;
  /** Twitter image (defaults to og:image if not provided) */
  image?: string;
  /** Twitter image alt text */
  imageAlt?: string;
}

export interface StructuredDataPerson {
  "@type": "Person";
  name: string;
  url?: string;
  sameAs?: string[];
}

export interface StructuredDataOrganization {
  "@type": "Organization";
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export interface StructuredDataWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  author?: StructuredDataPerson | StructuredDataOrganization;
  inLanguage?: string;
}

export interface StructuredDataWebPage {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  url: string;
  description?: string;
  isPartOf?: {
    "@type": "WebSite";
    url: string;
  };
  breadcrumb?: StructuredDataBreadcrumb;
}

export interface StructuredDataBreadcrumb {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export type StructuredData =
  | StructuredDataWebSite
  | StructuredDataWebPage
  | StructuredDataBreadcrumb
  | Record<string, any>;

export interface SEOMetadata {
  /** Page title */
  title: string;
  /** Meta description */
  description: string;
  /** Canonical URL */
  canonical?: string;
  /** Keywords (deprecated but still used) */
  keywords?: string[];
  /** Robots meta directives */
  robots?: string;
  /** Open Graph metadata */
  openGraph?: OpenGraphMetadata;
  /** Twitter Card metadata */
  twitter?: TwitterCardMetadata;
  /** JSON-LD structured data */
  structuredData?: StructuredData[];
  /** Additional meta tags */
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  /** Additional link tags */
  links?: Array<{
    rel: string;
    href: string;
    [key: string]: string;
  }>;
}

export interface SEOConfig {
  /** Default site-wide SEO settings */
  defaultSEO: SEOMetadata;
  /** Per-route SEO overrides */
  routeSEO?: Record<string, Partial<SEOMetadata>>;
  /** Base URL for the site */
  baseUrl: string;
  /** Site name */
  siteName: string;
  /** Default image for social sharing */
  defaultImage?: string;
  /** Twitter handle */
  twitterHandle?: string;
}

export interface SEOContextValue {
  /** Update SEO metadata */
  updateSEO: (metadata: Partial<SEOMetadata>) => void;
  /** Get current SEO metadata */
  getCurrentSEO: () => SEOMetadata;
  /** Reset to default SEO */
  resetSEO: () => void;
  /** Current page metadata */
  metadata: SEOMetadata;
}
