import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: [
    "../lib/**/*.mdx",
    "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-jest",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
    "storybook-addon-mock",
    // {
    //   name: '@storybook/addon-docs',
    //   options: {
    //     sourceLoaderOptions: {
    //       injectStoryParameters: true,
    //       parser: "typescript",
    //     },
    //   },
    // },
    {
      name: "@storybook/addon-coverage",
      options: {
        debug: true,
        // istanbul: {
        //   includes: ['lib/**'],
        // }
      },
    },
    "@storybook/addon-docs"
  ],

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const tailwindcss = (await import('@tailwindcss/vite')).default;

    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          '@storybook/react',
          '@storybook/blocks',
        ],
      },
    });
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  build: {
    // https://github.com/storybookjs/addon-coverage
    test: {
      disabledAddons: [
        "@storybook/addon-docs",
        "@storybook/addon-essentials/docs",
      ],
    },
  }
};

export default config;
