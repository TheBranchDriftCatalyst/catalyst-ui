import type { StorybookConfig } from "@storybook/react-webpack5";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import "@storybook/addon-console";

// const panelExclude = setConsoleOptions({}).panelExclude;
// setConsoleOptions({
//   panelExclude: [...panelExclude, /deprecated/],
// });

const config: StorybookConfig = {
  webpackFinal: async (config) => {
    // allow path aliases
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({ extensions: config.resolve.extensions }),
    ];
    return config;
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-jest",
    "@storybook/addon-storysource",
    // "@storybook/testing-library", // we don't need this in the storybook runner, test-runner is separate
    "@storybook/addon-coverage",
    "@storybook/addon-console",
    "@storybook/addon-controls",
    "@storybook/addon-themes",
    {
      name: "storybook-addon-sass-postcss",
      options: {
        loadSassAfterPostCSS: true, // for tailwind
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
