import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ["../lib/**/*.mdx", "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "storybook-design-token"],

  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const { resolve } = await import("path");
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

    // Support base path for GitHub Pages deployment
    const basePath = process.env.STORYBOOK_BASE_PATH || "/";

    return mergeConfig(config, {
      base: basePath,
      plugins: [
        // Add essential Storybook-compatible plugins
        tsconfigPaths({
          projects: [resolve(__dirname, "../tsconfig.json")],
        }),
        tailwindcss(),
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/catalyst-ui": resolve(__dirname, "../lib"),
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [...(config.optimizeDeps?.include || []), "@storybook/react"],
        exclude: [...(config.optimizeDeps?.exclude || []), "@storybook/test"],
      },
    });
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
