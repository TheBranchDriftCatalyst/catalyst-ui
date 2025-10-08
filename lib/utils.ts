import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export * from "./utils/logger";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

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
