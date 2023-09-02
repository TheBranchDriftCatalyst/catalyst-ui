import type { StorybookConfig } from "@storybook/react-webpack5";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import '@storybook/addon-console';

// const panelExclude = setConsoleOptions({}).panelExclude;
// setConsoleOptions({
//   panelExclude: [...panelExclude, /deprecated/],
// });

const config: StorybookConfig = {
  webpackFinal: async (config) => {
    // allow path aliases
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-jest',
    '@storybook/addon-storysource',
    // "@storybook/testing-library", // we don't need this in the storybook runner, test-runner is separate
    '@storybook/addon-coverage',
    "@storybook/addon-console",
    // "@storybook/addon-actions", // automatically added??
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: {
          implementation: require('postcss'),
        },
      },
    }
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
