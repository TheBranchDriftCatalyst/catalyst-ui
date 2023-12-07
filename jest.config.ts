import type {Config} from 'jest';

const config: Config = {
  "transform": {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.mdx$": "@storybook/addon-docs/jest-transform-mdx"
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    "lib/"
  ],
  outputFile: ".jest-test-results.json"
};

export default config;

