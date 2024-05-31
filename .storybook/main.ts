import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: [
    "../lib/**/*.mdx",
    "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-jest",
    "@storybook/addon-themes",
    "storybook-dark-mode",
    "@chromatic-com/storybook",
    "@storybook/addon-storysource",
    "storybook-addon-mock",
    {
      name: "@storybook/addon-coverage",
      options: {
        debug: true,
        // istanbul: {
        //   includes: ['lib/**'],
        // }
      },
    },
    // {
    //   name: '@storybook/addon-docs',
    //   options: {
    //     sourceLoaderOptions: {
    //       injectStoryParameters: true,
    //       parser: "typescript",
    //     },
    //   },
    // },
  ],
  // async viteFinal(config) {
  //   // Merge custom configuration into the default config
  //   const { mergeConfig } = await import('vite');

  //   return mergeConfig(config, {
  //     // Add dependencies to pre-optimization
  //     // optimizeDeps: {
  //     //   include: ['storybook-dark-mode'],
  //     // },
  //     plugins: [
  //       dynamicImport({
  //         filter(id) {
  //           // `node_modules` is exclude by default, so we need to include it explicitly
  //           // https://github.com/vite-plugin/vite-plugin-dynamic-import/blob/v1.3.0/src/index.ts#L133-L135
  //           if (id.includes('node_modules/@icons-pack/react-simple-icons')) {
  //             return true
  //           }
  //         }
  //       })
  //     ]
  //   });
  // },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  build: {
    // https://github.com/storybookjs/addon-coverage
    test: {
      disabledAddons: [
        "@storybook/addon-docs",
        "@storybook/addon-essentials/docs",
      ],
    },
  },
};

export default config;
