# CONTENT — Phase SC2: OUTLINE

Load this file after BRIEF completes and `plan/state/content-brief.json` is written.
OUTLINE spawns 3 parallel agents simultaneously to gather research, SEO data, and
competitive context, then the orchestrator merges their outputs into a structured outline.

---

## Purpose

Build the evidence-backed skeleton that the DRAFT phase will flesh out:
1. **Research agent** — facts, stats, and quotes that support every key message
2. **SEO agent** — keyword strategy, heading structure, and meta copy (web content only)
3. **Competitor agent** — what existing content covers this topic and where the gap is

All 3 agents run simultaneously. The orchestrator waits for all to complete, then merges
their outputs into `plan/state/content-outline.json`.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "outline",
  "role": "content",
  "label": "Content Outline",
  "status": "working",
  "detail": "Spawning 3 parallel agents — research, SEO, competitor"
}
```

Update `reasoning` in `agents.json`:
```
"reasoning": "3 independent agents (research, SEO, competitor) fan out simultaneously; orchestrator merges on completion"
```

---

## Pre-dispatch agent cards

Write all 3 agent cards to `agents.json` BEFORE the Agent tool calls (rule 9):

```json
{ "id": "research-agent", "role": "research", "label": "Research Agent", "status": "working", "detail": "Gathering facts, stats, quotes for each key message" }
```
```json
{ "id": "seo-agent", "role": "seo", "label": "SEO Agent", "status": "working", "detail": "Keyword density, LSI terms, heading structure, meta description" }
```
```json
{ "id": "competitor-agent", "role": "research", "label": "Competitor Agent", "status": "working", "detail": "Scanning 3 existing pieces on this topic — angle and structure analysis" }
```

If `content-brief.json.is_web_content == false`: set SEO agent card `status:"skipped"`, `detail:"Non-web content — SEO step skipped"`. Do NOT spawn the SEO agent.

Then emit all active Agent tool calls in ONE message (mandatory fan-out per rule 7).

---

## Agent A: research-agent

**Task:** Find 3–5 supporting facts, statistics, or quotes for each key message in `content-brief.json.key_messages[]`.

**Tools:** WebSearch, WebFetch, Write

**Output:** `plan/state/content-research.json`

```json
{
  "facts": [
    { "claim": "", "source": "", "url": "" }
  ],
  "stats": [
    { "stat": "", "source": "", "url": "", "year": "" }
  ],
  "quotes": [
    { "quote": "", "attribution": "", "source_url": "" }
  ],
  "sources": []
}
```

Rules for this agent:
- Every stat must have a verifiable source URL.
- Prefer primary sources (industry reports, peer-reviewed papers, official data) over blogs.
- Aim for at least 1 stat or fact per key message in the brief.
- If a key message has no supporting data: flag it in a `data_gaps[]` array.

---

## Agent B: seo-agent (web content only)

**Task:** Build keyword strategy and heading structure for the content.

**Condition:** Only spawn if `content-brief.json.is_web_content == true`.

**Tools:** WebSearch, WebFetch, Write

**Output:** `plan/state/content-seo.json`

```json
{
  "primary_keyword": "",
  "keyword_density_target_pct": 1.5,
  "lsi_keywords": [],
  "heading_structure": [
    { "level": "H1", "suggestion": "" },
    { "level": "H2", "suggestion": "" },
    { "level": "H3", "suggestion": "" }
  ],
  "meta_description": "",
  "internal_link_opportunities": [],
  "search_intent": "informational | commercial | transactional"
}
```

Rules for this agent:
- If `content-brief.json.seo_keyword` is non-null: use it as the primary keyword.
- If null: research and suggest the best keyword for the topic; write it to `primary_keyword`.
- `lsi_keywords[]` must have exactly 5 entries (Latent Semantic Indexing synonyms and related terms).
- `meta_description` must be 150–160 characters.
- `heading_structure[]` must include one H1, at least two H2s, and at least one H3.

---

## Agent C: competitor-agent

**Task:** Find 3 existing published pieces of content on the same topic, summarise their angle
and structure, and identify what angle is missing or overdone across all three.

**Tools:** WebSearch, WebFetch, Write

**Output:** `plan/state/content-competitors.json`

```json
{
  "pieces": [
    {
      "title": "",
      "url": "",
      "publication": "",
      "angle": "",
      "structure_summary": "",
      "word_count_estimate": 0,
      "strengths": [],
      "weaknesses": []
    }
  ],
  "overdone_angles": [],
  "missing_angles": [],
  "differentiation_angle": ""
}
```

Rules for this agent:
- `differentiation_angle` must be a single sentence: the unique angle our content will take that NONE of the 3 competitors cover well.
- If fewer than 3 pieces exist on the exact topic: expand the search to adjacent topics and note this.

---

## Orchestrator merge step

After all agents return:

1. Parse all output JSON files.
2. Set each agent card `status:"done"` (or `"blocked"` on failure — continue merge with available data).
3. Build `plan/state/content-outline.json`:

```json
{
  "title_options": [
    { "option": 1, "title": "" },
    { "option": 2, "title": "" },
    { "option": 3, "title": "" }
  ],
  "hook": "",
  "sections": [
    {
      "heading": "",
      "key_point": "",
      "supporting_data": "",
      "seo_heading_suggestion": ""
    }
  ],
  "cta": "",
  "differentiation_angle": "",
  "word_count_target": 0
}
```

**Merge rules:**
- `title_options[]`: generate 3 title variants — one benefit-led, one curiosity-led, one keyword-led (if web).
- `hook`: the strongest opening hook — a surprising stat, provocative question, or counterintuitive claim drawn from `content-research.json`.
- `sections[]`: one section per key message plus intro and conclusion. Pull `supporting_data` from `content-research.json`. Copy `seo_heading_suggestion` from `content-seo.json` where applicable.
- `cta`: derive from `content-brief.json.goal` (e.g. `convert` → trial sign-up, `inform` → subscribe for more).
- `differentiation_angle`: copy directly from `content-competitors.json.differentiation_angle`.
- `word_count_target`: copy from `content-brief.json.length.target`.

---

## Done condition

Mark `outline` card `status:"done"` when `plan/state/content-outline.json` is written.
Update `progress.step` to `{i:2, n:6, label:"outline-complete"}`.
Proceed to `phase-draft.md`.
