# STRATEGY — Phase SI1: IDEATE

Load this file when the orchestrator enters STRATEGY mode. IDEATE is always the first phase.
It runs as a dashboard-primary interview (rule 12 of the main skill) and produces
`plan/state/strategy-idea.json` which all downstream phases read.

---

## Purpose

Extract a structured product idea from free-form user input by asking four targeted questions:
1. **Idea** — what the product does and who uses it
2. **Problem** — the pain that exists without the product
3. **Target user** — role, context, willingness to pay
4. **Success metric** — what "working" looks like in 90 days

A vague IDEATE produces a vague strategy. Push for specifics on every point before
proceeding to VALIDATE.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "ideate",
  "role": "strategy",
  "label": "Product Ideation",
  "status": "working",
  "detail": "Interviewing — capturing idea, problem, user, and success metric"
}
```

Update `strategy` in `agents.json`:
```json
{
  "name": "Product Strategy",
  "how": "IDEATE → VALIDATE → DEFINE → GTM → HANDOFF"
}
```

---

## Interview flow (dashboard-first, rule 12)

Run each question as a dashboard prompt (`prompt` object written to `agents.json` →
`wait-answer.mjs` → CLI fallback). One question at a time.
Reflect answers back before moving to the next question.

### Q1 — Product idea
```
prompt.id:       "ideate-idea"
prompt.title:    "Product Idea"
prompt.question: "What does this product do, and who uses it?
                  Give me one or two sentences — enough to picture it."
prompt.options:  []   // free-text — omit options for open input
```
Record: `idea` (string, the user's raw description)

### Q2 — Core problem
```
prompt.id:       "ideate-problem"
prompt.title:    "Core Problem"
prompt.question: "What pain or problem exists without this product?
                  What does the user have to do today instead, and why is that frustrating?"
prompt.options:  []
```
Record: `problem` (string, the pain the product solves)

### Q3 — Target user
```
prompt.id:       "ideate-user"
prompt.title:    "Target User"
prompt.question: "Who is the target user?
                  Include:
                  - Role or title (e.g. 'solo founder', 'enterprise procurement manager')
                  - Context in which they encounter the problem
                  - Whether they are likely to pay for a solution (and roughly how much)"
prompt.options:  []
```
Record: `target_user` (string, structured description of role / context / WTP)

### Q4 — Success metric
```
prompt.id:       "ideate-success"
prompt.title:    "Success Metric"
prompt.question: "What does 'working' look like in 90 days?
                  Give me one clear, measurable signal — e.g. '500 paying users',
                  '$10 k MRR', '1 000 waitlist sign-ups', '3 enterprise pilots signed'."
prompt.options:  []
```
Record: `success_metric` (string, the 90-day definition of success)

---

## Bring-your-own-idea gate

Before Q1, check `plan/docs/` for an existing idea document (`.pdf`, `.md`, `.txt`):

> "I see `plan/docs/`. If you have an existing idea brief or one-pager, drop it in there now.
>  Have you added one? (Yes / No)"

- **Yes + file present** → read the file, pre-populate fields from it, summarise for user
  confirmation, then skip questions whose answers are clearly covered.
- **Yes + no file** → fall through to full interview.
- **No** → full interview (Q1–Q4).

---

## Output: `plan/state/strategy-idea.json`

Write this file on completion. All downstream strategy phases read it.

```json
{
  "idea": "",
  "problem": "",
  "target_user": "",
  "success_metric": "",
  "ideated_at": ""
}
```

---

## Done condition

Mark `ideate` card `status:"done"` when:
- All four fields in `strategy-idea.json` are non-empty strings
- `ideated_at` is set to the current ISO timestamp

Then proceed to `phase-validate.md`.
