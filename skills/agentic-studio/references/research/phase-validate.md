# RESEARCH — Phase 3: VALIDATE

Load this file after all GATHER agents have completed (or timed out).
VALIDATE runs entirely as the orchestrator — no subagents. You read all
`plan/state/gather-{angle}.json` files and assess data quality, flag contradictions,
and score source reliability before synthesis.

---

## Purpose

Raw gathered data is heterogeneous: primary datasets, industry reports, news articles,
and blog posts are not equally reliable. VALIDATE ensures the SYNTHESISE phase builds
on the strongest evidence and explicitly tracks what is contested or uncertain.

Three outputs:
1. **Source quality scores** — each finding rated against the rubric
2. **Contradiction log** — conflicting claims with resolution guidance
3. **Coverage gaps** — angles where evidence is thin or blocked

---

## Dashboard card

```json
{
  "id": "validate",
  "role": "research",
  "label": "Source Validation",
  "status": "working",
  "detail": "Cross-referencing sources, scoring quality, flagging contradictions"
}
```

Update `strategy`:
```json
{ "name": "Deep Research", "how": "Sequential — orchestrator validates all gathered data" }
```

---

## Validation algorithm

### Step 1 — Collect all gather files

Read each `plan/state/gather-{angle}.json`. For any missing (blocked agent):
- Insert an entry in `coverage_gaps[]` with `reason: "agent_blocked"`.
- Continue with available data — do NOT abort.

### Step 2 — Score each finding

Load `references/research/source-quality-rubric.md` and apply the rubric to every
`key_findings[]` entry across all gather files.

Assign each finding:
```json
{
  "quality_score": 1–5,
  "quality_tier": "primary | industry_report | news | blog | forum | unknown",
  "trust_level": "high | medium | low | discard"
}
```

**Trust level mapping:**
| Score | Trust level |
|---|---|
| 4–5 | high |
| 3 | medium |
| 2 | low |
| 1 | discard (exclude from synthesis) |

### Step 3 — Cross-reference for contradictions

For each topic area (market size, key players, regulatory status, etc.):
1. Collect all claims touching that topic from different angles.
2. Identify pairs where two claims cannot both be true (e.g. market size "$4.2B" vs "$8.1B" for same year).
3. Log each contradiction:
   ```json
   {
     "topic": "<what the contradiction is about>",
     "claim_a": "<first claim>",
     "source_a": "<URL>",
     "quality_a": "<score>",
     "claim_b": "<conflicting claim>",
     "source_b": "<URL>",
     "quality_b": "<score>",
     "resolution": "prefer_a | prefer_b | range | unresolvable",
     "resolution_reason": "<why — e.g. 'source_a is primary data; source_b is blog estimate'>"
   }
   ```

**Resolution rules:**
- `prefer_a / prefer_b`: one source clearly outranks the other on quality_score → prefer higher.
- `range`: both sources are credible but use different methodologies → express as range (e.g. "$4.2B–$8.1B").
- `unresolvable`: equal quality, fundamentally different claims → note as "contested" in synthesis.

### Step 4 — Identify coverage gaps

For each angle in `research-scope.json.angles_include[]`:
- If the agent was blocked → `reason: "agent_blocked"`
- If the agent ran but `key_findings[]` has < 2 entries → `reason: "insufficient_data"`
- If `data_points[]` is empty for a quantitative angle (market_data, financial) → `reason: "no_quantitative_data"`

### Step 5 — Write outputs

Write `plan/state/validation-report.json`:
```json
{
  "research_question": "",
  "validated_at": "",
  "total_findings": 0,
  "findings_by_tier": {
    "primary": 0,
    "industry_report": 0,
    "news": 0,
    "blog": 0,
    "forum": 0,
    "unknown": 0
  },
  "findings_discarded": 0,
  "contradictions": [
    {
      "topic": "",
      "claim_a": "",
      "source_a": "",
      "quality_a": 0,
      "claim_b": "",
      "source_b": "",
      "quality_b": 0,
      "resolution": "prefer_a | prefer_b | range | unresolvable",
      "resolution_reason": ""
    }
  ],
  "coverage_gaps": [
    {
      "angle": "",
      "reason": "agent_blocked | insufficient_data | no_quantitative_data",
      "impact": "low | medium | high"
    }
  ],
  "overall_evidence_quality": "strong | adequate | thin | insufficient",
  "recommendation": "proceed | proceed_with_caveats | request_more_research"
}
```

**Overall quality thresholds:**
| Condition | Rating |
|---|---|
| ≥60% high-trust findings, ≤1 unresolvable contradiction, 0–1 gaps | strong |
| ≥40% high-trust, ≤2 unresolvable, ≤2 gaps | adequate |
| ≥20% high-trust OR ≥3 gaps OR ≥3 unresolvable | thin |
| <20% high-trust AND ≥3 gaps | insufficient |

**Recommendation:**
- `strong / adequate` → `proceed`
- `thin` → `proceed_with_caveats` (note limitations in output)
- `insufficient` → `request_more_research` (ask user if they want to add sources or widen the search)

If `recommendation: "request_more_research"`, write a dashboard prompt:
```json
{
  "id": "validate-gate",
  "title": "Evidence is thin",
  "question": "I found limited high-quality data for: {gap_list}. How would you like to proceed?",
  "options": ["Continue anyway — note the gaps", "Try different search angles", "Abort"]
}
```
Block on `wait-answer.mjs validate-gate 300`, then handle the chosen path.

---

## Done condition

Mark `validate` card `status:"done"` when `validation-report.json` is written.
Set `detail` to: `"N findings validated — quality: {overall_evidence_quality}"`.
Proceed to `phase-synthesise.md`.
