#!/usr/bin/env bash
set -euo pipefail

# ════════════════════════════════════════════════════════════════════════════
#  ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗███████╗
#  ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
#  ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   █████╗
#  ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██╔══╝
#   ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ███████╗
#    ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
#
#         🔍 GitHub Pages Output Validator 🔍
# ════════════════════════════════════════════════════════════════════════════
#
# Validates the structure and contents of the GitHub Pages build output
# to ensure all required files and directories are present and valid.
#
# Usage:
#   ./scripts/validate-gh-pages.sh
#
# Exit Codes:
#   0 - All validations passed
#   1 - One or more validations failed
#
# ════════════════════════════════════════════════════════════════════════════

SCRIPT_VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
GH_PAGES_DIR="${PROJECT_ROOT}/gh-pages"

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🎨 SYNTHWAVE COLOR PALETTE                                             │
# └────────────────────────────────────────────────────────────────────────┘
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Neon colors
CYAN='\033[38;5;51m'
MAGENTA='\033[38;5;201m'
PINK='\033[38;5;213m'
PURPLE='\033[38;5;141m'
GREEN='\033[38;5;118m'
YELLOW='\033[38;5;228m'
RED='\033[38;5;196m'
ORANGE='\033[38;5;208m'

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

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🧪 VALIDATION FUNCTIONS                                                 │
# └────────────────────────────────────────────────────────────────────────┘

VALIDATION_ERRORS=0

validate_directory_exists() {
    log_step "Validating gh-pages directory"

    if [[ ! -d "${GH_PAGES_DIR}" ]]; then
        log_error "gh-pages directory not found at ${GH_PAGES_DIR}"
        log_info "Run 'task gh:build-ci' or 'task gh:deploy:build' first"
        ((VALIDATION_ERRORS++))
        return 1
    fi

    log_success "gh-pages directory exists"
    log_metric "Path: ${GH_PAGES_DIR}"
}

validate_required_files() {
    log_step "Validating required files"

    local required_files=(
        "index.html"
        "demo.html"
        ".nojekyll"
        "storybook/index.html"
    )

    local missing_files=()

    for file in "${required_files[@]}"; do
        local full_path="${GH_PAGES_DIR}/${file}"
        if [[ -f "${full_path}" ]]; then
            local size=$(du -h "${full_path}" 2>/dev/null | cut -f1)
            log_substep "✓ ${file} (${size})"
        else
            log_error "✗ Missing required file: ${file}"
            missing_files+=("${file}")
            ((VALIDATION_ERRORS++))
        fi
    done

    if [[ ${#missing_files[@]} -eq 0 ]]; then
        log_success "All required files present"
    else
        log_error "Missing ${#missing_files[@]} required file(s)"
        return 1
    fi
}

validate_html_files() {
    log_step "Validating HTML files"

    local html_files=("${GH_PAGES_DIR}/index.html" "${GH_PAGES_DIR}/demo.html")

    for file in "${html_files[@]}"; do
        if [[ ! -f "${file}" ]]; then
            continue
        fi

        local filename=$(basename "${file}")

        # Check if file is not empty
        if [[ ! -s "${file}" ]]; then
            log_error "✗ ${filename} is empty"
            ((VALIDATION_ERRORS++))
            continue
        fi

        # Check for DOCTYPE
        if ! grep -q "<!DOCTYPE html>" "${file}"; then
            log_warning "⚠ ${filename} missing DOCTYPE declaration"
        fi

        # Check for basic HTML structure
        if ! grep -q "<html" "${file}"; then
            log_error "✗ ${filename} missing <html> tag"
            ((VALIDATION_ERRORS++))
        elif ! grep -q "<head>" "${file}"; then
            log_error "✗ ${filename} missing <head> tag"
            ((VALIDATION_ERRORS++))
        elif ! grep -q "<body>" "${file}"; then
            log_error "✗ ${filename} missing <body> tag"
            ((VALIDATION_ERRORS++))
        else
            log_substep "✓ ${filename} has valid structure"
        fi
    done
}

validate_storybook() {
    log_step "Validating Storybook output"

    if [[ ! -d "${GH_PAGES_DIR}/storybook" ]]; then
        log_error "✗ Storybook directory not found"
        ((VALIDATION_ERRORS++))
        return 1
    fi

    log_substep "✓ Storybook directory exists"

    if [[ ! -f "${GH_PAGES_DIR}/storybook/index.html" ]]; then
        log_error "✗ Storybook index.html not found"
        ((VALIDATION_ERRORS++))
        return 1
    fi

    log_substep "✓ Storybook index.html exists"

    # Check for Storybook assets
    local storybook_js_count=$(find "${GH_PAGES_DIR}/storybook" -name "*.js" | wc -l | tr -d ' ')
    local storybook_css_count=$(find "${GH_PAGES_DIR}/storybook" -name "*.css" | wc -l | tr -d ' ')

    if [[ ${storybook_js_count} -eq 0 ]]; then
        log_warning "⚠ No JavaScript files found in Storybook build"
    else
        log_metric "JS files: ${storybook_js_count}"
    fi

    if [[ ${storybook_css_count} -eq 0 ]]; then
        log_warning "⚠ No CSS files found in Storybook build"
    else
        log_metric "CSS files: ${storybook_css_count}"
    fi

    log_success "Storybook validation complete"
}

validate_assets() {
    log_step "Validating assets"

    # Check for assets directory (created by Vite)
    if [[ -d "${GH_PAGES_DIR}/assets" ]]; then
        local js_count=$(find "${GH_PAGES_DIR}/assets" -name "*.js" | wc -l | tr -d ' ')
        local css_count=$(find "${GH_PAGES_DIR}/assets" -name "*.css" | wc -l | tr -d ' ')

        log_substep "✓ Assets directory exists"
        log_metric "JS files: ${js_count}"
        log_metric "CSS files: ${css_count}"

        if [[ ${js_count} -eq 0 ]]; then
            log_warning "⚠ No JavaScript files in assets directory"
        fi

        if [[ ${css_count} -eq 0 ]]; then
            log_warning "⚠ No CSS files in assets directory"
        fi
    else
        log_warning "⚠ Assets directory not found (may be inlined)"
    fi
}

validate_landing_page() {
    log_step "Validating landing page content"

    local index_file="${GH_PAGES_DIR}/index.html"

    if [[ ! -f "${index_file}" ]]; then
        log_error "✗ index.html not found"
        ((VALIDATION_ERRORS++))
        return 1
    fi

    # Check for expected content
    local expected_strings=(
        "CATALYST UI"
        "Demo App"
        "Storybook"
    )

    for str in "${expected_strings[@]}"; do
        if grep -q "${str}" "${index_file}"; then
            log_substep "✓ Found: ${str}"
        else
            log_warning "⚠ Missing expected content: ${str}"
        fi
    done

    # Check for links to demo and storybook
    if grep -q 'href=".*demo.html"' "${index_file}"; then
        log_substep "✓ Link to demo.html found"
    else
        log_error "✗ Link to demo.html not found"
        ((VALIDATION_ERRORS++))
    fi

    if grep -q 'href=".*storybook/"' "${index_file}"; then
        log_substep "✓ Link to storybook/ found"
    else
        log_error "✗ Link to storybook/ not found"
        ((VALIDATION_ERRORS++))
    fi
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 📊 SUMMARY REPORT                                                       │
# └────────────────────────────────────────────────────────────────────────┘

generate_summary() {
    log_header "VALIDATION SUMMARY"

    # Calculate total size
    if [[ -d "${GH_PAGES_DIR}" ]]; then
        local total_size=$(du -sh "${GH_PAGES_DIR}" 2>/dev/null | cut -f1)
        local total_files=$(find "${GH_PAGES_DIR}" -type f | wc -l | tr -d ' ')
        local js_files=$(find "${GH_PAGES_DIR}" -name "*.js" | wc -l | tr -d ' ')
        local css_files=$(find "${GH_PAGES_DIR}" -name "*.css" | wc -l | tr -d ' ')
        local html_files=$(find "${GH_PAGES_DIR}" -name "*.html" | wc -l | tr -d ' ')

        log_substep "Build Statistics:"
        log_metric "Total size: ${total_size}"
        log_metric "Total files: ${total_files}"
        log_metric "HTML files: ${html_files}"
        log_metric "JS files: ${js_files}"
        log_metric "CSS files: ${css_files}"
        echo ""
    fi

    if [[ ${VALIDATION_ERRORS} -eq 0 ]]; then
        echo -e "${BOLD}${GREEN}╔═══════════════════════════════════════════════════════════════════╗${RESET}"
        echo -e "${BOLD}${GREEN}║${RESET}  ${CYAN}✨ ALL VALIDATIONS PASSED ✨${RESET}                                  ${BOLD}${GREEN}║${RESET}"
        echo -e "${BOLD}${GREEN}╚═══════════════════════════════════════════════════════════════════╝${RESET}\n"
        return 0
    else
        echo -e "${BOLD}${RED}╔═══════════════════════════════════════════════════════════════════╗${RESET}"
        echo -e "${BOLD}${RED}║${RESET}  ${YELLOW}⚠ VALIDATION FAILED WITH ${VALIDATION_ERRORS} ERROR(S) ⚠${RESET}                      ${BOLD}${RED}║${RESET}"
        echo -e "${BOLD}${RED}╚═══════════════════════════════════════════════════════════════════╝${RESET}\n"
        return 1
    fi
}

# ┌────────────────────────────────────────────────────────────────────────┐
# │ 🚀 MAIN EXECUTION                                                       │
# └────────────────────────────────────────────────────────────────────────┘

main() {
    # Print header
    echo -e "${BOLD}${CYAN}"
    cat << "HEADER"
 ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗███████╗
 ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
 ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   █████╗
 ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██╔══╝
  ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ███████╗
   ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
HEADER
    echo -e "${RESET}"
    echo -e "${MAGENTA}${BOLD}      🔍 GitHub Pages Validator v${SCRIPT_VERSION} 🔍${RESET}\n"

    # Run validations
    validate_directory_exists || exit 1
    validate_required_files
    validate_html_files
    validate_landing_page
    validate_storybook
    validate_assets

    # Generate summary
    generate_summary

    # Exit with appropriate code
    if [[ ${VALIDATION_ERRORS} -eq 0 ]]; then
        exit 0
    else
        exit 1
    fi
}

# Error handling
trap 'log_error "Validation failed at line $LINENO"' ERR

# Execute
main "$@"
