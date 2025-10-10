# Feature Proposals

This directory contains proposals for features that have been designed but not yet implemented.

## Purpose

Proposals are detailed specifications for features that:

- Have been fully thought through and documented
- Are ready for implementation when prioritized
- May be implemented in future versions
- Serve as reference for design discussions

## Contents

### Component Proposals

- **`annotation-mode-hoc.md`** - Developer annotation system for components
  - Interactive component identification and documentation
  - Ctrl+Click to identify components
  - Zustand-based state management

- **`clippy-robot-assistant.md`** - 3D robot assistant with React Three Fiber
  - Interactive 3D assistant character
  - Animation states and interactions
  - Fun UI enhancement

### System Proposals

- **`design-tokens-autogen.md`** - Auto-generation of design tokens from CSS
  - Extract CSS custom properties automatically
  - Generate documentation for design tokens
  - Enable programmatic token access

- **`quick-events-ics.md`** - ICS-based task and calendar component
  - Parse ICS calendar files
  - Display events and tasks
  - Interactive calendar UI

- **`versioning-migration.md`** - Migration from standard-version to changesets
  - Monorepo-friendly versioning
  - Independent component releases
  - Better changelog management

## Status: Proposed

All documents in this directory are:

- ❌ **NOT STARTED** - No implementation begun
- 📝 **DESIGN COMPLETE** - Fully specified and ready to implement
- ⏳ **AWAITING PRIORITIZATION** - Will be scheduled based on roadmap

## Moving to Active Development

When implementation begins:

1. Move document from `docs/proposals/` → `docs/features/`
2. Add implementation checklist
3. Update status to "🚧 In Progress"
4. Track progress with regular updates

## Proposal Template

Use `docs/features/_template.md` when creating new proposals.
