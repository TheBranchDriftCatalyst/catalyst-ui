import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: [
    "../lib/**/*.mdx",
    "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-jest",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
    "storybook-addon-mock",
    {
      name: "@storybook/addon-coverage",
      options: {
        debug: true,
      },
    },
    "@storybook/addon-docs",
    "storybook-design-token"
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
      ],
    },
  }
};

export default config;
