#!/usr/bin/env bash
#
# docker-push.sh - Push Docker image to registry
#
# Usage:
#   ./scripts/docker-push.sh              # Push latest tag
#   ./scripts/docker-push.sh v1.2.3       # Push specific tag
#   ./scripts/docker-push.sh --all        # Push all local tags
#
# Environment variables:
#   REGISTRY      - Docker registry (default: localhost:5000)
#   IMAGE_NAME    - Image name (default: catalyst-ui)
#
# Prerequisites:
#   For local Nexus registry, start port-forward first:
#   kubectl port-forward -n registry svc/nexus-docker 5000:5000
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REGISTRY="${REGISTRY:-localhost:5000}"
IMAGE_NAME="${IMAGE_NAME:-catalyst-ui}"

# Determine tag
if [[ "${1:-}" == "--all" ]]; then
    PUSH_ALL=true
    TAG="latest"
elif [[ -n "${1:-}" ]]; then
    PUSH_ALL=false
    TAG="$1"
else
    PUSH_ALL=false
    TAG="latest"
fi

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Pushing catalyst-ui Docker image${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  Registry:  ${GREEN}${REGISTRY}${NC}"
echo -e "  Image:     ${GREEN}${IMAGE_NAME}${NC}"
echo -e "  Tag:       ${GREEN}${TAG}${NC}"
echo ""

# Check if registry is reachable
echo -e "${YELLOW}Checking registry connectivity...${NC}"
if ! curl -sf "http://${REGISTRY}/v2/" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to registry at ${REGISTRY}${NC}"
    echo ""
    echo -e "${YELLOW}For local Nexus registry, start port-forward:${NC}"
    echo -e "  kubectl port-forward -n registry svc/nexus-docker 5000:5000"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Registry is reachable${NC}"
echo ""

# Check if image exists locally
if ! docker image inspect "${FULL_IMAGE}" > /dev/null 2>&1; then
    echo -e "${RED}Error: Image ${FULL_IMAGE} not found locally${NC}"
    echo ""
    echo -e "${YELLOW}Build the image first:${NC}"
    echo -e "  ./scripts/docker-build.sh ${TAG}"
    echo ""
    exit 1
fi

# Push the image
echo -e "${YELLOW}Pushing ${FULL_IMAGE}...${NC}"
docker push "${FULL_IMAGE}"

# Also push latest if pushing a specific tag
if [[ "$TAG" != "latest" ]] && [[ "$PUSH_ALL" == "false" ]]; then
    echo ""
    echo -e "${YELLOW}Also pushing latest tag...${NC}"
    docker push "${REGISTRY}/${IMAGE_NAME}:latest"
fi

echo ""
echo -e "${GREEN}✓ Push complete!${NC}"
echo ""
echo -e "${BLUE}Image is now available at:${NC}"
echo -e "  ${FULL_IMAGE}"
if [[ "$TAG" != "latest" ]]; then
    echo -e "  ${REGISTRY}/${IMAGE_NAME}:latest"
fi
echo ""
echo -e "${BLUE}To deploy with ArgoCD:${NC}"
echo -e "  ArgoCD will auto-sync if using 'latest' tag"
echo -e "  Or update k8s/kustomization.yaml with new tag"
