# agentic-studio — Self-Upgrade Task List
> Use this file with `agentic-studio` itself to orchestrate the upgrade
> Feed each phase as a session to the tool — it will parallelise the work within each phase
> Repo: fork of `FaisalNoman/agentic-builder` → rename to `agentic-studio`

---

## How to use this file

1. Fork `FaisalNoman/agentic-builder` → rename to `agentic-studio`
2. Open the repo in Claude Code with `agentic-studio` installed
3. Feed each phase block below as a prompt to `agentic-studio`
4. The tool will spawn parallel agents and show progress in the dashboard
5. Review and approve at each quality gate before proceeding to the next phase

---

## Phase 1 — Foundation Fork & Rename
> Prompt to use: paste the block below into agentic-studio as a SURGICAL task

```
SURGICAL task: Rename and generalise the agentic-builder infrastructure for multi-domain use.

Files to modify:
- plugin.json: update name to "agentic-studio", description to cover dev/marketing/research/strategy/content/daily domains
- README.md: rewrite to reflect multi-domain purpose; keep SDLC section, add sections for each new domain
- hooks/route.mjs: rename internal constants from SDLC-specific labels to domain-neutral names; add placeholder routing stubs for MARKETING, RESEARCH, STRATEGY, CONTENT, DAILY intents
- dashboard/: update agent label rendering so domain type is shown (not hardcoded to "build" language)
- SKILL.md: update the trigger description to be domain-agnostic; add new mode names to the modes list

Do not break any existing GREENFIELD / FEATURE / SURGICAL behaviour.
All changes are additive or cosmetic at this stage.
```

### Checklist
- [x] Fork repo on GitHub, rename to `agentic-studio`
- [x] Update `plugin.json` — name, description, tags
- [x] Rewrite top section of `README.md`
- [x] Add domain-neutral labels to `hooks/route.mjs`
- [x] Generalise dashboard agent labels (remove hardcoded "build"/"fix" strings)
- [x] Update `SKILL.md` description and mode list
- [x] Update `references/` folder structure — add empty folders for each new domain
- [ ] Smoke-test: run existing GREENFIELD mode on a simple project to confirm nothing broke

---

## Phase 2 — MARKETING Mode
> Prompt to use: paste the block below into agentic-studio as a FEATURE task

```
FEATURE task: Add MARKETING mode to agentic-studio.

Mode name: MARKETING
Trigger phrases (for route.mjs): "marketing", "competitor", "SEO", "campaign", "brand", "GTM", "audience", "content strategy", "market research", "positioning", "social media", "ad copy", "conversion", "funnel", "AEO", "GEO"

Phase chain to implement (in references/marketing/):
1. DISCOVER — clarify brand, product, target audience, goals
2. RESEARCH — spawn parallel agents per competitor (max 5 simultaneous); each agent: positioning, pricing, messaging, 1-star reviews, feature gaps
3. SYNTHESISE — orchestrator merges competitor findings into a single competitive matrix
4. BRIEF — generate outputs based on goal:
   - Competitive analysis report (markdown)
   - Positioning statement
   - Campaign brief with target KPIs
   - Content calendar (4-week)
   - SEO/AEO keyword clusters
5. REVIEW — quality gate: check brief completeness score >= 80; flag missing sections

New files to create:
- references/marketing/phase-discover.md
- references/marketing/phase-research.md
- references/marketing/phase-synthesise.md
- references/marketing/phase-brief.md
- references/marketing/phase-review.md
- references/marketing/competitor-agent-prompt.md
- references/marketing/output-templates/competitive-matrix.md
- references/marketing/output-templates/campaign-brief.md
- references/marketing/output-templates/content-calendar.md

Update hooks/route.mjs to detect MARKETING intent and route to the new phase chain.
Update dashboard to show "Marketing Research" as the session type label.
```

### Checklist
- [x] Add MARKETING intent detection to `hooks/route.mjs` — already present (verified)
- [x] Create `references/marketing/` folder structure
- [x] Write `phase-discover.md` — clarification prompts for brand/product/goal
- [x] Write `phase-research.md` — competitor agent spawn instructions (max 5 parallel)
- [x] Write `competitor-agent-prompt.md` — per-agent research instructions with error handling
- [x] Write `phase-synthesise.md` — merge and dedup instructions for orchestrator
- [x] Write `phase-brief.md` — output selection logic (5 deliverables, goal-adaptive)
- [x] Write `phase-review.md` — quality gate scoring rubric (10 dimensions, threshold 80/100)
- [x] Create output templates: competitive matrix, campaign brief, content calendar
- [x] Update dashboard session type label for MARKETING — `strategy.name = "Marketing Research"` documented in `modes.md`
- [ ] Test: run MARKETING mode with a real product and 3 competitors
- [ ] Quality gate: competitive matrix should have ≥5 dimensions per competitor

---

## Phase 3 — RESEARCH Mode
> Prompt to use: paste the block below into agentic-studio as a FEATURE task

```
FEATURE task: Add RESEARCH mode to agentic-studio.

Mode name: RESEARCH
Trigger phrases (for route.mjs): "research", "analyse", "analysis", "find information about", "what is the market for", "investigate", "deep dive", "literature review", "industry report", "trends in", "size of the market", "investor brief"

Phase chain to implement (in references/research/):
1. SCOPE — clarify research question, depth (surface/standard/deep), output format, time horizon
2. GATHER — spawn parallel web-search agents by sub-topic (max 6 simultaneous); each agent covers a different angle: market data, competitor data, regulatory, technology, consumer sentiment, financial
3. VALIDATE — cross-reference sources; flag contradictions; score source quality (primary > industry report > news > blog)
4. SYNTHESISE — merge findings; resolve contradictions; build structured knowledge base
5. OUTPUT — generate based on depth setting:
   - Surface: 1-page exec summary
   - Standard: structured report with sections, data tables, source citations
   - Deep: full report + decision brief + key unknowns + recommended next questions

New files to create:
- references/research/phase-scope.md
- references/research/phase-gather.md
- references/research/phase-validate.md
- references/research/phase-synthesise.md
- references/research/phase-output.md
- references/research/web-agent-prompt.md
- references/research/source-quality-rubric.md
- references/research/output-templates/exec-summary.md
- references/research/output-templates/structured-report.md
- references/research/output-templates/decision-brief.md

Update hooks/route.mjs for RESEARCH intent.
```

### Checklist
- [x] Add RESEARCH intent detection to `hooks/route.mjs` — already present (verified)
- [x] Create `references/research/` folder structure
- [x] Write `phase-scope.md` — depth selector, format selector, time horizon
- [x] Write `phase-gather.md` — sub-topic decomposition logic; parallel agent spawn (max 6)
- [x] Write `web-agent-prompt.md` — per-agent web search instructions with angle-specific guidance
- [x] Write `phase-validate.md` — source quality rubric; contradiction detection and resolution
- [x] Write `source-quality-rubric.md` — 5-tier scoring (primary=5, blog=2, unreliable=1)
- [x] Write `phase-synthesise.md` — merge protocol; cross-angle insights; knowledge-base.json schema
- [x] Write `phase-output.md` — depth-conditional output (surface/standard/deep) with quality gate
- [x] Create output templates: exec summary (≤500 words), structured report (sectioned), decision brief (≤800 words)
- [x] Update `references/modes.md` — RESEARCH mode description, signal B, decision matrix, phase chain, dashboard label
- [ ] Test: run RESEARCH mode on a real market question (e.g. "SaaS pricing in Pakistan 2026")
- [ ] Quality gate: output must include ≥3 cited sources per major claim

---

## Phase 4 — STRATEGY Mode
> Prompt to use: paste the block below into agentic-studio as a FEATURE task

```
FEATURE task: Add STRATEGY mode to agentic-studio. This mode bridges business strategy with the existing SDLC pipeline.

Mode name: STRATEGY
Trigger phrases (for route.mjs): "product strategy", "PRD", "product requirements", "roadmap", "OKR", "go-to-market", "GTM", "pricing strategy", "stakeholder brief", "business case", "prioritise features", "RICE", "MoSCoW", "north star metric"

Phase chain to implement (in references/strategy/):
1. IDEATE — extract product idea, target user, core problem, success metric from free-form input
2. VALIDATE — market check (passes to RESEARCH mode internally for a lightweight gather); identify risks
3. DEFINE — generate core strategy artefacts:
   - PRD (Problem, Users, Goals, Non-goals, Requirements, Success metrics)
   - Feature list with RICE scores
   - Roadmap (Now/Next/Later)
   - OKR set (1 Objective, 3 Key Results)
4. GTM — generate go-to-market plan:
   - Target segment definition
   - Positioning statement
   - Launch channels
   - Pricing model recommendation
5. HANDOFF — convert strategy artefacts into agentic-studio GREENFIELD input:
   - Auto-generate the initial prompt for GREENFIELD mode
   - Pass PRD as the spec document
   - This closes the strategy → development loop

New files to create:
- references/strategy/phase-ideate.md
- references/strategy/phase-validate.md
- references/strategy/phase-define.md
- references/strategy/phase-gtm.md
- references/strategy/phase-handoff.md
- references/strategy/output-templates/prd-template.md
- references/strategy/output-templates/rice-scoring.md
- references/strategy/output-templates/roadmap.md
- references/strategy/output-templates/okr-set.md
- references/strategy/output-templates/gtm-plan.md

Critical: the HANDOFF phase must produce output that GREENFIELD mode can consume directly.
Test the full loop: idea → PRD → GREENFIELD build.
```

### Checklist
- [x] Add STRATEGY intent detection to `hooks/route.mjs` — signal patterns added to route.mjs + modes.md
- [x] Create `references/strategy/` folder structure
- [x] Write `phase-ideate.md` — structured extraction from free-form idea (4 questions, strategy-idea.json)
- [x] Write `phase-validate.md` — lightweight market check; viability green/amber/red; risk flags
- [x] Write `phase-define.md` — PRD + RICE + roadmap + OKR generation (4 artifacts)
- [x] Write `phase-gtm.md` — GTM plan: ICP, positioning statement, channel mix, pricing model
- [x] Write `phase-handoff.md` — GREENFIELD-HANDOFF.md generator; closes strategy→dev loop
- [x] Create output templates: PRD, RICE scoring table, roadmap, OKR set, GTM plan
- [x] Update `references/modes.md` — STRATEGY mode description, signal B, decision matrix, phase chain, dashboard label
- [ ] Wire HANDOFF output to GREENFIELD mode trigger in `hooks/route.mjs`
- [ ] Test full loop: free-form idea → STRATEGY mode → auto-trigger GREENFIELD mode
- [ ] Quality gate: PRD must include Problem, Users, Goals, Non-goals, Requirements, Success metrics

---

## Phase 5 — CONTENT Mode
> Prompt to use: paste the block below into agentic-studio as a FEATURE task

```
FEATURE task: Add CONTENT mode to agentic-studio. Applies quality-gate logic (mirrors TDD) to content production.

Mode name: CONTENT
Trigger phrases (for route.mjs): "write a blog", "write an article", "newsletter", "social media post", "LinkedIn post", "content brief", "landing page copy", "email campaign", "pitch deck", "case study", "whitepaper", "press release", "product announcement"

Phase chain to implement (in references/content/):
1. BRIEF — extract: content type, audience, goal, tone, word count, key messages, SEO keyword (if applicable)
2. OUTLINE — generate structured outline; spawn parallel agents for:
   - Research agent: supporting facts, stats, quotes
   - SEO agent: keyword placement, meta description, heading structure
   - Competitor agent: what's already been written; how to differentiate
3. DRAFT — write full draft incorporating outline + research
4. CRITIQUE — quality gate (score >= 75 to proceed):
   - Clarity score (0-100)
   - Originality score vs competitor content (0-100)
   - SEO compliance score (0-100)
   - Audience fit score (0-100)
   - Overall = average of 4 scores
5. REFINE — if score < 75: spawn refine agent with specific critique notes; loop back to CRITIQUE
6. PUBLISH-READY — final output:
   - Polished content (markdown)
   - Meta description (for web content)
   - Social media variants (3x tweet, 1x LinkedIn, 1x newsletter snippet)
   - PPTX slide deck (if content type = pitch deck or presentation)

New files to create:
- references/content/phase-brief.md
- references/content/phase-outline.md
- references/content/phase-draft.md
- references/content/phase-critique.md
- references/content/phase-refine.md
- references/content/phase-publish-ready.md
- references/content/quality-rubric.md
- references/content/output-templates/blog-post.md
- references/content/output-templates/social-variants.md
- references/content/output-templates/email-campaign.md
```

### Checklist
- [x] Add CONTENT intent detection to `hooks/route.mjs` — signal patterns added to route.mjs + modes.md
- [x] Create `references/content/` folder structure
- [x] Write `phase-brief.md` — content type selector (7 types) and brief extraction (7 questions)
- [x] Write `phase-outline.md` — 3 parallel agents: research + SEO + competitor; merged outline.json
- [x] Write `phase-draft.md` — full draft assembly; key messages, stats, tone, SEO rules
- [x] Write `phase-critique.md` — 4-dimension scoring (clarity/originality/SEO/audience fit); threshold 75
- [x] Write `quality-rubric.md` — breakpoints per dimension; hard-block rule (no dimension < 40)
- [x] Write `phase-refine.md` — critique-to-revision loop; max 3 iterations; BLOCKED fallback
- [x] Write `phase-publish-ready.md` — final md + social variants (3x tweet/LinkedIn/newsletter snippet)
- [x] Create output templates: blog post, social variants, email campaign
- [x] Update `references/modes.md` — CONTENT mode description, signal B, decision matrix, phase chain, dashboard label
- [ ] Test: write a 1000-word blog post on a technical topic; verify critique loop fires when score < 75
- [ ] Quality gate: final output score must be >= 75 across all 4 dimensions

---

## Phase 6 — DAILY Mode
> Prompt to use: paste the block below into agentic-studio as a FEATURE task

```
FEATURE task: Add DAILY mode to agentic-studio for knowledge-worker daily use cases.

Mode name: DAILY
Trigger phrases (for route.mjs): "meeting prep", "prepare for", "draft email", "triage my email", "weekly review", "OKR check-in", "decision framework", "pros and cons", "SOP", "standard operating procedure", "agenda", "talking points", "action items", "follow-up email", "summarise this"

Sub-modes within DAILY (detect from trigger):
- MEETING_PREP: research attendees + context, generate agenda, talking points, pre-read summary
- EMAIL: triage priorities, draft reply, generate subject line variants
- REVIEW: weekly OKR check-in template, progress summary, blockers, next week focus
- DECISION: structured pros/cons matrix, risk register, recommendation brief
- SOP: extract steps from description, format as numbered procedure, add decision points

Phase chain (simplified — 2-3 agents max per task):
1. PARSE — identify sub-mode and extract context from user input
2. EXECUTE — spawn 2-3 focused agents for the sub-mode
3. DELIVER — output clean, copy-paste-ready artefact

New files to create:
- references/daily/phase-parse.md
- references/daily/sub-modes/meeting-prep.md
- references/daily/sub-modes/email.md
- references/daily/sub-modes/review.md
- references/daily/sub-modes/decision.md
- references/daily/sub-modes/sop.md
- references/daily/output-templates/agenda.md
- references/daily/output-templates/decision-matrix.md
- references/daily/output-templates/weekly-review.md
- references/daily/output-templates/sop.md

Note: DAILY mode should be fast. Target < 60 seconds per task. Fewer agents, less ceremony.
```

### Checklist
- [x] Add DAILY intent detection to `hooks/route.mjs` — signal patterns added to route.mjs + modes.md
- [x] Create `references/daily/` folder structure
- [x] Write `phase-parse.md` — sub-mode classifier (5 modes, keyword triggers, daily-parse.json)
- [x] Write `sub-modes/meeting-prep.md` — 2 parallel agents: context-agent + agenda-agent
- [x] Write `sub-modes/email.md` — DRAFT (1 agent, 3 variants) / TRIAGE (orchestrator direct)
- [x] Write `sub-modes/review.md` — OKR check-in; orchestrator direct; weekly-review.md template
- [x] Write `sub-modes/decision.md` — decision matrix; orchestrator direct; pros/cons + recommendation
- [x] Write `sub-modes/sop.md` — procedure extraction; orchestrator direct; RACI + numbered steps
- [x] Create output templates: agenda, decision matrix, weekly review, SOP
- [x] Update `references/modes.md` — DAILY mode description, signal B, decision matrix, phase chain, dashboard label
- [ ] Test: prep for a real meeting; verify output in < 60 seconds
- [ ] Test: write a decision framework for a real decision

---

## Phase 7 — Integration, Polish & Release
> Prompt to use: paste the block below into agentic-studio as a SURGICAL task

```
SURGICAL task: Final integration, polish, and release prep for agentic-studio.

Tasks:
1. ROUTE AUDIT — review hooks/route.mjs: ensure no intent overlap between modes; add fallback to SDLC if no domain matches; add confidence scoring so ambiguous inputs ask for clarification rather than guessing wrong
2. DASHBOARD UPDATE — update dashboard UI to show:
   - Current mode name (SDLC / MARKETING / RESEARCH / STRATEGY / CONTENT / DAILY)
   - Domain-specific agent role labels (e.g. "Competitor Agent" not "Sub-agent 3")
   - Phase progress indicator per mode
3. README FINAL — complete README.md:
   - Mode overview table
   - Quick-start for each mode (one example prompt per mode)
   - Architecture diagram (text-based)
   - Installation instructions
   - Contributing guide
4. SKILL.md FINAL — update trigger description to cover all 6 domains with examples
5. PLUGIN.JSON FINAL — update tags, version (1.0.0), description
6. SMOKE TEST ALL MODES — run one real task per mode, verify output quality
```

### Checklist
- [x] Audit `route.mjs` for intent overlap; add priority order comment + overlap resolution
- [x] Update dashboard mode label (shows `strategy.name` when available) and fix "Agentic Builder" → "Agentic Studio" in header/footer
- [x] Dashboard agent role labels already present (domain icons + CSS role vars for all 8 modes)
- [x] Complete `README.md` — quick-start for each mode, text architecture diagram, contributing guide
- [x] Final `SKILL.md` — rule 1 updated to list all 8 modes with descriptions
- [x] Final `plugin.json` — version 1.0.0 in both `.claude-plugin/plugin.json` and `skills/agentic-studio/plugin.json`; multi-domain descriptions; expanded keywords
- [ ] Smoke test SDLC mode (existing)
- [ ] Smoke test MARKETING mode
- [ ] Smoke test RESEARCH mode
- [ ] Smoke test STRATEGY mode
- [ ] Smoke test CONTENT mode
- [ ] Smoke test DAILY mode
- [ ] Tag release `v1.0.0` on GitHub

---

## Bonus Tasks (Post-v1.0.0)

These are stretch goals identified from the competitive analysis.

```
FEATURE task: Add cross-platform support to agentic-studio.
Competitors alirezarezvani and digital-marketing-pro support 8-13 platforms.
Add adapter generation scripts for Codex, Gemini CLI, and Cursor using the same SKILL.md source.
Reference: wshobson/agents cross-platform adapter approach.
```

- [ ] Add `scripts/generate-codex.sh` adapter
- [ ] Add `scripts/generate-gemini.sh` adapter
- [ ] Add `scripts/generate-cursor.sh` adapter
- [ ] Add cross-platform install section to README

```
FEATURE task: Add plugin evaluation framework to agentic-studio.
Reference: wshobson/agents three-layer evaluation (Static / LLM Judge / Monte Carlo).
Build a /evaluate command that scores each mode's output quality.
```

- [ ] Design evaluation rubric per mode
- [ ] Build static structural checker (< 2s)
- [ ] Build LLM judge scorer (4 dimensions per mode)
- [ ] Add `/evaluate` slash command

```
FEATURE task: Add AEO/GEO audit to the MARKETING mode.
Reference: indranilbanerjee/digital-marketing-pro 6-platform audit standard.
Audit content against ChatGPT, Perplexity, Google AI Mode, Google AI Overviews, Gemini, Microsoft Copilot citability.
```

- [ ] Research AEO/GEO audit methodology
- [ ] Add `references/marketing/aeo-geo-audit.md`
- [ ] Wire into MARKETING BRIEF phase as optional output

---

## Estimated Timeline

| Phase | Effort | Weeks |
|---|---|---|
| Phase 1 — Foundation | Low | 1–2 |
| Phase 2 — MARKETING | Medium | 3–5 |
| Phase 3 — RESEARCH | Medium | 6–8 |
| Phase 4 — STRATEGY | High | 9–11 |
| Phase 5 — CONTENT | Medium | 12–13 |
| Phase 6 — DAILY | Low | 14–15 |
| Phase 7 — Integration | Medium | 16–17 |
| **Total** | | **~17 weeks solo / ~8 weeks with parallel sessions** |

> Tip: Phases 2, 3, and 6 can be run in parallel as separate agentic-studio sessions since they don't depend on each other. Only Phase 4 (STRATEGY) depends on Phase 3 (RESEARCH) for its validation sub-step.

---

*Task list generated: June 22, 2026 · Based on research report: agentic-studio-research.md*
