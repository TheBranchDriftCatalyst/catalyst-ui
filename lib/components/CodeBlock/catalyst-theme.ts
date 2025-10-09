import type { ThemeRegistration } from "shiki";

// Extended settings interface to include decorator content field
// Some editors support the 'content' field for special decorators (e.g., carriage-return)
interface ExtendedTokenSettings {
  foreground?: string;
  background?: string;
  fontStyle?: string;
  content?: string;
}

export const catalystTheme: ThemeRegistration = {
  name: "catalyst",
  type: "dark",
  colors: {
    "editor.background": "#0a0a0f",
    "editor.foreground": "#e4e4e7",
    "terminal.ansiBlack": "#0a0a0f",
    "terminal.ansiRed": "#ff2975",
    "terminal.ansiGreen": "#00fcd6",
    "terminal.ansiYellow": "#fbbf24",
    "terminal.ansiBlue": "#00d4ff",
    "terminal.ansiMagenta": "#c026d3",
    "terminal.ansiCyan": "#00fcd6",
    "terminal.ansiWhite": "#e4e4e7",
    "terminal.ansiBrightBlack": "#27272a",
    "terminal.ansiBrightRed": "#ff6ec7",
    "terminal.ansiBrightGreen": "#00fcd6",
    "terminal.ansiBrightYellow": "#fbbf24",
    "terminal.ansiBrightBlue": "#00d4ff",
    "terminal.ansiBrightMagenta": "#c026d3",
    "terminal.ansiBrightCyan": "#00fcd6",
    "terminal.ansiBrightWhite": "#fafafa",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        foreground: "#a1a1aa",
        fontStyle: "italic",
      },
    },
    {
      scope: ["variable", "string constant.other.placeholder"],
      settings: {
        foreground: "#e4e4e7",
      },
    },
    {
      scope: ["constant", "entity.name.constant", "variable.other.constant", "variable.language"],
      settings: {
        foreground: "#00fcd6",
      },
    },
    {
      scope: ["entity", "entity.name"],
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "variable.parameter.function",
      settings: {
        foreground: "#e4e4e7",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "#ff6ec7",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "#c026d3",
        fontStyle: "bold",
      },
    },
    {
      scope: ["storage", "storage.type"],
      settings: {
        foreground: "#c026d3",
      },
    },
    {
      scope: ["storage.modifier.package", "storage.modifier.import", "storage.type.java"],
      settings: {
        foreground: "#e4e4e7",
      },
    },
    {
      scope: [
        "string",
        "punctuation.definition.string",
        "string punctuation.section.embedded source",
      ],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      scope: "support",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "meta.property-name",
      settings: {
        foreground: "#00fcd6",
      },
    },
    {
      scope: "variable",
      settings: {
        foreground: "#ff6ec7",
      },
    },
    {
      scope: "variable.other",
      settings: {
        foreground: "#e4e4e7",
      },
    },
    {
      scope: "invalid.broken",
      settings: {
        fontStyle: "italic",
        foreground: "#ff2975",
      },
    },
    {
      scope: "invalid.deprecated",
      settings: {
        fontStyle: "italic",
        foreground: "#ff2975",
      },
    },
    {
      scope: "invalid.illegal",
      settings: {
        fontStyle: "italic",
        foreground: "#ff2975",
      },
    },
    {
      scope: "invalid.unimplemented",
      settings: {
        fontStyle: "italic",
        foreground: "#ff2975",
      },
    },
    {
      scope: "carriage-return",
      settings: {
        fontStyle: "italic underline",
        background: "#c026d3",
        foreground: "#0a0a0f",
        content: "^M",
      } as ExtendedTokenSettings,
    },
    {
      scope: "message.error",
      settings: {
        foreground: "#ff2975",
      },
    },
    {
      scope: "string source",
      settings: {
        foreground: "#e4e4e7",
      },
    },
    {
      scope: "string variable",
      settings: {
        foreground: "#00fcd6",
      },
    },
    {
      scope: ["source.regexp", "string.regexp"],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      scope: [
        "string.regexp.character-class",
        "string.regexp constant.character.escape",
        "string.regexp source.ruby.embedded",
        "string.regexp string.regexp.arbitrary-repitition",
      ],
      settings: {
        foreground: "#fbbf24",
      },
    },
    {
      scope: "string.regexp constant.character.escape",
      settings: {
        fontStyle: "bold",
        foreground: "#00fcd6",
      },
    },
    {
      scope: "support.constant",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "support.variable",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "meta.module-reference",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "#ff6ec7",
      },
    },
    {
      scope: ["markup.heading", "markup.heading entity.name"],
      settings: {
        fontStyle: "bold",
        foreground: "#00fcd6",
      },
    },
    {
      scope: "markup.quote",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
        foreground: "#e4e4e7",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "#e4e4e7",
      },
    },
    {
      scope: "markup.raw",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: ["markup.deleted", "meta.diff.header.from-file", "punctuation.definition.deleted"],
      settings: {
        background: "#ff2975",
        foreground: "#0a0a0f",
      },
    },
    {
      scope: ["markup.inserted", "meta.diff.header.to-file", "punctuation.definition.inserted"],
      settings: {
        background: "#00fcd6",
        foreground: "#0a0a0f",
      },
    },
    {
      scope: ["markup.changed", "punctuation.definition.changed"],
      settings: {
        background: "#c026d3",
        foreground: "#0a0a0f",
      },
    },
    {
      scope: ["markup.ignored", "markup.untracked"],
      settings: {
        foreground: "#27272a",
        background: "#00d4ff",
      },
    },
    {
      scope: "meta.diff.range",
      settings: {
        foreground: "#c026d3",
        fontStyle: "bold",
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: "meta.separator",
      settings: {
        fontStyle: "bold",
        foreground: "#00d4ff",
      },
    },
    {
      scope: "meta.output",
      settings: {
        foreground: "#00d4ff",
      },
    },
    {
      scope: [
        "brackethighlighter.tag",
        "brackethighlighter.curly",
        "brackethighlighter.round",
        "brackethighlighter.square",
        "brackethighlighter.angle",
        "brackethighlighter.quote",
      ],
      settings: {
        foreground: "#a1a1aa",
      },
    },
    {
      scope: "brackethighlighter.unmatched",
      settings: {
        foreground: "#ff2975",
      },
    },
    {
      scope: ["constant.other.reference.link", "string.other.link"],
      settings: {
        foreground: "#fbbf24",
        fontStyle: "underline",
      },
    },
  ],
};
