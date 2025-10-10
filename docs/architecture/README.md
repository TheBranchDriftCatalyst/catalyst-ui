# Architecture Documentation

This directory contains architectural documentation for catalyst-ui components and systems.

## Purpose

Architecture documents explain the design, structure, and technical decisions behind major components and systems. Unlike feature tracking documents, these are living documentation meant to help developers understand how the system works.

## Contents

- **`PERFORMANCE_MONITORING.md`** - Performance monitoring and debugging tools
  - Documents react-scan integration, web-vitals, DevModeProvider
  - How to monitor and optimize component performance
  - Developer tooling for performance analysis

- **`export-patterns.md`** - Export pattern standards (referenced from mass-cleanup-refactor.md)
  - Named exports vs default exports
  - Barrel export patterns
  - Module organization best practices

- **`animation-hoc.md`** - Animation HOC architecture (referenced from various sources)
  - Animation effect HOC design patterns
  - useControllableState and useAnimationTriggers hooks
  - Controlled/uncontrolled component patterns

## When to Add Architecture Docs

Create architecture documents for:

- ✅ Complex systems that need explanation (ForceGraph, animation system)
- ✅ Cross-cutting concerns (theming, logging, performance)
- ✅ Design patterns and best practices (export patterns, HOC patterns)
- ✅ Developer tooling and debugging (DevMode, loggers, profiling)

## Related Directories

- `docs/features/` - Active feature tracking and proposals
- `docs/proposals/` - Proposed features not yet started
- `docs/development/` - Development guides and workflows
