# Changelog

All notable changes to **agentic-builder** are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0]

### Added
- **Redesigned dashboard** — OLED dark + glassmorphism UI (Inter + JetBrains Mono): pill status header,
  KPI bento strip (Working / Done / Blocked / Progress / Elapsed / Throughput), tabbed workbench
  (Swarm · Flow-chart · Tests), inline-SVG role icons, ambient depth.
- **Throughput KPI** with a live sparkline — real task-completion rate per minute (rolling 30s window).
- **Per-gate test progress** in a Tests tab — unit/TDD results (vitest · jest · node:test) accumulated
  per milestone gate, plus an optional live Playwright E2E stream when a progress-server is running.
- **Milestone undo / redo** — click a milestone in the Plan flow-chart to revert it (and everything
  downstream) via git, or re-implement it with change notes. Git-backed, confirm-first, between-waves only.
- **Interactive approvals on the dashboard** — questions and plan-approval gates are answered in the
  board (with a CLI fallback); "Open Plan" / "Open Page" side actions.
- **Adaptive sidebar** — shows per-milestone progress when planned, falls back to an activity feed.

### Changed
- **Plan flow-chart is locked for the run** — published once at planning, then only node colours update
  (no relayout, no churn after a gate). The locked plan + summary persist across reloads (localStorage,
  keyed per run), so they can't be wiped.
- Every interview question routes through the dashboard-first ASK protocol (board first, CLI fallback).

### Robustness
- Graceful no-git fallback: detected at start (`caps.git`); commits/undo disabled, build + redo still work.
- Stall detection, phase-weighted progress (with indeterminate state), deep-linkable views.

## [0.1.0]

- Initial release: in-session SDLC orchestrator — global dependency-graph scheduler, milestone gates,
  design-system routing, TDD, two-stage code review, parallel agent swarm, and a live dashboard.
  Runs under Claude Code with no API key. Greenfield / Feature / Surgical modes. Plugin packaging with a
  UserPromptSubmit routing hook.
