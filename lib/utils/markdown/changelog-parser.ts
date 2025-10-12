/**
 * @module markdown/changelog-parser
 * @description Specialized parser for conventional CHANGELOG.md files.
 *
 * Parses structured changelog markdown into timeline-ready data with versions,
 * dates, categories, and change entries. Designed for Conventional Changelog format.
 *
 * **Expected CHANGELOG.md structure:**
 * ```markdown
 * ## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)
 *
 * ### ✨ FEATURES
 * - Added new feature X
 * - Implemented feature Y
 *
 * ### 🐛 BUG FIXES
 * - Fixed issue with Z
 * ```
 *
 * **Parsing rules:**
 * - H2 headers = Version entries with optional date and comparison URL
 * - H3 headers = Categories (FEATURES, BUG FIXES, etc.) with optional emoji
 * - Lists = Change items under each category
 *
 * @example Basic usage
 * ```ts
 * import { parseChangelog } from '@/catalyst-ui/utils/markdown/changelog-parser';
 *
 * const changelogMd = `
 * ## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)
 *
 * ### ✨ FEATURES
 * - Added new feature
 *
 * ### 🐛 BUG FIXES
 * - Fixed critical bug
 * `;
 *
 * const entries = parseChangelog(changelogMd);
 * // entries[0].version === "1.0.0"
 * // entries[0].categories[0].name === "FEATURES"
 * // entries[0].categories[0].emoji === "✨"
 * ```
 *
 * @see {@link parseMarkdown} for underlying markdown parsing
 */

import type { Heading, List } from "mdast";
import { parseMarkdown } from "./parser";

/**
 * Represents a single changelog entry for a version.
 *
 * Each entry corresponds to one version release with categorized changes.
 *
 * @property version - Semantic version string (e.g., "1.0.0")
 * @property date - Release date in ISO format (YYYY-MM-DD) or "Unknown"
 * @property url - Optional GitHub comparison URL for this version
 * @property categories - Array of change categories (features, fixes, etc.)
 *
 * @example
 * ```ts
 * const entry: ChangelogEntry = {
 *   version: "1.0.0",
 *   date: "2025-10-06",
 *   url: "https://github.com/user/repo/compare/v0.9.0...v1.0.0",
 *   categories: [
 *     { name: "FEATURES", emoji: "✨", items: ["New feature"] },
 *     { name: "BUG FIXES", emoji: "🐛", items: ["Fixed bug"] }
 *   ]
 * };
 * ```
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  url?: string;
  categories: ChangelogCategory[];
}

/**
 * Represents a category of changes within a changelog entry.
 *
 * Categories group related changes (e.g., FEATURES, BUG FIXES, DOCUMENTATION).
 *
 * @property name - Category name in uppercase (e.g., "FEATURES", "BUG FIXES")
 * @property emoji - Optional emoji prefix (e.g., "✨", "🐛", "📚")
 * @property items - Array of change descriptions
 *
 * @example
 * ```ts
 * const category: ChangelogCategory = {
 *   name: "FEATURES",
 *   emoji: "✨",
 *   items: [
 *     "Added dark mode support",
 *     "Implemented user authentication"
 *   ]
 * };
 * ```
 */
export interface ChangelogCategory {
  name: string;
  emoji?: string;
  items: string[];
}

/**
 * Extract semantic version number from heading text.
 *
 * Matches semantic versioning format (X.Y.Z) within heading text.
 * Handles versions wrapped in brackets or plain format.
 *
 * @param text - Heading text containing version (e.g., "[1.0.0] (2025-10-06)")
 * @returns Extracted version string or null if not found
 *
 * @example
 * ```ts
 * extractVersion("[1.0.0] (2025-10-06)"); // "1.0.0"
 * extractVersion("Version 2.3.4");        // "2.3.4"
 * extractVersion("No version here");      // null
 * ```
 *
 * @internal
 */
function extractVersion(text: string): string | null {
  const match = text.match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Extract ISO date from heading text.
 *
 * Looks for dates in parentheses following ISO format (YYYY-MM-DD).
 *
 * @param text - Heading text containing date (e.g., "[1.0.0] (2025-10-06)")
 * @returns Extracted date string or null if not found
 *
 * @example
 * ```ts
 * extractDate("(2025-10-06)");           // "2025-10-06"
 * extractDate("[1.0.0] (2025-10-06)");   // "2025-10-06"
 * extractDate("No date here");           // null
 * ```
 *
 * @internal
 */
function extractDate(text: string): string | null {
  const match = text.match(/\((\d{4}-\d{2}-\d{2})\)/);
  return match ? match[1] : null;
}

/**
 * Extract category name and optional emoji from heading text.
 *
 * Parses category headings that may start with emoji or symbols.
 * Handles emojis with variation selectors (e.g., ♻️) and unicode symbols.
 *
 * @param text - Heading text (e.g., "### 📚 DOCUMENTATION")
 * @returns Object with category name and optional emoji
 *
 * @example
 * ```ts
 * extractCategory("📚 DOCUMENTATION");  // { name: "DOCUMENTATION", emoji: "📚" }
 * extractCategory("✨ FEATURES");       // { name: "FEATURES", emoji: "✨" }
 * extractCategory("BREAKING CHANGES");  // { name: "BREAKING CHANGES" }
 * extractCategory("♻️ REFACTORING");    // { name: "REFACTORING", emoji: "♻️" }
 * ```
 *
 * @internal
 */
function extractCategory(text: string): { name: string; emoji?: string } {
  // Match any emoji or symbol character(s) followed by space and text
  // This catches emojis, symbols with variation selectors (️), etc.
  const emojiMatch = text.match(/^([^\w\s]+)\s+(.+)$/);
  if (emojiMatch) {
    return { emoji: emojiMatch[1].trim(), name: emojiMatch[2].trim() };
  }
  return { name: text };
}

/**
 * Extract plain text from heading node children.
 *
 * Recursively extracts text from heading children, handling text nodes,
 * links, and other inline elements.
 *
 * @param heading - mdast Heading node
 * @returns Combined text content of all children
 *
 * @example
 * ```ts
 * // Heading with link: ## [1.0.0](https://github.com/user/repo)
 * const heading: Heading = {
 *   type: 'heading',
 *   depth: 2,
 *   children: [{ type: 'link', url: '...', children: [{ type: 'text', value: '1.0.0' }] }]
 * };
 * getHeadingText(heading); // "1.0.0"
 * ```
 *
 * @internal
 */
function getHeadingText(heading: Heading): string {
  return heading.children
    .map(child => {
      if ("value" in child) return child.value;
      if (child.type === "link") {
        // Extract text from link children
        return child.children.map(c => ("value" in c ? c.value : "")).join("");
      }
      return "";
    })
    .join("");
}

/**
 * Parse a CHANGELOG.md file into structured entries.
 *
 * Transforms conventional changelog markdown into a structured format suitable
 * for rendering timelines or displaying version history. Supports GitHub
 * comparison URLs and emoji-prefixed categories.
 *
 * **Expected structure:**
 * ```markdown
 * ## [version](comparison-url) (YYYY-MM-DD)
 *
 * ### emoji CATEGORY_NAME
 * - Change item 1
 * - Change item 2
 * ```
 *
 * **Parsing algorithm:**
 * 1. Parse markdown to AST via {@link parseMarkdown}
 * 2. Iterate through AST nodes:
 *    - H2 = Version header (extracts version, date, URL)
 *    - H3 = Category header (extracts name and emoji)
 *    - List = Change items for current category
 * 3. Group changes into categories within entries
 *
 * @param markdown - Raw CHANGELOG.md content
 * @returns Array of structured changelog entries, newest first
 *
 * @example Basic changelog
 * ```ts
 * const changelog = `
 * ## [1.0.0](https://github.com/user/repo/compare/v0.9.0...v1.0.0) (2025-10-06)
 *
 * ### ✨ FEATURES
 * - Added dark mode
 * - Implemented search
 *
 * ### 🐛 BUG FIXES
 * - Fixed memory leak
 * `;
 *
 * const entries = parseChangelog(changelog);
 * console.log(entries[0].version);                    // "1.0.0"
 * console.log(entries[0].date);                       // "2025-10-06"
 * console.log(entries[0].categories[0].name);         // "FEATURES"
 * console.log(entries[0].categories[0].emoji);        // "✨"
 * console.log(entries[0].categories[0].items.length); // 2
 * ```
 *
 * @example With missing date
 * ```ts
 * const changelog = `
 * ## [0.5.0](https://github.com/user/repo/compare/v0.4.0...v0.5.0)
 *
 * ### 📚 DOCUMENTATION
 * - Updated README
 * `;
 *
 * const entries = parseChangelog(changelog);
 * console.log(entries[0].date); // "Unknown"
 * ```
 *
 * @example Multiple versions
 * ```ts
 * const changelog = `
 * ## [2.0.0] (2025-11-01)
 * ### 💥 BREAKING CHANGES
 * - Removed deprecated API
 *
 * ## [1.5.0] (2025-10-15)
 * ### ✨ FEATURES
 * - New feature
 * `;
 *
 * const entries = parseChangelog(changelog);
 * console.log(entries.length);        // 2
 * console.log(entries[0].version);    // "2.0.0"
 * console.log(entries[1].version);    // "1.5.0"
 * ```
 *
 * @see {@link ChangelogEntry} for return type structure
 * @see {@link changelogEntryToTimelineData} to convert entries for timeline display
 */
export function parseChangelog(markdown: string): ChangelogEntry[] {
  const ast = parseMarkdown(markdown);
  const entries: ChangelogEntry[] = [];

  let currentEntry: ChangelogEntry | null = null;
  let currentCategory: ChangelogCategory | null = null;

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // H2 = Version header
    if (node.type === "heading" && (node as Heading).depth === 2) {
      const heading = node as Heading;
      const text = getHeadingText(heading);

      const version = extractVersion(text);
      const date = extractDate(text);

      // Extract URL from link node
      const linkNode = heading.children.find(child => child.type === "link");
      const url = linkNode && "url" in linkNode ? linkNode.url : undefined;

      if (version) {
        // Save previous entry
        if (currentEntry && currentCategory) {
          currentEntry.categories.push(currentCategory);
        }

        // Start new entry
        currentEntry = {
          version,
          date: date || "Unknown",
          url: url || undefined,
          categories: [],
        };
        currentCategory = null;
        entries.push(currentEntry);
      }
    }

    // H3 = Category header (FEATURES, BUG FIXES, etc.)
    if (node.type === "heading" && (node as Heading).depth === 3 && currentEntry) {
      const heading = node as Heading;
      const text = getHeadingText(heading);

      // Save previous category
      if (currentCategory) {
        currentEntry.categories.push(currentCategory);
      }

      const { name, emoji } = extractCategory(text);
      currentCategory = {
        name,
        emoji,
        items: [],
      };
    }

    // List = Category items
    if (node.type === "list" && currentCategory) {
      const list = node as List;
      const items = list.children.map(item => {
        const text = item.children
          .map(child => {
            if (child.type === "paragraph") {
              return child.children
                .map(c => {
                  if ("value" in c) return c.value;
                  if (c.type === "link") {
                    return c.children.map(lc => ("value" in lc ? lc.value : "")).join("");
                  }
                  if (c.type === "strong") {
                    return c.children.map(sc => ("value" in sc ? sc.value : "")).join("");
                  }
                  return "";
                })
                .join("");
            }
            return "";
          })
          .join(" ")
          .trim();

        // Strip leading bullet/asterisk if present
        return text.replace(/^\*\s*/, "").trim();
      });

      currentCategory.items.push(...items);
    }
  }

  // Save last category
  if (currentEntry && currentCategory) {
    currentEntry.categories.push(currentCategory);
  }

  return entries;
}

/**
 * Extract base repository URL from GitHub comparison URL.
 *
 * Strips comparison path to get the root repository URL.
 *
 * @param compareUrl - GitHub comparison URL
 * @returns Base repository URL or undefined
 *
 * @example
 * ```ts
 * const url = "https://github.com/user/repo/compare/v0.9.0...v1.0.0";
 * extractRepoBaseUrl(url); // "https://github.com/user/repo"
 *
 * extractRepoBaseUrl(undefined); // undefined
 * ```
 *
 * @internal
 */
function extractRepoBaseUrl(compareUrl?: string): string | undefined {
  if (!compareUrl) return undefined;
  const match = compareUrl.match(/(https:\/\/github\.com\/[^\/]+\/[^\/]+)/);
  return match ? match[1] : undefined;
}

/**
 * Convert a changelog entry to timeline-compatible format.
 *
 * Flattens the nested category structure into a flat array of achievements
 * suitable for display in a timeline component. Combines category emoji/name
 * with each change item.
 *
 * @param entry - Parsed changelog entry
 * @returns Timeline-ready data structure
 *
 * @example
 * ```ts
 * const entry: ChangelogEntry = {
 *   version: "1.0.0",
 *   date: "2025-10-06",
 *   url: "https://github.com/user/repo/compare/v0.9.0...v1.0.0",
 *   categories: [
 *     {
 *       name: "FEATURES",
 *       emoji: "✨",
 *       items: ["Added dark mode", "Implemented search"]
 *     },
 *     {
 *       name: "BUG FIXES",
 *       emoji: "🐛",
 *       items: ["Fixed memory leak"]
 *     }
 *   ]
 * };
 *
 * const timelineData = changelogEntryToTimelineData(entry);
 * console.log(timelineData.version);              // "1.0.0"
 * console.log(timelineData.date);                 // "2025-10-06"
 * console.log(timelineData.achievements.length);  // 3
 * console.log(timelineData.achievements[0].text); // "✨ FEATURES: Added dark mode"
 * console.log(timelineData.achievements[1].text); // "✨ FEATURES: Implemented search"
 * console.log(timelineData.achievements[2].text); // "🐛 BUG FIXES: Fixed memory leak"
 * ```
 *
 * @example Without emojis
 * ```ts
 * const entry: ChangelogEntry = {
 *   version: "0.5.0",
 *   date: "2025-09-01",
 *   categories: [
 *     { name: "DOCUMENTATION", items: ["Updated README"] }
 *   ]
 * };
 *
 * const timelineData = changelogEntryToTimelineData(entry);
 * console.log(timelineData.achievements[0].text); // "• DOCUMENTATION: Updated README"
 * ```
 *
 * @see {@link ChangelogEntry} for input type
 */
export function changelogEntryToTimelineData(entry: ChangelogEntry) {
  const repoBaseUrl = extractRepoBaseUrl(entry.url);

  return {
    date: entry.date,
    version: entry.version,
    url: entry.url,
    repoBaseUrl,
    achievements: entry.categories.flatMap(category =>
      category.items.map(item => ({
        text: `${category.emoji || "•"} ${category.name}: ${item}`,
        repoBaseUrl,
      }))
    ),
  };
}
