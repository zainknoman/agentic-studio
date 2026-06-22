# MARKETING — Phase 2: RESEARCH

Load this file after DISCOVER completes and `plan/state/marketing-brief.json` is written.
RESEARCH spawns one competitor agent per competitor (up to 5 simultaneously).
Each agent is fully isolated — it owns one output file and never reads another agent's file.

---

## Purpose

Gather structured competitive intelligence for each competitor named in DISCOVER:
- Positioning and messaging
- Pricing model and tiers
- Key features vs our product
- Customer pain signals (1-star reviews, social complaints)
- Feature and messaging gaps we can exploit

---

## Dashboard card

Add card before spawning agents:
```json
{
  "id": "research",
  "role": "research",
  "label": "Competitor Research",
  "status": "working",
  "detail": "Spawning N parallel competitor agents — each analyses one competitor"
}
```

Update `reasoning` in `agents.json` to explain the parallel dispatch:
```
"reasoning": "N competitors → N parallel agents; all independent, no cross-deps"
```

---

## Concurrency rules

- **Maximum simultaneous agents: 5** (hard cap — do not exceed even if user named fewer).
- If `competitors.length <= 5`: dispatch ALL in one message (mandatory fan-out per rule 7).
- If somehow more than 5 were recorded in DISCOVER: process first 5; note the rest were skipped.
- Each agent writes to its own isolated file: `plan/state/research-{slug}.json`
  where `slug` = lowercase competitor name with spaces replaced by hyphens.

---

## Pre-dispatch dashboard update

Write N competitor cards to `agents.json` BEFORE the Agent tool calls (rule 9):
```json
{
  "id": "competitor-{slug}",
  "role": "competitor",
  "label": "{CompetitorName}",
  "status": "working",
  "detail": "Researching positioning, pricing, messaging, reviews, feature gaps"
}
```

Then emit all N Agent tool calls in ONE message.

---

## Spawning competitor agents

Load `references/marketing/competitor-agent-prompt.md` for the exact subagent prompt template.
Substitute:
- `{COMPETITOR_NAME}` — from `marketing-brief.json`
- `{COMPETITOR_URL}` — from `marketing-brief.json` (may be empty — agent must search for it)
- `{OUR_PRODUCT}` — `marketing-brief.json.product.name`
- `{OUR_ONE_LINER}` — `marketing-brief.json.brand.one_liner`
- `{OUTPUT_FILE}` — `plan/state/research-{slug}.json`

Each agent is `subagent_type: "general-purpose"` with tools: WebFetch, WebSearch, Read, Write.

---

## After agents return

For each returned agent:
1. Parse the JSON output (per rule 10 — retry once on failure, two failures = mark blocked).
2. Set the competitor card `status:"done"` (or `"blocked"` on two failures).
3. Write `detail` with a one-line summary: `"Analysed: {positioning_headline}"`.

If ANY competitor agent is blocked: log it, continue with the rest. The SYNTHESISE phase will
note missing competitors in the matrix.

---

## Output: per-competitor `plan/state/research-{slug}.json`

Each agent writes this file. Schema is defined in `competitor-agent-prompt.md`. Summary:
```json
{
  "competitor": "",
  "url": "",
  "positioning_headline": "",
  "target_customer": "",
  "pricing": { "model": "", "tiers": [] },
  "key_messages": [],
  "differentiators": [],
  "weaknesses": [],
  "one_star_themes": [],
  "feature_gaps_vs_us": [],
  "messaging_gaps_vs_us": [],
  "seo_keywords": [],
  "researched_at": ""
}
```

---

## Done condition

Mark `research` card `status:"done"` when all agents have returned (done or blocked).
Proceed to `phase-synthesise.md`.
