#!/usr/bin/env bash
#
# docker-build.sh - Build Docker image for catalyst-ui (multi-arch support)
#
# Usage:
#   ./scripts/docker-build.sh              # Build for current platform (latest tag)
#   ./scripts/docker-build.sh v1.2.3       # Build with specific tag
#   ./scripts/docker-build.sh --sha        # Build with git SHA tag
#   ./scripts/docker-build.sh --multiarch  # Build for linux/amd64 and linux/arm64
#
# Environment variables:
#   REGISTRY        - Docker registry (default: localhost:5000)
#   IMAGE_NAME      - Image name (default: catalyst-ui)
#   PLATFORMS       - Target platforms (default: linux/amd64,linux/arm64 for multiarch)
#   PUSH            - Set to "true" to push after build (required for multiarch)
#   DOCKER_BUILD_ARGS - Additional docker build arguments
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
PUSH="${PUSH:-false}"
MULTIARCH=false

# Parse arguments
POSITIONAL_ARGS=()
while [[ $# -gt 0 ]]; do
    case $1 in
        --multiarch|-m)
            MULTIARCH=true
            shift
            ;;
        --push|-p)
            PUSH=true
            shift
            ;;
        --sha)
            POSITIONAL_ARGS+=("--sha")
            shift
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done
set -- "${POSITIONAL_ARGS[@]:-}"

# Determine tag
if [[ "${1:-}" == "--sha" ]]; then
    TAG=$(git -C "$PROJECT_ROOT" rev-parse --short HEAD)
elif [[ -n "${1:-}" ]]; then
    TAG="$1"
else
    TAG="latest"
fi

# Set platforms
# Default platforms: amd64 (Intel/AMD), arm64 (Apple Silicon, AWS Graviton, Raspberry Pi 4)
# Optional: arm/v7 (older Raspberry Pi), 386 (32-bit x86)
if [[ "$MULTIARCH" == "true" ]]; then
    PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64,linux/arm/v7}"
else
    PLATFORMS="${PLATFORMS:-}"
fi

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Building catalyst-ui Docker image${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  Registry:   ${GREEN}${REGISTRY}${NC}"
echo -e "  Image:      ${GREEN}${IMAGE_NAME}${NC}"
echo -e "  Tag:        ${GREEN}${TAG}${NC}"
echo -e "  Full:       ${GREEN}${FULL_IMAGE}${NC}"
echo -e "  Multi-arch: ${GREEN}${MULTIARCH}${NC}"
if [[ -n "$PLATFORMS" ]]; then
    echo -e "  Platforms:  ${GREEN}${PLATFORMS}${NC}"
fi
echo -e "  Push:       ${GREEN}${PUSH}${NC}"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Check if Dockerfile exists
if [[ ! -f "Dockerfile" ]]; then
    echo -e "${RED}Error: Dockerfile not found in ${PROJECT_ROOT}${NC}"
    exit 1
fi

# Multi-arch build requires buildx
if [[ "$MULTIARCH" == "true" ]]; then
    echo -e "${YELLOW}Setting up Docker buildx for multi-arch build...${NC}"

    # Create/use buildx builder
    BUILDER_NAME="catalyst-builder"
    if ! docker buildx inspect "$BUILDER_NAME" > /dev/null 2>&1; then
        echo -e "${YELLOW}Creating buildx builder '${BUILDER_NAME}'...${NC}"
        docker buildx create --name "$BUILDER_NAME" --driver docker-container --bootstrap
    fi
    docker buildx use "$BUILDER_NAME"

    # Multi-arch builds must push (can't load multi-arch to local daemon)
    if [[ "$PUSH" != "true" ]]; then
        echo -e "${YELLOW}Note: Multi-arch builds require --push flag to store the image.${NC}"
        echo -e "${YELLOW}Building without push will only validate the build.${NC}"
    fi

    echo ""
    echo -e "${YELLOW}Building multi-arch image for: ${PLATFORMS}${NC}"

    BUILD_CMD="docker buildx build --platform ${PLATFORMS}"

    if [[ "$PUSH" == "true" ]]; then
        BUILD_CMD="$BUILD_CMD --push"
    fi

    $BUILD_CMD \
        --tag "${FULL_IMAGE}" \
        --tag "${REGISTRY}/${IMAGE_NAME}:latest" \
        ${DOCKER_BUILD_ARGS:-} \
        .
else
    # Standard single-arch build
    echo -e "${YELLOW}Building Docker image (single arch)...${NC}"

    docker build \
        --tag "${FULL_IMAGE}" \
        --tag "${REGISTRY}/${IMAGE_NAME}:latest" \
        ${DOCKER_BUILD_ARGS:-} \
        .

    if [[ "$PUSH" == "true" ]]; then
        echo ""
        echo -e "${YELLOW}Pushing image...${NC}"
        docker push "${FULL_IMAGE}"
        docker push "${REGISTRY}/${IMAGE_NAME}:latest"
    fi
fi

echo ""
echo -e "${GREEN}✓ Build complete!${NC}"
echo ""
echo -e "  Image: ${FULL_IMAGE}"
echo ""

if [[ "$PUSH" != "true" ]] && [[ "$MULTIARCH" != "true" ]]; then
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  Push to registry:  ./scripts/docker-push.sh ${TAG}"
    echo -e "  Run locally:       docker run -p 3000:80 ${FULL_IMAGE}"
elif [[ "$MULTIARCH" == "true" ]] && [[ "$PUSH" != "true" ]]; then
    echo -e "${BLUE}To build and push multi-arch:${NC}"
    echo -e "  ./scripts/docker-build.sh --multiarch --push ${TAG}"
fi
