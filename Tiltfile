# -*- mode: Python -*-
# Tiltfile for catalyst-ui development workflow
#
# This Tiltfile provides a hot-reload development experience for the catalyst-ui
# application running in Kubernetes. It watches for file changes, rebuilds the
# Docker image, and syncs to the cluster.
#
# Usage:
#   tilt up                    # Start development environment
#   tilt down                  # Tear down resources
#   tilt up --stream           # Start with log streaming
#
# Prerequisites:
#   - kubectl configured and connected to your cluster
#   - Docker running locally
#   - Tilt installed (https://tilt.dev)

# =============================================================================
# Configuration
# =============================================================================

# Allow connecting to the Talos cluster (k8s context)
allow_k8s_contexts(['admin@talos-default', 'talos-default'])

# Registry configuration - use local registry via port-forward
# Run: kubectl port-forward -n registry svc/nexus-docker 5000:5000
default_registry('localhost:5000')

# =============================================================================
# Build Configuration
# =============================================================================

# Build the Docker image with live update support
docker_build(
    'catalyst-ui',
    '.',
    dockerfile='Dockerfile',
    # Live update allows syncing files without full rebuild
    live_update=[
        # Sync source changes (for development builds)
        sync('./app', '/app/app'),
        sync('./lib', '/app/lib'),
        sync('./public', '/app/public'),
        # If package.json changes, run yarn install
        run('cd /app && yarn install', trigger=['./package.json', './yarn.lock']),
        # Rebuild when source changes
        run('cd /app && yarn build:app', trigger=['./app', './lib']),
    ],
)

# =============================================================================
# Kubernetes Resources
# =============================================================================

# Load k8s manifests from the k8s directory
k8s_yaml(kustomize('k8s'))

# Configure the catalyst-ui resource
k8s_resource(
    'catalyst-ui',
    port_forwards=[
        port_forward(3000, 80, name='catalyst-ui'),
    ],
    labels=['frontend'],
    resource_deps=[],  # No dependencies for now
)

# =============================================================================
# Development Helpers
# =============================================================================

# Add a button to open the app in browser
local_resource(
    'open-browser',
    'open http://localhost:3000 || xdg-open http://localhost:3000 2>/dev/null || echo "Open http://localhost:3000 in your browser"',
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
    labels=['helpers'],
)

# Add a button to run tests
local_resource(
    'run-tests',
    'yarn test',
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
    labels=['helpers'],
)

# Add a button to run linting
local_resource(
    'lint',
    'yarn lint',
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
    labels=['helpers'],
)

# =============================================================================
# Custom Commands
# =============================================================================

# Print helpful info on startup
print("""
=============================================================================
  Catalyst UI Development Environment
=============================================================================

  Resources:
    - catalyst-ui: http://localhost:3000 (port-forwarded)
    - In-cluster:  http://catalyst.talos00 (via Traefik IngressRoute)

  Manual triggers (Tilt UI):
    - open-browser: Open app in browser
    - run-tests:    Run test suite
    - lint:         Run ESLint

  Tips:
    - Changes to app/ and lib/ will trigger live updates
    - package.json changes will reinstall dependencies
    - Full rebuild on Dockerfile changes

  Prerequisites:
    - Registry port-forward: kubectl port-forward -n registry svc/nexus-docker 5000:5000

=============================================================================
""")
