import { clsx, type ClassValue } from "clsx";
import { isNil, omitBy } from "lodash";
import React from "react";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// TODO: this is not implemented yet, but theoretically can be used to convert
// from the tailwind shadcn theme to the storybook theme
export const getComputedSBTheme = (rootStyle: any) => {
  return omitBy(
    {
      // @ts-ignore
      appBg: rootStyle.getPropertyValue("--background").trim(),
      // appBorderColor: null,
      // appBorderRadius: null,
      // appContentBg: null,
      // appPreviewBg: null,
      // barBg: null,
      // barHoverColor: null,
      // barSelectedColor: null,
      // barTextColor: null,
      // base: null,
      // booleanBg: null,
      // booleanSelectedBg: null,
      // buttonBg: null,
      // buttonBorder: null,
      colorPrimary: rootStyle.getPropertyValue("--primary").trim(),
      colorSecondary: rootStyle.getPropertyValue("--secondary").trim(),
      // fontBase: null,
      // fontCode: null,
      // inputBg: null,
      // inputBorder: null,
      // inputBorderRadius: null,
      // inputTextColor: null,
      // textColor: null,
      // textInverseColor: null,
      // textMutedColor: null,
    },
    isNil,
  );
};

export const addKeysToChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // Check if the child already has a key
      if (child.key != null) {
        return child;
      }
      return React.cloneElement(child, { key: index });
    }
    return child;
  });
};
