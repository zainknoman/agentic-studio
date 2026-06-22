# RESEARCH — Phase 4: SYNTHESISE

Load this file after VALIDATE completes and `plan/state/validation-report.json` is written.
SYNTHESISE runs entirely as the orchestrator — no subagents. You read all validated gather
files, apply contradiction resolutions, and merge everything into one structured knowledge base.

---

## Purpose

Transform N validated angle files into:
1. A structured **knowledge base** (`plan/state/knowledge-base.json`) — the single source of truth
   for the OUTPUT phase.
2. An annotated **findings summary** noting confidence levels, contradictions, and gaps.

The knowledge base is format-agnostic; the OUTPUT phase selects the right template.

---

## Dashboard card

```json
{
  "id": "synthesise",
  "role": "research",
  "label": "Knowledge Synthesis",
  "status": "working",
  "detail": "Merging N angle files → structured knowledge base"
}
```

---

## Synthesis algorithm

### Step 1 — Load inputs

Read in this order:
1. `plan/state/research-scope.json` — original question, depth, audience
2. `plan/state/validation-report.json` — trust scores, contradiction resolutions, gaps
3. All `plan/state/gather-{angle}.json` files that have `status != "blocked"`

### Step 2 — Apply contradiction resolutions

For every contradiction in `validation-report.json`:
- `prefer_a / prefer_b`: use the preferred claim; exclude the other.
- `range`: express the metric as a range in the knowledge base (e.g. `"$4.2B–$8.1B (contested)"`).
- `unresolvable`: mark the field `"[CONTESTED: claim_a vs claim_b — see validation-report]"`.

Never silently drop a contradiction — every one must appear somewhere in the knowledge base.

### Step 3 — Build the core knowledge structure

For each angle, extract:

**market_data:**
- TAM / SAM / SOM with confidence levels
- CAGR / growth rate
- Key segments and their relative sizes
- Geographic breakdowns if available
- Top 3 quantitative statistics with sources

**competitor_landscape:**
- Named players with positioning archetype
- Relative market share or funding if available
- Common weaknesses across the field
- White space / underserved niches identified

**regulatory:**
- Applicable laws or frameworks
- Pending regulation with expected timeline
- Enforcement trend (tightening / stable / loosening)
- Jurisdictions specifically affected

**technology:**
- Dominant current solutions and maturity level
- Emerging technologies and their readiness (TRL if applicable)
- Key research directions / open problems
- Adoption barriers

**consumer_sentiment:**
- Recurring pain themes (most mentioned → least)
- Positive signals / what users value most
- Net sentiment (positive / mixed / negative)
- Representative quotes (max 3, verbatim from sources)

**financial:**
- Total investment in the space (12mo and YTD if available)
- Notable funding rounds (company, amount, stage, date)
- M&A activity
- Revenue signals for key players (if public)

### Step 4 — Derive cross-angle insights

These are insights that CANNOT be found in any single angle — they emerge from combining two or more.

For each insight:
```json
{
  "insight": "<synthesised observation — what the combined data tells us>",
  "supporting_angles": ["market_data", "regulatory"],
  "confidence": "high | medium | low",
  "implication": "<what this means for the research question>"
}
```

Examples of cross-angle insight types:
- Market size + regulatory friction → regulatory headwind on growth
- Technology maturity + financial investment → overfunded vs. underfunded spaces
- Competitor weakness + consumer sentiment → validated market gap
- Financial + competitor → consolidation signals

### Step 5 — Write knowledge base

Write `plan/state/knowledge-base.json`:
```json
{
  "research_question": "",
  "depth": "",
  "audience": "",
  "synthesised_at": "",
  "evidence_quality": "strong | adequate | thin | insufficient",
  "key_findings": [
    {
      "finding": "<concise statement of a research finding>",
      "angle": "<source angle>",
      "confidence": "high | medium | low",
      "sources": ["<URL>"],
      "data_points": [{"metric": "", "value": "", "source": ""}]
    }
  ],
  "by_angle": {
    "market_data": {
      "tam": "", "sam": "", "cagr": "", "key_segments": [],
      "top_statistics": [{"metric": "", "value": "", "source": ""}]
    },
    "competitor_landscape": {
      "players": [{"name": "", "archetype": "", "share_signal": ""}],
      "white_space": [], "common_weaknesses": []
    },
    "regulatory": {
      "frameworks": [], "pending": [], "trend": "", "jurisdictions": []
    },
    "technology": {
      "dominant_solutions": [], "emerging": [], "adoption_barriers": []
    },
    "consumer_sentiment": {
      "pain_themes": [], "valued_features": [], "net_sentiment": "",
      "representative_quotes": []
    },
    "financial": {
      "total_investment_12mo": "", "notable_rounds": [],
      "ma_activity": [], "revenue_signals": []
    }
  },
  "cross_angle_insights": [
    {
      "insight": "",
      "supporting_angles": [],
      "confidence": "",
      "implication": ""
    }
  ],
  "contradictions": [
    {
      "topic": "",
      "resolution": "",
      "note": ""
    }
  ],
  "coverage_gaps": [
    {"angle": "", "impact": "low | medium | high"}
  ],
  "key_unknowns": [
    "<important question the research could not answer, with reason>"
  ],
  "recommended_next_questions": [
    "<follow-on research question worth pursuing>"
  ]
}
```

---

## Done condition

Mark `synthesise` card `status:"done"` when:
- `knowledge-base.json` is written
- `key_findings[]` has ≥3 entries
- `cross_angle_insights[]` has ≥1 entry (for standard/deep depth)
- `key_unknowns[]` is populated (even if empty — empty means "no unknowns found")

Set `detail`: `"N findings · N insights · evidence: {evidence_quality}"`.
Proceed to `phase-output.md`.
