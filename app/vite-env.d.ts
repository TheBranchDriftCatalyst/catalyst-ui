/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CATALYST_DEV_UTILS_ENABLED?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Support for ?raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}

// Build-time injected constants
declare const __APP_VERSION__: string;
declare const __GIT_HASH__: string;
declare const __LAST_COMMIT__: string;

// Runtime configuration injected via config.js
interface RuntimeConfig {
  BASE_URL: string;
  API_URL: string;
  ENVIRONMENT: string;
}

declare global {
  interface Window {
    ENV?: RuntimeConfig;
  }
}
