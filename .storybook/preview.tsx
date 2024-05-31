// import { withTests } from "@storybook/addon-jest";
import { withThemeByClassName } from "@storybook/addon-themes";
// import { addons } from "@storybook/preview-api";
import { themes as sbThemes } from "@storybook/theming";
import reduce from "lodash/reduce";
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
    // docs: {
    //   toc: true,
    //   container: (props) => {
    //     return <DocsContainer {...props} />;
    //   },
    // },
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
      defaultTheme: "catalyst",
    }),
  ],
};

export default preview;
