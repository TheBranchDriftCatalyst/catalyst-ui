/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CATALYST_DEV_UTILS_ENABLED?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Plain CSS imports (side-effect only, no exports)
declare module "*.css" {
  const content: void;
  export default content;
}

// CSS Modules imports (exports className mappings)
declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}

// Support for ?raw imports
declare module "*?raw" {
  const content: string;
  export default content;
}

// Support for ?inline imports (CSS as string)
declare module "*.css?inline" {
  const content: string;
  export default content;
}
