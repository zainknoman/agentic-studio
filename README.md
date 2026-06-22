# Agentic Studio

<img width="1280" height="640" alt="og-card" src="https://github.com/user-attachments/assets/de6b8a5f-8320-468a-9ddd-fb5287fc30a1" />

**Multi-domain AI orchestrator for Claude Code.** Turns natural language into autonomous agent swarm
workflows across six domains — no API key, no separate program. Runs entirely inside your Claude Code
session on the subscription you're already logged into.

| Domain | What it does |
|---|---|
| 🔨 **Software (SDLC)** | Greenfield builds, feature additions, bug fixes — full autonomous dev pipeline |
| 📊 **Marketing** | Competitor research, campaign briefs, SEO/AEO strategy, content calendars |
| 🔍 **Research** | Deep market research, industry reports, investor briefs, source-validated findings |
| 🎯 **Strategy** | PRDs, roadmaps, OKRs, GTM plans — connects directly to SDLC build pipeline |
| ✍️ **Content** | Blog posts, newsletters, social variants, pitch decks — quality-gated output |
| 📅 **Daily** | Meeting prep, email drafts, weekly reviews, decision frameworks, SOPs |

Evolved from `agentic-builder` — all existing SDLC functionality is preserved.

---

## What it does (SDLC mode)

- **Global dependency-graph scheduler** — every task whose dependencies are met runs at once (up to a
  concurrency cap), across the whole project. No sprint barriers; "milestones" are gate/review/commit
  nodes that block only their own cluster, so the agent fleet stays saturated.
- **Eight auto-detected modes** — GREENFIELD (build from scratch), FEATURE (add to an existing
  codebase), SURGICAL (diagnose + fix a bug), MARKETING, RESEARCH, STRATEGY, CONTENT, DAILY.
- **Design-system routing** — for UI projects it interviews for product/industry/aesthetic, routes to
  the best installed design skill (prefers `ui-ux-pro-max`), writes a token contract, and validates a
  wireframe with you before any code.
- **TDD discipline** — interfaces locked → failing tests → implementation → bounded fix loops.
- **Two-stage code review** — spec compliance, then code quality, per milestone.
- **Live dashboard** — a zero-dependency local page showing every agent in real time, with:
  - dark / light theme toggle,
  - a **Plan tab** rendering the live dependency-graph flowchart (status-colored, arrows, gates),
  - **interactive approvals** — the plan and questions appear on the dashboard with buttons (CLI stays
    as the fallback),
  - an accurate phase-weighted progress bar and a verbose toggle.

## Install

Add this repo as a plugin marketplace, then install:

```
/plugin marketplace add zainknoman/agentic-studio
/plugin install agentic-studio@agentic-studio
```

(Or point `/plugin marketplace add` at the repo's Git URL.) Requires Node.js on PATH (used by the
dashboard) — no npm install, no credentials.

## Use

Just describe what you want — the bundled hook nudges Claude Code to pick this orchestrator for any
build / fix / feature request:

```
Build a small habit-tracker web app with a localStorage store, a stats bar, and a dark/light toggle.
```

Or invoke it explicitly any time:

```
/agentic-studio Build me a URL-shortener API with tests.
```

It will interview you (only as needed), show a plan for approval on the dashboard, then build —
opening the live dashboard automatically so you can watch the swarm.

## Quick-start examples

One prompt per mode — just describe what you want and the hook routes automatically:

```
# GREENFIELD — build from scratch
Build a habit-tracker web app with a localStorage store, a stats bar, and a dark/light toggle.

# FEATURE — add to an existing codebase
Add a CSV export button to the orders table in this Next.js app.

# SURGICAL — diagnose and fix a bug
Fix this failing test: TypeError: Cannot read properties of undefined (reading 'map') at orders.tsx:47

# MARKETING — competitor research and campaign strategy
Run a competitor analysis for monday.com vs Asana vs Linear, and give me a positioning brief for a
new PM tool targeting engineering-led startups.

# RESEARCH — deep validated research
Research the current state of the BNPL market in Southeast Asia — size, key players, regulatory
landscape, and investment signals. Depth: deep. Audience: pre-seed investor.

# STRATEGY — product strategy and roadmap
Write a PRD for a B2B analytics dashboard MVP. Include RICE-scored feature list, OKRs for Q3,
and a now/next/later roadmap.

# CONTENT — quality-gated long-form writing
Write a 1500-word thought-leadership blog post about the shift from synchronous to async-first
engineering cultures, with LinkedIn and Twitter thread variants.

# DAILY — fast productivity tasks
Prepare my talking points for a 30-minute design review meeting. Attendees: 3 engineers, 1 PM,
1 designer. Goal: get sign-off on the new onboarding flow wireframes.
```

Or invoke the skill explicitly:

```
/agentic-studio Research the competitive landscape for AI coding assistants.
```

---

## Architecture

```
User prompt
    │
    ▼
hooks/route.mjs  ── UserPromptSubmit hook ──────────────────────────────────────
    │  Regex-classifies prompt → injects nudge into Claude Code context
    │  Priority: SDLC > MARKETING > RESEARCH > STRATEGY > CONTENT > DAILY
    │
    ▼
SKILL.md (orchestrator — you, the session model)
    │
    ├── Stage 0: Resume check → mode detection (references/modes.md)
    │                                                │
    │   ┌──────────┬───────────┬───────────┬──────┤ domain modes skip to domain chains
    │   ▼          ▼           ▼           ▼      │
    │ GREENFIELD FEATURE   SURGICAL   MARKETING / RESEARCH / STRATEGY / CONTENT / DAILY
    │   │          │           │           │
    │   └──────────┴───────────┴───────────┘
    │                   │
    ├── Stage 1: Interview / bring-your-own-docs gate
    ├── Stage 2: PRD → global DAG → doc quality gate
    ├── Stage 3: Design routing (UI projects) → wireframe approval
    ├── Stage 4: scaffold → architect (N parallel) → TDD (N parallel) → impl (N parallel)
    ├── Stage 5: per-milestone integration → spec-review → quality-review → git commit
    └── Stage 6: finishing (smoke test · README · handoff)

Live dashboard (plan/dashboard/)
    ├── server.mjs     zero-dep Node.js SSE server, auto port (base 4317)
    ├── index.html     OLED dark/light UI — agent cards, DAG flowchart, test runner
    └── wait-answer.mjs  bridges dashboard button clicks → orchestrator stdin

Domain phase chains
    references/marketing/   M1-SCOPE → M2-AUDIT → M3-BRIEF → M4-STRATEGY → M5-CALENDAR
    references/research/    R1-SCOPE → R2-GATHER → R3-VALIDATE → R4-SYNTHESISE → R5-OUTPUT
    references/strategy/    SI1-IDEATE → SI2-VALIDATE → SI3-DEFINE → SI4-GTM → SI5-HANDOFF
    references/content/     SC1-BRIEF → SC2-OUTLINE → SC3-DRAFT → SC4-CRITIQUE → SC5-REFINE → SC6-PUBLISH-READY
    references/daily/       SD1-PARSE → SD2-EXECUTE (sub-mode) → SD3-DELIVER
```

---

## What's in the box

```
.claude-plugin/plugin.json                  marketplace manifest (v1.0.0)
skills/agentic-studio/plugin.json           skill manifest (v1.0.0)
hooks/hooks.json                            UserPromptSubmit hook registration
hooks/route.mjs                             routes build/fix/domain prompts to this skill
skills/agentic-studio/SKILL.md             the orchestrator (8 modes)
skills/agentic-studio/references/          phase prompts, scheduler, schemas, protocols
skills/agentic-studio/references/marketing/  MARKETING mode phase files
skills/agentic-studio/references/research/   RESEARCH mode phase files (+ output templates)
skills/agentic-studio/references/strategy/   STRATEGY mode phase files
skills/agentic-studio/references/content/    CONTENT mode phase files
skills/agentic-studio/references/daily/      DAILY mode phase files + sub-modes
skills/agentic-studio/template/dashboard/  the live dashboard (server + page + answer bridge)
```

---

## Notes

- **In-session only.** This plugin needs no API key. An optional standalone headless/CI runner
  ("Engine B") exists in development but is intentionally not bundled here.
- The dashboard binds to `localhost` on an auto-selected free port (base 4317).
- **STRATEGY → SDLC handoff**: the STRATEGY phase chain emits `plan/docs/GREENFIELD-HANDOFF.md`,
  which auto-feeds the GREENFIELD mode so you can go from "define the product" to "build the product"
  in one session.

---

## Contributing

1. Fork and clone. All plugin content lives under `skills/agentic-studio/references/`.
2. **Adding a new mode**: add phase files to `references/<mode>/`, add mode to `references/modes.md`
   (Signal B detection, decision matrix row, dashboard strategy label), add regex to `hooks/route.mjs`,
   update SKILL.md rule 1.
3. **Editing phase files**: each file has a `Purpose` section, a `dashboard card JSON block`, numbered
   algorithm steps, an output schema, and a done condition. Keep that structure.
4. **Dashboard changes**: edit `skills/agentic-studio/template/dashboard/index.html`. No build step —
   it's vanilla JS. The CSS vars for role colors are at the top of the `<style>` block.
5. Open a PR against `main`. Bump the patch version in both `plugin.json` files for fixes,
   minor version for new modes or phase additions, major for breaking changes to the protocol.

---

## License

MIT — see [LICENSE](./LICENSE).
