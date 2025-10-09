# GitHub Pages Deployment Guide

This repository is configured to automatically deploy both the demo app and Storybook to GitHub Pages.

## Quick Start

- [x] **Push to GitHub**

  ```bash
  git push origin main
  ```

- [x] **Enable GitHub Pages** _(Completed: 2025-10-08)_
  1. Go to your repository on GitHub
  2. Navigate to **Settings** → **Pages** (in left sidebar)
  3. Under **"Source"**, select **GitHub Actions** from the dropdown
  4. Save the changes

- [x] **Wait for deployment** _(Completed: 2025-10-08)_
  - Go to the **Actions** tab in your repository
  - Watch the "Deploy to GitHub Pages" workflow run
  - First deployment takes ~2-5 minutes

- [x] **Access your deployed site** _(Live at: https://thebranchdriftcatalyst.github.io/catalyst-ui/)_
  - **Root**: `https://<username>.github.io/<repo-name>/` - Landing page
  - **Demo App**: `https://<username>.github.io/<repo-name>/demo.html`
  - **Storybook**: `https://<username>.github.io/<repo-name>/storybook/`

## Deployment Structure

```
/                    Landing page with navigation to both sections
├── demo.html       Demo app showcase
├── storybook/      Component library documentation
└── assets/         Shared assets
```

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) automatically:

1. **Builds the demo app** using `yarn build:app`
   - Output: `dist/app/` (gitignored)

2. **Builds Storybook** using `yarn build:storybook`
   - Output: `dist/storybook/` (gitignored)

3. **Combines both builds** into a single deployment:
   - Renames app's `index.html` to `demo.html`
   - Copies Storybook to `/storybook/` subdirectory
   - Creates a custom landing page at root

4. **Deploys to GitHub Pages** using GitHub Actions

## Manual Deployment Trigger

You can manually trigger a deployment without pushing:

- [ ] Go to **Actions** tab on GitHub
- [ ] Select "Deploy to GitHub Pages" workflow
- [ ] Click **Run workflow** → **Run workflow**

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

- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json` (not devDependencies for build deps)
- Verify builds work locally first

### 404 errors on deployed site

- Check that Pages is set to use "GitHub Actions" source
- Verify the workflow completed successfully
- Check browser console for asset loading errors

### Changes not reflecting

- Workflow only runs on push to `main` branch
- Check the Actions tab to see if workflow ran
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

## Notes

- **Auto-deployment**: Every push to `main` triggers a new deployment
- **Build artifacts**: All build outputs in `dist/` are gitignored
- **Caching**: Node modules are cached in GitHub Actions for faster builds
- **Permissions**: Workflow has minimal required permissions for Pages deployment
