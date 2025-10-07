#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Validating GitHub Pages Build ===${NC}\n"

# Check if gh-pages directory exists
if [ ! -d "gh-pages" ]; then
  echo -e "${RED}❌ Error: gh-pages directory not found${NC}"
  echo "Run 'task test:gh-actions' first to build"
  exit 1
fi

echo -e "${GREEN}✓${NC} gh-pages directory exists"

# Track validation status
errors=0

# Check for index.html (app entry point)
if [ -f "gh-pages/index.html" ]; then
  echo -e "${GREEN}✓${NC} index.html exists"
else
  echo -e "${RED}❌ index.html missing${NC}"
  errors=$((errors + 1))
fi

# Check for common asset files
echo ""
echo "Checking for assets..."
asset_count=$(find gh-pages -type f \( -name "*.js" -o -name "*.css" \) | wc -l | xargs)
if [ "$asset_count" -gt 0 ]; then
  echo -e "${GREEN}✓${NC} Found $asset_count JS/CSS asset files"
else
  echo -e "${YELLOW}⚠${NC}  No JS/CSS assets found (may be bundled)"
fi

# Directory size
echo ""
size=$(du -sh gh-pages | cut -f1)
echo -e "${BLUE}📦 Total size:${NC} $size"

# Summary
echo ""
echo "========================================="
if [ $errors -eq 0 ]; then
  echo -e "${GREEN}✅ All validations passed!${NC}"
  echo ""
  echo "To preview locally:"
  echo -e "  ${BLUE}cd gh-pages && python3 -m http.server 8080${NC}"
  echo "  Then open http://localhost:8080"
  exit 0
else
  echo -e "${RED}❌ $errors validation(s) failed${NC}"
  exit 1
fi
