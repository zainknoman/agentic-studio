# Sub-mode: REVIEW

**Dashboard card:** `review`
**Target time:** < 20 seconds (excluding user input wait)
**Max agents:** 0 (orchestrator handles directly)
**Input:** `plan/state/daily-parse.json` → `context.week`, `context.okrs`, `context.wins`, `context.blockers`

---

## Purpose

Generate a structured weekly or OKR review document the user can reflect on and act from.

---

## Steps

### 1. Check for OKR/goal data

If `context.okrs` or `context.wins` is non-empty in parse state: proceed immediately to step 3.

If goals/OKRs are not in the message: prompt the user once via dashboard:

```
Paste your OKRs or last week's goals (or press Enter to use a generic template):
```

Wait up to 60 seconds. If no response, proceed with generic template placeholders.

---

### 2. Accept or default input

If user pastes goals: capture them as the OKR set.
If no response after 60s: use generic placeholders (`[KR 1]`, `[KR 2]`, etc.) and note "Fill in your actual KRs" in the document.

---

### 3. Write review document

Write `plan/docs/daily-review.md` using the template at `references/daily/output-templates/weekly-review.md`.

Populate each section:

**Wins this week** — Pull from `context.wins` if available. Otherwise leave bullets with prompt: "What went well? Even small things count."

**What didn't go as planned** — Pull from `context.blockers`. Frame as specific observations, not self-criticism. Include a one-line root cause per item.

**OKR progress table** — One row per KR with: KR description | Start | Current | Target | Status (on-track / at-risk / blocked). Derive status from context if possible; otherwise leave as `[assess]`.

**Energy and focus** — Rate 1–5 each: Deep focus time available / Energy level / Interruption level. Pull from message context or leave as `[rate]`.

**Next week's top 3 priorities** — Numbered. Each includes a "why it matters" clause. Infer from blockers and OKR status if not explicit.

**One process improvement** — "Next week I will change X to Y because Z." Infer from blockers if possible.

**Shoutouts or gratitude** — Optional field. Leave blank if not mentioned by user.

---

### 4. Print output path

```
Weekly review ready → plan/docs/daily-review.md
```

---

## Done Condition

`plan/docs/daily-review.md` written and path printed. Card status → `complete`.
