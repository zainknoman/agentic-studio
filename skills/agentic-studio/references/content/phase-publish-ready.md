# CONTENT — Phase SC6: PUBLISH-READY

Load this file after CRITIQUE passes (or after REFINE completes, including the BLOCKED path).
PUBLISH-READY is the final output assembly phase. It produces all deliverable files
the user needs to publish or distribute the content.

---

## Purpose

Assemble the final publication package:
1. **Polished final content** — the approved draft with complete frontmatter
2. **Social media variants** — tweet variants, LinkedIn post, newsletter snippet
3. **Slide outline** — slide-by-slide breakdown (pitch deck content type only)

All outputs land in `plan/docs/` for easy handoff.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "output",
  "role": "content",
  "label": "Final Output",
  "status": "working",
  "detail": "Assembling final content, social variants, and delivery files"
}
```

---

## Algorithm

### Step 1 — Write polished final content

Read `plan/docs/content-draft.md` (the last draft version, post-any-refinement).

Write `plan/docs/content-final.md` with the following changes:
- Replace the draft frontmatter block with the final frontmatter (see schema below).
- Make any minor copy-editing fixes (typos, punctuation, spacing) — do NOT change structure or rewrite sections.
- Do NOT remove citations or supporting data.

**Final frontmatter schema:**
```markdown
---
title: {selected title from content-outline.json}
content_type: {type from content-brief.json}
meta_description: {meta_description from content-seo.json, or null if non-web}
word_count: {actual word count of final draft}
quality_score: {overall score from content-critique.json}
date: {today's date, ISO 8601}
status: final
---
```

### Step 2 — Generate social variants

Write `plan/docs/content-social.md` with ALL of the following sections.
Do not skip any section regardless of content type.

Use `output-templates/social-variants.md` as the structural template.

**Section A — Twitter / X variants (3 tweets)**

Generate 3 standalone tweet variants. Each must be ≤280 characters. Do not include URLs
(user will add tracking links). Label each:

1. **Hook tweet** — opens with a surprising stat or bold claim from `content-research.json`
2. **Thread-starter tweet** — numbered list format: "N things about {topic}:"
   followed by items that tease the full piece
3. **Conversational tweet** — a question or hot take that invites replies

**Section B — LinkedIn post (1 post, 150–200 words)**

3-paragraph structure:
- Paragraph 1 (hook): single strong sentence — stat, question, or counterintuitive claim
- Paragraph 2 (value): 3–5 sentences expanding the main insight from the content
- Paragraph 3 (CTA): direct ask + 3–5 relevant hashtags

Tone: professional, regardless of the `content-brief.json.tone` setting.
No bullet lists in the first line (LinkedIn algorithm penalises this).

**Section C — Newsletter snippet (1 snippet, 50–75 words)**

A self-contained teaser for inclusion in an existing newsletter:
- Opening sentence: restate the hook from the final content
- 2–3 body sentences: tease the most interesting insight without giving it away
- Final sentence: "read more" hook with implied link anchor text

### Step 3 — Generate slide outline (pitch deck only)

**Condition:** Only run if `content-brief.json.type == "pitch-deck"`.

Write `plan/docs/content-slides.md`.

Format per slide:
```markdown
## Slide {N}: {Title}

**Bullets:**
- {Bullet 1}
- {Bullet 2}
- {Bullet 3}

**Speaker note:** {One or two sentences the presenter says out loud that are NOT on the slide.}
```

Derive slide structure from `content-final.md` sections. Map:
- Intro section → Slide 1 (title/hook slide)
- Each H2 section → one slide
- Key takeaways → penultimate slide
- CTA section → final slide

If `content-brief.json.length.range == "slides"`: use `content-brief.json.length.target`
as the slide count target. Compress or expand sections to hit the count within ±2 slides.

---

## Final user print

After all output files are written, print this message to the user:

```
Content complete.

Final:           plan/docs/content-final.md
Social variants: plan/docs/content-social.md
{Slides:         plan/docs/content-slides.md  ← only if pitch deck}

Quality score: {overall}/100
Word count:    {actual_word_count}
Content type:  {type}
```

---

## Done condition

Mark `output` card `status:"done"` when all applicable output files are written.
Update `progress.step` to `{i:6, n:6, label:"done"}`.

The CONTENT mode pipeline is complete. No further phases run automatically.
