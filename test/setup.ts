/**
 * Vitest test setup file
 *
 * This file runs before each test file to set up the testing environment.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (used by usePrefersReducedMotion and other media query hooks)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (used by some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver (used by some Radix UI components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Suppress console errors/warnings in tests (optional - remove if you want to see them)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

/**
 * Polyfill Web Storage.
 *
 * Node >= 22 ships its own `localStorage` global that reads as `undefined`
 * unless the process was started with `--localstorage-file`. Vitest's jsdom
 * environment makes `window === globalThis`, so that Node global shadows
 * jsdom's own implementation and BOTH `localStorage` and `window.localStorage`
 * come back undefined. Everything that persists state — theme seeding, the
 * no-flash script, analytics sessions — is untestable without this.
 *
 * Only installed when Web Storage is genuinely missing, so a runtime that
 * provides a real implementation keeps it.
 */
if (!(globalThis as any).localStorage) {
  class MemoryStorage {
    #data = new Map<string, string>();

    get length(): number {
      return this.#data.size;
    }
    key(index: number): string | null {
      return [...this.#data.keys()][index] ?? null;
    }
    getItem(key: string): string | null {
      return this.#data.get(String(key)) ?? null;
    }
    setItem(key: string, value: string): void {
      this.#data.set(String(key), String(value));
    }
    removeItem(key: string): void {
      this.#data.delete(String(key));
    }
    clear(): void {
      this.#data.clear();
    }
  }

  // noFlash.test.ts patches `Storage.prototype.getItem` to simulate private
  // mode, so the global constructor has to be the one our instances derive from.
  (globalThis as any).Storage = MemoryStorage;

  for (const key of ["localStorage", "sessionStorage"]) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value: new MemoryStorage(),
    });
  }
}
