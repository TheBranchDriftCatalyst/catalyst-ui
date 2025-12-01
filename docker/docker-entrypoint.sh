#!/bin/sh
set -e

# Runtime configuration injection for Catalyst UI
# This script replaces placeholder values in config.js with environment variables

CONFIG_FILE="/usr/share/nginx/html/config.js"

# Default values
BASE_URL="${BASE_URL:-/}"
API_URL="${API_URL:-}"
ENVIRONMENT="${ENVIRONMENT:-production}"

echo "Injecting runtime configuration..."
echo "  BASE_URL: $BASE_URL"
echo "  API_URL: $API_URL"
echo "  ENVIRONMENT: $ENVIRONMENT"

# Replace placeholders in config.js
if [ -f "$CONFIG_FILE" ]; then
    sed -i "s|__RUNTIME_BASE_URL__|${BASE_URL}|g" "$CONFIG_FILE"
    sed -i "s|__RUNTIME_API_URL__|${API_URL}|g" "$CONFIG_FILE"
    sed -i "s|__RUNTIME_ENVIRONMENT__|${ENVIRONMENT}|g" "$CONFIG_FILE"
    echo "Configuration injected successfully"
else
    echo "Warning: $CONFIG_FILE not found, skipping config injection"
fi

# Execute the main command (nginx)
exec "$@"
