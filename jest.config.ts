import type {Config} from 'jest';

const config: Config = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    "lib/"
  ],
  outputFile: ".jest-test-results.json"
};

export default config;