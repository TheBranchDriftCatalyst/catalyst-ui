# Base Path Guidelines for GitHub Pages Deployment

This document outlines best practices for handling base paths to ensure the application works correctly both locally and when deployed to GitHub Pages at `/catalyst-ui/`.

## Problem Context

When deploying to GitHub Pages under a subdirectory (e.g., `https://thebranchdriftcatalyst.github.io/catalyst-ui/`), all URLs must respect the base path. Hardcoded absolute paths like `/models/...` or `/home/welcome` will resolve to the root domain instead of the subdirectory.

## Environment Variables

**Build-time:**

- `VITE_BASE_PATH` - Set by build-ci.sh to `/catalyst-ui/` for production builds
- `import.meta.env.BASE_URL` - Vite exposes this at runtime (set from `base` config)

**Configuration:**

- `vite.app.config.ts` line 29: `base: process.env.VITE_BASE_PATH || "/"`

## Rules for Base Path Handling

### ✅ DO: Use `import.meta.env.BASE_URL` for all paths

**1. Static Assets (images, models, files)**

```tsx
// ✅ Correct
const modelPath = `${import.meta.env.BASE_URL}models/desktop_pc/scene.gltf`;
const imagePath = `${import.meta.env.BASE_URL}images/logo.png`;

// ❌ Wrong
const modelPath = "/models/desktop_pc/scene.gltf";
const imagePath = "/images/logo.png";
```

**2. Navigation and Routing**

```tsx
// ✅ Correct - prepend base path
const basePath = import.meta.env.BASE_URL || "/";
const newPath = `${basePath}${section}/${tab}`;
window.history.replaceState({}, "", newPath);

// ❌ Wrong - absolute path
const newPath = `/${section}/${tab}`;
window.history.replaceState({}, "", newPath);
```

**3. Parsing URLs (strip base path first)**

```tsx
// ✅ Correct - remove base path before parsing
const basePath = import.meta.env.BASE_URL || "/";
const relativePath = window.location.pathname.replace(new RegExp(`^${basePath}`), "");
const segments = relativePath.split("/").filter(Boolean);

// ❌ Wrong - parse absolute pathname directly
const segments = window.location.pathname.split("/").filter(Boolean);
```

**4. HTML Assets (Vite handles automatically)**

```html
<!-- ✅ Vite transforms these automatically -->
<link rel="icon" href="/vite.svg" />
<script type="module" src="/main.tsx"></script>

<!-- No action needed in index.html - Vite's base config handles this -->
```

### ✅ DO: Test with base path locally

```bash
# Build with base path
VITE_BASE_PATH="/catalyst-ui/" yarn build:app

# Preview the build (navigate to localhost:4173/catalyst-ui/)
yarn preview:app
```

### ❌ DON'T: Hardcode absolute paths

**Never do this:**

```tsx
// ❌ Hardcoded absolute paths
fetch("/api/data");
window.location.href = "/home";
<img src="/images/logo.png" />;
useGLTF("/models/scene.gltf");
```

**Instead:**

```tsx
// ✅ Use base path
const basePath = import.meta.env.BASE_URL || "/";
fetch(`${basePath}api/data`);
window.location.href = `${basePath}home`;
<img src={`${basePath}images/logo.png`} />;
useGLTF(`${basePath}models/scene.gltf`);
```

## Checklist for New Code

Before adding new features, check:

- [ ] All asset paths use `import.meta.env.BASE_URL` prefix
- [ ] Navigation/routing respects base path when constructing URLs
- [ ] URL parsing strips base path before extracting segments
- [ ] No hardcoded `/` paths in fetch, href, src, etc.
- [ ] Test locally with `VITE_BASE_PATH="/catalyst-ui/"` build

## Common Pitfalls

### 1. 3D Models (Three.js/GLTF)

```tsx
// ❌ Wrong
useGLTF("/models/desktop_pc/scene.gltf");

// ✅ Correct
useGLTF(`${import.meta.env.BASE_URL}models/desktop_pc/scene.gltf`);
```

### 2. Client-Side Routing

```tsx
// ❌ Wrong
const newPath = `/${section}/${tab}`;

// ✅ Correct
const basePath = import.meta.env.BASE_URL || "/";
const newPath = `${basePath}${section}/${tab}`;
```

### 3. Parsing window.location.pathname

```tsx
// ❌ Wrong - includes base path in segments
const segments = window.location.pathname.split("/").filter(Boolean);
// On GH Pages: ['/catalyst-ui/', 'home', 'welcome'] ❌

// ✅ Correct - strip base path first
const basePath = import.meta.env.BASE_URL || "/";
const relativePath = window.location.pathname.replace(new RegExp(`^${basePath}`), "");
const segments = relativePath.split("/").filter(Boolean);
// Result: ['home', 'welcome'] ✅
```

### 4. Dynamic Imports

```tsx
// ✅ Vite handles dynamic imports automatically
const module = await import(`./tabs/${tabName}.tsx`);
// No base path needed - Vite resolves relative to chunk location
```

## Files Already Fixed

These files correctly handle base paths:

1. **lib/components/ThreeJS/DesktopPCModel.tsx**
   - Lines 44, 92: `${import.meta.env.BASE_URL}models/desktop_pc/scene.gltf`

2. **lib/components/ThreeJS/PlanetModel.tsx**
   - Lines 41, 63: `${import.meta.env.BASE_URL}models/planet/scene.gltf`

3. **app/App.tsx**
   - Lines 34-42: getInitialState() strips base path
   - Lines 87-92: URL updates prepend base path
   - Lines 113-121: popstate handler strips base path

4. **vite.app.config.ts**
   - Line 6: Import `@rollup/plugin-yaml`
   - Line 45: Add `yamlPlugin()` to plugins array

## Deployment Process

1. **Local Development**: `yarn dev` (BASE_URL = "/")
2. **Local Testing**: `VITE_BASE_PATH="/catalyst-ui/" yarn build:app && yarn preview:app`
3. **CI Build**: `scripts/build-ci.sh` sets `VITE_BASE_PATH="/catalyst-ui/"`
4. **GitHub Pages**: Deployed to `https://thebranchdriftcatalyst.github.io/catalyst-ui/`

## Related Issues

- **Issue #1**: 3D models failed to load (absolute paths)
  - Fixed: 2025-11-09 (commit 9bda73c)

- **Issue #2**: Tab navigation broken (routing without base path)
  - Fixed: 2025-11-09 (commit cf6bde1)

## Additional Resources

- [Vite Base Path Config](https://vitejs.dev/config/shared-options.html#base)
- [GitHub Pages Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
