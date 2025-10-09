# 🌆 CI Build Script Documentation

## Overview

`build-ci.sh` is a synthwave-styled production-ready build script that merges the Catalyst UI demo app and Storybook into a single GitHub Pages deployment.

**Version:** 1.0.0
**Location:** `scripts/build-ci.sh`

---

## 🎯 What It Does

The script performs a complete CI/CD build pipeline:

1. **Environment Diagnostics** - Logs system info, git status, Node/Yarn versions
2. **Cleanup** - Removes previous `dist/` and `gh-pages/` directories
3. **Build App** - Compiles demo app with Vite (output: `dist/app/`)
4. **Build Storybook** - Compiles Storybook docs (output: `dist/storybook/`)
5. **Merge Outputs** - Combines both builds into `gh-pages/` directory
6. **Create Landing Page** - Generates synthwave-styled `index.html`
7. **Validate** - Confirms all required files exist
8. **Report** - Outputs build metrics and JSON summary

---

## 📂 Output Structure

```
gh-pages/
├── index.html          # Synthwave landing page with links
├── demo.html           # Demo app (renamed from index.html)
├── assets/             # App assets (JS, CSS, images)
├── storybook/          # Complete Storybook build
│   ├── index.html
│   └── ...
└── .nojekyll           # Disables Jekyll processing
```

---

## 🚀 Local Usage

### Basic Run

```bash
# From project root
./scripts/build-ci.sh
```

### With Custom Base Path

```bash
# For different deployment path
BASE_PATH=/my-app/ ./scripts/build-ci.sh
```

### Test Before Deploying

```bash
# Run build
./scripts/build-ci.sh

# Preview landing page
open gh-pages/index.html

# Serve locally (requires npx/serve)
npx serve gh-pages
# Visit: http://localhost:3000
```

---

## 🔧 Environment Variables

| Variable    | Default         | Description                    |
| ----------- | --------------- | ------------------------------ |
| `BASE_PATH` | `/catalyst-ui/` | Base URL path for GitHub Pages |
| `NODE_ENV`  | `production`    | Build environment              |
| `CI`        | `false`         | CI/CD indicator                |

**Example:**

```bash
export BASE_PATH=/my-custom-path/
export NODE_ENV=production
./scripts/build-ci.sh
```

---

## 📊 Logging Output

The script provides comprehensive, color-coded logging:

### Log Levels

- **🎨 Headers** - Magenta section dividers
- **ℹ️ Info** - Cyan informational messages with timestamps
- **✓ Success** - Green success indicators
- **⚠️ Warning** - Orange warnings
- **✗ Error** - Red errors (exits with code 1)
- **▸ Steps** - Pink major steps
- **→ Substeps** - Purple detailed actions
- **📊 Metrics** - Yellow data points

### Example Output

```
  ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗
 ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝
 ██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║
 ██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║
 ╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║
  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝

         🌆 CI Build Script v1.0.0 🌆

╔═══════════════════════════════════════════════════════════════════╗
║ ENVIRONMENT DIAGNOSTICS
╚═══════════════════════════════════════════════════════════════════╝
ℹ  [2025-10-08 17:30:00] Script version: 1.0.0
ℹ  [2025-10-08 17:30:00] Project root: /Users/panda/catalyst-ui
  → Git Information:
  📊 Branch: main
  📊 Commit: a47b90a
  📊 Status: 3 modified files
  → Runtime Environment:
  📊 Node: v24.0.0
  📊 Yarn: 1.22.22
  📊 BASE_PATH: /catalyst-ui/

▸ Cleaning previous builds
  → Removing dist/ (4.2M)
✓  [2025-10-08 17:30:01] Removed dist/
✓  [2025-10-08 17:30:01] Cleanup complete

▸ Building application
  → Running: yarn build:app
  📊 Base path: /catalyst-ui/
✓  [2025-10-08 17:30:15] App build complete (14s, 2.1M, 87 files)

...

╔═══════════════════════════════════════════════════════════════════╗
║ BUILD REPORT
╚═══════════════════════════════════════════════════════════════════╝
  → Output Structure:
gh-pages/
├── index.html (5.2K)
├── demo.html (3.1K)
├── .nojekyll (0B)
├── assets/
└── storybook/

  → Size Analysis:
  📊 Total size: 8.3M
  📊 App size: 2.1M
  📊 Storybook size: 6.2M

  → Performance:
  📊 Total build time: 45s

ℹ  [2025-10-08 17:30:45] JSON Build Summary:
{
  "version": "1.0.0",
  "timestamp": "2025-10-09T00:30:45Z",
  "git_commit": "a47b90a3d...",
  "duration_seconds": 45,
  "output_size_bytes": 8704523,
  "file_count": 342,
  "base_path": "/catalyst-ui/",
  "status": "success"
}

╔═══════════════════════════════════════════════════════════════════╗
║  ✨ BUILD PIPELINE COMPLETE ✨
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🐛 Troubleshooting

### Build Fails: "yarn: command not found"

**Cause:** Yarn not installed or not in PATH

**Solution:**

```bash
# Install Yarn globally
npm install -g yarn

# Or use corepack (Node 16+)
corepack enable
```

---

### Build Fails: "dist/app not found"

**Cause:** App build failed

**Solution:**

1. Check `yarn build:app` runs successfully manually
2. Review dependencies in `package.json`
3. Clear node_modules and reinstall: `rm -rf node_modules && yarn install`

---

### Build Fails: "Storybook build failed"

**Cause:** Storybook configuration issue or missing dependencies

**Solution:**

1. Test Storybook locally: `yarn dev:storybook`
2. Check `.storybook/main.ts` configuration
3. Verify Storybook addons are installed

---

### GitHub Pages Shows 404

**Cause:** Base path mismatch or Pages not configured

**Solution:**

1. Verify `BASE_PATH=/your-repo-name/` matches your GitHub repo
2. Check Pages settings: Settings → Pages → Source = "GitHub Actions"
3. Ensure workflow completed successfully in Actions tab

---

### Assets Not Loading on GitHub Pages

**Cause:** Incorrect base path in build

**Solution:**

1. Verify `VITE_BASE_PATH` is set correctly in workflow
2. Check browser console for 404 errors
3. Inspect asset paths in deployed `demo.html` - should be `/repo-name/assets/...`

---

### Storybook Link Broken

**Cause:** App not using correct environment variable

**Solution:**

1. Ensure `app/App.tsx` uses:
   ```tsx
   const storybookUrl = import.meta.env.DEV
     ? "http://localhost:6006"
     : `${import.meta.env.BASE_URL}storybook/`;
   ```
2. Rebuild app: `./scripts/build-ci.sh`

---

## 🔍 Debugging CI Logs

### Finding Issues in GitHub Actions

1. Go to **Actions** tab in your repo
2. Click the failed workflow run
3. Expand the build step
4. Look for **red ✗ error messages**
5. Check the **JSON Build Summary** at the end for structured data

### Parsing JSON Summary

The script outputs a JSON summary for automated parsing:

```bash
# Extract from CI logs
./scripts/build-ci.sh 2>&1 | grep -A 10 "JSON Build Summary"

# Parse with jq
./scripts/build-ci.sh 2>&1 | grep -A 10 "JSON Build Summary" | tail -n +2 | jq '.duration_seconds'
```

---

## 📋 CI/CD Integration

### GitHub Actions

**File:** `.github/workflows/deploy-pages.yml`

```yaml
- name: Run CI Build Script
  run: ./scripts/build-ci.sh
  env:
    BASE_PATH: /catalyst-ui/
```

### Other CI Systems

The script is portable and works with:

- GitLab CI
- CircleCI
- Travis CI
- Jenkins
- Local development

Just ensure:

1. Node.js and Yarn are installed
2. `BASE_PATH` environment variable is set
3. Script has execute permissions (`chmod +x`)

---

## 🎨 Landing Page

The script auto-generates a synthwave-themed landing page at `gh-pages/index.html`:

**Features:**

- Animated grid background with perspective effect
- CRT scanlines for retro aesthetic
- Glowing neon buttons (magenta/cyan)
- Responsive design (mobile-friendly)
- Links to both Demo App and Storybook

**Customization:**
Edit the `create_landing_page()` function in `build-ci.sh` to modify styles, colors, or content.

---

## 📈 Performance Metrics

The script tracks and reports:

- **Build Duration:** Time for each step + total
- **Output Size:** Total bytes, app size, Storybook size
- **File Counts:** Total files, JS, CSS, HTML
- **Git Info:** Commit SHA, branch, modified files
- **System Info:** Node version, disk space, memory

**Example JSON Output:**

```json
{
  "version": "1.0.0",
  "timestamp": "2025-10-09T00:30:45Z",
  "git_commit": "a47b90a3d...",
  "duration_seconds": 45,
  "output_size_bytes": 8704523,
  "file_count": 342,
  "base_path": "/catalyst-ui/",
  "status": "success"
}
```

Use this data for:

- Build time regression tracking
- Bundle size monitoring
- CI/CD dashboards
- Performance budgets

---

## 🔒 Security Notes

- **No secrets required** - Script uses public GitHub Pages
- **Read-only git operations** - Only reads commit info
- **No external dependencies** - Uses standard bash utilities
- **Error handling** - `set -euo pipefail` prevents silent failures
- **Validation** - Confirms all required files before reporting success

---

## 🚀 Future Enhancements

Potential improvements:

- [ ] Add bundle analysis report
- [ ] Generate sourcemap coverage
- [ ] Add performance budgets with warnings
- [ ] Create diff report between builds
- [ ] Add compression (gzip/brotli) metrics
- [ ] Deploy preview URLs for PRs

---

## 📚 Related Documentation

- [GitHub Pages Deployment Guide](../docs/development/deployment.md)
- [Development Workflow](../docs/development/workflow.md)
- [Vite Configuration](../vite.app.config.ts)
- [Storybook Configuration](../.storybook/main.ts)

---

## 🆘 Support

If you encounter issues:

1. Check this documentation first
2. Review [Troubleshooting](#-troubleshooting) section
3. Examine CI logs for error messages
4. Test locally with `./scripts/build-ci.sh`
5. Create an issue with:
   - Full error log
   - JSON build summary
   - System info (`node -v`, `yarn -v`)
   - Git status (`git status`)

---

**Happy Building! 🌆✨**
