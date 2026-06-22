# AB — Operating Modes (global-DAG edition)

Load this file during Stage 0 mode detection. It defines what each mode enables and skips.
The orchestrator reads it once, sets `framework-state.mode`, then never re-reads it.

---

## Operating Modes

### GREENFIELD
User is starting a new project from scratch.
Full pipeline: interview → PRD → scaffold → architect → TDD → impl → review → finish.

### FEATURE
User wants to add one or more features to an existing codebase.
Skips: interview, PRD creation, scaffold.
Runs: repo survey → scoped planning → architect (interfaces for new feature only) → TDD → parallel impl → two-stage review → commit.

### SURGICAL
User wants to fix a bug, resolve an error, or make a targeted change to one area.
Skips: interview, PRD, scaffold, architect, TDD setup.
Runs: repo survey → systematic debugging → targeted fix agent(s) → two-stage review → commit.

### MARKETING
User wants competitive research, a campaign brief, positioning, content strategy, SEO/AEO clusters,
or any marketing intelligence output.
Skips: PRD, scaffold, architect, TDD, DAG build loop.
Runs: DISCOVER interview → parallel RESEARCH agents (up to 5 competitors simultaneously) →
SYNTHESISE (orchestrator merges) → BRIEF (5 deliverables) → REVIEW quality gate (≥ 80/100).
Phase reference: `references/marketing/` (phase-discover.md → phase-research.md →
phase-synthesise.md → phase-brief.md → phase-review.md).

### RESEARCH
User wants a deep-dive investigation, industry report, market analysis, investor brief,
or any evidence-based knowledge synthesis from public sources.
Skips: PRD, scaffold, architect, TDD, DAG build loop.
Runs: SCOPE interview → parallel GATHER agents (up to 6 simultaneous, one per angle) →
VALIDATE (cross-reference, score sources) → SYNTHESISE (build knowledge base) →
OUTPUT (surface / standard / deep deliverable).
Phase reference: `references/research/` (phase-scope.md → phase-gather.md →
phase-validate.md → phase-synthesise.md → phase-output.md).

### STRATEGY
User wants to produce product strategy artifacts: PRD, feature prioritisation, roadmap, OKRs,
or a go-to-market plan — and optionally hand off to GREENFIELD for implementation.
Skips: PRD (generates its own), scaffold, architect, TDD, DAG build loop.
Runs: IDEATE interview → VALIDATE (market check, viability) → DEFINE (PRD + RICE + roadmap + OKRs) →
GTM (positioning, channels, pricing) → HANDOFF (generate GREENFIELD-ready brief).
Phase reference: `references/strategy/` (phase-ideate.md → phase-validate.md → phase-define.md →
phase-gtm.md → phase-handoff.md).

### CONTENT
User wants to produce a polished written artifact: blog post, newsletter, LinkedIn post, landing page
copy, email campaign, pitch deck, case study, whitepaper, or press release — with quality-gated
critique and revision loop.
Skips: PRD, scaffold, architect, TDD, DAG build loop.
Runs: BRIEF interview → parallel OUTLINE agents (research + SEO + competitor) → DRAFT →
CRITIQUE (4-dimension scoring, threshold 75) → REFINE loop (max 3 iterations) → PUBLISH-READY.
Phase reference: `references/content/` (phase-brief.md → phase-outline.md → phase-draft.md →
phase-critique.md → phase-refine.md → phase-publish-ready.md).

### DAILY
User wants a fast knowledge-worker productivity output: meeting prep, email draft, weekly review,
decision framework, or standard operating procedure. Target: < 60 seconds per task.
Skips: everything except parse → execute → deliver. Max 2 agents.
Runs: PARSE (classify sub-mode) → EXECUTE (sub-mode handler) → DELIVER (copy-paste-ready output).
Sub-modes: MEETING_PREP · EMAIL · REVIEW · DECISION · SOP.
Phase reference: `references/daily/` (phase-parse.md → sub-modes/{sub-mode}.md).

---

## Mode Detection (Stage 0, Step 1)

Run this detection BEFORE asking the user anything. It uses three signals:

### Signal A — Directory state
```bash
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" \
  -o -name "*.rs" -o -name "*.rb" -o -name "*.java" -o -name "*.cs" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" ! -name "*.test.*" ! -name "*.spec.*" \
  | wc -l
```
- **0–2 source files** → directory signal: GREENFIELD
- **3+ source files** → directory signal: BROWNFIELD (FEATURE or SURGICAL)

### Signal B — User's request language

SURGICAL signals (any one is enough):
- Contains an error message, stack trace, or test failure output
- "fix", "bug", "broken", "failing", "error", "crash", "not working", "issue"
- References a specific file, function, or line number
- Pastes code that doesn't work

FEATURE signals:
- "add", "implement", "build", "create", "I need X feature", "extend with"
- Describes new behavior that doesn't exist yet
- No error or failure mentioned

GREENFIELD signals:
- "from scratch", "new project", "start a", "build me an app", "create a"
- Empty or near-empty directory

MARKETING signals (any one is enough):
- "marketing", "competitor", "SEO", "campaign", "brand strategy", "GTM", "go-to-market"
- "audience", "content strategy", "market research", "positioning", "social media"
- "ad copy", "conversion", "funnel", "AEO", "GEO", "AI citations"
- "competitive analysis", "competitor research", "campaign brief", "keyword clusters"

RESEARCH signals (any one is enough):
- "research", "analyse", "analysis", "investigate", "deep dive", "literature review"
- "industry report", "investor brief", "find information about", "trends in"
- "what is the market for", "size of the market", "market sizing"
- "due diligence", "landscape report", "state of the market", "evidence on"

STRATEGY signals (any one is enough):
- "product strategy", "PRD", "product requirements", "roadmap", "OKR", "north star metric"
- "go-to-market", "GTM", "pricing strategy", "stakeholder brief", "business case"
- "prioritise features", "RICE", "MoSCoW", "feature prioritisation", "product vision"
- "now next later", "product roadmap", "define the product", "what should we build"

CONTENT signals (any one is enough):
- "write a blog", "write an article", "newsletter", "LinkedIn post", "Twitter thread"
- "landing page copy", "email campaign", "pitch deck", "case study", "whitepaper"
- "press release", "product announcement", "content brief", "write me a"
- "draft a post", "help me write", "blog post about", "article about"

DAILY signals (any one is enough):
- "meeting prep", "prepare for", "draft email", "triage my email", "follow-up email"
- "weekly review", "OKR check-in", "decision framework", "pros and cons", "should I"
- "SOP", "standard operating procedure", "agenda for", "talking points", "action items"
- "summarise this", "help me decide", "week in review", "retrospective"

### Signal C — Explicit user override
User says "use surgical mode", "just fix this", "full build", "add feature" → trust them exactly.

### Decision matrix

| Directory state | Request language | Mode |
|---|---|---|
| GREENFIELD | any | GREENFIELD |
| BROWNFIELD | SURGICAL signals | SURGICAL |
| BROWNFIELD | FEATURE signals | FEATURE |
| any | MARKETING signals | MARKETING (directory state irrelevant) |
| any | RESEARCH signals | RESEARCH (directory state irrelevant) |
| any | STRATEGY signals | STRATEGY (directory state irrelevant) |
| any | CONTENT signals | CONTENT (directory state irrelevant) |
| any | DAILY signals | DAILY (directory state irrelevant) |
| BROWNFIELD | ambiguous | ask one question (see below) |
| GREENFIELD | SURGICAL/FEATURE signals | ask — user may be in wrong dir |

### Ambiguity resolution (one question only)

When signals conflict or are unclear, ask ONE question:

> "I see an existing codebase here. Which best describes what you need?
> A) Fix a specific bug or error
> B) Add a new feature to the existing code
> C) Build something new from scratch in this folder"

Map A→SURGICAL, B→FEATURE, C→GREENFIELD. Do not ask follow-up questions — proceed.

---

## Per-mode Phase Gates

### MARKETING — competitive research + brief pipeline

```
Stage 0:  mode detection → dashboard launch (no worktree, no scaffold)
Stage M1: DISCOVER — dashboard-first interview (brand, product, audience, goal, competitors)
          Output: plan/state/marketing-brief.json
Stage M2: RESEARCH — parallel competitor agents (max 5 simultaneous)
          Each agent: positioning, pricing, messaging, 1-star reviews, feature gaps, SEO keywords
          Output: plan/state/research-{slug}.json (one per competitor)
Stage M3: SYNTHESISE — orchestrator merges all profiles → competitive matrix
          Output: plan/state/competitive-matrix.json + plan/docs/competitive-matrix.md
Stage M4: BRIEF — generate 5 deliverables (sequential, orchestrator-direct)
          Outputs: competitive-analysis.md, positioning.md, campaign-brief.md,
                   content-calendar.md, keyword-clusters.md  (all in plan/docs/)
Stage M5: REVIEW — quality gate: completeness score ≥ 80/100; flag + regenerate if below
          Output: plan/state/brief-review.json
```

**Reference files:** Load in order as each stage starts:
`references/marketing/phase-discover.md` → `phase-research.md` → `phase-synthesise.md`
→ `phase-brief.md` → `phase-review.md`
Competitor subagent prompt: `references/marketing/competitor-agent-prompt.md`
Output templates: `references/marketing/output-templates/`

**Skipped entirely:** PRD, FEATURES.txt, ARCHITECTURE.md, scaffold, worktree, architect,
TDD, global DAG, milestone gates, code review, git commits.

**Dashboard cards:** discover · competitor-{slug} (N cards) · synthesise · brief · review

---

### RESEARCH — evidence-based investigation pipeline

```
Stage 0:   mode detection → dashboard launch (no worktree, no scaffold)
Stage R1:  SCOPE — dashboard-first interview (question, depth, angles, time horizon, audience)
           Output: plan/state/research-scope.json
Stage R2:  GATHER — parallel angle agents (max 6 simultaneous)
           Each agent: one angle (market / competitor / regulatory / technology / sentiment / financial)
           Output: plan/state/gather-{angle}.json (one per agent)
Stage R3:  VALIDATE — orchestrator cross-references sources, scores quality, resolves contradictions
           Output: plan/state/validation-report.json
Stage R4:  SYNTHESISE — orchestrator merges all angles into structured knowledge base
           Output: plan/state/knowledge-base.json
Stage R5:  OUTPUT — generate deliverables based on depth setting:
           surface  → plan/docs/research-exec-summary.md
           standard → plan/docs/research-report.md
           deep     → plan/docs/research-report.md + plan/docs/research-decision-brief.md
```

**Reference files:** Load in order as each stage starts:
`references/research/phase-scope.md` → `phase-gather.md` → `phase-validate.md`
→ `phase-synthesise.md` → `phase-output.md`
Web agent prompt: `references/research/web-agent-prompt.md`
Source scoring: `references/research/source-quality-rubric.md`
Output templates: `references/research/output-templates/`

**Skipped entirely:** PRD, FEATURES.txt, ARCHITECTURE.md, scaffold, worktree, architect,
TDD, global DAG, milestone gates, code review, git commits.

**Dashboard cards:** scope · gather-{angle} (N cards) · validate · synthesise · output

---

### STRATEGY — product strategy pipeline

```
Stage 0:   mode detection → dashboard launch (no worktree, no scaffold)
Stage SI1: IDEATE — dashboard-first interview (idea, problem, target user, success metric)
           Output: plan/state/strategy-idea.json
Stage SI2: VALIDATE — market check (analogous products, timing, risks, viability)
           Output: plan/state/strategy-validation.json
           Gate: if viability=red, prompt user to proceed/adjust/pivot
Stage SI3: DEFINE — generate 4 artifacts (PRD + RICE features + roadmap + OKRs)
           Outputs: plan/docs/strategy-prd.md, strategy-features.md,
                    strategy-roadmap.md, strategy-okrs.md
Stage SI4: GTM — go-to-market plan (ICP, positioning, channels, pricing)
           Output: plan/docs/strategy-gtm.md
Stage SI5: HANDOFF — convert artifacts into GREENFIELD-ready brief
           Output: plan/docs/GREENFIELD-HANDOFF.md
```

**Reference files:** Load in order:
`references/strategy/phase-ideate.md` → `phase-validate.md` → `phase-define.md`
→ `phase-gtm.md` → `phase-handoff.md`
Output templates: `references/strategy/output-templates/`

**Skipped entirely:** scaffold, worktree, architect, TDD, global DAG, milestone gates, code review, git commits.

**Dashboard cards:** ideate · validate · define · gtm · handoff

---

### CONTENT — quality-gated content production pipeline

```
Stage 0:   mode detection → dashboard launch (no worktree, no scaffold)
Stage SC1: BRIEF — dashboard-first interview (type, audience, goal, tone, word count, messages, SEO)
           Output: plan/state/content-brief.json
Stage SC2: OUTLINE — 3 parallel agents (research + SEO + competitor)
           Outputs: plan/state/content-research.json, content-seo.json, content-competitors.json
           Merged: plan/state/content-outline.json
Stage SC3: DRAFT — orchestrator writes full draft
           Output: plan/docs/content-draft.md
Stage SC4: CRITIQUE — 4-dimension scoring (clarity + originality + SEO + audience fit), threshold 75
           Output: plan/state/content-critique.json
Stage SC5: REFINE — (only if score < 75) revision loop, max 3 iterations
           Output: plan/docs/content-draft.md (overwritten)
Stage SC6: PUBLISH-READY — final assembly
           Outputs: plan/docs/content-final.md, plan/docs/content-social.md
```

**Reference files:** Load in order:
`references/content/phase-brief.md` → `phase-outline.md` → `phase-draft.md`
→ `phase-critique.md` → `phase-refine.md` → `phase-publish-ready.md`
Quality rubric: `references/content/quality-rubric.md`
Output templates: `references/content/output-templates/`

**Skipped entirely:** PRD, scaffold, worktree, architect, TDD, global DAG, milestone gates, git commits.

**Dashboard cards:** brief · research · seo · competitor · draft · critique · refine (if needed) · output

---

### DAILY — fast productivity pipeline (< 60 seconds per task)

```
Stage 0:   mode detection → dashboard launch (minimal — 3 cards max)
Stage SD1: PARSE — classify sub-mode, extract context from user message
           Output: plan/state/daily-parse.json
Stage SD2: EXECUTE — route to sub-mode handler (max 2 agents)
           MEETING_PREP: context-agent + agenda-agent → plan/docs/daily-meeting-prep.md
           EMAIL/DRAFT:  1 draft-agent → plan/docs/daily-email-drafts.md
           EMAIL/TRIAGE: orchestrator direct → plan/docs/daily-email-triage.md
           REVIEW:       orchestrator direct → plan/docs/daily-review.md
           DECISION:     orchestrator direct → plan/docs/daily-decision.md
           SOP:          orchestrator direct → plan/docs/daily-sop.md
Stage SD3: DELIVER — print output file path to user; no further phases
```

**Reference files:** `references/daily/phase-parse.md` → `references/daily/sub-modes/{sub-mode}.md`
Output templates: `references/daily/output-templates/`

**Skipped entirely:** interview, PRD, scaffold, worktree, architect, TDD, global DAG, milestone gates, review, git commits.

**Dashboard cards:** parse · execute (1–2 agent cards) · done

---

### GREENFIELD — full pipeline

```
Stage 0:  mode detection → worktree decision → dir setup → dashboard launch
Stage 1:  bring-your-own-docs gate → interview (if no docs) → tech stack
Stage 2:  PRD + FEATURES + ARCHITECTURE + TECH-STACK → global DAG + milestones → doc-quality gate
Stage 2.4: wireframe (UI projects only)
Stage 2.5: scaffold toolchain
Stage 3:  ONE global scheduler run (architect → TDD → impl → fix → milestone gates), no sprint loop
Phase 8:  two-stage review per milestone (review-{M} node)
Phase 9:  finishing (verify → cleanup → BUILD-SUMMARY → final commit)
```

Dashboard cards: interview · prd · planner · doc-check · router · wireframe · scaffold ·
architect · tdd · impl · fix · spec-review · quality-review · finishing

---

### FEATURE — add to existing codebase

```
Stage 0:  mode detection → repo survey → dashboard launch (no worktree question yet)
Stage F1: feature scoping (you do this, not a subagent — 5 minutes max)
Stage F2: impact analysis → scoped DAG + milestones (1–3 milestones typical)
Stage 2.4: wireframe (if the feature has UI)
Stage 3:  ONE global scheduler run (architect → TDD → parallel impl → fix → milestone gates)
          [existing tests must stay green — each milestone gate runs the full suite]
Phase 8:  two-stage review per milestone (review-{M} node)
Phase 9:  finishing (verify full suite → BUILD-SUMMARY delta → commit)
```

**Skipped vs GREENFIELD:** interview · PRD creation · FEATURES.txt · ARCHITECTURE.md (read existing,
don't rewrite) · scaffold · bring-your-own-docs gate.

**Dashboard cards:** survey · scoping · planner · architect · tdd · impl · fix ·
spec-review · quality-review · finishing

#### Stage F1 — Feature scoping (FEATURE mode only)

Do this yourself — no subagent needed. Takes one pass through the codebase.

1. **Survey the repo** (dashboard card: `survey`, detail: "reading repo structure"):
   ```bash
   find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | head -60
   cat package.json 2>/dev/null || cat pyproject.toml 2>/dev/null || true
   cat README.md 2>/dev/null | head -40
   ```
2. **Identify the entry points** most relevant to the requested feature. Read those files only.
3. **State the feature contract** — write `plan/docs/FEATURE-SPEC.md`:
   ```markdown
   # Feature: {name}
   ## What it does
   {1 paragraph}
   ## Acceptance criteria
   - [ ] {specific, testable criterion 1}
   - [ ] {specific, testable criterion 2}
   ## Files likely affected
   - {file}: {why}
   ## Files must NOT be changed
   - {file}: {reason — don't break this}
   ## Existing tests that must stay green
   {test command} — currently {N} passing
   ```
4. Show `FEATURE-SPEC.md` to user. Ask: "Does this capture what you want? (Yes / adjust)"
   One round of adjustment max — then proceed.

#### Stage F2 — Impact analysis + scoped DAG (FEATURE mode only)

Decompose only the feature's tasks and build a scoped global DAG. If the feature touches ≤5 files →
1 milestone. If it touches 6–15 files → 2 milestones, split by layer (data/logic/UI) — but they still
run as one DAG, so independent layers fan out concurrently rather than waiting on a sprint boundary.
If 15+ files → treat as GREENFIELD and tell the user this is a large rework.

Write `plan/state/milestones.json` with the feature's tasks only.
Read existing `src/types/` interfaces — don't redefine them, extend them.

---

### SURGICAL — fix a bug or targeted change

```
Stage 0:   mode detection → repo survey → dashboard launch (minimal)
Stage S1:  problem capture → reproduction confirmation
Stage S2:  systematic debugging (references/systematic-debugging.md — full protocol)
Stage S3:  targeted fix agent (1 agent, possibly 2 if two independent files affected)
Phase 8:   two-stage review (scoped: spec = did it fix the issue, quality = did it break anything)
           [no milestone review — scoped to changed files + integration suite]
Phase 9:   surgical finish (no cleanup pass, no BUILD-SUMMARY — just commit + confirmation)
```

**Skipped entirely:** interview · PRD · FEATURES · ARCHITECTURE · scaffold · worktree setup ·
architect · TDD (uses existing tests as the gate) · DAG planning · hierarchical orchestration.

**Dashboard cards:** survey · diagnose · fix · spec-review · quality-review · done

#### Stage S1 — Problem capture (SURGICAL mode only)

Do this yourself in 2–3 tool calls. Dashboard card: `diagnose`.

1. **Read the error** — if the user pasted an error/stack trace, read it fully now.
   If not, ask ONE question: "Can you paste the error message or failing test output?"

2. **Confirm reproduction:**
   ```bash
   {test_command} 2>&1 | tail -30    # run the suite, see what's actually failing
   ```
   If no test fails but behavior is wrong, ask the user for the exact reproduction steps.
   Never proceed to fix without confirmed reproduction.

3. **Identify the blast radius** — which files are in scope:
   ```bash
   git log --oneline -5               # recent changes
   git diff HEAD --name-only          # uncommitted changes (if any)
   ```
   List the 1–3 files most likely to contain the root cause based on the stack trace.

4. Write `plan/state/surgical-target.json`:
   ```json
   {
     "problem": "<one sentence: what is failing and how>",
     "reproduction": "<exact command that shows the failure>",
     "failing_tests": ["<test id or description>"],
     "suspect_files": ["<file1>", "<file2>"],
     "blast_radius": "single-file | multi-file",
     "confirmed_reproduction": true
   }
   ```

#### Stage S2 — Systematic debugging dispatch (SURGICAL mode only)

Load `references/systematic-debugging.md`. Dispatch ONE fix agent with:
- Full error output (not truncated — surgical mode, so context is small)
- All suspect files from `surgical-target.json`
- Existing test file(s) covering the failing area
- Instruction to follow the four-phase protocol from systematic-debugging.md

**If `blast_radius: "multi-file"` AND files are independent:**
Dispatch 2 fix agents in ONE message (parallel). Each owns exactly one file.
Merge results: both must pass before proceeding to review.

**If files are dependent** (fix in file A requires reading file B's output):
Serialize — fix file A first, then file B.

#### Stage S3 — Surgical two-stage review (SURGICAL mode only)

Scoped version of Phase 8 — same protocol from `references/code-review-protocol.md` but:

- **Stage 1 (spec compliance):** Did the fix resolve the stated problem? Is there a test that proves it?
  Context: `git diff HEAD` (just the fix) · `surgical-target.json` · failing test output.
- **Stage 2 (code quality):** Did the fix introduce any new issues? Is it the minimal change?
  Context: `git diff HEAD` · relevant file(s) only.

After both stages pass: `git commit -m "fix({area}): {problem one-liner}"`. Done.

---

## framework-state.json mode field

Set immediately after mode detection in Stage 0:

```json
{
  "mode": "greenfield | feature | surgical | marketing | research | strategy | content | daily",
  "mode_reason": "<why this mode was chosen — e.g. 'brownfield + error message in request'>",
  "detected_at": "{iso timestamp}"
}
```

The main loop in `phases.md` checks `framework-state.mode` at every phase gate.
Phases not applicable to the current mode are skipped with a dashboard log entry:
`"skipped — {mode} mode"`.

---

## Dashboard strategy labels by mode

| Mode | strategy.name | strategy.how |
|---|---|---|
| GREENFIELD | Full Build | Interview → PRD → scaffold → TDD → parallel impl → review |
| FEATURE | Feature Addition | Survey → scoped plan → architect → TDD → parallel impl → review |
| SURGICAL | Surgical Fix | Diagnose → systematic debug → targeted fix → scoped review |
| MARKETING | Marketing Research | DISCOVER → RESEARCH (parallel) → SYNTHESISE → BRIEF → REVIEW |
| RESEARCH | Deep Research | SCOPE → GATHER (parallel) → VALIDATE → SYNTHESISE → OUTPUT |
| STRATEGY | Product Strategy | IDEATE → VALIDATE → DEFINE → GTM → HANDOFF |
| CONTENT | Content Production | BRIEF → OUTLINE (parallel) → DRAFT → CRITIQUE → REFINE → PUBLISH-READY |
| DAILY | Daily Productivity | PARSE → EXECUTE (1–2 agents) → DELIVER |
