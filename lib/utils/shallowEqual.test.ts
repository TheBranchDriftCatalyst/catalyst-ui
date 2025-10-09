import { describe, it, expect } from "vitest";
import { shallowEqual } from "./shallowEqual";

describe("shallowEqual", () => {
  describe("Identity and null/undefined cases", () => {
    it("should return true for same reference", () => {
      const obj = { a: 1, b: 2 };
      expect(shallowEqual(obj, obj)).toBe(true);
    });

    it("should return true for both null", () => {
      expect(shallowEqual(null, null)).toBe(true);
    });

    it("should return true for both undefined", () => {
      expect(shallowEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for null vs object", () => {
      expect(shallowEqual(null, { a: 1 })).toBe(false);
      expect(shallowEqual({ a: 1 }, null)).toBe(false);
    });

    it("should return false for undefined vs object", () => {
      expect(shallowEqual(undefined, { a: 1 })).toBe(false);
      expect(shallowEqual({ a: 1 }, undefined)).toBe(false);
    });

    it("should return false for null vs undefined", () => {
      expect(shallowEqual(null, undefined)).toBe(false);
      expect(shallowEqual(undefined, null)).toBe(false);
    });
  });

  describe("Basic equality - primitive values", () => {
    it("should return true for objects with same primitive values", () => {
      const objA = { a: 1, b: "hello", c: true };
      const objB = { a: 1, b: "hello", c: true };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should return true for empty objects", () => {
      expect(shallowEqual({}, {})).toBe(true);
    });

    it("should return false for different primitive values", () => {
      const objA = { a: 1 };
      const objB = { a: 2 };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should return false for different keys", () => {
      const objA = { a: 1 };
      const objB = { b: 1 };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should return false for different number of keys", () => {
      const objA = { a: 1, b: 2 };
      const objB = { a: 1 };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should handle objects with null values", () => {
      const objA = { a: null, b: 2 };
      const objB = { a: null, b: 2 };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle objects with undefined values", () => {
      const objA = { a: undefined, b: 2 };
      const objB = { a: undefined, b: 2 };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should distinguish null vs undefined values", () => {
      const objA = { a: null };
      const objB = { a: undefined };
      expect(shallowEqual(objA, objB)).toBe(false);
    });
  });

  describe("Shallow comparison - reference equality", () => {
    it("should return true for nested objects with same reference", () => {
      const nested = { x: 1 };
      const objA = { a: nested };
      const objB = { a: nested };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should return false for nested objects with different references", () => {
      const objA = { a: { x: 1 } };
      const objB = { a: { x: 1 } };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should return true for arrays with same reference", () => {
      const arr = [1, 2, 3];
      const objA = { a: arr };
      const objB = { a: arr };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should return false for arrays with different references", () => {
      const objA = { a: [1, 2, 3] };
      const objB = { a: [1, 2, 3] };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should return true for functions with same reference", () => {
      const fn = () => {};
      const objA = { callback: fn };
      const objB = { callback: fn };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should return false for functions with different references", () => {
      const objA = { callback: () => {} };
      const objB = { callback: () => {} };
      expect(shallowEqual(objA, objB)).toBe(false);
    });
  });

  describe("Special JavaScript values", () => {
    it("should handle NaN values", () => {
      const objA = { a: NaN };
      const objB = { a: NaN };
      // NaN !== NaN in JavaScript, so this should be false
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should distinguish 0 and -0", () => {
      const objA = { a: 0 };
      const objB = { a: -0 };
      // In JavaScript, 0 === -0, so this should be true
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle Infinity", () => {
      const objA = { a: Infinity };
      const objB = { a: Infinity };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should distinguish Infinity and -Infinity", () => {
      const objA = { a: Infinity };
      const objB = { a: -Infinity };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should handle boolean values", () => {
      const objA = { a: true, b: false };
      const objB = { a: true, b: false };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle string values", () => {
      const objA = { a: "hello", b: "" };
      const objB = { a: "hello", b: "" };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle symbol values with same reference", () => {
      const sym = Symbol("test");
      const objA = { a: sym };
      const objB = { a: sym };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle symbol values with different references", () => {
      const objA = { a: Symbol("test") };
      const objB = { a: Symbol("test") };
      expect(shallowEqual(objA, objB)).toBe(false);
    });
  });

  describe("Key order independence", () => {
    it("should return true regardless of key order", () => {
      const objA = { a: 1, b: 2, c: 3 };
      const objB = { c: 3, a: 1, b: 2 };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should return true for complex values regardless of key order", () => {
      const nested = { x: 1 };
      const objA = { a: nested, b: "test", c: 123 };
      const objB = { c: 123, b: "test", a: nested };
      expect(shallowEqual(objA, objB)).toBe(true);
    });
  });

  describe("Edge cases and complex scenarios", () => {
    it("should handle objects with many keys", () => {
      const objA: Record<string, number> = {};
      const objB: Record<string, number> = {};

      for (let i = 0; i < 100; i++) {
        objA[`key${i}`] = i;
        objB[`key${i}`] = i;
      }

      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle objects with mixed types", () => {
      const nested = { x: 1 };
      const fn = () => {};
      const objA = {
        num: 42,
        str: "hello",
        bool: true,
        null: null,
        undef: undefined,
        obj: nested,
        fn,
        arr: [1, 2],
      };
      const objB = {
        num: 42,
        str: "hello",
        bool: true,
        null: null,
        undef: undefined,
        obj: nested,
        fn,
        arr: [1, 2],
      };

      expect(shallowEqual(objA, objB)).toBe(false); // Different array references
    });

    it("should fail fast on key count mismatch", () => {
      const objA = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const objB = { a: 1, b: 2, c: 3 };

      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should check hasOwnProperty to avoid prototype pollution", () => {
      const objA = { a: 1 };
      const objB = Object.create({ b: 2 }); // b is on prototype
      objB.a = 1;

      // Should only compare own properties
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle Date objects with same reference", () => {
      const date = new Date();
      const objA = { timestamp: date };
      const objB = { timestamp: date };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle Date objects with different references", () => {
      const objA = { timestamp: new Date("2024-01-01") };
      const objB = { timestamp: new Date("2024-01-01") };
      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it("should handle RegExp objects with same reference", () => {
      const regex = /test/gi;
      const objA = { pattern: regex };
      const objB = { pattern: regex };
      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it("should handle RegExp objects with different references", () => {
      const objA = { pattern: /test/gi };
      const objB = { pattern: /test/gi };
      expect(shallowEqual(objA, objB)).toBe(false);
    });
  });

  describe("React use cases", () => {
    it("should detect prop changes for React.memo", () => {
      const prevProps = { id: 1, name: "John", onClick: () => {} };
      const nextProps = { id: 1, name: "John", onClick: () => {} };

      // Different function references = should re-render
      expect(shallowEqual(prevProps, nextProps)).toBe(false);
    });

    it("should prevent re-render when props haven't changed", () => {
      const onClick = () => {};
      const prevProps = { id: 1, name: "John", onClick };
      const nextProps = { id: 1, name: "John", onClick };

      // Same function reference = can skip re-render
      expect(shallowEqual(prevProps, nextProps)).toBe(true);
    });

    it("should detect state object changes", () => {
      const prevState = { visibleNodes: { node1: true, node2: false } };
      const nextState = { visibleNodes: { node1: true, node2: false } };

      // Different object references = state changed
      expect(shallowEqual(prevState, nextState)).toBe(false);
    });

    it("should detect when a single prop value changes", () => {
      const onClick = () => {};
      const prevProps = { id: 1, name: "John", onClick };
      const nextProps = { id: 2, name: "John", onClick };

      expect(shallowEqual(prevProps, nextProps)).toBe(false);
    });

    it("should work with visibility record pattern from Legend component", () => {
      const prev = { node1: true, node2: false, node3: true };
      const next = { node1: true, node2: false, node3: true };

      expect(shallowEqual(prev, next)).toBe(true);
    });

    it("should detect visibility changes", () => {
      const prev = { node1: true, node2: false, node3: true };
      const next = { node1: true, node2: true, node3: true }; // node2 toggled

      expect(shallowEqual(prev, next)).toBe(false);
    });
  });
});
