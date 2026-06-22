# MARKETING — Phase 3: SYNTHESISE

Load this file after all RESEARCH agents have completed (or timed out).
SYNTHESISE runs entirely as the orchestrator — no subagents. You read all
`plan/state/research-{slug}.json` files and merge them into one competitive matrix.

---

## Purpose

Transform N isolated competitor profiles into:
1. A unified **competitive matrix** (`plan/state/competitive-matrix.json`) — the structured
   source of truth for BRIEF phase deliverables.
2. A human-readable **competitive matrix document** (`plan/docs/competitive-matrix.md`) —
   following the template in `output-templates/competitive-matrix.md`.

---

## Dashboard card

```json
{
  "id": "synthesise",
  "role": "marketing",
  "label": "Competitive Synthesis",
  "status": "working",
  "detail": "Merging N competitor profiles → competitive matrix"
}
```

Update `strategy`:
```json
{ "name": "Marketing Research", "how": "Sequential — merging competitor data, 1 orchestrator" }
```

---

## Synthesis algorithm

### Step 1 — Collect and validate

Read each `plan/state/research-{slug}.json`. For any that are missing or malformed,
insert a placeholder row marked `"status": "blocked"` in the matrix.

### Step 2 — Cross-competitor pattern extraction

For each dimension below, scan all competitor profiles and extract patterns:

**A. Positioning clusters**
Group competitors by their positioning archetype:
- `price-leader` — competes on cost
- `feature-rich` — competes on depth/completeness
- `simplicity` — competes on ease-of-use
- `enterprise` — competes on security/compliance/SLA
- `niche-specialist` — competes on vertical depth

Assign each competitor one primary archetype. Note if our brand occupies a gap.

**B. Pricing landscape**
Build a pricing tier table (freemium / starter / pro / enterprise) with known price points.
Flag where our product is cheaper, more expensive, or missing a tier.

**C. Messaging gaps (OPPORTUNITY SIGNALS)**
Find claims that NO competitor makes clearly — these are our differentiation openings.
Also find claims ALL competitors make — these are table stakes (must match but don't win).

**D. Feature gaps**
List features competitors have that we lack (threat) and features we have that they lack (advantage).

**E. Customer pain themes**
Aggregate `one_star_themes[]` across all competitors. Recurring themes = market-wide pains
we can address in our messaging.

**F. SEO/AEO keyword overlap**
Aggregate `seo_keywords[]` across all competitors. Cluster by topic. Flag high-volume
keywords where ≤1 competitor ranks well — organic opportunity gaps.

### Step 3 — Our position assessment

Using `marketing-brief.json` (our brand + product), score our position on each dimension:
- **Positioning**: which archetype are we closest to? Is there white space?
- **Pricing**: are we competitive, premium, or cheap in this landscape?
- **Messaging**: what unique claims can we own?
- **Features**: our top 3 advantages; our top 3 gaps to address.

### Step 4 — Write outputs

Write `plan/state/competitive-matrix.json`:
```json
{
  "our_brand": "",
  "our_product": "",
  "competitors": [
    {
      "name": "",
      "archetype": "simplicity | price-leader | feature-rich | enterprise | niche-specialist",
      "positioning_headline": "",
      "pricing_model": "",
      "pricing_entry_point": "",
      "key_strengths": [],
      "key_weaknesses": [],
      "one_star_themes": [],
      "status": "done | blocked"
    }
  ],
  "landscape": {
    "positioning_archetypes": {},
    "pricing_table": [],
    "messaging_gaps": [],
    "table_stakes_claims": [],
    "feature_gaps_threat": [],
    "feature_gaps_advantage": [],
    "customer_pain_themes": [],
    "seo_keyword_clusters": []
  },
  "our_position": {
    "archetype": "",
    "pricing_position": "competitive | premium | value",
    "unique_claims": [],
    "top_advantages": [],
    "top_gaps": []
  },
  "synthesised_at": ""
}
```

Then render `plan/docs/competitive-matrix.md` using the template in
`references/marketing/output-templates/competitive-matrix.md`, substituting real data.

---

## Done condition

Mark `synthesise` card `status:"done"` when:
- `plan/state/competitive-matrix.json` is written and valid
- `plan/docs/competitive-matrix.md` is written
- All competitors appear in the matrix (blocked ones noted)

Proceed to `phase-brief.md`.
