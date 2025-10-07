import type { Heading, List } from "mdast";
import { parseMarkdown } from "./parser";

export interface ChangelogEntry {
  version: string;
  date: string;
  url?: string;
  categories: ChangelogCategory[];
}

export interface ChangelogCategory {
  name: string;
  emoji?: string;
  items: string[];
}

/**
 * Extract version number from heading text
 * Examples: "1.0.0", "0.6.0", "0.0.3"
 * Matches semantic version format: X.Y.Z
 */
function extractVersion(text: string): string | null {
  const match = text.match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Extract date from heading text
 * Example: "(2025-10-06)" -> "2025-10-06"
 */
function extractDate(text: string): string | null {
  const match = text.match(/\((\d{4}-\d{2}-\d{2})\)/);
  return match ? match[1] : null;
}

/**
 * Extract category name and emoji from heading
 * Examples: "### 📚 DOCUMENTATION" -> { name: "DOCUMENTATION", emoji: "📚" }
 * Handles various emoji ranges including symbols like ♻️, ⚡, etc.
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
 * Extract text from heading children (handles text, links, etc.)
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
 * Parse CHANGELOG.md into structured timeline entries
 *
 * @param markdown - Raw CHANGELOG.md content
 * @returns Array of changelog entries with versions, dates, and categorized changes
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
 * Extract base repo URL from comparison URL
 * Example: https://github.com/user/repo/compare/... -> https://github.com/user/repo
 */
function extractRepoBaseUrl(compareUrl?: string): string | undefined {
  if (!compareUrl) return undefined;
  const match = compareUrl.match(/(https:\/\/github\.com\/[^\/]+\/[^\/]+)/);
  return match ? match[1] : undefined;
}

/**
 * Convert changelog entry to timeline-friendly format
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
