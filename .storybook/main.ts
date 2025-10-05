import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: [
    "../lib/**/*.mdx",
    "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    "storybook-design-token"
  ],

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const { resolve } = await import('path');
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

    return mergeConfig(config, {
      plugins: [
        // Path resolution MUST come first, before any transformations
        tsconfigPaths({
          projects: [resolve(__dirname, '../tsconfig.json')],
        }),
        tailwindcss(),
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@/catalyst-ui': resolve(__dirname, '../lib'),
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

};

export default config;
