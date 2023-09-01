import type { Preview } from "@storybook/react";
import { withTests } from '@storybook/addon-jest';
import results from '../.jest-test-results.json';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};



export const decorators = [
  withTests({
    results,
  }),
];


export default preview;
