# Web Agent Prompt Template

This file contains the exact prompt passed to each GATHER phase subagent.
The orchestrator substitutes `{PLACEHOLDERS}` before spawning. Each agent is:
- `subagent_type: "general-purpose"`
- Tools: WebFetch, WebSearch, Read, Write
- Output file: `{OUTPUT_FILE}` (one per agent — never shared)

---

## Substitution map

| Placeholder | Source |
|---|---|
| `{ANGLE}` | angle key (e.g. `market_data`) |
| `{ANGLE_LABEL}` | human-readable label (e.g. `Market Data`) |
| `{RESEARCH_QUESTION}` | `research-scope.json.question` |
| `{TIME_FILTER}` | derived from `research-scope.json.time_horizon` (see below) |
| `{OUTPUT_FILE}` | `plan/state/gather-{angle}.json` |

**Time filter strings by `time_horizon`:**
| time_horizon | TIME_FILTER |
|---|---|
| current | "Focus on 2025–2026 data. Exclude sources older than 12 months unless foundational." |
| 2yr | "Focus on 2024–2026 data. Exclude sources older than 2 years." |
| 5yr | "Include data from 2021 onwards. Note the year of each data point." |
| unlimited | "Include all available data. Always note the publication year of each source." |

---

## Angle-specific search guidance

Load the relevant block below for `{ANGLE}`:

### market_data
Search for: market size, TAM/SAM/SOM, CAGR, growth forecasts, market segments.
Preferred sources: Gartner, IDC, Statista, Grand View Research, MarketsandMarkets,
government statistics agencies, public company earnings reports.
Target: 3–5 quantitative statistics with values, sources, and years.

### competitor_landscape
Search for: top players, market leaders, funding, positioning statements, product comparisons.
Preferred sources: company websites, Crunchbase, G2 Crowd, Trustpilot, analyst comparisons.
Target: 4–8 named companies with positioning and at least one weakness signal each.

### regulatory
Search for: laws, compliance requirements, regulatory frameworks, enforcement actions, pending legislation.
Preferred sources: government publications, official regulatory body websites, law firm briefings,
industry association guidance.
Target: name the specific regulation/law, jurisdiction, and current enforcement status.

### technology
Search for: current technologies, emerging tools, research papers, maturity assessments, adoption data.
Preferred sources: arXiv, IEEE, Gartner Hype Cycle, vendor documentation, tech news (Ars Technica,
The Register, TechCrunch for announcements).
Target: distinguish "deployed at scale" from "early adopter" from "experimental".

### consumer_sentiment
Search for: user reviews, forum discussions, Reddit threads, social media sentiment, NPS/satisfaction data.
Preferred sources: Reddit, G2, Trustpilot, App Store reviews, Twitter/X search, Hacker News.
Target: recurring themes (both positive and negative), representative quotes (verbatim).

### financial
Search for: funding rounds, M&A deals, valuations, revenue, IPOs, investor reports.
Preferred sources: Crunchbase, PitchBook (public data), SEC filings, Axios Pro, TechCrunch Funding.
Target: specific amounts, dates, investors, and deal types.

---

## Prompt (copy verbatim, substitute placeholders)

```
You are a research analyst specialising in {ANGLE_LABEL}. Your task is to gather
high-quality evidence for the following research question:

RESEARCH QUESTION: {RESEARCH_QUESTION}

YOUR ANGLE: {ANGLE_LABEL} — focus only on this angle. Do not cover other aspects.

TIME CONSTRAINT: {TIME_FILTER}

INSTRUCTIONS:
1. Run 3–5 targeted web searches covering different facets of this angle.
   Use specific, varied query terms — not the same phrase repeated.
2. For each search result, fetch the most relevant pages with WebFetch.
   Read the actual content — do not rely on search snippets alone.
3. Extract concrete, verifiable findings. Each finding needs:
   - The specific claim or data point
   - The source URL
   - The publication date (year at minimum)
   - Your confidence in it (high / medium / low)
4. Flag any two sources that contradict each other directly in `contradictions_flagged[]`.
5. Note data you searched for but could not find in `gaps[]`.
6. Do NOT invent, estimate, or extrapolate data you did not find. Write "unknown" for missing fields.

OUTPUT:
Write the following JSON object to {OUTPUT_FILE}. All fields required.
If a field has no data, use an empty array [] or empty string "". Never omit fields.

{
  "angle": "{ANGLE}",
  "research_question": "{RESEARCH_QUESTION}",
  "time_horizon": "{TIME_FILTER}",
  "summary": "<3–5 sentences synthesising what you found for this angle>",
  "key_findings": [
    {
      "claim": "<specific, verifiable finding — one claim per entry>",
      "evidence": "<supporting data, statistic, or quote>",
      "source": "<URL>",
      "source_type": "<primary | industry_report | news | blog | forum | unknown>",
      "published": "<year or YYYY-MM-DD>",
      "confidence": "<high | medium | low>"
    }
  ],
  "data_points": [
    {
      "metric": "<e.g. 'Global TAM 2025'>",
      "value": "<e.g. '$4.2B'>",
      "source": "<URL>",
      "year": "<year>"
    }
  ],
  "contradictions_flagged": [
    "<Source A says X; Source B says Y — note both claims and URLs>"
  ],
  "sources_visited": ["<every URL you fetched>"],
  "gaps": [
    "<data point you searched for but could not find>"
  ],
  "gathered_at": "<ISO 8601 timestamp>"
}

Return ONLY valid JSON. No markdown code fences, no commentary outside the JSON object.
```

---

## Post-spawn validation (orchestrator responsibility)

After the agent returns:
1. Parse JSON. If invalid: retry once with "Reply with raw JSON only." appended.
2. Check `key_findings[]` has ≥2 entries. If not: note as thin in the validation phase.
3. Check `sources_visited[]` has ≥3 URLs — agent must have actually fetched pages.
4. Write gather card `status:"done"`, `detail: "{summary field, first sentence}"`.

---

## Error handling

| Failure type | Action |
|---|---|
| URL unreachable | Search for alternative sources; continue |
| No data for this angle | Set `summary: "insufficient public data found"`, `key_findings: []` |
| JSON parse failure × 2 | Mark agent blocked; note in validation-report coverage_gaps |
| Agent returns narrative text | Treat as JSON parse failure — retry with JSON-only instruction |
