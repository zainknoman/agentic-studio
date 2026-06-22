# Sub-mode: SOP

**Dashboard card:** `sop`
**Target time:** < 60 seconds
**Max agents:** 0 (orchestrator handles directly)
**Input:** `plan/state/daily-parse.json` → `context.process_name`, `context.trigger`, `context.actors`, `context.tools`, `context.steps_described`

---

## Purpose

Document a business process as a clean, immediately usable Standard Operating Procedure.

---

## Steps

### 1. Extract process components

From parse context:
- **Process name:** Derive from user's description if not explicit. Make it a noun phrase: "[Verb]-[Object] Process" (e.g. "New Client Onboarding Process").
- **Trigger:** When/why does this process start? (e.g. "When a new contract is signed", "Every Monday morning").
- **Actors:** Who performs or is involved? If multiple: identify primary actor (Responsible) and others.
- **Tools/systems:** Any software, docs, or platforms mentioned.
- **Steps already described:** Any sequence the user provided — preserve their order and language, then expand.

---

### 2. Determine granularity

- **High-level description** (vague, few steps): Expand each step into 2–3 sub-steps. Add expected output and decision points.
- **Detailed description** (many micro-steps): Group into logical phases (e.g. Phase 1: Preparation, Phase 2: Execution, Phase 3: Verification).
- **Moderate:** Use as-is with light enrichment.

---

### 3. Write SOP document

Write `plan/docs/daily-sop.md` using the template at `references/daily/output-templates/sop.md`.

Populate:

**Header:** Process name, Version 1.0, today's date, owner (from actors if determinable).

**Purpose:** One sentence — what this process accomplishes and why it matters.

**Scope:** Who this applies to; what's in scope and out of scope.

**Trigger:** Specific condition that initiates this process.

**Roles and responsibilities (RACI table):** If 1 actor: simple "Owner: [name]" list. If multiple: RACI table with Role | R | A | C | I.

**Process steps:** Numbered. Each step:
```
Step N: [Title]
- Actor: [who does this]
- Action: [what they do]
- Expected output: [what "done" looks like]
- Decision point: [if X then Y, else Z] (omit if N/A)
- If this fails: [fallback action]
```

**Quality checks:** How to verify the process completed correctly. 2–3 checkpoints.

**Related processes:** List any upstream/downstream SOPs if mentioned or inferable.

**Change log:** Empty table with columns: Date | Version | Change | Author.

---

### 4. Print output path

```
SOP ready → plan/docs/daily-sop.md
```

---

## Done Condition

`plan/docs/daily-sop.md` written and path printed. Card status → `complete`.
