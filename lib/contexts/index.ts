// Context Providers
export * from "./Analytics";
export * from "./Card";
export * from "./Debug";
export * from "./i18n";
export * from "./Motion";
export * from "./SEO";
export * from "./Theme";

// One-stop wrapper that seeds first-run defaults, runs legacy migrations,
// then mounts ThemeProvider. Preferred over ThemeProvider for new
// integrations; existing ThemeProvider consumers keep working unchanged.
export * from "./CatalystProvider";

// No-flash-of-wrong-theme inline script generator. Consumers paste the
// output into their static `index.html`'s <head> so the initial paint
// uses the correct dark/light class before React mounts.
export * from "./noFlash";

// NOTE: CatalystHeader exports HeaderProvider
// Exported here for convenience, but lives in components/
export * from "../components/CatalystHeader";
