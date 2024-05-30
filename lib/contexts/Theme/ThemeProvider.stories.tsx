import React from "react";
import { ThemeProvider } from ".";
import Button from "../../ui/button";

export default {
  render: () => {
    return (
      <ThemeProvider>
        <Button>Button</Button>
      </ThemeProvider>
    );
  },
  tags: ["autodocs"],
  // argTypes: {
  //   variant: {
  //     options: ["default", "destructive", "outline", "secondary", "link"],
  //     control: { type: "radio" },
  //     defaultValue: "default",
  //   },
  //   size: {
  //     options: ["default", "xxxs", "xxs", "xs", "sm", "lg", "icon"],
  //     control: { type: "radio" },
  //     defaultValue: "default",
  //   },
  //   onClick: { action: "clicked" },
  // },
  // args: {
  //   onClick: fn(),
  // },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const button = canvas.getByRole("button");
  //   await userEvent.click(button);
  // },
};
