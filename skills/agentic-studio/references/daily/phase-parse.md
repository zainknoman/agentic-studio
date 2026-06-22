# Stage SD1: Parse — DAILY Mode Entry Point

**Dashboard card:** `parse`
**Runs as:** Orchestrator (no subagent spawn)
**Target time:** < 5 seconds
**Strategy:** `{ "name": "Daily Productivity", "how": "PARSE → EXECUTE (1–2 agents) → DELIVER" }`

---

## Purpose

Classify the user's DAILY request into one of 5 sub-modes, extract all relevant context, write state, and immediately route. Do NOT ask for clarification unless the input is completely ambiguous (e.g. bare word "meeting" with zero context).

---

## Classification Rules

Match the first trigger that fires. Triggers are case-insensitive substring matches against the full user message.

| Sub-mode | Triggers |
|---|---|
| `MEETING_PREP` | "meeting prep", "prepare for", "meeting with", "before my call with", "1:1 with", "agenda for" |
| `EMAIL` | "draft email", "reply to", "triage my email", "follow-up email", "email about", "email to" |
| `REVIEW` | "weekly review", "OKR check-in", "retrospective", "what did I accomplish", "week in review" |
| `DECISION` | "decision framework", "pros and cons", "should I", "help me decide", "compare options", "make a decision" |
| `SOP` | "standard operating procedure", "SOP", "step-by-step process for", "how do we", "document this process", "create a runbook" |

If no trigger matches and the request is clearly productivity-adjacent (but ambiguous sub-mode), apply heuristics: names + time = MEETING_PREP, email subjects = EMAIL, "week / goals / OKRs" = REVIEW, choices/tradeoffs = DECISION, process/workflow = SOP.

---

## Context Extraction per Sub-mode

### MEETING_PREP
Extract: attendee names, meeting topic, meeting goal, meeting duration, scheduled time, any prior relationship context the user mentioned.

### EMAIL
Extract: operation type (DRAFT vs TRIAGE), recipient name/role, email topic, desired outcome, tone preference, any existing email thread pasted.

### REVIEW
Extract: week identifier (e.g. "this week", specific dates), any OKRs or goals already stated in message, wins or blockers mentioned.

### DECISION
Extract: decision statement, options listed (may be empty), criteria mentioned, time constraint, stakes/reversibility.

### SOP
Extract: process name, trigger condition, actors/roles, tools/systems mentioned, any steps already described by user.

---

## Steps

1. Read the full user message.
2. Apply classification rules above — assign `sub_mode`.
3. Extract context fields for the matched sub-mode.
4. Write `plan/state/daily-parse.json`:

```json
{
  "sub_mode": "MEETING_PREP | EMAIL | REVIEW | DECISION | SOP",
  "context": {},
  "parsed_at": "<ISO timestamp>"
}
```

5. Immediately route to the sub-mode file:
   - MEETING_PREP → `references/daily/sub-modes/meeting-prep.md`
   - EMAIL → `references/daily/sub-modes/email.md`
   - REVIEW → `references/daily/sub-modes/review.md`
   - DECISION → `references/daily/sub-modes/decision.md`
   - SOP → `references/daily/sub-modes/sop.md`

---

## Done Condition

`plan/state/daily-parse.json` written AND routing to sub-mode file initiated. Card status → `complete`.
