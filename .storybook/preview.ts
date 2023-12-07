import type { Preview } from "@storybook/react";
import { withTests } from '@storybook/addon-jest';
// import { withThemeByDataAttribute } from '@storybook/addon-styling';
import { withThemeByClassName }  from '@storybook/addon-themes';
import results from '../.jest-test-results.json';
import { withConsole } from '@storybook/addon-console';
// import * as nextImage from "next/image";
// import { themes } from '@storybook/theming';
import { addons } from '@storybook/preview-api';
import { DocsContainer } from '@storybook/addon-docs';
import { reduce } from 'lodash';

import {
  DARK_MODE_EVENT_NAME,
  UPDATE_DARK_MODE_EVENT_NAME
} from 'storybook-dark-mode';

import '../src/global.scss';


const channel = addons.getChannel();


// Object.defineProperty(nextImage, "default", {
//   configurable: true,
//   value: (props) => <img {...props} />,
// });

const preview: Preview = {
  parameters: {
    darkMode: {
      darkClass: 'dark',
      lightClass: 'light',
      // classTarget: 'html',
      stylePreview: true,
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

const tNames = ['dracula', 'gold', 'laracon', 'nature', 'netflix', 'nord']
const themes = reduce(tNames, (a, tName) => {
  a[`${tName}`] = `theme-${tName}`;
  return a;
}, {})

export const decorators = [
  withTests({
    results,
  }),
  
  // TODO: might switch to this: https://storybook.js.org/addons/storybook-dark-mode/
  //  so that i can separate the dark mode from the theme
  withThemeByClassName({
    themes: themes,
    defaultTheme: "theme-dracula",
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
