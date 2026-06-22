# STRATEGY — Phase SI3: DEFINE

Load this file after VALIDATE completes and `plan/state/strategy-validation.json` exists
with `recommendation` set to `proceed` or `adjust`.
DEFINE runs entirely as the orchestrator — no subagents. You write all four strategy
artifacts directly using the output templates in `references/strategy/output-templates/`.

---

## Purpose

Generate the four core strategy artifacts that give the product a concrete foundation:
1. **PRD** — what the product is and what it must do
2. **Feature list with RICE scores** — what to build and in what order
3. **Roadmap (Now/Next/Later)** — when to build each feature
4. **OKR set** — one Objective and three Key Results for the quarter

All four documents are written by the orchestrator sequentially. The dashboard card
is updated after each write so the user sees progress in real time.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "define",
  "role": "strategy",
  "label": "Strategy Definition",
  "status": "working",
  "detail": "Writing PRD (1/4)"
}
```

Update `strategy` in `agents.json`:
```json
{
  "name": "Product Strategy",
  "how": "IDEATE → VALIDATE → DEFINE → GTM → HANDOFF"
}
```

---

## Output file map

| Artifact | Template | Output file |
|---|---|---|
| PRD | `references/strategy/output-templates/prd-template.md` | `plan/docs/strategy-prd.md` |
| Feature list + RICE | `references/strategy/output-templates/rice-scoring.md` | `plan/docs/strategy-features.md` |
| Roadmap | `references/strategy/output-templates/roadmap.md` | `plan/docs/strategy-roadmap.md` |
| OKR set | `references/strategy/output-templates/okr-set.md` | `plan/docs/strategy-okrs.md` |

Update `progress.step` in `agents.json` between each write:
`{i:1,n:4,label:"strategy-prd.md"}` → `{i:2,n:4,label:"strategy-features.md"}` →
`{i:3,n:4,label:"strategy-roadmap.md"}` → `{i:4,n:4,label:"strategy-okrs.md"}`

---

## Artifact 1 — PRD

File: `plan/docs/strategy-prd.md`
Template: `references/strategy/output-templates/prd-template.md`

Populate using data from:
- `strategy-idea.json` — idea, problem, target_user, success_metric
- `strategy-validation.json` — risks (surface as constraints / non-goals)

Key substitutions:
- `{PRODUCT_NAME}` — extract from `idea` field (the noun phrase describing the product)
- `{PROBLEM_STATEMENT}` — use `problem` field verbatim, then expand with one paragraph
- `{PRIMARY_PERSONA}` — derive from `target_user` field
- `{SUCCESS_METRICS}` — use `success_metric` as the primary KPI; add 2 supporting metrics

Write 5–8 functional requirements as user stories: "As a [user], I can [action] so that [benefit]."
Derive from the `idea` field — what does the product actually do step by step?

Update `detail` in dashboard card: `"Writing PRD (1/4)"` → after write → `"Writing RICE scores (2/4)"`

---

## Artifact 2 — Feature list with RICE scores

File: `plan/docs/strategy-features.md`
Template: `references/strategy/output-templates/rice-scoring.md`

Generate 8–12 features derived from the PRD functional requirements plus any additional
features implied by the product type. For each feature:
- **Reach** — estimate users per quarter who benefit (based on target_user scale)
- **Impact** — score 3/2/1/0.5/0.25 (see template guide)
- **Confidence** — 100%/80%/50% based on how validated the need is
- **Effort** — person-weeks (1-week increments; cap at 12 weeks for MVP features)
- **RICE Score** — calculate: `(Reach × Impact × Confidence) / Effort`

Sort rows by RICE score descending. Assign priority tier:
- Top 5 features by score → `Now`
- Next 5 features → `Next`
- Remaining → `Later`

Derive feature list from PRD user stories plus standard features for the product category
(e.g. auth, onboarding, notifications for a SaaS app).

Update `detail` in dashboard card: `"Writing RICE scores (2/4)"` → after write → `"Writing roadmap (3/4)"`

---

## Artifact 3 — Roadmap (Now/Next/Later)

File: `plan/docs/strategy-roadmap.md`
Template: `references/strategy/output-templates/roadmap.md`

Populate three columns from the RICE priority tiers:
- **NOW** (this quarter) — all `Now`-tier features from RICE scoring; status = `In progress` or `Planned`
- **NEXT** (next quarter) — all `Next`-tier features; status = `Planned`
- **LATER** (6+ months) — all `Later`-tier features; status = `Directional`

For each item, fill: Feature name | RICE score | Owner | Status
- Owner defaults to `{TEAM}` unless the product is a solo build, in which case `Founder`

Guiding principles section: write 3 bullets that reflect what this roadmap optimises for,
derived from `success_metric` and the product's primary value proposition.

Update `detail` in dashboard card: `"Writing roadmap (3/4)"` → after write → `"Writing OKRs (4/4)"`

---

## Artifact 4 — OKR set

File: `plan/docs/strategy-okrs.md`
Template: `references/strategy/output-templates/okr-set.md`

Write one Objective and three Key Results for the current quarter:

**Objective** — derive from `success_metric`; make it qualitative and inspiring.
Example pattern: "Prove that [product name] solves a real problem for [target_user] and
establishes a foothold in the market."

**Key Results** — each must be quantitative and directly measurable:
- KR1 — tied to the primary `success_metric` (the user's 90-day goal)
- KR2 — a leading indicator of KR1 (e.g. active trials, weekly active users)
- KR3 — a quality or retention signal (e.g. NPS ≥ 40, 60-day retention ≥ 30%)

For each KR: fill baseline (current state = 0 for a new product), target, and measurement method.

Initiatives section: list the top 3 actions from the `Now` roadmap tier that most directly
move these KRs.

---

## Done condition

Mark `define` card `status:"done"` when:
- All four files are written (`strategy-prd.md`, `strategy-features.md`,
  `strategy-roadmap.md`, `strategy-okrs.md`)
- `progress.step` is `{i:4, n:4, label:"done"}`

Then proceed to `phase-gtm.md`.
