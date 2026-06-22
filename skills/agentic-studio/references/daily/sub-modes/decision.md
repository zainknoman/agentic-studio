# Sub-mode: DECISION

**Dashboard card:** `decision`
**Target time:** < 45 seconds
**Max agents:** 0 (orchestrator handles directly)
**Input:** `plan/state/daily-parse.json` → `context.decision`, `context.options`, `context.criteria`, `context.time_constraint`

---

## Purpose

Produce a structured decision document with scored options, a risk register, and a clear recommendation.

---

## Steps

### 1. Extract decision components

From parse context:
- **Decision statement:** The core choice to be made. Rewrite as: "We need to decide: [X]."
- **Options:** If listed by user, use them. If not listed: generate 3 sensible options based on the decision. Label as Option A, B, C.
- **Criteria:** If mentioned, use them. If not: default to **Impact / Effort / Reversibility**.
- **Time constraint:** If mentioned, include in recommendation section.

---

### 2. Score each option

For each option:
- Evaluate against each criterion (score 1–10 per criterion, higher = better).
- Compute overall score: average of criterion scores (or weighted if user specified weights).
- Assign scores based on reasoning from the decision context — do not leave blank.

Scoring defaults:
- **Impact:** How much does this move the needle? (1 = minimal, 10 = transformative)
- **Effort:** How hard is it? Invert scale — 10 = low effort, 1 = very high effort.
- **Reversibility:** How easy is it to undo? (10 = fully reversible, 1 = permanent)

---

### 3. Write decision document

Write `plan/docs/daily-decision.md` using the template at `references/daily/output-templates/decision-matrix.md`.

Populate:

**Decision statement** — One sentence per step 1.

**Context** — 1 paragraph: what prompted this decision, deadline if applicable.

**Options comparison table** — Option | Description | Key pros (2–3 bullets) | Key cons (2–3 bullets) | Score /10

**Criteria used** — List criteria and explain weighting if non-default.

**Risk register** — Top 2 risks per option: Option | Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation.

**Recommendation** — State a clear winner if scores diverge by ≥ 2 points. If scores are close: state "Too close to call on [criteria X] — the deciding factor is [Y]." Never leave this section blank.

**Next action** — One sentence: "By [date or 'end of week'], [who] will [specific action]."

---

### 4. Print output path

```
Decision framework ready → plan/docs/daily-decision.md
```

---

## Done Condition

`plan/docs/daily-decision.md` written and path printed. Card status → `complete`.
