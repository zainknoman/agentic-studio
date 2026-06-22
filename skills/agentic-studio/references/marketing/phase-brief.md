# MARKETING — Phase 4: BRIEF

Load this file after SYNTHESISE completes and `plan/state/competitive-matrix.json` exists.
BRIEF generates all requested marketing deliverables from the synthesised competitive intelligence.
Deliverables are selected by `marketing-brief.json.goal.type`.

---

## Purpose

Produce the final marketing outputs — written documents ready for the user to use:
1. Competitive analysis report (always generated)
2. Positioning statement (always generated)
3. Campaign brief with target KPIs (always generated)
4. 4-week content calendar (always generated)
5. SEO/AEO keyword clusters (always generated)

All five outputs are generated every time. The depth and focus shifts based on `goal.type`.

---

## Dashboard card

```json
{
  "id": "brief",
  "role": "marketing",
  "label": "Brief Generation",
  "status": "working",
  "detail": "Generating 5 deliverables from competitive matrix"
}
```

Update `strategy`:
```json
{ "name": "Marketing Research", "how": "Sequential — orchestrator writes 5 deliverables" }
```

---

## Output file map

| Deliverable | Output file |
|---|---|
| Competitive analysis report | `plan/docs/competitive-analysis.md` |
| Positioning statement | `plan/docs/positioning.md` |
| Campaign brief | `plan/docs/campaign-brief.md` |
| Content calendar | `plan/docs/content-calendar.md` |
| SEO/AEO keyword clusters | `plan/docs/keyword-clusters.md` |

Update `progress.step` in `agents.json` between each write:
`{i:1,n:5,label:"competitive-analysis.md"}` → `{i:2,n:5,label:"positioning.md"}` → …

---

## Deliverable 1 — Competitive Analysis Report

File: `plan/docs/competitive-analysis.md`
Template basis: `references/marketing/output-templates/competitive-matrix.md`

Use the competitive matrix to write a narrative report. Structure:
```
# Competitive Analysis: {Our Product} vs {N Competitors}
## Executive Summary (3 bullets: market position, key threat, key opportunity)
## Market Landscape
## Competitor Profiles (one section per competitor)
## Cross-Competitor Patterns
## Our Positioning Assessment
## Strategic Recommendations (top 5, prioritised by impact)
```

**Goal-specific focus adjustments:**
- `Launch` → emphasise messaging gaps and first-mover positioning angles
- `Growth` → emphasise acquisition channels competitors are using vs neglecting
- `Retention` → emphasise competitor weaknesses and 1-star themes we can counter
- `Repositioning` → emphasise archetype gaps and narrative pivots
- `SEO/AEO` → emphasise keyword cluster opportunities and AI citation gaps

---

## Deliverable 2 — Positioning Statement

File: `plan/docs/positioning.md`

Write using the classic positioning template, then three alternative framings:

```markdown
# Positioning Statement

## Primary (Geoffrey Moore format)
For [target customer] who [statement of need or opportunity],
[product name] is a [product category]
that [statement of key benefit — why it's compelling].
Unlike [primary competitive alternative],
our product [statement of primary differentiation].

## Tagline options (3 alternatives)
1. [Option A — benefit-led]
2. [Option B — emotion-led]
3. [Option C — differentiation-led]

## Elevator pitch (30 seconds)
[2–3 sentences. Opens with pain, names the solution, closes with the differentiating proof point.]

## Proof points (top 3)
Back each claim in the positioning with a specific, verifiable proof point.
| Claim | Proof point |
|---|---|
| ... | ... |
```

Derive positioning from:
- `our_position.unique_claims[]` from competitive matrix
- `our_position.top_advantages[]`
- `landscape.messaging_gaps[]` (what no competitor says clearly — own it)
- `audience.psychographics` from `marketing-brief.json`

---

## Deliverable 3 — Campaign Brief

File: `plan/docs/campaign-brief.md`
Template basis: `references/marketing/output-templates/campaign-brief.md`

Fill the template with specifics drawn from DISCOVER + SYNTHESISE:
- `goal.type` → campaign objective and KPI targets
- `landscape` → competitive context section
- `our_position` → creative direction and message hierarchy
- `audience` → targeting parameters and channel mix

**KPI targets by goal type:**
| Goal | Primary KPI | Secondary KPI | Target range |
|---|---|---|---|
| Launch | Sign-ups / installs | Brand awareness reach | +500 sign-ups in 30 days |
| Growth | MQLs | CAC ≤ industry avg | +30% MQL volume QoQ |
| Retention | Churn rate | NPS | Churn ≤ 3% monthly |
| Repositioning | Share of voice | Sentiment score | +15pt positive sentiment |
| SEO/AEO | Organic sessions | AI citation appearances | +40% organic sessions in 90 days |

Include a **media channel recommendation** section:
- Primary channel (highest ROI given goal + audience channels)
- Secondary channels (supporting)
- Channels to avoid (mismatch with audience)

---

## Deliverable 4 — 4-Week Content Calendar

File: `plan/docs/content-calendar.md`
Template basis: `references/marketing/output-templates/content-calendar.md`

Generate a structured 4-week content plan. Rules:
- **Week 1** — Awareness / problem framing (top-of-funnel)
- **Week 2** — Education / positioning (mid-funnel)
- **Week 3** — Social proof / differentiation (mid-funnel)
- **Week 4** — Conversion / CTA (bottom-funnel)

For each week, produce 5 content items (one per working day):
```
| Day | Format | Title / Hook | Key message | Target channel | CTA |
|---|---|---|---|---|---|
| Mon | LinkedIn post | ... | ... | LinkedIn | ... |
| Tue | Blog article | ... | ... | Website/SEO | ... |
| Wed | Short-form video | ... | ... | TikTok/IG Reels | ... |
| Thu | Email | ... | ... | Newsletter | ... |
| Fri | Twitter/X thread | ... | ... | Twitter/X | ... |
```

Derive content topics from:
- `landscape.customer_pain_themes[]` — pain-led hooks
- `our_position.unique_claims[]` — differentiation topics
- `landscape.messaging_gaps[]` — unclaimed narrative territory
- `audience.channels` — match format to where audience lives

Include a **Content Repurposing Map** at the end: how each blog post becomes
a LinkedIn post, a thread, a short video script, and an email excerpt.

---

## Deliverable 5 — SEO/AEO Keyword Clusters

File: `plan/docs/keyword-clusters.md`

Structure:
```markdown
# SEO / AEO Keyword Clusters

## Cluster 1: [Primary Topic]
### Intent: [Informational / Commercial / Transactional]
### Pillar keyword: [head term] — estimated high/med/low volume
### Long-tail cluster:
- [long-tail 1]
- [long-tail 2]
- [long-tail 3]
### AI citation opportunity:
- [Question-format prompt users ask ChatGPT/Claude/Perplexity]
- [Recommended answer format: FAQ / How-to / Definition]
### Competitor gap: [which competitors rank here, who doesn't]
```

Generate 4–6 clusters. Derive from:
- `landscape.seo_keyword_clusters[]` from competitive matrix
- `audience.psychographics` → what they search for at each funnel stage
- `our_position.unique_claims[]` → brand-specific keywords to own

**AEO layer** (AI Engine Optimisation): for each cluster, add the AI-cited question format.
AI search engines (ChatGPT, Claude, Perplexity, Gemini) favour:
- FAQ-structured content with clear Q&A blocks
- Definition-style answers for "what is X" queries
- Step-by-step guides for "how to" queries
- Comparison tables for "X vs Y" queries

---

## Done condition

Mark `brief` card `status:"done"` when all 5 files are written.
Update `progress.step` to `{i:5, n:5, label:"done"}`.
Proceed to `phase-review.md`.
