import { DocsContainer } from "@storybook/addon-docs";
// import { withTests } from "@storybook/addon-jest";
import { withThemeByClassName } from "@storybook/addon-themes";
// import { addons } from "@storybook/preview-api";
import { themes as sbThemes } from "@storybook/theming";
import reduce from "lodash/reduce";
import React from "react";
// import results from "../coverage/storybook/coverage-storybook.json";
import "../lib/global.css";

// const channel = addons.getChannel();

const preview = {
  parameters: {
    // docs: {
    //   theme: { ...sbThemes.dark }
    // },
    darkMode: {
      light: { ...sbThemes.light },
      dark: { ...sbThemes.dark },
      darkClass: "dark",
      lightClass: "light",
      classTarget: "html",
      stylePreview: true,
    },
    docs: {
      toc: true,
      container: (props) => {
        return <DocsContainer {...props} />;
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // withTests({ results, filesExt: ".stories.tsx" }),
    withThemeByClassName({
      themes: reduce(
        ["dracula", "gold", "laracon", "nature", "netflix", "nord", "catalyst", 'none'],
        (a, tName) => {
          a[`${tName}`] = `theme-${tName}`;
          return a;
        },
        {},
      ),
      defaultTheme: "dracula",
    }),
  ],
};

export default preview;

//  TODO: what we are goign to do is we agoign to use this trick:
// const rootStyle = getComputedStyle(document.documentElement);
// setMainColor(rootStyle.getPropertyValue('--main-color').trim());
// To get all of these values from our themes
// const sbTheme = {
//   appBg: {},
//   appBorderColor: {},
//   appBorderRadius: {},
//   appContentBg: {},
//   appPreviewBg: {},
//   barBg: {},
//   barHoverColor: {},
//   barSelectedColor: {},
//   barTextColor: {},
//   base: {},
//   booleanBg: {},
//   booleanSelectedBg: {},
//   buttonBg: {},
//   buttonBorder: {},
//   colorPrimary: {},
//   colorSecondary: {},
//   fontBase: {},
//   fontCode: {},
//   inputBg: {},
//   inputBorder: {},
//   inputBorderRadius: {},
//   inputTextColor: {},
//   textColor: {},
//   textInverseColor: {},
//   textMutedColor: {},
// }

// {
//   "base": "dark",
//   "colorPrimary": "#FF4785",
//   "colorSecondary": "#029CFD",
//   "appBg": "#222425",
//   "appContentBg": "#1B1C1D",
//   "appPreviewBg": "#FFFFFF",
//   "appBorderColor": "rgba(255,255,255,.1)",
//   "appBorderRadius": 4,
//   "fontBase": "\"Nunito Sans\", -apple-system, \".SFNSText-Regular\", \"San Francisco\", BlinkMacSystemFont, \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//   "fontCode": "ui-monospace, Menlo, Monaco, \"Roboto Mono\", \"Oxygen Mono\", \"Ubuntu Monospace\", \"Source Code Pro\", \"Droid Sans Mono\", \"Courier New\", monospace",
//   "textColor": "#C9CDCF",
//   "textInverseColor": "#222425",
//   "textMutedColor": "#798186",
//   "barTextColor": "#73828C",
//   "barHoverColor": "#029CFD",
//   "barSelectedColor": "#029CFD",
//   "barBg": "#292C2E",
//   "buttonBg": "#222425",
//   "buttonBorder": "rgba(255,255,255,.1)",
//   "booleanBg": "#222425",
//   "booleanSelectedBg": "#2E3438",
//   "inputBg": "#1B1C1D",
//   "inputBorder": "rgba(255,255,255,.1)",
//   "inputTextColor": "#FFFFFF",
//   "inputBorderRadius": 4
// }
