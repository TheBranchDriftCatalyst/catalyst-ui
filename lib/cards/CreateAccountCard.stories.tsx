import { Meta } from '@storybook/react';
// import NavigationItem, { _sampleLinkObjects } from "../NavigationHeader/NavigationItem";
import CreateAccountCard from './CreateAccountCard'; // Adjust the import path as needed

// Define the metadata for the story
const meta: Meta<typeof CreateAccountCard> = {
  title: 'Cards/CreateAccountCard',
  component: CreateAccountCard,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const Default = {
  args: {
    oidcProviders: [
      {
        name: 'GitHub',
        onClick: () => {},
        // icon: ,
      },
      {
        name: 'Google',
        onClick: () => {},
        // icon: ,
      },
    ],
  },
};
