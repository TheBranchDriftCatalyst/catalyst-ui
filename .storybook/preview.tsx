/**
 * Storybook Preview Configuration
 *
 * TODO: SPLIT & REFACTOR
 * - Extract withBackgroundSync decorator to separate file (.storybook/decorators/withBackgroundSync.ts)
 * - Extract theme switcher decorator to separate file (.storybook/decorators/withThemeSwitcher.ts)
 * - Extract massive CSS injection logic to utility (.storybook/utils/injectDocsTheme.ts)
 * - Move isColorDark helper to shared utils
 *
 * TODO: AUDIT & CLEANUP
 * - Review if all those Storybook theme CSS overrides are still necessary (lines 78-338)
 * - Check if we can simplify the background sync logic
 * - Test if "pure-dark" and "pure-light" backgrounds are actually used
 * - Consider removing unused addon configurations
 * - Verify all globalTypes/toolbar items are needed
 *
 * TODO: OPTIMIZATION
 * - The CSS injection on every background change might be heavy - consider memoization
 * - Check if we can reduce specificity in CSS selectors
 */
import { addons } from "storybook/internal/preview-api";
import { themes as sbThemes } from "storybook/theming";
import "../lib/global.css";
// Frontload all theme CSS for Storybook (normally dynamically loaded by ThemeProvider)
// Using Vite's glob import to automatically load all theme CSS files
import.meta.glob("../lib/contexts/Theme/styles/*.css", { eager: true });
import { useEffect } from "react";
import { useGlobals } from "storybook/internal/preview-api";

const channel = addons.getChannel();

// Helper to determine if a color is dark
const isColorDark = (hexColor: string): boolean => {
  if (!hexColor || hexColor === "transparent") return false;
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// Decorator to sync backgrounds to docs mode AND set light/dark class on html
const withBackgroundSync = (Story, context) => {
  const [globals] = useGlobals();
  const backgroundName = globals?.backgrounds?.value;

  useEffect(() => {
    if (!backgroundName) return;

    const backgrounds = context.parameters?.backgrounds?.values || [];
    const selectedBg = backgrounds.find(bg => bg.name === backgroundName);

    // Use theme design tokens if "theme" option selected, otherwise use explicit color
    let backgroundColor;
    if (backgroundName === "theme-dark") {
      // Use CSS variable from current theme
      backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      backgroundColor = backgroundColor.startsWith("hsl")
        ? `hsl(${backgroundColor})`
        : backgroundColor;
    } else if (backgroundName === "theme-light") {
      // For light variant, still use theme's background
      backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      backgroundColor = backgroundColor.startsWith("hsl")
        ? `hsl(${backgroundColor})`
        : backgroundColor;
    } else {
      backgroundColor = selectedBg?.value || backgroundName || "#0a0a0a";
    }

    const isDark =
      backgroundName === "theme-dark" ||
      (backgroundName !== "theme-light" && isColorDark(backgroundColor));

    // Update html class to include light/dark (but preserve theme-* classes)
    const html = document.documentElement;
    const currentThemeClass = Array.from(html.classList).find(c => c.startsWith("theme-"));
    html.classList.remove("light", "dark");
    html.classList.add(isDark ? "dark" : "light");
    // Ensure theme class is still present
    if (currentThemeClass && !html.classList.contains(currentThemeClass)) {
      html.classList.add(currentThemeClass);
    }

    // Remove existing style tag if present
    let styleTag = document.getElementById("storybook-bg-override");
    if (styleTag) {
      styleTag.remove();
    }

    styleTag = document.createElement("style");
    styleTag.id = "storybook-bg-override";

    // Get the appropriate Storybook theme (using themes.dark/light which have the correct structure)
    const theme = isDark ? sbThemes.dark : sbThemes.light;

    // HACK THE PLANET: Inject Storybook's EXACT theme properties extracted from node_modules
    // CRITICAL: Avoid bleeding into component previews by excluding .sb-story and #story--* elements
    // This fixes hte dumb issue of not being able to toggle docs theme after runtime... comeon bros|bras
    //  AI Generated this hack, so if some future update breaks it, just have AI do it again, wasnt hard
    // once i told it to go nuclear and just do the tedious work of replicating the entire structure
    // TODO: lets maybe extract this big blob to a seperate helper util
    styleTag.textContent = `
        /* Override background - ONLY Storybook docs UI, NOT component previews */
        .sbdocs.sbdocs-wrapper,
        .sbdocs-content,
        .sb-main-padded:not(:has(.docs-story)):not(:has(.sb-story)),
        #storybook-docs {
          background-color: ${backgroundColor} !important;
        }

        /* Inject Storybook theme text colors - EXCLUDE STORY CONTENT */
        .sbdocs:not(.sb-story):not(#story--*),
        .sbdocs-wrapper > *:not(.docs-story):not(.sb-story),
        .sbdocs-content > *:not(.docs-story):not(.sb-story) {
          color: ${theme.textColor};
          font-family: ${theme.fontBase};
        }

        /* Headings - ONLY in docs, not in stories */
        .sbdocs > h1,
        .sbdocs > h2,
        .sbdocs > h3,
        .sbdocs > h4,
        .sbdocs > h5,
        .sbdocs > h6,
        .sbdocs-content > h1,
        .sbdocs-content > h2,
        .sbdocs-content > h3,
        .sbdocs-content > h4,
        .sbdocs-content > h5,
        .sbdocs-content > h6,
        .sbdocs .sbdocs-title,
        .sbdocs .sbdocs-subtitle {
          color: ${theme.textColor} !important;
          border-bottom-color: ${theme.appBorderColor} !important;
        }

        /* Text elements - ONLY outside story previews */
        .sbdocs > p,
        .sbdocs > li,
        .sbdocs > span:not(.token),
        .sbdocs-content > p,
        .sbdocs-content > ul > li,
        .sbdocs-content > ol > li {
          color: ${theme.textMutedColor} !important;
        }

        /* Links - ONLY in docs text */
        .sbdocs > a,
        .sbdocs > a:visited,
        .sbdocs-content > p > a,
        .sbdocs-content > ul > li > a,
        .sbdocs-content > ol > li > a {
          color: ${theme.colorSecondary} !important;
        }

        .sbdocs > a:hover,
        .sbdocs-content > p > a:hover,
        .sbdocs-content > ul > li > a:hover,
        .sbdocs-content > ol > li > a:hover {
          color: ${theme.barHoverColor} !important;
        }

        /* Inline code - ONLY in docs descriptions, not components */
        .sbdocs-content > * code:not(pre code),
        .sbdocs > * code:not(pre code),
        .docblock-description code:not(pre code) {
          color: ${theme.textColor} !important;
          background: ${theme.inputBg} !important;
          border: 1px solid ${theme.appBorderColor} !important;
          font-family: ${theme.fontCode} !important;
          padding: 2px 6px !important;
          border-radius: ${theme.inputBorderRadius}px !important;
        }

        /* Code blocks - ONLY docs code examples, not in story previews */
        .sbdocs-content > pre,
        .sbdocs > pre,
        .sbdocs pre.prismjs {
          background: ${theme.appContentBg} !important;
          border: 1px solid ${theme.appBorderColor} !important;
          color: ${theme.textColor} !important;
          border-radius: ${theme.appBorderRadius}px !important;
        }

        .sbdocs-content > pre code,
        .sbdocs > pre code,
        .sbdocs pre.prismjs code {
          color: ${theme.textColor} !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        /* Syntax highlighting for code blocks */
        .sbdocs .token.comment,
        .sbdocs .token.prolog,
        .sbdocs .token.doctype,
        .sbdocs .token.cdata {
          color: ${theme.textMutedColor} !important;
        }

        .sbdocs .token.punctuation {
          color: ${theme.textColor} !important;
        }

        .sbdocs .token.property,
        .sbdocs .token.tag,
        .sbdocs .token.boolean,
        .sbdocs .token.number,
        .sbdocs .token.constant,
        .sbdocs .token.symbol,
        .sbdocs .token.deleted {
          color: ${theme.colorPrimary} !important;
        }

        .sbdocs .token.selector,
        .sbdocs .token.attr-name,
        .sbdocs .token.string,
        .sbdocs .token.char,
        .sbdocs .token.builtin,
        .sbdocs .token.inserted {
          color: ${theme.colorSecondary} !important;
        }

        .sbdocs .token.operator,
        .sbdocs .token.entity,
        .sbdocs .token.url,
        .sbdocs .language-css .token.string,
        .sbdocs .style .token.string {
          color: ${theme.textColor} !important;
        }

        .sbdocs .token.atrule,
        .sbdocs .token.attr-value,
        .sbdocs .token.keyword {
          color: ${theme.colorSecondary} !important;
        }

        .sbdocs .token.function,
        .sbdocs .token.class-name {
          color: ${theme.colorPrimary} !important;
        }

        /* Tables - COMPLETE COVERAGE */
        .sbdocs table,
        .sbdocs table.docblock-argstable,
        .sbdocs .docblock-argstable {
          border-color: ${theme.appBorderColor} !important;
          background: transparent !important;
          border-collapse: collapse !important;
        }

        .sbdocs thead,
        .sbdocs thead tr,
        .sbdocs .docblock-argstable-head {
          background: ${theme.barBg} !important;
        }

        .sbdocs th,
        .sbdocs .docblock-argstable-head th {
          color: ${theme.textColor} !important;
          background: ${theme.barBg} !important;
          border-color: ${theme.appBorderColor} !important;
          font-weight: 600 !important;
        }

        .sbdocs tbody,
        .sbdocs tbody tr,
        .sbdocs .docblock-argstable-body,
        .sbdocs .docblock-argstable-body tr {
          background: ${theme.appContentBg} !important;
        }

        .sbdocs tbody tr:nth-of-type(odd),
        .sbdocs .docblock-argstable-body tr:nth-of-type(odd) {
          background: ${theme.appBg} !important;
        }

        .sbdocs td,
        .sbdocs .docblock-argstable-body td {
          color: ${theme.textMutedColor} !important;
          background: transparent !important;
          border-color: ${theme.appBorderColor} !important;
        }

        .sbdocs tr {
          border-color: ${theme.appBorderColor} !important;
        }

        /* Dividers */
        .sbdocs hr {
          border-color: ${theme.appBorderColor} !important;
          background: ${theme.appBorderColor} !important;
        }

        /* Story preview blocks - keep white for component visibility */
        .sbdocs .sbdocs-preview,
        .sbdocs .docs-story,
        .sbdocs .sb-story {
          background: ${theme.appPreviewBg} !important;
          border: 1px solid ${theme.appBorderColor} !important;
          border-radius: ${theme.appBorderRadius}px !important;
        }

        /* Boolean/toggle controls - ONLY Storybook controls */
        .sbdocs-content > .docblock-argstable input[type="checkbox"],
        .sbdocs > .docblock-argstable .boolean-control {
          background: ${theme.booleanBg} !important;
          border-color: ${theme.buttonBorder} !important;
        }

        .sbdocs-content > .docblock-argstable input[type="checkbox"]:checked,
        .sbdocs > .docblock-argstable .boolean-control.checked {
          background: ${theme.booleanSelectedBg} !important;
        }

        /* Buttons in docs - ONLY Storybook toolbar/control buttons */
        .sbdocs > .docblock-argstable button:not(.primary),
        .sbdocs-content > .docblock-argstable button:not(.primary) {
          background: ${theme.buttonBg} !important;
          border: 1px solid ${theme.buttonBorder} !important;
          color: ${theme.textColor} !important;
        }

        .sbdocs > .docblock-argstable button:hover:not(.primary),
        .sbdocs-content > .docblock-argstable button:hover:not(.primary) {
          background: ${theme.booleanSelectedBg} !important;
        }

        /* Description/subtitle text */
        .sbdocs .sbdocs-description,
        .sbdocs .docblock-description {
          color: ${theme.textMutedColor} !important;
        }

        /* Controls/inputs in docs - ONLY Storybook controls, not your components */
        .sbdocs-content > .docblock-argstable input,
        .sbdocs-content > .docblock-argstable textarea,
        .sbdocs-content > .docblock-argstable select {
          background: ${theme.inputBg} !important;
          border: 1px solid ${theme.inputBorder} !important;
          color: ${theme.inputTextColor} !important;
          border-radius: ${theme.inputBorderRadius}px !important;
        }

        /* Badges/tags - ONLY Storybook badges */
        .sbdocs .sbdocs-badge,
        .docblock-argstable code.badge {
          background: ${theme.buttonBg} !important;
          border: 1px solid ${theme.buttonBorder} !important;
          color: ${theme.textColor} !important;
        }

        /* Blockquotes - ONLY in docs content */
        .sbdocs-content > blockquote,
        .sbdocs > blockquote {
          border-left-color: ${theme.colorSecondary} !important;
          background: ${theme.inputBg} !important;
          color: ${theme.textMutedColor} !important;
        }
      `;

    document.head.appendChild(styleTag);
  }, [backgroundName]);

  return Story();
};

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "theme-dark",
      values: [
        { name: "theme-dark", title: "Theme Dark (uses --background)", value: "var(--background)" },
        {
          name: "theme-light",
          title: "Theme Light (uses --background)",
          value: "var(--background)",
        },
        { name: "pure-dark", title: "Pure Dark", value: "#0a0a0a" },
        { name: "pure-light", title: "Pure Light", value: "#f5f5f5" },
      ],
    },
    docs: {
      codePanel: true,
      // Apply backgrounds to docs pages
      canvas: {
        sourceState: "shown",
      },
      // No static theme - we inject it dynamically via decorator
    },
  },
  decorators: [
    withBackgroundSync,
    // Theme switcher decorator - applies theme-* class to html element
    Story => {
      const [globals] = useGlobals();
      const selectedTheme = globals?.theme || "catalyst";

      useEffect(() => {
        const html = document.documentElement;
        // Remove all theme-* classes
        Array.from(html.classList)
          .filter(c => c.startsWith("theme-"))
          .forEach(c => html.classList.remove(c));

        // Apply selected theme
        html.classList.add(`theme-${selectedTheme}`);
      }, [selectedTheme]);

      return Story();
    },
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "catalyst",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "catalyst", title: "Catalyst" },
          { value: "dracula", title: "Dracula" },
          { value: "gold", title: "Gold" },
          { value: "laracon", title: "Laracon" },
          { value: "nature", title: "Nature" },
          { value: "netflix", title: "Netflix" },
          { value: "nord", title: "Nord" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
