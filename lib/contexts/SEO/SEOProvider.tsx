/**
 * SEO Provider
 * Dynamic meta tag management with Open Graph, Twitter Cards, and JSON-LD support
 */

import React, { useCallback, useEffect, useState } from "react";
import type { SEOContextValue, SEOMetadata, SEOConfig } from "./types";
import { SEOContext } from "./SEOContext";

interface SEOProviderProps {
  children: React.ReactNode;
  /** SEO configuration */
  config: SEOConfig;
}

const DEFAULT_METADATA: SEOMetadata = {
  title: "Catalyst UI",
  description: "A production-ready React component library",
};

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
    // Update or create meta description
    if (metadata.description) {
      updateMetaTag("name", "description", metadata.description);
    }

    // Update keywords
    if (metadata.keywords && metadata.keywords.length > 0) {
      updateMetaTag("name", "keywords", metadata.keywords.join(", "));
    }

    // Update robots
    if (metadata.robots) {
      updateMetaTag("name", "robots", metadata.robots);
    }

    // Update Open Graph tags
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

    // Update Twitter Card tags
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

    // Update additional meta tags
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

  // Helper to update or create meta tags
  const updateMetaTag = (attribute: string, key: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);

    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  };

  // Helper to update or create link tags
  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", rel);
      document.head.appendChild(element);
    }

    element.setAttribute("href", href);
  };

  // Helper to update JSON-LD structured data
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
        ? ({ ...prev.openGraph, ...newMetadata.openGraph } as any)
        : prev.openGraph,
      twitter: newMetadata.twitter
        ? ({ ...prev.twitter, ...newMetadata.twitter } as any)
        : prev.twitter,
    }));
  }, []);

  const getCurrentSEO = useCallback(() => {
    return metadata;
  }, [metadata]);

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
