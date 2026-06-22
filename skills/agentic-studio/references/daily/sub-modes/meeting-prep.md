# Sub-mode: MEETING_PREP

**Dashboard card:** `meeting-prep`
**Target time:** < 60 seconds
**Max agents:** 2 (spawned simultaneously in ONE message)
**Input:** `plan/state/daily-parse.json` → `context.attendees`, `context.topic`, `context.goal`, `context.duration`

---

## Purpose

Prepare the user for an upcoming meeting: attendee research + a tight agenda, assembled into one ready-to-use document.

---

## Steps

### 1. Spawn 2 agents simultaneously (ONE message)

**Agent A — context-agent**

Task: Research each attendee named in the parse context.
- Search for: LinkedIn profile/bio, company role, recent news about their company, any shared context mentioned by user.
- For each attendee, compile: name, role, company, recent_news (1–2 bullets), talking_points (2–3 suggested openers).
- Output → `plan/state/daily-attendees.json`:

```json
{
  "attendees": [
    {
      "name": "<name>",
      "role": "<role>",
      "company": "<company>",
      "recent_news": ["<item>"],
      "talking_points": ["<point>"]
    }
  ]
}
```

**Agent B — agenda-agent**

Task: Draft a meeting agenda using the template at `references/daily/output-templates/agenda.md`.
- Meeting objective: 1 clear sentence stating the decision or outcome needed.
- Agenda items: 4–6 items with time allocations that sum to ≤ meeting duration (default 60 min if not specified).
- Pre-read: 2–3 items if topic warrants background material.
- Desired outcome: 1 sentence.
- Output → `plan/state/daily-agenda-draft.json`:

```json
{
  "objective": "<sentence>",
  "agenda_items": [
    { "item": "<title>", "owner": "<name>", "time_min": 10, "type": "discussion|info|decision" }
  ],
  "pre_read": ["<item>"],
  "desired_outcome": "<sentence>"
}
```

---

### 2. Orchestrator assembles final document

After both agents complete, write `plan/docs/daily-meeting-prep.md` with:

1. **Attendee Context Table** — Name | Role | Company | Key Talking Point (from daily-attendees.json)
2. **Agenda** — rendered from agenda template with all fields filled
3. **5 Suggested Talking Points** — synthesized from attendee research + meeting topic
4. **3 Questions to Ask** — open-ended questions that move the meeting toward the desired outcome
5. **Potential Objections + Responses** — anticipate 2–3 likely pushbacks and brief counters

---

### 3. Print output path

```
Meeting prep ready → plan/docs/daily-meeting-prep.md
```

---

## Done Condition

`plan/docs/daily-meeting-prep.md` written and path printed. Card status → `complete`.
