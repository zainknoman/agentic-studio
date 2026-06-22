# Sub-mode: EMAIL

**Dashboard card:** `email`
**Target time:** < 30 seconds
**Max agents:** 1 (DRAFT path only; TRIAGE is orchestrator-direct)
**Input:** `plan/state/daily-parse.json` → `context.operation`, `context.recipient`, `context.topic`, `context.outcome`, `context.tone`, `context.thread`

---

## Purpose

Either draft polished email variants for the user to pick from, or triage a list of emails into action buckets.

---

## Operation Detection

Check `context.operation` from parse state:
- If `DRAFT` → run Draft path below.
- If `TRIAGE` → run Triage path below.
- If ambiguous: if user pasted email subjects/senders or said "triage" → TRIAGE. If user described what they want to say → DRAFT.

---

## Path A: DRAFT

Spawn 1 agent with the full email context (recipient, topic, desired outcome, tone, any thread pasted).

Agent writes 3 variants to `plan/docs/daily-email-drafts.md`:

### Variant 1 — Formal
Professional, complete sentences, clear structure, appropriate for executive/external communication. Under 200 words unless user specified longer.

### Variant 2 — Direct
Gets to the point in the first sentence. No pleasantries beyond a brief opener. Under 150 words.

### Variant 3 — Brief
3–5 sentences maximum. Mobile-friendly. Ideal when speed of reply matters more than depth.

Each variant includes: Subject line, Body, Suggested send time (if context implies urgency).

Output → `plan/docs/daily-email-drafts.md`

---

## Path B: TRIAGE

Orchestrator handles directly — no agent spawn.

Read the list of emails from the user message (subjects, senders, any snippets provided).

Write `plan/docs/daily-email-triage.md` with:

### Priority Buckets

**Respond Today** — Time-sensitive, requires your direct action, sender is important.

**Respond This Week** — Important but not urgent; can batch.

**FYI** — Informational only; read but no reply needed.

**Archive** — Newsletters, notifications, low-value. Can delete/archive without reading.

### Suggested Reply Starters (top 3 "Respond Today" items)

For each: 1–2 sentence opener the user can paste and complete.

Example format:
```
[Email from: <sender> re: <subject>]
Reply starter: "Thanks for reaching out about [X]. I can [action] by [date] — ..."
```

Output → `plan/docs/daily-email-triage.md`

---

## Steps (both paths)

1. Detect operation type.
2. Execute appropriate path.
3. Print output path:

```
Email output ready → plan/docs/daily-email-drafts.md
```
or
```
Email triage ready → plan/docs/daily-email-triage.md
```

---

## Done Condition

Output file written and path printed. Card status → `complete`.
