/// <reference types="vite/client" />

// Support for ?raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}
