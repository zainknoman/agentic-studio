# Competitor Agent Prompt Template

This file contains the exact prompt passed to each competitor research subagent.
The orchestrator substitutes `{PLACEHOLDERS}` before spawning. Each agent is:
- `subagent_type: "general-purpose"`
- Tools: WebFetch, WebSearch, Read, Write
- Output file: `{OUTPUT_FILE}` (one per agent — never shared)

---

## Substitution map

| Placeholder | Source |
|---|---|
| `{COMPETITOR_NAME}` | `marketing-brief.json.competitors[i].name` |
| `{COMPETITOR_URL}` | `marketing-brief.json.competitors[i].url` (may be empty string) |
| `{COMPETITOR_NOTES}` | `marketing-brief.json.competitors[i].notes` (may be empty string) |
| `{OUR_PRODUCT}` | `marketing-brief.json.product.name` |
| `{OUR_ONE_LINER}` | `marketing-brief.json.brand.one_liner` |
| `{OUTPUT_FILE}` | `plan/state/research-{slug}.json` |

---

## Prompt (copy verbatim, substitute placeholders)

```
You are a competitive intelligence analyst. Research the competitor described below and
write a structured JSON report. Be specific — cite real pricing, real product features,
and real customer complaints. Never invent data you cannot verify.

COMPETITOR: {COMPETITOR_NAME}
URL: {COMPETITOR_URL}  (if empty, search for their website first)
NOTES: {COMPETITOR_NOTES}

WE ARE: {OUR_PRODUCT} — {OUR_ONE_LINER}

TASK:
1. Visit their website (use WebFetch on {COMPETITOR_URL} or search for it).
   Read their homepage, pricing page, and features/product page.
2. Search for recent customer reviews (G2, Capterra, Trustpilot, Reddit, App Store).
   Focus on 1–2 star reviews to find recurring pain themes.
3. Search for their SEO presence: what keywords do they rank for? What content do they publish?
   (Search "site:{COMPETITOR_URL} top pages" or use Ahrefs/SimilarWeb public data if available.)
4. Compare their product to {OUR_PRODUCT}: what features do they have that we lack?
   What messaging claims do they make that we could counter?

OUTPUT:
Write the following JSON object to {OUTPUT_FILE}. Every field must be populated.
If a field cannot be determined with confidence, write "unknown" — do NOT leave it empty.

{
  "competitor": "{COMPETITOR_NAME}",
  "url": "<actual URL found>",
  "positioning_headline": "<their main tagline or value prop headline, quoted from their site>",
  "positioning_archetype": "<one of: price-leader | feature-rich | simplicity | enterprise | niche-specialist>",
  "target_customer": "<who they market to — role, company size, industry if detectable>",
  "pricing": {
    "model": "<one of: free | freemium | subscription | usage-based | per-seat | one-time | enterprise-only | unknown>",
    "entry_point": "<lowest visible paid tier price, e.g. '$29/mo' or 'unknown'>",
    "tiers": [
      { "name": "<tier name>", "price": "<price or 'custom'>", "highlights": ["<feature>"] }
    ]
  },
  "key_messages": [
    "<top 3–5 marketing messages from their homepage/ads, quoted or closely paraphrased>"
  ],
  "differentiators": [
    "<what they claim makes them unique vs the market>"
  ],
  "weaknesses": [
    "<what their customers or reviewers criticise most — from reviews, forums>"
  ],
  "one_star_themes": [
    "<recurring complaint theme from 1–2 star reviews — be specific: 'slow customer support', 'no mobile app', 'pricing jumps too high at scale'>"
  ],
  "feature_gaps_vs_us": [
    "<features they have that {OUR_PRODUCT} lacks or where they are stronger>"
  ],
  "messaging_gaps_vs_us": [
    "<claims or narratives they own that {OUR_PRODUCT} does not counter effectively>"
  ],
  "seo_keywords": [
    "<up to 10 keywords or topics they appear to rank for or target — from their content, meta tags, blog categories>"
  ],
  "sources": [
    "<URL of each page visited>"
  ],
  "researched_at": "<ISO 8601 timestamp>"
}

Return ONLY valid JSON. No markdown code fences, no commentary outside the JSON object.
```

---

## Post-spawn validation (orchestrator responsibility)

After the agent returns, the orchestrator must:
1. Parse the JSON. If invalid, retry once with "Reply with raw JSON only." appended.
2. Check that `one_star_themes[]` has ≥1 entry and `seo_keywords[]` has ≥3 entries.
   If not, note as partial in the review card — still use the data, just flag it.
3. Write the competitor card `status:"done"`, `detail:"<positioning_headline>"`.

---

## Error handling

| Failure type | Action |
|---|---|
| URL unreachable | Search for competitor name + "pricing" + "features"; continue with found data |
| No public pricing | Set `pricing.model: "unknown"`, `pricing.entry_point: "unknown"` |
| No reviews found | Set `one_star_themes: ["no public reviews found"]` |
| JSON parse failure × 2 | Mark agent blocked; orchestrator notes in synthesise phase |
