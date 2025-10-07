# Development Workflow

## Concurrent Development (Linked Library)

When developing catalyst-ui while using it in another app:

### One-time setup:

```bash
# In catalyst-ui directory
cd /path/to/catalyst-ui
yarn link
yarn dev:lib  # Runs build in watch mode
```

### In your consuming app:

```bash
cd /path/to/your-app
yarn link catalyst-ui
yarn dev
```

Now changes in `catalyst-ui/lib/` will auto-rebuild and appear in your app in real-time!

### To unlink:

```bash
# In your app
yarn unlink catalyst-ui
yarn install --force

# In catalyst-ui
yarn unlink
```

## Release Workflow

### Making a release:

```bash
# First release (creates v0.0.1)
yarn release:first

# Patch release (0.0.1 → 0.0.2)
yarn release:patch

# Minor release (0.0.1 → 0.1.0)
yarn release:minor

# Major release (0.0.1 → 1.0.0)
yarn release:major
```

This will:

- ✅ Bump version in package.json
- ✅ Generate/update CHANGELOG.md from conventional commits
- ✅ Create git tag
- ✅ Commit changes

### Pushing releases:

```bash
git push --follow-tags
```

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

**Examples:**

```bash
git commit -m "feat(ui): add tooltip component"
git commit -m "fix(theme): resolve dark mode background issue"
git commit -m "docs: update installation instructions"
```

Commitlint will validate your commit messages automatically via git hooks.

## Development Commands

```bash
# Standard development (Storybook + App + Build Watch)
yarn dev

# Individual processes
yarn dev:app          # Vite dev server for kitchen sink app
yarn dev:storybook    # Storybook only
yarn dev:lib          # Build library in watch mode
yarn dev:test         # Storybook test runner

# Building
yarn build            # Build library for production
yarn build:app        # Build kitchen sink app
yarn build:storybook  # Build Storybook for deployment

# Quality
yarn lint             # ESLint check
```

## Source Maps

Source maps are enabled and point to original `lib/` files. When using this library in another project via `yarn link`, your IDE will jump to the source files, not `dist/`.
