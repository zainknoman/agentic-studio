# RESEARCH — Phase 1: SCOPE

Load this file when the orchestrator enters RESEARCH mode. SCOPE is always the first phase.
It runs as a dashboard-primary interview (rule 12 of the main skill) and produces
`plan/state/research-scope.json` which all downstream phases read.

---

## Purpose

Establish four parameters that govern the entire research run:
1. **Question** — the precise research question or topic
2. **Depth** — surface / standard / deep (controls output format and agent count)
3. **Format** — who receives this output and in what form
4. **Time horizon** — how recent the data must be (current / 2yr / 5yr / no limit)

Vague scope → vague findings. Pin the question before anything else.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "scope",
  "role": "research",
  "label": "Research Scoping",
  "status": "working",
  "detail": "Interviewing — defining research question, depth, format, time horizon"
}
```

Update `strategy` in `agents.json`:
```json
{
  "name": "Deep Research",
  "how": "SCOPE → GATHER (parallel) → VALIDATE → SYNTHESISE → OUTPUT"
}
```

---

## Bring-your-own-brief gate

Before Q1, check `plan/docs/` for an existing brief:

> "I created `plan/docs/`. If you have an existing research brief or specification document,
>  drop it in there now. Have you added one? (Yes / No)"

- **Yes + file present** → read it, pre-populate scope from it, confirm with user, skip to Q4.
- **Yes + no file** → fall through to full interview.
- **No** → full interview (Q1–Q5).

---

## Interview flow (dashboard-first, rule 12)

Run each question as a dashboard prompt (`prompt` → `wait-answer.mjs` → CLI fallback).

### Q1 — The research question
```
prompt.id:       "scope-question"
prompt.title:    "Research Question"
prompt.question: "What exactly do you need to know? State it as a specific question.
                  Examples:
                  - 'What is the global market size for B2B SaaS security tooling in 2025–2026?'
                  - 'What are the main regulatory challenges for fintech startups in the EU?'
                  - 'Who are the top 5 players in AI-assisted code review and what are their weaknesses?'"
prompt.options:  []  // free-text
```
Record: `question` (the primary research question, verbatim)

Clarify if too broad ("What's AI?" → ask: "Which aspect of AI? — industry adoption, investment trends, specific technology?").
Clarify if too narrow ("What did Gartner say last Tuesday?" → explain we cross-reference multiple sources).

### Q2 — Depth setting
```
prompt.id:       "scope-depth"
prompt.title:    "Research Depth"
prompt.question: "How deep do you need to go?"
prompt.options:  [
  "Surface — quick overview, key numbers, 1-page summary (10–15 min)",
  "Standard — structured report with sections, data tables, citations (30–45 min)",
  "Deep — full report + decision brief + key unknowns + recommended next questions (60–90 min)"
]
```
Record: `depth` — one of: `surface | standard | deep`

**Depth → agent count + output format map:**
| Depth   | GATHER agents | Output |
|---------|--------------|--------|
| surface | 2–3 (market + competitor only) | exec-summary.md (1 page) |
| standard | 4–6 (all angles) | structured-report.md (full sections) |
| deep | 6 (all angles, max depth) | structured-report.md + decision-brief.md + unknowns appendix |

### Q3 — Sub-topics / angles (optional override)
```
prompt.id:       "scope-angles"
prompt.title:    "Research Angles"
prompt.question: "I'll research these angles in parallel:
                  Market data · Competitor landscape · Regulatory environment ·
                  Technology trends · Consumer/user sentiment · Financial & investment signals

                  Are there angles to SKIP or FOCUS on? Or should I cover all of them?
                  (Leave blank to use defaults for your depth setting.)"
prompt.options:  ["Cover all angles", "Skip some / focus on specific ones"]
```
If "Skip/focus": ask one follow-up to identify which angles.
Record: `angles_include[]` — defaults derived from depth if not overridden.

### Q4 — Time horizon
```
prompt.id:       "scope-time"
prompt.title:    "Time Horizon"
prompt.question: "How recent does the data need to be?"
prompt.options:  [
  "Current — 2025–2026 data only",
  "Recent — past 2 years",
  "Historical — past 5 years",
  "No limit — include all available data"
]
```
Record: `time_horizon` — one of: `current | 2yr | 5yr | unlimited`
This becomes a search filter passed to each GATHER agent.

### Q5 — Output audience + format constraint
```
prompt.id:       "scope-audience"
prompt.title:    "Output Audience"
prompt.question: "Who receives this report and how will they use it?"
prompt.options:  [
  "Internal team — operational decision",
  "Executive / board — strategic decision or investment",
  "Investor / VC — due diligence or pitch support",
  "Client / external — deliverable or proposal"
]
```
Record: `audience` — informs tone, formality, and which output template to use.

---

## Output: `plan/state/research-scope.json`

Write on completion. All downstream phases read it.

```json
{
  "question": "",
  "depth": "surface | standard | deep",
  "angles_include": [
    "market_data",
    "competitor_landscape",
    "regulatory",
    "technology",
    "consumer_sentiment",
    "financial"
  ],
  "time_horizon": "current | 2yr | 5yr | unlimited",
  "audience": "internal | executive | investor | client",
  "output_file_prefix": "plan/docs/research",
  "scoped_at": ""
}
```

**Default angles by depth:**
- `surface`: `["market_data", "competitor_landscape"]`
- `standard`: `["market_data", "competitor_landscape", "regulatory", "technology"]`
- `deep`: `["market_data", "competitor_landscape", "regulatory", "technology", "consumer_sentiment", "financial"]`

---

## Done condition

Mark `scope` card `status:"done"` when:
- `question` is non-empty and specific
- `depth` is set
- `angles_include[]` has ≥1 entry
- `time_horizon` is set
- `audience` is set

Proceed to `phase-gather.md`.
