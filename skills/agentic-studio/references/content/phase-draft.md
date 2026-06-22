# CONTENT — Phase SC3: DRAFT

Load this file after OUTLINE completes and `plan/state/content-outline.json` is written.
DRAFT is written directly by the orchestrator — no subagents — to guarantee consistent voice
across the entire piece.

---

## Purpose

Produce a full, publication-ready first draft by combining:
- The structural skeleton from `content-outline.json`
- The supporting evidence from `content-research.json`
- The SEO requirements from `content-seo.json` (web content only)
- The tone and key-message constraints from `content-brief.json`

The orchestrator writes directly. Subagents introduce voice fragmentation; this phase
intentionally avoids them.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "draft",
  "role": "content",
  "label": "Content Draft",
  "status": "working",
  "detail": "Reading outline and research — writing full draft"
}
```

Update `detail` when writing begins:
```json
{ "detail": "Writing draft — {word_count_target} word target, {type} format" }
```

Update `detail` when complete:
```json
{ "detail": "Draft complete — {actual_word_count} words written" }
```

---

## Algorithm

### Step 1 — Load all inputs

Read the following files before writing a single word:

| File | Purpose |
|---|---|
| `plan/state/content-brief.json` | Type, audience, goal, tone, key messages, SEO keyword |
| `plan/state/content-outline.json` | Title options, hook, sections[], CTA |
| `plan/state/content-research.json` | Facts, stats, quotes, sources |
| `plan/state/content-seo.json` | Keyword density, LSI keywords, heading suggestions, meta description |

If `content-brief.json.is_web_content == false`: skip `content-seo.json` (file may not exist).

### Step 2 — Select title and confirm outline

1. From `content-outline.json.title_options[]`, select the title best matched to `content-brief.json.goal`:
   - `inform` or `seo` → keyword-led title
   - `persuade` or `convert` → benefit-led title
   - `entertain` → curiosity-led title
2. Verify sections[] covers every key message in `content-brief.json.key_messages[]`.
   If a key message has no corresponding section, add a section for it.

### Step 3 — Write the draft

Write `plan/docs/content-draft.md` following the outline exactly. Apply these rules:

**Universal rules (all content types):**
- Every key message from `content-brief.json.key_messages[]` MUST appear in the draft,
  ideally within a dedicated section heading or opening sentence of a paragraph.
- Every stat must cite its source inline using the format: `(Source Name, Year)`.
  Full URLs are not required inline; they are preserved in `content-research.json`.
- Tone must match `content-brief.json.tone` throughout the entire piece.
  Do not drift tone mid-draft.
- The hook from `content-outline.json.hook` must appear in the opening paragraph.
- The CTA from `content-outline.json.cta` must appear in the closing section.
- Word count must land within ±15% of `content-outline.json.word_count_target`.

**Web content SEO rules (only if `is_web_content == true`):**
- The SEO keyword from `content-seo.json.primary_keyword` must appear in:
  - The title (H1)
  - The first paragraph (within the first 100 words)
  - At least 2 H2 subheadings
- Keyword density must stay within ±0.5% of `content-seo.json.keyword_density_target_pct`.
- At least 3 of the 5 LSI keywords from `content-seo.json.lsi_keywords[]` must appear naturally in the body.
- Use the heading structure from `content-seo.json.heading_structure[]` as the basis for H1/H2/H3 tags.

**Format-specific rules:**

| Content type | Special rule |
|---|---|
| Twitter thread | Each tweet ≤280 chars. Number tweets (1/N, 2/N…). Strong hook tweet first. |
| LinkedIn post | 3-paragraph structure: hook, value, CTA. No bullet lists in first line. |
| Newsletter | Subject line + preview text at top, then body. Use subheadings every 3 paragraphs. |
| Email campaign | Follow `output-templates/email-campaign.md` structure exactly. |
| Pitch deck | Use slide-by-slide format. Each slide: Slide N: {title}, bullets, speaker note. |
| Press release | Inverted pyramid. Dateline in first paragraph. Quote from spokesperson in second paragraph. |

### Step 4 — Write to file

Write the complete draft to `plan/docs/content-draft.md`.

Do not truncate. Do not write placeholders. Every section must be fully written prose.

---

## Output: `plan/docs/content-draft.md`

The draft file must begin with this frontmatter block:

```markdown
---
draft_version: 1
content_type: {type from brief}
target_word_count: {word_count_target}
tone: {tone from brief}
seo_keyword: {primary_keyword or null}
status: draft
---
```

Followed by the full draft content.

---

## Done condition

Mark `draft` card `status:"done"` when `plan/docs/content-draft.md` is written and non-empty.
Update `progress.step` to `{i:3, n:6, label:"draft-complete"}`.
Proceed to `phase-critique.md`.
