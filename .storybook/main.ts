import type { StorybookConfig } from "@storybook/react-vite";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ["../lib/**/*.mdx", "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    // "storybook-design-token", // Disabled - causing build errors with Font presenter
  ],

  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const { resolve } = await import("path");
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

    // Support base path for GitHub Pages deployment
    const basePath = process.env.STORYBOOK_BASE_PATH || "/";

    // Filter out vite-plugin-dts - we don't need declaration files for Storybook
    const filteredPlugins = (config.plugins || []).filter((plugin: any) => {
      return plugin?.name !== "vite:dts";
    });

    return mergeConfig(config, {
      base: basePath,
      plugins: [
        ...filteredPlugins,
        // Path resolution MUST come first, before any transformations
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
        include: [...(config.optimizeDeps?.include || []), "@storybook/react", "@storybook/blocks"],
      },
    });
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
