# Testing Guide

Complete guide to testing in catalyst-ui using Vitest and Testing Library.

## Quick Start

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Open Vitest UI
yarn test:ui

# Generate coverage report
yarn test:coverage

# Update README badges
yarn update:badges
```

## Test Organization

Tests are colocated with source files using the `.test.ts` or `.test.tsx` extension:

```
lib/
├── hooks/
│   ├── useControllableState.ts
│   ├── useControllableState.test.ts  ← Test file
│   ├── useAnimationTriggers.ts
│   └── useAnimationTriggers.test.ts  ← Test file
└── utils/
    ├── logger.ts
    ├── logger.test.ts                ← Test file
    ├── shallowEqual.ts
    └── shallowEqual.test.ts          ← Test file
```

## Current Test Coverage

### Hooks (100% Coverage)

- **useControllableState**: 17 tests
  - Uncontrolled mode behavior
  - Controlled mode with onChange
  - Mode switching (uncontrolled ↔ controlled)
  - Edge cases (null/undefined, rapid updates)

- **useAnimationTriggers**: 20 tests
  - Hover, click, and manual triggers
  - Handler reference stability
  - Integration scenarios
  - Return value structure

### Utilities (~99% Coverage)

- **logger**: 52 tests
  - Basic logging (debug, info, warn, error)
  - Configuration and global levels
  - ScopedLogger per-logger controls
  - LoggerRegistry state management
  - Color assignment consistency

- **shallowEqual**: 44 tests
  - Identity and null/undefined cases
  - Primitive value equality
  - Reference equality for objects/arrays/functions
  - Special JavaScript values (NaN, Infinity, symbols)
  - React.memo use cases

## Writing Tests

### Test Structure

Use descriptive test organization with nested `describe` blocks:

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { myHook } from "./myHook";

describe("myHook", () => {
  describe("Basic functionality", () => {
    it("should initialize with default value", () => {
      const { result } = renderHook(() => myHook());
      expect(result.current.value).toBe(defaultValue);
    });
  });

  describe("Edge cases", () => {
    it("should handle null values", () => {
      // ... test
    });
  });
});
```

### Testing Hooks

Use `renderHook` from Testing Library:

```typescript
import { renderHook, act } from "@testing-library/react";

it("should update state when setValue is called", () => {
  const { result } = renderHook(() => useControllableState(undefined, false));

  act(() => {
    result.current[1](true);
  });

  expect(result.current[0]).toBe(true);
});
```

### Testing Components

Use `render` and query utilities from Testing Library:

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("should render children", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

### Mocking

Use Vitest's `vi` API for mocking:

```typescript
import { vi, beforeEach, afterEach } from "vitest";

describe("Component with external dependencies", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should log error", () => {
    // ... test that triggers error
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error message");
  });
});
```

## Coverage Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html", "lcov", "json-summary"],
  include: ["lib/**/*.{ts,tsx}"],
  exclude: [
    "**/*.stories.tsx",
    "**/*.test.tsx",
    "**/index.ts",
    "**/types.ts",
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

## Test Setup

Global test setup is in `test/setup.ts`:

- Cleanup after each test
- `window.matchMedia` mock for media query hooks
- `IntersectionObserver` and `ResizeObserver` mocks
- `@testing-library/jest-dom` matchers

## CI/CD Integration

Tests run automatically on GitHub Actions:

- **Workflow**: `.github/workflows/test.yml`
- **Triggers**: Push to main/master, all PRs
- **Coverage**: Uploaded to Codecov (if configured)
- **Artifacts**: Coverage reports archived for 30 days

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - tests behavior
it("should toggle state on click", () => {
  const { result } = renderHook(() => useToggle());
  act(() => result.current.toggle());
  expect(result.current.isOn).toBe(true);
});

// ❌ Bad - tests implementation
it("should call useState", () => {
  // Don't test React internals
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it("should return true for objects with same primitive values", () => {});

// ❌ Bad
it("works", () => {});
```

### 3. Arrange-Act-Assert Pattern

```typescript
it("should update state when setValue is called", () => {
  // Arrange
  const { result } = renderHook(() => useControllableState(undefined, false));

  // Act
  act(() => {
    result.current[1](true);
  });

  // Assert
  expect(result.current[0]).toBe(true);
});
```

### 4. Test Edge Cases

Always include tests for:

- Null/undefined values
- Empty inputs
- Boundary conditions
- Error states
- Rapid/concurrent operations

### 5. Keep Tests Fast

- Avoid unnecessary delays
- Mock expensive operations
- Use `beforeEach` for common setup
- Group related tests in `describe` blocks

## Debugging Tests

### Run Specific Test

```bash
# Run tests in a specific file
yarn test useControllableState

# Run tests matching pattern
yarn test --grep "should handle null"
```

### Use Vitest UI

```bash
yarn test:ui
```

This opens an interactive UI where you can:

- Run/debug individual tests
- See coverage visualizations
- View test execution time
- Inspect test output

### Debug in VS Code

Add breakpoint in test, then run:

```bash
node --inspect-brk ./node_modules/.bin/vitest run --no-coverage
```

Attach VS Code debugger to the Node process.

## Common Issues

### Tests Pass Locally but Fail in CI

1. Check for timezone dependencies
2. Verify all mocks are properly set up
3. Look for race conditions
4. Ensure Node version matches

### Coverage Not Generated

1. Verify `vitest.config.ts` has correct paths
2. Check test files are named correctly (`.test.ts` or `.test.tsx`)
3. Run `yarn test:coverage` instead of `yarn test`

### Flaky Tests

1. Avoid testing implementation details
2. Use `waitFor` for async operations
3. Mock time-dependent functions
4. Ensure proper cleanup in `afterEach`

## Related Documentation

- [Badge System](./badges.md) - Test and coverage badges
- [CI/CD Setup](./deployment.md) - GitHub Actions configuration
- [Vitest Documentation](https://vitest.dev)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
