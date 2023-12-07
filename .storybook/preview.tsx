import type { Preview } from "@storybook/react";
import { withTests } from '@storybook/addon-jest';
// import { withThemeByDataAttribute } from '@storybook/addon-styling';
import { withThemeByClassName }  from '@storybook/addon-themes';
import results from '../.jest-test-results.json';
import { withConsole } from '@storybook/addon-console';
// import * as nextImage from "next/image";
import { themes as sbThemes } from '@storybook/theming';
import { addons } from '@storybook/preview-api';
import { DocsContainer } from '@storybook/addon-docs';
import { reduce } from 'lodash';


import {
  DARK_MODE_EVENT_NAME,
  UPDATE_DARK_MODE_EVENT_NAME
} from 'storybook-dark-mode';

import '../src/global.scss';


const channel = addons.getChannel();


const preview: Preview = {
  parameters: {
    docs: {
      theme: { ...sbThemes.dark }
    },
    darkMode: {
      light: { ...sbThemes.light },
      dark: { ...sbThemes.dark },
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


export const decorators = [
  withTests({
    results,
  }),
  withThemeByClassName({
      themes: reduce(['dracula', 'gold', 'laracon', 'nature', 'netflix', 'nord'], (a, tName) => {
    a[`${tName}`] = `theme-${tName}`;
    return a;
  }, {}),
    defaultTheme: "theme-dracula",
  }),
];


export default preview;
