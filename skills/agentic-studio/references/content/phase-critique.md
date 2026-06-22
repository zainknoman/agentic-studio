# CONTENT — Phase SC4: CRITIQUE

Load this file after DRAFT completes and `plan/docs/content-draft.md` is written.
CRITIQUE scores the draft on 4 quality dimensions. Passing threshold is 75 overall.
No single dimension may score below 40 even if the average meets the threshold.

---

## Purpose

Provide an objective, evidence-grounded quality gate before the content is published.
The orchestrator reads the draft and scores it across:
1. **Clarity** — is the message immediately clear?
2. **Originality** — does it bring a genuinely different angle?
3. **SEO compliance** — does it meet technical keyword requirements? (web only)
4. **Audience fit** — does the tone and complexity match the stated audience?

The critique produces specific, actionable feedback — not general impressions.
Every note must cite the section or line it refers to.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "critique",
  "role": "content",
  "label": "Quality Critique",
  "status": "working",
  "detail": "Scoring draft on clarity, originality, SEO compliance, audience fit"
}
```

---

## Scoring algorithm

The orchestrator reads `plan/docs/content-draft.md` and applies the following rubric.
Full scoring criteria are in `references/content/quality-rubric.md`.

### Dimension A — Clarity (0–100)

Questions to answer:
1. Is the main message of the piece clear within the first 50 words?
2. Is there any jargon used without definition for the stated `audience.knowledge_level`?
3. Does the content flow logically from section to section with clear transitions?
4. Is the CTA unambiguous — does the reader know exactly what to do next?

Scoring breakpoints:
- 90–100: All four questions answered "yes"
- 75–89: Three of four answered "yes"; one minor issue
- 50–74: One or two structural clarity problems (buried lede, jargon wall, abrupt ending)
- Below 50: Main message not clear in first 50 words, OR no CTA present

### Dimension B — Originality (0–100)

Compare against `plan/state/content-competitors.json`:
1. Does the draft take the `differentiation_angle` from the outline?
2. Does it introduce data, a framework, or a perspective NOT found in any competitor piece?
3. Does it avoid simply restating what the top 3 competitor pieces already say?

Scoring breakpoints:
- 90–100: Clear unique angle, original data or framework, fully differentiated
- 75–89: Differentiated angle present, minor overlap with one competitor piece
- 50–74: Partially differentiated — covers some unique ground but repeats common narrative
- Below 50: Same angle as ≥2 competitor pieces, no original data or framework added

### Dimension C — SEO compliance (0–100)

**Auto-score 100 if `content-brief.json.is_web_content == false`. Skip all checks below.**

For web content:
1. Primary keyword in H1 title? (+25 points)
2. Primary keyword in first 100 words? (+25 points)
3. Primary keyword in ≥2 H2 headings? (+20 points)
4. Meta description written and 150–160 characters? (+15 points)
5. At least 3 of 5 LSI keywords used naturally in body? (+15 points)

Score = sum of points earned above.

### Dimension D — Audience fit (0–100)

Questions to answer:
1. Does the tone match `content-brief.json.tone`? (e.g. no casual slang in a "professional" piece)
2. Is the complexity appropriate for `audience.knowledge_level`?
   - Beginner: no unexplained acronyms, concepts introduced before used
   - Intermediate: assumes domain familiarity, avoids over-explaining basics
   - Expert: peer-to-peer register, technical precision valued
3. Does the content address what `audience.cares_about` from the brief?
4. Does the `goal` of the content align with how the content ends?
   - `inform` → reader leaves knowing something concrete
   - `persuade` → reader is presented with a clear argument and counter-arguments addressed
   - `convert` → strong CTA with urgency or social proof
   - `entertain` → piece is enjoyable, not just informative

Scoring breakpoints:
- 90–100: All four alignment checks pass
- 75–89: Three of four pass; one minor tone or complexity mismatch
- 50–74: Tone or complexity clearly wrong for audience; goal-CTA mismatch
- Below 50: Content written for wrong audience entirely, OR goal completely absent from structure

---

## Overall score and pass/fail

```
overall = average(clarity, originality, seo_compliance, audience_fit)
```

**Hard block rule:** If ANY single dimension scores below 40, the draft fails regardless of overall average.

**Pass threshold:** overall ≥ 75 AND no dimension below 40.

---

## Output: `plan/state/content-critique.json`

```json
{
  "scores": {
    "clarity": 0,
    "originality": 0,
    "seo": 0,
    "audience_fit": 0,
    "overall": 0
  },
  "feedback": [
    {
      "dimension": "clarity | originality | seo | audience_fit",
      "score": 0,
      "notes": [],
      "cited_sections": []
    }
  ],
  "hard_block_dimension": null,
  "passed": false,
  "critique_version": 1
}
```

`feedback[].notes[]` — array of specific, actionable improvement notes.
`feedback[].cited_sections[]` — array of section headings or line ranges that need revision.
`hard_block_dimension` — name of dimension that scored below 40 (or null if none).
`passed` — true if overall ≥75 AND no dimension below 40.

---

## Routing decision

After writing `content-critique.json`:

- **If `passed == true`:** Mark `critique` card `status:"done"`, `detail:"Score: {overall}/100 — passed"`. Proceed to `phase-publish-ready.md`.
- **If `passed == false`:** Mark `critique` card `status:"done"`, `detail:"Score: {overall}/100 — revision required"`. Proceed to `phase-refine.md`.

Update `progress.step` to `{i:4, n:6, label:"critique-complete"}`.
