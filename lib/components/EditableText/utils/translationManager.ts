/**
 * Utility functions for managing translation keys and values
 */

// TODO: this is only used by the codemod and be removed from the lib

/**
 * Generates a translation key from text content
 *
 * @example
 * ```ts
 * generateTranslationKey("Welcome to Catalyst")
 * // Returns: "welcome_to_catalyst"
 *
 * generateTranslationKey("Hello World!", "home")
 * // Returns: "home.hello_world"
 * ```
 */
export function generateTranslationKey(text: string, prefix?: string): string {
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50); // Limit key length

  return prefix ? `${prefix}.${key}` : key;
}

/**
 * Determines the appropriate namespace for a component
 *
 * @example
 * ```ts
 * getNamespaceForComponent("CardDemo")
 * // Returns: "components"
 *
 * getNamespaceForComponent("ErrorBoundary")
 * // Returns: "errors"
 *
 * getNamespaceForComponent("HomePage")
 * // Returns: "common"
 * ```
 */
export function getNamespaceForComponent(componentName: string): string {
  const componentMappings: Record<string, string> = {
    Card: "components",
    Button: "components",
    Dialog: "components",
    Form: "components",
    Input: "components",
    Table: "components",
    Error: "errors",
    Validation: "errors",
  };

  for (const [pattern, namespace] of Object.entries(componentMappings)) {
    if (componentName.includes(pattern)) {
      return namespace;
    }
  }

  return "common";
}

/**
 * Parse a nested translation key path
 *
 * @example
 * ```ts
 * parseKeyPath("home.welcome.title")
 * // Returns: ["home", "welcome", "title"]
 * ```
 */
export function parseKeyPath(key: string): string[] {
  return key.split(".");
}

/**
 * Set a value in a nested object using a key path
 *
 * @example
 * ```ts
 * const obj = { home: { welcome: { title: "Old Title" } } };
 * const updated = setNestedValue(obj, ["home", "welcome", "title"], "New Title");
 * // Returns: { home: { welcome: { title: "New Title" } } }
 * ```
 */
export function setNestedValue(obj: any, keyPath: string[], value: string): any {
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    } else {
      current[key] = { ...current[key] }; // Clone to avoid mutation
    }
    current = current[key];
  }

  current[keyPath[keyPath.length - 1]] = value;
  return result;
}

/**
 * Get a value from a nested object using a key path
 *
 * @example
 * ```ts
 * const obj = { home: { welcome: { title: "Hello" } } };
 * getNestedValue(obj, ["home", "welcome", "title"])
 * // Returns: "Hello"
 * ```
 */
export function getNestedValue(obj: any, keyPath: string[]): string | undefined {
  let current = obj;

  for (const key of keyPath) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}
