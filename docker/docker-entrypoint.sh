#!/bin/sh
set -e

# Runtime configuration injection for Catalyst UI
# This script replaces placeholder values in config.js with environment variables

CONFIG_FILE="/usr/share/nginx/html/config.js"
HEALTH_FILE="/usr/share/nginx/html/health.json"

# Default values
BASE_URL="${BASE_URL:-/}"
API_URL="${API_URL:-}"
ENVIRONMENT="${ENVIRONMENT:-production}"
# DEV_UTILS_ENABLED defaults to false - set to "true" to enable dev tools in production
DEV_UTILS_ENABLED="${DEV_UTILS_ENABLED:-false}"

# Convert string to boolean for JS
if [ "$DEV_UTILS_ENABLED" = "true" ] || [ "$DEV_UTILS_ENABLED" = "1" ]; then
    DEV_UTILS_JS="true"
else
    DEV_UTILS_JS="false"
fi

echo "Injecting runtime configuration..."
echo "  BASE_URL: $BASE_URL"
echo "  API_URL: $API_URL"
echo "  ENVIRONMENT: $ENVIRONMENT"
echo "  DEV_UTILS_ENABLED: $DEV_UTILS_JS"

# Replace placeholders in config.js
if [ -f "$CONFIG_FILE" ]; then
    sed -i "s|__RUNTIME_BASE_URL__|${BASE_URL}|g" "$CONFIG_FILE"
    sed -i "s|__RUNTIME_API_URL__|${API_URL}|g" "$CONFIG_FILE"
    sed -i "s|__RUNTIME_ENVIRONMENT__|${ENVIRONMENT}|g" "$CONFIG_FILE"
    sed -i "s|__RUNTIME_DEV_UTILS_ENABLED__|${DEV_UTILS_JS}|g" "$CONFIG_FILE"
    echo "Configuration injected successfully"
else
    echo "Warning: $CONFIG_FILE not found, skipping config injection"
fi

# Inject health check metadata
BUILD_VERSION="${BUILD_VERSION:-unknown}"
BUILD_TIMESTAMP="${BUILD_TIMESTAMP:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}"

if [ -f "$HEALTH_FILE" ]; then
    sed -i "s|__BUILD_VERSION__|${BUILD_VERSION}|g" "$HEALTH_FILE"
    sed -i "s|__BUILD_TIMESTAMP__|${BUILD_TIMESTAMP}|g" "$HEALTH_FILE"
    echo "Health check metadata injected: version=$BUILD_VERSION"
else
    echo "Warning: $HEALTH_FILE not found, skipping health injection"
fi

# Execute the main command (nginx)
exec "$@"
