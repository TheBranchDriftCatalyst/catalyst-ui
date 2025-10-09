/// <reference types="vite/client" />

// Support for ?raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}

// Build-time injected constants
declare const __APP_VERSION__: string;
declare const __GIT_HASH__: string;
declare const __LAST_COMMIT__: string;
