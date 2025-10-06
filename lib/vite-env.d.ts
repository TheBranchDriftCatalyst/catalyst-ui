/// <reference types="vite/client" />

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Support for ?raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}
