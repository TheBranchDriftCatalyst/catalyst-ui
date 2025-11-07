#!/usr/bin/env bash
set -euo pipefail

# ════════════════════════════════════════════════════════════════════════════
#  ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗
# ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝
# ██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║
# ██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║
# ╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║
#  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝
#
#           🌆 CI/CD Build Script - GitHub Pages Deployment 🌆
# ════════════════════════════════════════════════════════════════════════════

SCRIPT_VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
START_TIME=$(date +%s)

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🎨 SYNTHWAVE COLOR PALETTE                                             │
# └────────────────────────────────────────────────────────────────────────┘
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Neon colors
CYAN='\033[38;5;51m'      # Bright cyan
MAGENTA='\033[38;5;201m'  # Bright magenta
PINK='\033[38;5;213m'     # Hot pink
PURPLE='\033[38;5;141m'   # Purple
BLUE='\033[38;5;39m'      # Electric blue
GREEN='\033[38;5;118m'    # Neon green
YELLOW='\033[38;5;228m'   # Yellow
RED='\033[38;5;196m'      # Error red
ORANGE='\033[38;5;208m'   # Warning orange

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 📊 LOGGING FUNCTIONS                                                    │
# └────────────────────────────────────────────────────────────────────────┘

timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}

log_header() {
    echo -e "\n${BOLD}${MAGENTA}╔═══════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${MAGENTA}║${RESET} ${CYAN}$1${RESET}"
    echo -e "${BOLD}${MAGENTA}╚═══════════════════════════════════════════════════════════════════╝${RESET}"
}

log_info() {
    echo -e "${CYAN}ℹ  [$(timestamp)]${RESET} $1"
}

log_success() {
    echo -e "${GREEN}✓  [$(timestamp)]${RESET} $1"
}

log_warning() {
    echo -e "${ORANGE}⚠  [$(timestamp)]${RESET} $1"
}

log_error() {
    echo -e "${RED}✗  [$(timestamp)]${RESET} $1" >&2
}

log_step() {
    echo -e "\n${BOLD}${PINK}▸ $1${RESET}"
}

log_substep() {
    echo -e "${DIM}${PURPLE}  → $1${RESET}"
}

log_metric() {
    echo -e "${YELLOW}  📊 $1${RESET}"
}

progress_bar() {
    local current=$1
    local total=$2
    local width=40
    local percentage=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))

    printf "\r${CYAN}["
    printf "%${filled}s" | tr ' ' '█'
    printf "%${empty}s" | tr ' ' '░'
    printf "]${RESET} ${BOLD}${percentage}%%${RESET}"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🔍 ENVIRONMENT DIAGNOSTICS                                              │
# └────────────────────────────────────────────────────────────────────────┘

log_environment() {
    log_header "ENVIRONMENT DIAGNOSTICS"

    log_info "Script version: ${SCRIPT_VERSION}"
    log_info "Project root: ${PROJECT_ROOT}"
    log_info "Working directory: $(pwd)"
    log_info "User: $(whoami)"
    log_info "Hostname: $(hostname)"

    log_substep "Git Information:"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        log_metric "Branch: $(git branch --show-current 2>/dev/null || echo 'detached HEAD')"
        log_metric "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
        log_metric "Status: $(git status --short | wc -l | tr -d ' ') modified files"
    else
        log_warning "Not a git repository"
    fi

    log_substep "Runtime Environment:"
    log_metric "Node: $(node --version 2>/dev/null || echo 'not found')"
    log_metric "Yarn: $(yarn --version 2>/dev/null || echo 'not found')"
    log_metric "Shell: ${SHELL}"
    log_metric "OS: $(uname -s) $(uname -r)"

    log_substep "Environment Variables:"
    log_metric "BASE_PATH: ${BASE_PATH:-/catalyst-ui/}"
    log_metric "VITE_BASE_URL: ${VITE_BASE_URL:-https://thebranchdriftcatalyst.github.io/catalyst-ui}"
    log_metric "NODE_ENV: ${NODE_ENV:-production}"
    log_metric "CI: ${CI:-false}"
    log_metric "VITE_CATALYST_DEV_UTILS_ENABLED: ${VITE_CATALYST_DEV_UTILS_ENABLED:-false}"

    log_substep "Disk Space:"
    df -h "${PROJECT_ROOT}" | tail -1 | awk '{print "  📊 Available: " $4 " / " $2 " (" $5 " used)"}'

    log_substep "Memory:"
    if command -v free &> /dev/null; then
        free -h | grep "Mem:" | awk '{print "  📊 Available: " $7 " / " $2}'
    elif [[ "$(uname)" == "Darwin" ]]; then
        log_metric "macOS - use Activity Monitor for details"
    fi
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🧹 CLEANUP                                                              │
# └────────────────────────────────────────────────────────────────────────┘

cleanup() {
    log_step "Cleaning previous builds"

    local dirs_to_clean=("dist" "gh-pages")

    for dir in "${dirs_to_clean[@]}"; do
        if [[ -d "${PROJECT_ROOT}/${dir}" ]]; then
            local size=$(du -sh "${PROJECT_ROOT}/${dir}" 2>/dev/null | cut -f1)
            log_substep "Removing ${dir}/ (${size})"
            rm -rf "${PROJECT_ROOT}/${dir}"
            log_success "Removed ${dir}/"
        else
            log_substep "Skipping ${dir}/ (doesn't exist)"
        fi
    done

    log_success "Cleanup complete"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🏗️  BUILD FUNCTIONS                                                     │
# └────────────────────────────────────────────────────────────────────────┘

build_app() {
    log_step "Building application"
    local build_start=$(date +%s)

    log_substep "Running: yarn build:app"
    log_metric "Base path: ${BASE_PATH:-/catalyst-ui/}"
    log_metric "Base URL: ${VITE_BASE_URL:-https://thebranchdriftcatalyst.github.io/catalyst-ui}"
    log_metric "Dev utils: enabled (demo mode)"

    cd "${PROJECT_ROOT}"
    VITE_BASE_PATH="${BASE_PATH:-/catalyst-ui/}" \
    VITE_BASE_URL="${VITE_BASE_URL:-https://thebranchdriftcatalyst.github.io/catalyst-ui}" \
    yarn build:app

    local build_end=$(date +%s)
    local duration=$((build_end - build_start))

    if [[ -d "${PROJECT_ROOT}/dist/app" ]]; then
        local size=$(du -sh "${PROJECT_ROOT}/dist/app" 2>/dev/null | cut -f1)
        local file_count=$(find "${PROJECT_ROOT}/dist/app" -type f | wc -l | tr -d ' ')
        log_success "App build complete (${duration}s, ${size}, ${file_count} files)"
    else
        log_error "App build failed - output directory not found"
        exit 1
    fi
}

build_storybook() {
    log_step "Building Storybook"
    local build_start=$(date +%s)

    local base_path="${BASE_PATH:-/catalyst-ui/}"
    local storybook_path="${base_path}storybook/"

    log_substep "Running: yarn build:storybook"
    log_metric "Base path: ${storybook_path}"

    cd "${PROJECT_ROOT}"
    STORYBOOK_BASE_PATH="${storybook_path}" yarn build:storybook

    local build_end=$(date +%s)
    local duration=$((build_end - build_start))

    if [[ -d "${PROJECT_ROOT}/dist/storybook" ]]; then
        local size=$(du -sh "${PROJECT_ROOT}/dist/storybook" 2>/dev/null | cut -f1)
        local file_count=$(find "${PROJECT_ROOT}/dist/storybook" -type f | wc -l | tr -d ' ')
        log_success "Storybook build complete (${duration}s, ${size}, ${file_count} files)"
    else
        log_error "Storybook build failed - output directory not found"
        exit 1
    fi
}

build_api_docs() {
    log_step "Building API Documentation (optional)"
    local build_start=$(date +%s)

    log_substep "Running: yarn docs:api"

    cd "${PROJECT_ROOT}"

    # Try to build API docs, but don't fail the entire build if it errors
    if yarn docs:api 2>&1; then
        local build_end=$(date +%s)
        local duration=$((build_end - build_start))

        if [[ -d "${PROJECT_ROOT}/docs/api" ]]; then
            local size=$(du -sh "${PROJECT_ROOT}/docs/api" 2>/dev/null | cut -f1)
            local file_count=$(find "${PROJECT_ROOT}/docs/api" -type f | wc -l | tr -d ' ')
            log_success "API docs build complete (${duration}s, ${size}, ${file_count} files)"
            return 0
        else
            log_warning "API docs build succeeded but output directory not found"
            return 1
        fi
    else
        local build_end=$(date +%s)
        local duration=$((build_end - build_start))
        log_warning "API docs build failed (${duration}s) - TypeScript errors detected"
        log_warning "Continuing build without API documentation"
        log_warning "To fix: address TypeScript errors in component files"
        return 1
    fi
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🎨 LANDING PAGE GENERATION                                              │
# └────────────────────────────────────────────────────────────────────────┘

create_landing_page() {
    local output="${PROJECT_ROOT}/gh-pages/index.html"
    local base_path="${BASE_PATH:-/catalyst-ui/}"

    log_substep "Creating synthwave landing page"
    log_metric "Using base path: ${base_path}"

    cat > "${output}" << LANDING_EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catalyst UI - Synthwave Component Library</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(180deg, #0a0a1f 0%, #1a0a2e 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated grid background */
        .grid {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(rgba(230, 57, 235, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(57, 235, 230, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: gridScroll 20s linear infinite;
            pointer-events: none;
        }

        @keyframes gridScroll {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }

        .container {
            text-align: center;
            z-index: 10;
            padding: 2rem;
        }

        h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #e639eb, #39ebe6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 80px rgba(230, 57, 235, 0.5);
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from { filter: drop-shadow(0 0 20px rgba(230, 57, 235, 0.5)); }
            to { filter: drop-shadow(0 0 40px rgba(57, 235, 230, 0.8)); }
        }

        .tagline {
            font-size: 1.2rem;
            color: #39ebe6;
            margin-bottom: 3rem;
            opacity: 0.9;
        }

        .buttons {
            display: flex;
            gap: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .button {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            text-decoration: none;
            border: 2px solid;
            border-radius: 8px;
            font-weight: bold;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .button:hover::before {
            left: 100%;
        }

        .demo {
            color: #e639eb;
            border-color: #e639eb;
            background: rgba(230, 57, 235, 0.1);
            box-shadow: 0 0 20px rgba(230, 57, 235, 0.3);
        }

        .demo:hover {
            background: rgba(230, 57, 235, 0.2);
            box-shadow: 0 0 40px rgba(230, 57, 235, 0.6);
            transform: translateY(-2px);
        }

        .storybook {
            color: #39ebe6;
            border-color: #39ebe6;
            background: rgba(57, 235, 230, 0.1);
            box-shadow: 0 0 20px rgba(57, 235, 230, 0.3);
        }

        .storybook:hover {
            background: rgba(57, 235, 230, 0.2);
            box-shadow: 0 0 40px rgba(57, 235, 230, 0.6);
            transform: translateY(-2px);
        }

        .api {
            color: #ffd700;
            border-color: #ffd700;
            background: rgba(255, 215, 0, 0.1);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .api:hover {
            background: rgba(255, 215, 0, 0.2);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
            transform: translateY(-2px);
        }

        /* CRT scanlines */
        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(10px); }
        }

        @media (max-width: 768px) {
            h1 { font-size: 2.5rem; }
            .tagline { font-size: 1rem; }
            .buttons { flex-direction: column; gap: 1rem; }
        }
    </style>
</head>
<body>
    <div class="grid"></div>
    <div class="scanlines"></div>
    <div class="container">
        <h1>CATALYST UI</h1>
        <p class="tagline">⚡ Synthwave-Powered React Components ⚡</p>
        <div class="buttons">
            <a href="${base_path}demo.html" class="button demo">🎮 Demo App</a>
            <a href="${base_path}storybook/" class="button storybook">📚 Storybook</a>
            <a href="${base_path}api/" class="button api">📖 API Docs</a>
        </div>
    </div>
</body>
</html>
LANDING_EOF

    log_success "Landing page created"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 📦 MERGE OUTPUTS                                                        │
# └────────────────────────────────────────────────────────────────────────┘

merge_outputs() {
    log_step "Merging build outputs"

    local gh_pages="${PROJECT_ROOT}/gh-pages"

    # Create gh-pages directory
    log_substep "Creating gh-pages directory"
    mkdir -p "${gh_pages}"

    # Copy app build
    log_substep "Copying app build to gh-pages/"
    cp -r "${PROJECT_ROOT}/dist/app/"* "${gh_pages}/"
    log_success "App files copied"

    # Copy public assets (models, fonts, etc.)
    log_substep "Copying public assets to gh-pages/"
    if [[ -d "${PROJECT_ROOT}/public" ]]; then
        cp -r "${PROJECT_ROOT}/public/"* "${gh_pages}/"
        log_success "Public assets copied"
    else
        log_warning "Public directory not found"
    fi

    # Rename index.html to demo.html
    log_substep "Renaming index.html → demo.html"
    if [[ -f "${gh_pages}/index.html" ]]; then
        mv "${gh_pages}/index.html" "${gh_pages}/demo.html"
        log_success "Renamed to demo.html"
    else
        log_error "index.html not found"
        exit 1
    fi

    # Copy Storybook
    log_substep "Copying Storybook to gh-pages/storybook/"
    cp -r "${PROJECT_ROOT}/dist/storybook" "${gh_pages}/storybook"
    log_success "Storybook files copied"

    # Copy API docs (if available)
    if [[ -d "${PROJECT_ROOT}/docs/api" ]]; then
        log_substep "Copying API docs to gh-pages/api/"
        cp -r "${PROJECT_ROOT}/docs/api" "${gh_pages}/api"
        log_success "API docs copied"
    else
        log_warning "Skipping API docs (not built)"
    fi

    # Create landing page
    create_landing_page

    # Add .nojekyll
    log_substep "Adding .nojekyll file"
    touch "${gh_pages}/.nojekyll"
    log_success ".nojekyll created"

    log_success "Merge complete"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ ✅ VALIDATION                                                           │
# └────────────────────────────────────────────────────────────────────────┘

validate_output() {
    log_step "Validating output"

    local gh_pages="${PROJECT_ROOT}/gh-pages"
    local errors=0

    # Required files
    local required_files=(
        "index.html"
        "demo.html"
        ".nojekyll"
        "storybook/index.html"
    )

    # Required directories
    local required_dirs=(
        "models"
        "assets"
    )

    # Optional directories (warn if missing, but don't fail)
    local optional_dirs=(
        "api"
    )

    # Check required files
    for file in "${required_files[@]}"; do
        if [[ -f "${gh_pages}/${file}" ]]; then
            local size=$(du -h "${gh_pages}/${file}" | cut -f1)
            log_substep "✓ ${file} (${size})"
        else
            log_error "✗ Missing: ${file}"
            ((errors++))
        fi
    done

    # Check required directories
    for dir in "${required_dirs[@]}"; do
        if [[ -d "${gh_pages}/${dir}" ]]; then
            local size=$(du -sh "${gh_pages}/${dir}" 2>/dev/null | cut -f1)
            local file_count=$(find "${gh_pages}/${dir}" -type f | wc -l | tr -d ' ')
            log_substep "✓ ${dir}/ (${size}, ${file_count} files)"
        else
            log_error "✗ Missing directory: ${dir}/"
            ((errors++))
        fi
    done

    # Check optional directories
    for dir in "${optional_dirs[@]}"; do
        if [[ -d "${gh_pages}/${dir}" ]]; then
            local size=$(du -sh "${gh_pages}/${dir}" 2>/dev/null | cut -f1)
            local file_count=$(find "${gh_pages}/${dir}" -type f | wc -l | tr -d ' ')
            log_substep "✓ ${dir}/ (${size}, ${file_count} files) [optional]"
        else
            log_warning "⚠ Missing directory: ${dir}/ (optional - TypeDoc build may have failed)"
        fi
    done

    if [[ ${errors} -gt 0 ]]; then
        log_error "Validation failed with ${errors} errors"
        exit 1
    fi

    log_success "All required files and directories present"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 📊 BUILD REPORT                                                         │
# └────────────────────────────────────────────────────────────────────────┘

generate_report() {
    log_header "BUILD REPORT"

    local gh_pages="${PROJECT_ROOT}/gh-pages"
    local end_time=$(date +%s)
    local total_duration=$((end_time - START_TIME))

    log_substep "Output Structure:"
    if command -v tree &> /dev/null; then
        tree -L 2 -h "${gh_pages}" | head -20
    else
        find "${gh_pages}" -maxdepth 2 -type f -o -type d | head -20
    fi

    echo ""
    log_substep "Size Analysis:"
    log_metric "Total size: $(du -sh ${gh_pages} | cut -f1)"
    log_metric "App size: $(du -sh ${gh_pages}/demo.html ${gh_pages}/assets 2>/dev/null | awk '{s+=$1}END{print s}' || echo 'N/A')"
    log_metric "Storybook size: $(du -sh ${gh_pages}/storybook | cut -f1)"
    if [[ -d "${gh_pages}/api" ]]; then
        log_metric "API docs size: $(du -sh ${gh_pages}/api | cut -f1)"
    else
        log_metric "API docs size: N/A (not built)"
    fi

    log_substep "File Counts:"
    log_metric "Total files: $(find ${gh_pages} -type f | wc -l | tr -d ' ')"
    log_metric "JS files: $(find ${gh_pages} -name '*.js' | wc -l | tr -d ' ')"
    log_metric "CSS files: $(find ${gh_pages} -name '*.css' | wc -l | tr -d ' ')"
    log_metric "HTML files: $(find ${gh_pages} -name '*.html' | wc -l | tr -d ' ')"

    log_substep "Performance:"
    log_metric "Total build time: ${total_duration}s"

    # JSON summary for parsing
    echo ""
    log_info "JSON Build Summary:"
    cat << JSON_SUMMARY
{
  "version": "${SCRIPT_VERSION}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "duration_seconds": ${total_duration},
  "output_size_bytes": $(du -sb ${gh_pages} | cut -f1),
  "file_count": $(find ${gh_pages} -type f | wc -l),
  "base_path": "${BASE_PATH:-/catalyst-ui/}",
  "status": "success"
}
JSON_SUMMARY

    log_success "Build completed successfully! 🚀"
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🚀 MAIN EXECUTION                                                       │
# └────────────────────────────────────────────────────────────────────────┘

main() {
    # Print header
    echo -e "${BOLD}${CYAN}"
    cat << "HEADER"
  ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗
 ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝
 ██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║
 ██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║
 ╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║
  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝
HEADER
    echo -e "${RESET}"
    echo -e "${MAGENTA}${BOLD}         🌆 CI Build Script v${SCRIPT_VERSION} 🌆${RESET}\n"

    # Set BASE_PATH default if not provided
    export BASE_PATH="${BASE_PATH:-/catalyst-ui/}"

    # Enable dev utilities in production demo (UI only, no backend sync)
    export VITE_CATALYST_DEV_UTILS_ENABLED=true

    # Run build pipeline
    log_environment
    cleanup
    build_app
    build_storybook
    build_api_docs || log_warning "Continuing without API docs"
    merge_outputs
    validate_output
    generate_report

    # Final success message
    echo -e "\n${BOLD}${GREEN}╔═══════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${GREEN}║${RESET}  ${CYAN}✨ BUILD PIPELINE COMPLETE ✨${RESET}                                ${BOLD}${GREEN}║${RESET}"
    echo -e "${BOLD}${GREEN}╚═══════════════════════════════════════════════════════════════════╝${RESET}\n"
}

# Error handling
trap 'log_error "Build failed at line $LINENO. Exit code: $?"' ERR

# Execute
main "$@"
