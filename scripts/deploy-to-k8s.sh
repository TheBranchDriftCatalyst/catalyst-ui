#!/usr/bin/env bash
#
# deploy-to-k8s.sh - Build, push, and deploy catalyst-ui to Kubernetes
#
# This is a convenience script that combines build, push, and triggers ArgoCD sync.
#
# Usage:
#   ./scripts/deploy-to-k8s.sh              # Build and deploy latest
#   ./scripts/deploy-to-k8s.sh v1.2.3       # Build and deploy specific version
#   ./scripts/deploy-to-k8s.sh --sha        # Build and deploy with git SHA
#
# Environment variables:
#   REGISTRY      - Docker registry (default: localhost:5000)
#   IMAGE_NAME    - Image name (default: catalyst-ui)
#   SKIP_BUILD    - Set to "true" to skip build step
#   SKIP_PUSH     - Set to "true" to skip push step
#
# Prerequisites:
#   - Docker running
#   - kubectl configured
#   - Port-forward to registry: kubectl port-forward -n registry svc/nexus-docker 5000:5000
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REGISTRY="${REGISTRY:-localhost:5000}"
IMAGE_NAME="${IMAGE_NAME:-catalyst-ui}"
SKIP_BUILD="${SKIP_BUILD:-false}"
SKIP_PUSH="${SKIP_PUSH:-false}"

# Determine tag
if [[ "${1:-}" == "--sha" ]]; then
    TAG=$(git -C "$PROJECT_ROOT" rev-parse --short HEAD)
elif [[ -n "${1:-}" ]]; then
    TAG="$1"
else
    TAG="latest"
fi

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Catalyst UI - Deploy to Kubernetes    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Tag: ${GREEN}${TAG}${NC}"
echo ""

# Step 1: Build
if [[ "$SKIP_BUILD" != "true" ]]; then
    echo -e "${BLUE}[1/4] Building Docker image...${NC}"
    "$SCRIPT_DIR/docker-build.sh" "$TAG"
    echo ""
else
    echo -e "${YELLOW}[1/4] Skipping build (SKIP_BUILD=true)${NC}"
    echo ""
fi

# Step 2: Check port-forward
echo -e "${BLUE}[2/4] Checking registry connectivity...${NC}"
if ! curl -sf "http://${REGISTRY}/v2/" > /dev/null 2>&1; then
    echo -e "${YELLOW}Registry not reachable. Starting port-forward...${NC}"

    # Check if port-forward is already running
    if pgrep -f "port-forward.*nexus-docker.*5000" > /dev/null; then
        echo -e "${YELLOW}Port-forward process found but registry not responding.${NC}"
        echo -e "${YELLOW}Please check your port-forward or start a new one:${NC}"
        echo -e "  kubectl port-forward -n registry svc/nexus-docker 5000:5000"
        exit 1
    fi

    # Start port-forward in background
    kubectl port-forward -n registry svc/nexus-docker 5000:5000 &
    PF_PID=$!

    # Wait for it to be ready
    echo -e "${YELLOW}Waiting for port-forward to be ready...${NC}"
    for i in {1..10}; do
        if curl -sf "http://${REGISTRY}/v2/" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Port-forward ready${NC}"
            break
        fi
        sleep 1
    done

    if ! curl -sf "http://${REGISTRY}/v2/" > /dev/null 2>&1; then
        echo -e "${RED}Error: Port-forward failed to start${NC}"
        kill $PF_PID 2>/dev/null || true
        exit 1
    fi
else
    echo -e "${GREEN}✓ Registry is reachable${NC}"
fi
echo ""

# Step 3: Push
if [[ "$SKIP_PUSH" != "true" ]]; then
    echo -e "${BLUE}[3/4] Pushing to registry...${NC}"
    "$SCRIPT_DIR/docker-push.sh" "$TAG"
    echo ""
else
    echo -e "${YELLOW}[3/4] Skipping push (SKIP_PUSH=true)${NC}"
    echo ""
fi

# Step 4: Trigger ArgoCD sync (optional)
echo -e "${BLUE}[4/4] Checking ArgoCD application...${NC}"
if kubectl get application catalyst-ui -n argocd > /dev/null 2>&1; then
    echo -e "${YELLOW}Triggering ArgoCD refresh...${NC}"

    # Annotate to trigger refresh
    kubectl -n argocd patch application catalyst-ui \
        --type merge \
        -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "hard"}}}'

    # Wait a moment for sync to start
    sleep 2

    # Check status
    SYNC_STATUS=$(kubectl get application catalyst-ui -n argocd -o jsonpath='{.status.sync.status}')
    HEALTH_STATUS=$(kubectl get application catalyst-ui -n argocd -o jsonpath='{.status.health.status}')

    echo -e "${GREEN}✓ ArgoCD application refreshed${NC}"
    echo -e "  Sync Status:   ${SYNC_STATUS}"
    echo -e "  Health Status: ${HEALTH_STATUS}"
else
    echo -e "${YELLOW}ArgoCD application 'catalyst-ui' not found${NC}"
    echo -e "Apply it with: kubectl apply -f infrastructure/base/argocd/applications/catalyst-ui.yaml"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Deployment complete!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Image: ${REGISTRY}/${IMAGE_NAME}:${TAG}"
echo -e "  URL:   http://catalyst.talos00"
echo ""
echo -e "${BLUE}Monitor deployment:${NC}"
echo -e "  kubectl get pods -n catalyst -w"
echo -e "  kubectl logs -n catalyst -l app=catalyst-ui -f"
