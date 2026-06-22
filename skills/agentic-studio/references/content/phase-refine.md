# CONTENT — Phase SC5: REFINE

Load this file only if `plan/state/content-critique.json.passed == false`.
REFINE is a targeted revision loop. It does NOT rewrite the whole draft — it surgically
fixes only the sections that caused failing scores.

Maximum 3 refinement loops. After each loop, critique logic re-runs to check the new score.

---

## Purpose

Bring the draft from a failing score to ≥75 overall with no dimension below 40,
through targeted revision rather than a full rewrite. Targeted edits preserve:
- Sections that already scored well (do not regress them)
- The author's voice and structural intent
- Supporting data and citations

---

## Dashboard card

Add card (or update existing) in `agents.json`:
```json
{
  "id": "refine",
  "role": "content",
  "label": "Content Refinement",
  "status": "working",
  "detail": "Revision 1/3 — targeting failing dimensions"
}
```

Update `detail` on each subsequent loop:
```json
{ "detail": "Revision {n}/3 — score was {prev_score}/100, targeting {failing_dimensions}" }
```

---

## Algorithm

### Step 1 — Identify failing sections

Read `plan/state/content-critique.json`:
1. List dimensions with score < 75 (or the single dimension below 40 that triggered the hard block).
2. For each failing dimension: collect all `cited_sections[]` from that dimension's feedback entry.
3. Build a revision target list: the minimum set of sections to rewrite to move the score above threshold.

Do NOT rewrite sections that scored 80+. Preserve them exactly.

### Step 2 — Spawn refine-agent

Spawn ONE refine-agent with:

**Inputs handed to agent:**
- `plan/docs/content-draft.md` — current draft
- `plan/state/content-critique.json` — scores and feedback
- `plan/state/content-brief.json` — original constraints (tone, audience, key messages)

**Agent instructions:**
```
You are a content revision specialist. Your job is surgical improvement — not a full rewrite.

Read the current draft and the critique feedback carefully.

Failing dimensions: {list from critique}
Sections to revise: {cited_sections from those dimensions}

Rules:
1. Rewrite ONLY the sections listed in "Sections to revise".
2. Keep ALL other sections exactly as written.
3. For each failing dimension, apply the specific remedies below.
4. Do not introduce new facts or stats that are not in content-research.json.
5. Maintain the tone: {content-brief.tone}.
6. Overwrite plan/docs/content-draft.md with the revised draft when done.
```

**Remedies by dimension:**

| Dimension failing | Required remedies |
|---|---|
| Clarity | Rewrite the opening 50 words to lead with the main message. Add transition sentences between sections. Define any jargon on first use. Sharpen the CTA to a single imperative. |
| Originality | Replace any section that mirrors competitor content with the differentiation_angle from content-outline.json. Add at least one insight not found in any competitor piece. |
| SEO (web only) | Insert primary keyword into H1 and first paragraph. Add keyword to 2 H2 headings. Write meta description (150–160 chars) at top of file. Weave in missing LSI keywords naturally. |
| Audience fit | Adjust register to match {tone}. Add/remove explanatory sentences based on {knowledge_level}. Ensure closing section drives the {goal} outcome. |

**Agent output:** Overwrite `plan/docs/content-draft.md`. Increment `draft_version` in frontmatter by 1.

### Step 3 — Re-run critique logic

After the refine-agent completes:
1. Re-apply the full critique scoring logic from `phase-critique.md` to the new draft.
2. Write updated `plan/state/content-critique.json` with `critique_version` incremented.
3. Update the refine card `detail` with new score.

### Step 4 — Loop control

```
if overall >= 75 AND no dimension below 40:
    → passed; mark refine card status:"done"; proceed to phase-publish-ready.md

if loop_count < 3:
    → loop_count++; return to Step 1 with new critique

if loop_count == 3 AND still failing:
    → BLOCKED path (see below)
```

---

## BLOCKED path (score < 75 after 3 loops)

If the draft has not passed after 3 refinement loops:

1. Update the dashboard card:
```json
{
  "id": "refine",
  "status": "blocked",
  "detail": "Score: {final_score}/100 after 3 revisions — proceeding with current draft"
}
```

2. Print this message to the user:
```
Score: {final_score}/100 after 3 revisions.

The draft did not reach the 75-point quality threshold. Proceeding with the current
draft — you may want to review and edit plan/docs/content-draft.md manually before
publishing. The critique notes are in plan/state/content-critique.json.
```

3. Proceed to `phase-publish-ready.md` anyway.
   Final output assembly runs regardless of score.

---

## Done condition

Mark `refine` card `status:"done"` when:
- `passed == true` in `content-critique.json`, OR
- 3 loops completed (BLOCKED path above)

Update `progress.step` to `{i:5, n:6, label:"refine-complete"}`.
Proceed to `phase-publish-ready.md`.
