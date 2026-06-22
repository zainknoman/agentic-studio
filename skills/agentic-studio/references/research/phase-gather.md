# RESEARCH — Phase 2: GATHER

Load this file after SCOPE completes and `plan/state/research-scope.json` is written.
GATHER spawns parallel web-search agents — one per research angle — up to 6 simultaneously.
Each agent is fully isolated: it owns one output file and never reads another agent's file.

---

## Purpose

Gather raw evidence for each angle defined in SCOPE:
- **market_data** — TAM/SAM/SOM, growth rates, key statistics
- **competitor_landscape** — players, positioning, differentiators, weaknesses
- **regulatory** — laws, compliance requirements, pending legislation, enforcement trends
- **technology** — current solutions, emerging tech, R&D directions, maturity levels
- **consumer_sentiment** — user reviews, forum discussions, NPS trends, complaints
- **financial** — funding rounds, M&A activity, valuations, revenue signals

---

## Dashboard card

Add before spawning:
```json
{
  "id": "gather",
  "role": "research",
  "label": "Evidence Gathering",
  "status": "working",
  "detail": "Spawning N parallel agents — each covers one research angle"
}
```

Update `reasoning`:
```
"N angles → N parallel agents; fully independent, no cross-deps — dispatching all at once"
```

---

## Concurrency rules

- **Maximum simultaneous agents: 6** (hard cap — one per angle).
- Dispatch ALL included angles in ONE message (mandatory fan-out per rule 7).
- Surface depth: 2 agents. Standard: 4. Deep: 6 (all angles).
- Each agent writes to: `plan/state/gather-{angle}.json`
  where `angle` is the angle key (e.g. `market_data`, `regulatory`).

---

## Pre-dispatch dashboard update

Write one card per angle to `agents.json` BEFORE the Agent tool calls (rule 9):
```json
{
  "id": "gather-{angle}",
  "role": "research",
  "label": "{Angle Label}",
  "status": "working",
  "detail": "Searching: {research question} — {angle} angle"
}
```

Angle label map:
| Angle key | Label |
|---|---|
| market_data | Market Data |
| competitor_landscape | Competitor Landscape |
| regulatory | Regulatory & Legal |
| technology | Technology Trends |
| consumer_sentiment | Consumer Sentiment |
| financial | Financial & Investment |

Then emit all Agent tool calls in ONE message.

---

## Spawning agents

Load `references/research/web-agent-prompt.md` for the exact subagent prompt template.
Substitute:
- `{ANGLE}` — the angle key
- `{ANGLE_LABEL}` — human-readable label
- `{RESEARCH_QUESTION}` — from `research-scope.json.question`
- `{TIME_HORIZON}` — from `research-scope.json.time_horizon`
- `{OUTPUT_FILE}` — `plan/state/gather-{angle}.json`

Each agent is `subagent_type: "general-purpose"` with tools: WebFetch, WebSearch, Read, Write.

**Time horizon → search date filter:**
| time_horizon | Search instruction |
|---|---|
| current | "Focus on 2025–2026 data. Exclude sources older than 12 months." |
| 2yr | "Focus on 2024–2026 data. Exclude sources older than 2 years." |
| 5yr | "Include data from 2021 onwards." |
| unlimited | "Include all available data; note publication dates." |

---

## After agents return

For each returned agent:
1. Parse the JSON (per rule 10 — retry once on failure, two failures = mark blocked).
2. Set gather card `status:"done"` (or `"blocked"` on two failures).
3. Write `detail` with a one-line summary from `summary` field in the output.

If ANY agent is blocked: log it, continue with the rest. The VALIDATE phase will flag
incomplete coverage in its quality assessment.

---

## Output: per-angle `plan/state/gather-{angle}.json`

Each agent writes this schema:

```json
{
  "angle": "market_data | competitor_landscape | regulatory | technology | consumer_sentiment | financial",
  "research_question": "",
  "time_horizon": "",
  "summary": "<3-5 sentence synthesis of what was found>",
  "key_findings": [
    {
      "claim": "<specific, verifiable finding>",
      "evidence": "<supporting data point, quote, or statistic>",
      "source": "<URL or publication name>",
      "source_type": "primary | industry_report | news | blog | forum | unknown",
      "published": "<year or YYYY-MM-DD if known>",
      "confidence": "high | medium | low"
    }
  ],
  "data_points": [
    {
      "metric": "<e.g. 'Global market size 2025'>",
      "value": "<e.g. '$4.2B'>",
      "source": "<URL>",
      "year": "<year>"
    }
  ],
  "contradictions_flagged": [
    "<any two sources that claim conflicting facts — note both claims and both sources>"
  ],
  "sources_visited": ["<URL>"],
  "gaps": [
    "<data point you tried to find but could not locate>"
  ],
  "gathered_at": "<ISO 8601 timestamp>"
}
```

---

## Done condition

Mark `gather` card `status:"done"` when all agents have returned (done or blocked).
Record any blocked angles in `plan/state/research-scope.json` under `blocked_angles[]`.
Proceed to `phase-validate.md`.
