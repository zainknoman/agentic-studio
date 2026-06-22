# MARKETING — Phase 1: DISCOVER

Load this file when the orchestrator enters MARKETING mode. DISCOVER is always the first phase.
It runs as a dashboard-primary interview (rule 12 of the main skill) and produces
`plan/state/marketing-brief.json` which all downstream phases read.

---

## Purpose

Establish the four pillars needed for effective research and brief generation:
1. **Brand** — who the client is
2. **Product** — what is being marketed
3. **Audience** — who the buyers/users are
4. **Goal** — what the marketing output must achieve

A vague DISCOVER produces vague research. Push for specifics on every point before
proceeding to RESEARCH.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "discover",
  "role": "marketing",
  "label": "Marketing Discovery",
  "status": "working",
  "detail": "Interviewing — establishing brand, product, audience, goals"
}
```

Update `strategy` in `agents.json`:
```json
{
  "name": "Marketing Research",
  "how": "DISCOVER → RESEARCH (parallel) → SYNTHESISE → BRIEF → REVIEW"
}
```

---

## Interview flow (dashboard-first, rule 12)

Run each question as a dashboard prompt (`prompt` object → `wait-answer.mjs` → CLI fallback).
One question at a time. Reflect answers back before the next question.

### Q1 — Brand identity
```
prompt.id:       "discover-brand"
prompt.title:    "Brand"
prompt.question: "What is the brand name, and what does it do in one sentence?"
prompt.options:  []   // free-text — omit options for open input
```
Record: `brand.name`, `brand.one_liner`

### Q2 — Product / offer being marketed
```
prompt.id:       "discover-product"
prompt.question: "What specific product, feature, or service are we marketing?
                  (e.g. 'Pro plan launch', 'mobile app v2', 'enterprise consulting package')"
```
Record: `product.name`, `product.description`, `product.launch_stage`
(launch_stage: idea | pre-launch | launched | growth | mature)

### Q3 — Target audience
```
prompt.id:       "discover-audience"
prompt.question: "Who is the target audience? Include:
                  - Demographics (age, location, role/title)
                  - Psychographics (goals, pains, buying triggers)
                  - Where they spend time online"
```
Record: `audience.demographics`, `audience.psychographics`, `audience.channels`

### Q4 — Primary goal + outputs requested
```
prompt.id:       "discover-goal"
prompt.title:    "Goal & Deliverables"
prompt.question: "What is the primary marketing goal?"
prompt.options:  [
  "Launch — drive awareness and first users",
  "Growth — increase MQLs / pipeline",
  "Retention — reduce churn, increase LTV",
  "Repositioning — change brand perception",
  "SEO/AEO — capture organic and AI-cited traffic"
]
```
Record: `goal.type`, map to `goal.primary_kpi` (see KPI map below)

**KPI map:**
| Goal | Primary KPI |
|---|---|
| Launch | Brand awareness reach, sign-ups |
| Growth | MQL volume, CAC, conversion rate |
| Retention | Churn rate, NPS, expansion revenue |
| Repositioning | Share of voice, sentiment score |
| SEO/AEO | Organic sessions, AI citation rate |

### Q5 — Competitors (required for RESEARCH phase)
```
prompt.id:       "discover-competitors"
prompt.question: "Name your top competitors (up to 5). For each, paste their homepage URL
                  if you know it. I will research them in parallel."
```
Record: `competitors[]` — array of `{ name, url?, notes? }`
**Cap at 5.** If the user names more than 5, ask them to prioritise the top 5.

### Q6 — Budget / timeline / constraints (optional but useful)
```
prompt.id:       "discover-constraints"
prompt.question: "Any budget, timeline, or channel constraints?
                  (e.g. 'launch in 3 weeks', 'no paid ads', 'B2B SaaS, 50–500 employee companies only')
                  — or skip."
prompt.options:  ["Skip"]   // plus free-text input
```
Record: `constraints` (may be empty string)

---

## Bring-your-own-brief gate

Before Q1, check `plan/docs/` for an existing brief file (`.pdf`, `.md`, `.txt`, `.docx`):

> "I see `plan/docs/`. If you have an existing marketing brief or PRD, drop it in there now.
>  Have you added one? (Yes / No)"

- **Yes + file present** → read the file, pre-populate `marketing-brief.json` from it, show a
  summary to the user for confirmation, then skip to Q5 (competitors) if audience/goal are covered.
- **Yes + no file** → fall through to full interview.
- **No** → full interview (Q1–Q6).

---

## Output: `plan/state/marketing-brief.json`

Write this file on completion. All downstream phases read it.

```json
{
  "brand": {
    "name": "",
    "one_liner": ""
  },
  "product": {
    "name": "",
    "description": "",
    "launch_stage": "launched"
  },
  "audience": {
    "demographics": "",
    "psychographics": "",
    "channels": ""
  },
  "goal": {
    "type": "Growth",
    "primary_kpi": "MQL volume, CAC, conversion rate"
  },
  "competitors": [
    { "name": "", "url": "", "notes": "" }
  ],
  "constraints": "",
  "discovered_at": ""
}
```

---

## Done condition

Mark `discover` card `status:"done"` when:
- All required fields in `marketing-brief.json` are non-empty
- `competitors[]` has 1–5 entries
- `goal.type` is set

Then proceed to `phase-research.md`.
