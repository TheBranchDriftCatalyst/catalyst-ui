# Testing GitHub Actions Locally

This directory contains scripts for testing GitHub Actions workflows locally using [`act`](https://github.com/nektos/act).

## Quick Start

```bash
# List available workflows and jobs
task test:gh-actions:list

# Run the build job locally (dry run first)
task test:gh-actions:dry

# Run the actual build
task test:gh-actions

# Validate the build output
task test:gh-actions:validate
```

## Setup

### Prerequisites

1. **Docker**: Act runs workflows in Docker containers
2. **act**: GitHub Actions local runner

```bash
# Install act (if not already installed)
brew install act

# Upgrade to latest version for node20 support
brew upgrade act
```

### Configuration

The `.actrc` file configures act to:
- Use `catthehacker/ubuntu:act-latest` Docker images (includes Node.js)
- Use `linux/amd64` architecture for M1/M2 Mac compatibility
- Match GitHub Actions' ubuntu-latest environment

## Known Issues

### `node20` Compatibility

If you see an error like:
```
Error: The runs.using key in action.yml must be one of: [composite docker node12 node16], got node20
```

**Solution**: Upgrade act to version 0.2.82 or later:
```bash
brew upgrade act
```

Older versions of act (< 0.2.70) don't support the `node20` runtime used by newer GitHub Actions like `actions/setup-node@v4`.

### Alternative: Downgrade Actions

If you can't upgrade act, you can temporarily downgrade the actions in `.github/workflows/deploy-pages.yml`:

```yaml
- uses: actions/checkout@v3  # instead of v4
- uses: actions/setup-node@v3  # instead of v4
```

But this is not recommended for production.

## Scripts

### `validate-gh-pages.sh`

Validates the GitHub Pages build output:
- ✅ Checks `gh-pages/` directory exists
- ✅ Validates `index.html` (landing page)
- ✅ Validates `demo.html` (app build)
- ✅ Validates `storybook/` directory (component docs)
- ✅ Checks for assets (JS/CSS files)
- 📦 Reports total build size

Run after building:
```bash
task test:gh-actions
task test:gh-actions:validate
```

## Preview Locally

After a successful build, preview the GitHub Pages output:

```bash
cd gh-pages
python3 -m http.server 8080
```

Then visit:
- http://localhost:8080 - Landing page
- http://localhost:8080/demo.html - Demo app
- http://localhost:8080/storybook/ - Storybook docs

## Workflow Details

The `deploy-pages.yml` workflow has two jobs:

1. **build** (tested with act):
   - Checkout code
   - Setup Node.js 20
   - Install dependencies
   - Build app (`yarn build:app`)
   - Build Storybook (`yarn build:storybook`)
   - Combine builds into `gh-pages/` directory
   - Upload artifact

2. **deploy** (cannot test locally):
   - Deploy to GitHub Pages
   - Requires GitHub Pages credentials
   - Only runs on GitHub Actions

## Debugging

### Verbose Output

Enable verbose logging in `.actrc`:
```bash
# Uncomment this line in .actrc
--verbose
```

### View Container Logs

```bash
# Run with verbose flag
act -j build --verbose

# Or inspect Docker container directly
docker ps  # while act is running
docker logs <container_id>
```

### Skip Specific Steps

```bash
# Run specific job
act -j build

# Set environment variables
act -j build --env MY_VAR=value
```

## Troubleshooting

### Workflow doesn't run

**Check**: Is Docker running?
```bash
docker ps
```

**Check**: Does the workflow file have syntax errors?
```bash
act -l  # Should list jobs
```

### Build fails in container

**Check**: Do you have enough disk space?
```bash
docker system df
docker system prune  # Clean up old images
```

**Check**: Is the Docker image pulled?
```bash
docker pull catthehacker/ubuntu:act-latest --platform linux/amd64
```

### Permission errors

**Check**: Is the validation script executable?
```bash
chmod +x scripts/validate-gh-pages.sh
```

## Resources

- [act Documentation](https://github.com/nektos/act)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [catthehacker Docker Images](https://github.com/catthehacker/docker_images)
