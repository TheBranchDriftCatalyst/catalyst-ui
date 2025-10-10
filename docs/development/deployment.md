# GitHub Pages Deployment Guide

This repository is configured to automatically deploy both the demo app, Storybook, and API documentation to GitHub Pages. Deployments are fully automated via GitHub Actions with comprehensive validation and rollback capabilities.

## Quick Start

https://thebranchdriftcatalyst.github.io/catalyst-ui/

## Deployment Structure

```
/                    Landing page with navigation to all sections
├── demo.html       Demo app showcase
├── storybook/      Component library documentation (interactive)
├── api/            API documentation (TypeDoc-generated)
├── assets/         Shared assets (JS, CSS, fonts, images)
├── CHANGELOG.md    Version history
└── .nojekyll       Disables Jekyll processing
```

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) automatically:

1. **Builds the demo app** using `yarn build:app`
   - Output: `dist/app/` (gitignored)

2. **Builds Storybook** using `yarn build:storybook`
   - Output: `dist/storybook/` (gitignored)

3. **Builds API documentation** using `yarn docs:api`
   - Output: `docs/api/` (TypeDoc-generated markdown)

4. **Combines all builds** via `scripts/build-ci.sh`:
   - Renames app's `index.html` to `demo.html`
   - Copies Storybook to `/storybook/` subdirectory
   - Copies API docs to `/api/` subdirectory
   - Creates a custom synthwave landing page at root with gold API docs button
   - Adds CHANGELOG.md and .nojekyll

5. **Validates output** using `scripts/validate-gh-pages.sh`
   - Verifies required files exist
   - Checks HTML structure
   - Counts assets

6. **Deploys to GitHub Pages** using GitHub Actions artifact upload

## Manual Deployment Trigger

You can manually trigger a deployment without pushing:

- Go to **Actions** tab on GitHub
- Select "Deploy to GitHub Pages" workflow
- Click **Run workflow** → **Run workflow**

## Local Testing

Test the builds locally before deploying:

```bash
# Build app
yarn build:app

# Build Storybook
yarn build:storybook

# Preview app build
yarn preview:app

# Preview Storybook build
npx serve dist/storybook
```

## Troubleshooting

### Deployment fails

**Check workflow logs:**

1. Go to Actions tab on GitHub
2. Find the failed "Deploy to GitHub Pages" run
3. Click on the run and expand failed step
4. Look for error messages (common issues below)

**Common causes:**

- Build dependencies in `devDependencies` instead of `dependencies`
- Missing environment variables or secrets
- Syntax errors in build scripts
- Out of memory (increase Node memory: `NODE_OPTIONS=--max_old_space_size=4096`)
- TypeDoc generation failures (check JSDoc syntax)

**Fix steps:**

1. Test builds locally first: `yarn build:app && yarn build:storybook && yarn docs:api`
2. Run CI build script locally: `task gh:build-ci`
3. Validate output structure: `task gh:validate`
4. If successful locally, push again and monitor Actions tab

### 404 errors on deployed site

**Root cause check:**

- GitHub Pages source must be "GitHub Actions" (not "Deploy from a branch")
  - Settings → Pages → Source → GitHub Actions
- Verify workflow completed successfully (green checkmark in Actions tab)
- Check browser console for specific 404s (assets vs routes)

**Asset 404s** (JS/CSS files not loading):

- Check asset paths in `scripts/build-ci.sh` - should use `BASE_PATH` variable
- Verify `vite.config.ts` has correct `base` setting
- Look for absolute paths (should be relative or use base path)

**Route 404s** (refreshing on `/demo.html` gives 404):

- GitHub Pages doesn't support SPA routing by default
- Use hash routing in React Router: `createHashRouter()` instead of `createBrowserRouter()`
- Or add custom 404.html that redirects to index.html

### Changes not reflecting

**Workflow not running:**

- Workflow only triggers on push to `main` branch
- Check `.github/workflows/deploy-pages.yml` - `branches: [main]`
- Verify you pushed to `main` (not a different branch)
- Check Actions tab - workflow should show "in progress" or "completed"

**Workflow ran but changes not visible:**

1. Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows/Linux)
2. Clear browser cache for the site
3. Open in incognito/private mode
4. Check GitHub Pages dashboard for deployment time
5. GitHub Pages CDN can take 1-2 minutes to propagate

**Caching issues:**

- Assets have content hashes (e.g., `index-abc123.js`) - should bust cache automatically
- If seeing old assets, check build logs for hash generation
- Verify `vite.config.ts` has `build.rollupOptions.output.assetFileNames` with `[hash]`

### Build succeeds but site broken

**Broken JavaScript/CSS:**

- Check browser console for errors
- Common issue: Incorrect `base` path in vite config
- Verify paths in network tab (should be `/catalyst-ui/assets/...`)

**Storybook not loading:**

- Check `/storybook/index.html` exists
- Verify storybook build completed (check Actions logs)
- Ensure `.storybook/main.ts` has correct `base` setting

**API docs broken:**

- Check `/api/README.md` exists and renders
- Verify TypeDoc generated successfully (no JSDoc syntax errors)
- Look for TypeScript compilation errors in build logs

### Permission errors in workflow

**GitHub Actions permissions:**

- Workflow needs `contents: read` and `pages: write` permissions
- Check `.github/workflows/deploy-pages.yml` permissions block
- Verify repository Settings → Actions → General → Workflow permissions is "Read and write"

### Out of disk space

**GitHub Actions runners have limited space:**

- Clean up between builds: `yarn clean` or `task gh:clean`
- Remove unused dependencies
- Check for large files in `dist/` (should be gitignored)
- Use `--no-frozen-lockfile` sparingly (increases install size)

## Rollback Procedures

If a deployment breaks the site, you can roll back to a previous version:

### Option 1: Revert via Git (Recommended)

**For bad code changes:**

```bash
# Find the commit that broke the site
git log --oneline

# Revert to previous working commit
git revert <bad-commit-hash>

# Or reset to previous commit (destructive)
git reset --hard <good-commit-hash>
git push --force origin main
```

**This triggers automatic redeployment of the working version.**

### Option 2: Re-run Previous Workflow

**For broken builds (code is fine):**

1. Go to Actions tab → "Deploy to GitHub Pages"
2. Find the last successful workflow run (green checkmark)
3. Click on the run
4. Click "Re-run all jobs" button
5. Monitor the redeployment

**Note**: This only works if the issue was transient (e.g., npm registry timeout, not code changes).

### Option 3: Manual Deployment from Local

**Emergency rollback when GitHub Actions is unavailable:**

**Requirements:**

- `gh` CLI installed: `brew install gh`
- Authenticated: `gh auth login`

**Steps:**

```bash
# 1. Checkout last known working commit
git checkout <good-commit-hash>

# 2. Build everything locally
yarn build:app
yarn build:storybook
yarn docs:api

# 3. Run CI build script
./scripts/build-ci.sh

# 4. Deploy manually (requires gh CLI)
cd gh-pages
gh repo view --web  # Get repo URL
# Use gh pages deploy or manually push to gh-pages branch
```

**Warning**: Manual deployment should be last resort - prefer Options 1 or 2.

### Rollback Checklist

After any rollback:

- [ ] Verify site loads: https://thebranchdriftcatalyst.github.io/catalyst-ui/
- [ ] Check demo app works: `/demo.html`
- [ ] Check Storybook loads: `/storybook/`
- [ ] Check API docs render: `/api/`
- [ ] Test on mobile and desktop
- [ ] Check browser console for errors
- [ ] Verify CHANGELOG.md is correct version

### Preventing Future Issues

**Pre-deployment checklist:**

1. Test builds locally: `yarn build:app && yarn build:storybook && yarn docs:api`
2. Validate CI build: `task gh:build-ci && task gh:validate`
3. Check for console errors in dev: `yarn dev`
4. Run tests: `yarn test`
5. Review diffs before pushing
6. Push to feature branch first, test in PR preview (if available)

**Post-deployment verification:**

- Wait 2-3 minutes for CDN propagation
- Check deployed site immediately
- Monitor for error reports
- Keep GitHub Actions tab open during deployment

## Notes

- **Auto-deployment**: Every push to `main` triggers a new deployment
- **Build artifacts**: All build outputs in `dist/` and `gh-pages/` are gitignored
- **Caching**: Node modules are cached in GitHub Actions for faster builds (5-10min → 2-3min)
- **Permissions**: Workflow has minimal required permissions for Pages deployment
- **Deployment time**: Typically 3-5 minutes from push to live site
- **CDN propagation**: GitHub Pages CDN takes 1-2 minutes to update globally

# GitHub Actions Testing Guide

This guide covers testing GitHub Actions workflows locally using `act` and validating build outputs.

## Overview

We have two main GitHub Actions workflows:

1. **test.yml** - Runs tests, generates coverage reports, and uploads to Codecov
2. **deploy-pages.yml** - Builds and deploys the project to GitHub Pages

## Prerequisites

- [act](https://github.com/nektos/act) - Run GitHub Actions locally
- [Docker](https://www.docker.com/) - Required by act
- [Task](https://taskfile.dev/) - Task runner (optional, but recommended)

## Configuration

The project includes a `.actrc` file that configures act to:

- Use `catthehacker/ubuntu:act-latest` images for compatibility
- Set `linux/amd64` architecture for M1/M2 Mac compatibility
- Use Docker for containerized testing

## Available Tasks

All GitHub Actions testing tasks are prefixed with `gh:` in the Taskfile.

### Listing Workflows

```bash
# List all available workflows and jobs
task gh:list
```

### Dry Runs

Dry runs show what would execute without actually running the workflows:

```bash
# Dry run all workflows
task gh:test:dry

# Dry run test workflow only
task gh:test:dry-run

# Dry run deploy workflow only
task gh:deploy:dry-run
```

### Test Workflow

Run the test workflow (test.yml) locally:

```bash
# Run test workflow
task gh:test

# Run with verbose output
task gh:test:verbose
```

**What it tests:**

- Installs dependencies with Yarn
- Runs `yarn test`
- Generates coverage report with `yarn test:coverage`
- Simulates Codecov upload
- Creates coverage badge (requires secrets)
- Archives test results

### Deploy Workflow

Run the deploy workflow (deploy-pages.yml) locally:

```bash
# Run build job only (recommended for testing)
task gh:deploy:build

# Run with verbose output
task gh:deploy:build-verbose

# Run full workflow (build + deploy)
task gh:deploy:full
```

**What it tests:**

- Installs dependencies with Yarn
- Runs `./scripts/build-ci.sh`
- Builds both the app and Storybook
- Creates GitHub Pages structure
- Uploads artifact (simulated)

### CI Build Script

Test the CI build script directly without Docker overhead:

```bash
# Run CI build script
task gh:build-ci

# Run and validate output
task gh:build-ci:validate
```

**What it does:**

- Cleans previous builds
- Builds app with Vite (`yarn build:app`)
- Builds Storybook (`yarn build:storybook`)
- Merges outputs into `gh-pages/` directory
- Creates synthwave landing page
- Validates output structure

### Validation

Validate the GitHub Pages build output:

```bash
# Validate gh-pages directory structure
task gh:validate
```

**Validation checks:**

- ✅ Required files exist (index.html, demo.html, .nojekyll, storybook/index.html)
- ✅ HTML files have valid structure
- ✅ Landing page contains expected content
- ✅ Storybook directory is complete
- ✅ Assets are present

### Combined Tests

Run multiple tests in sequence:

```bash
# Run all workflow tests (test + deploy build)
task gh:test:all

# Quick validation (list + dry run)
task gh:test:quick
```

### Cleanup

Clean up build artifacts:

```bash
# Remove dist/ and gh-pages/ directories
task gh:clean
```

## Testing Workflow

Recommended workflow for testing changes to GitHub Actions:

1. **List workflows** to see available jobs:

   ```bash
   task gh:list
   ```

2. **Dry run** to validate syntax without execution:

   ```bash
   task gh:test:dry-run
   task gh:deploy:dry-run
   ```

3. **Test specific workflows**:

   ```bash
   # Test the test workflow
   task gh:test

   # Test the deploy build
   task gh:deploy:build
   ```

4. **Validate output**:

   ```bash
   task gh:validate
   ```

5. **Clean up**:
   ```bash
   task gh:clean
   ```

## Build Output Structure

After running `task gh:deploy:build` or `task gh:build-ci`, the `gh-pages/` directory will have:

```
gh-pages/
├── index.html           # Synthwave landing page
├── demo.html            # Main app (renamed from index.html)
├── .nojekyll            # Disables Jekyll processing
├── assets/              # Vite-generated assets (JS, CSS, fonts, etc.)
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
├── storybook/           # Storybook static build
│   ├── index.html
│   ├── iframe.html
│   ├── assets/
│   └── ...
└── CHANGELOG.md         # Changelog file
```

## Validation Script

The validation script (`scripts/validate-gh-pages.sh`) performs comprehensive checks:

### Required Files Check

- Verifies all essential files exist
- Reports file sizes

### HTML Structure Check

- Validates DOCTYPE declarations
- Checks for `<html>`, `<head>`, `<body>` tags
- Ensures files are not empty

### Landing Page Content Check

- Verifies "CATALYST UI" branding
- Checks for links to demo.html and storybook/
- Validates expected content

### Storybook Check

- Verifies storybook directory exists
- Checks for index.html
- Counts JS and CSS assets

### Assets Check

- Verifies assets directory
- Counts JS and CSS files
- Warns if assets are missing

### Summary Report

- Total size of gh-pages/
- File counts (total, HTML, JS, CSS)
- Build statistics

## Troubleshooting

### Docker Issues

If Docker is not running:

```bash
# Start Docker Desktop first, then run:
task gh:list
```

### Permission Errors

If you encounter permission errors with scripts:

```bash
chmod +x scripts/build-ci.sh
chmod +x scripts/validate-gh-pages.sh
```

### Act Errors

If act fails to pull images:

```bash
# Manually pull the required image
docker pull catthehacker/ubuntu:act-latest --platform linux/amd64
```

### Build Failures

If builds fail:

1. Check that dependencies are installed: `yarn install`
2. Try building locally first: `yarn build:app && yarn build:storybook`
3. Clean and retry: `task gh:clean && task gh:deploy:build`

## Integration with CI/CD

These local tests help catch issues before pushing to GitHub:

1. **Before committing workflow changes:**

   ```bash
   task gh:test:dry-run
   task gh:deploy:dry-run
   ```

2. **Before pushing to main:**

   ```bash
   task gh:test:all
   task gh:validate
   ```

3. **After updating build scripts:**
   ```bash
   task gh:build-ci:validate
   ```

## Environment Variables

### Deploy Workflow

The deploy workflow uses:

- `BASE_PATH` - Base path for GitHub Pages (default: `/catalyst-ui/`)

You can override this when testing:

```bash
BASE_PATH=/custom-path/ ./scripts/build-ci.sh
```

### Test Workflow

The test workflow requires these secrets (only in GitHub Actions):

- `CODECOV_TOKEN` - For uploading to Codecov
- `GIST_SECRET` - For creating coverage badges
- `GIST_ID` - Gist ID for coverage badge storage

These are automatically mocked by act during local testing.

## Performance Tips

### Skip Slow Steps

When iterating on workflows, you can:

1. Use dry runs to validate syntax quickly
2. Test the CI build script directly (bypasses Docker)
3. Run specific jobs instead of full workflows

### Use Verbose Mode Sparingly

Verbose output is helpful for debugging but slows down execution:

```bash
# Normal speed
task gh:deploy:build

# Slower, more detailed
task gh:deploy:build-verbose
```

### Cache Docker Images

Act caches Docker images, but you can pre-pull them:

```bash
docker pull catthehacker/ubuntu:act-latest --platform linux/amd64
docker pull catthehacker/ubuntu:act-22.04 --platform linux/amd64
```

## References

- [act Documentation](https://github.com/nektos/act)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Taskfile Documentation](https://taskfile.dev/)

## Contributing

When modifying workflows:

1. Test locally first with act
2. Use dry runs to validate syntax
3. Validate output structure with `task gh:validate`
4. Document any new environment variables or secrets
5. Update this guide if adding new test tasks

## Quick Reference

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `task gh:list`         | List all workflows and jobs       |
| `task gh:test:dry`     | Dry run all workflows             |
| `task gh:test`         | Run test workflow locally         |
| `task gh:deploy:build` | Run deploy build job locally      |
| `task gh:validate`     | Validate gh-pages output          |
| `task gh:build-ci`     | Test CI build script directly     |
| `task gh:clean`        | Clean build artifacts             |
| `task gh:test:all`     | Run all workflow tests            |
| `task gh:test:quick`   | Quick validation (list + dry run) |
