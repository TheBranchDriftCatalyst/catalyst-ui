import type { Preview } from "@storybook/react";
import { withTests } from '@storybook/addon-jest';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
import results from '../.jest-test-results.json';
import { withConsole } from '@storybook/addon-console';
// import * as nextImage from "next/image";

import '../src/tailwind.scss';

// Object.defineProperty(nextImage, "default", {
//   configurable: true,
//   value: (props) => <img {...props} />,
// });

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
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
      dracula: 'dracula',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
];

// export const globalTypes = {
//   theme: {
//     name: "Theme",
//     description: "Global theme for components",
//     defaultValue: 'dark',
//     toolbar: {
//       icon: "paintbrush",
//       // Array of plain string values or MenuItem shape (see below)
//       items: [
//         { value: "light", title: "Light", left: "🌞" },
//         { value: "dark", title: "Dark", left: "🌛" },
//       ],
//       // Change title based on selected value
//       dynamicTitle: true,
//     },
//   },
// };


export default preview;
