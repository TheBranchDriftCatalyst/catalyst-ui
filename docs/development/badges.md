# Test & Coverage Badges

This document explains how the test and coverage badges work in the README.

## Current Badges

The README includes the following test-related badges:

1. **Tests Workflow Status** - Shows if the CI tests are passing
   - Auto-updates via GitHub Actions on each push
   - Badge: `[![Tests](https://github.com/TheBranchDriftCatalyst/catalyst-ui/actions/workflows/test.yml/badge.svg)]`

2. **Coverage Percentage** - Shows test coverage percentage
   - Manually updated via script (see below)
   - Badge: `[![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?logo=vitest)]`
   - Color: `brightgreen` (≥80%), `yellow` (60-79%), `red` (<60%)

3. **Test Count** - Shows number of passing tests
   - Manually updated via script (see below)
   - Badge: `[![Tests Passing](https://img.shields.io/badge/tests-133_passing-success?logo=vitest)]`

## Automatic Updates (CI)

The GitHub Actions workflow (`.github/workflows/test.yml`) automatically:

1. Runs all tests on push to main/master
2. Generates coverage reports
3. Uploads coverage to Codecov (if configured)
4. Archives coverage reports as artifacts

The **Tests** badge updates automatically based on the workflow status.

## Manual Updates (Local)

To update the coverage and test count badges locally:

```bash
# Run the badge update script
./scripts/update-badges.sh
```

This script:

1. Runs tests with coverage
2. Extracts coverage percentage from `coverage/coverage-summary.json`
3. Counts total number of tests
4. Updates README.md badge URLs with new values
5. Determines appropriate colors based on coverage thresholds

## Badge Update Workflow

### After Writing New Tests

1. Run tests to verify they pass:

   ```bash
   yarn test
   ```

2. Generate coverage report:

   ```bash
   yarn test:coverage
   ```

3. Update badges:

   ```bash
   ./scripts/update-badges.sh
   ```

4. Commit changes:
   ```bash
   git add README.md
   git commit -m "docs: update test badges (133 tests, 99% coverage)"
   ```

### Before Releases

Always update badges before creating a release:

```bash
# Update badges
./scripts/update-badges.sh

# Verify badges are correct
cat README.md | grep -A 2 "Tests"

# Commit if changed
git add README.md
git commit -m "docs: update badges for v1.2.2"

# Create release
yarn release:patch
```

## Coverage Thresholds

The project maintains the following coverage thresholds (configured in `vitest.config.ts`):

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

These thresholds are enforced by the test command and will fail if coverage drops below these levels.

## Current Test Coverage

As of the latest update:

- **Total Tests**: 133
- **Coverage**: ~99% (hooks + utilities)

### Detailed Coverage

- `useControllableState`: 17 tests, 100% coverage
- `useAnimationTriggers`: 20 tests, 100% coverage
- `logger`: 52 tests, 98.14% coverage
- `shallowEqual`: 44 tests, 100% coverage

## Optional: Dynamic Badges (Advanced)

For automatic badge updates on every CI run, you can set up:

### Option 1: Codecov (Recommended)

1. Sign up at [codecov.io](https://codecov.io)
2. Add `CODECOV_TOKEN` to GitHub secrets
3. Coverage badge auto-updates on each push

### Option 2: Dynamic GitHub Gist Badge

1. Create a GitHub gist to store badge data
2. Add `GIST_SECRET` and `GIST_ID` to GitHub secrets
3. Workflow will update gist with latest coverage

The workflow (`.github/workflows/test.yml`) already includes commented-out sections for both options.

## Troubleshooting

### Badge not updating

1. **Check script ran successfully**:

   ```bash
   ./scripts/update-badges.sh
   ```

2. **Verify coverage report exists**:

   ```bash
   ls -la coverage/coverage-summary.json
   ```

3. **Manually check coverage**:
   ```bash
   cat coverage/coverage-summary.json | jq '.total.lines.pct'
   ```

### CI workflow failing

1. Check GitHub Actions logs
2. Verify all dependencies installed correctly
3. Ensure test files don't have syntax errors

### Coverage lower than expected

1. Check which files are excluded:

   ```bash
   cat vitest.config.ts | grep -A 10 "exclude:"
   ```

2. Run coverage with detailed output:
   ```bash
   yarn test:coverage --reporter=verbose
   ```

## Future Enhancements

- [ ] Set up Codecov for automatic coverage tracking
- [ ] Add visual coverage badge (not just percentage)
- [ ] Create component-level coverage badges
- [ ] Add mutation testing badge
- [ ] Track test execution time trends

## Related Documentation

- [Testing Guide](./testing.md) - How to write tests
- [CI/CD Setup](./deployment.md) - GitHub Actions configuration
- [Contributing Guide](../../CONTRIBUTING.md) - Development workflow
