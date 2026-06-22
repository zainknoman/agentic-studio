# MARKETING — Phase 5: REVIEW

Load this file after BRIEF completes and all 5 deliverable files are written.
REVIEW is a quality gate — it scores the brief package and blocks delivery if quality is below threshold.

---

## Purpose

Ensure every deliverable meets a minimum completeness standard before handing off to the user.
Incomplete briefs lead to poor campaigns. Score each deliverable on 10 dimensions (10 points each = 100 max).
A score ≥ 80 is required to pass. Below 80 = flag missing sections and regenerate.

---

## Dashboard card

```json
{
  "id": "review",
  "role": "review",
  "label": "Brief Quality Review",
  "status": "working",
  "detail": "Scoring 5 deliverables against completeness checklist — threshold: 80/100"
}
```

---

## Completeness scoring rubric

Score each of the 10 dimensions 0 (missing) · 5 (partial) · 10 (complete):

| # | Dimension | What to check |
|---|---|---|
| 1 | **Brand clarity** | Positioning statement has a named target customer, problem, category, and differentiator |
| 2 | **Audience specificity** | Deliverables reference a specific demographic + psychographic profile, not generic |
| 3 | **Competitor coverage** | Competitive matrix has ≥2 complete competitor profiles with pricing and positioning |
| 4 | **Differentiation** | At least 1 unique claim is owned (not matched by all competitors) |
| 5 | **Goal alignment** | Campaign brief KPIs are specific, measurable, and match `goal.type` from DISCOVER |
| 6 | **Content depth** | Content calendar has ≥4 weeks × 5 items = 20 content slots filled with titles + key messages |
| 7 | **Channel specificity** | Channels named in the content calendar match `audience.channels` from DISCOVER |
| 8 | **SEO/AEO coverage** | ≥4 keyword clusters with at least 3 long-tail keywords and 1 AEO question each |
| 9 | **Proof points** | Positioning statement has ≥2 specific, verifiable proof points |
| 10 | **Actionability** | Campaign brief includes a media channel recommendation and a campaign timeline |

---

## Scoring algorithm

```
total_score = sum of all 10 dimension scores  (max: 100)

for each dimension:
  if fully present and specific   → 10
  if present but vague/incomplete → 5
  if missing entirely             → 0
```

Write `plan/state/brief-review.json`:
```json
{
  "total_score": 0,
  "passed": false,
  "threshold": 80,
  "dimensions": [
    { "id": "brand_clarity",      "score": 0, "note": "" },
    { "id": "audience_specificity","score": 0, "note": "" },
    { "id": "competitor_coverage", "score": 0, "note": "" },
    { "id": "differentiation",     "score": 0, "note": "" },
    { "id": "goal_alignment",      "score": 0, "note": "" },
    { "id": "content_depth",       "score": 0, "note": "" },
    { "id": "channel_specificity", "score": 0, "note": "" },
    { "id": "seo_aeo_coverage",    "score": 0, "note": "" },
    { "id": "proof_points",        "score": 0, "note": "" },
    { "id": "actionability",       "score": 0, "note": "" }
  ],
  "missing_sections": [],
  "reviewed_at": ""
}
```

---

## Pass path (score ≥ 80)

1. Set `passed: true` in `brief-review.json`.
2. Update review card `status:"done"`, `note:"Score {X}/100 — PASSED"`.
3. Write `plan/state/framework-state.json` with `"marketing_complete": true`.
4. Print the delivery summary (see below).

---

## Fail path (score < 80)

1. Set `passed: false` in `brief-review.json`.
2. Populate `missing_sections[]` with the names of every dimension that scored < 10,
   plus a one-line description of what's missing.
3. Update review card `status:"blocked"`, `note:"Score {X}/100 — BELOW THRESHOLD"`.
4. Write a dashboard `prompt` to inform the user and offer options:

```json
{
  "id": "review-fail",
  "title": "Brief quality below threshold",
  "question": "Score: {X}/100 (threshold: 80). Missing sections:\n{list}.\nHow should we proceed?",
  "options": [
    "Auto-fix — regenerate missing sections",
    "Accept anyway — deliver as-is",
    "Abort"
  ]
}
```

Block on `wait-answer.mjs review-fail 600` (CLI fallback: `AskUserQuestion`).

**If "Auto-fix"**: return to BRIEF phase for only the failing dimensions. Re-run their specific
sections. Re-score after regeneration. Maximum 2 fix attempts; after that, deliver with a warning.

**If "Accept anyway"**: set `passed: true`, note `"accepted_below_threshold": true`, proceed.

**If "Abort"**: set framework-state `"aborted": true`, stop.

---

## Delivery summary (on pass)

Print to CLI:
```
─────────────────────────────────────────────
  Marketing Research Complete  ✓ {score}/100
─────────────────────────────────────────────
  Deliverables in plan/docs/:
  • competitive-analysis.md  — Competitive landscape + strategic recommendations
  • positioning.md           — Positioning statement + taglines + elevator pitch
  • campaign-brief.md        — Campaign brief with KPIs + channel mix
  • content-calendar.md      — 4-week content plan (20 items)
  • keyword-clusters.md      — SEO/AEO clusters with AI citation guidance
─────────────────────────────────────────────
```

Also update the `brief` agent card `note` with the score and a one-line summary.

---

## Done condition

REVIEW is complete (pass or accepted) when `framework-state.marketing_complete` is `true`.
Mark `review` card `status:"done"`.
The MARKETING session ends here — no further phases.
