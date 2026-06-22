# CONTENT — Phase SC1: BRIEF

Load this file when the orchestrator enters CONTENT mode. BRIEF is always the first phase.
It runs as a dashboard-primary interview (rule 12 of the main skill) and produces
`plan/state/content-brief.json` which all downstream phases read.

---

## Purpose

Extract the seven parameters that define every downstream content decision:
1. **Type** — which content format to produce
2. **Audience** — who reads it, their role and knowledge level
3. **Goal** — what the content must achieve for the reader and the business
4. **Tone** — the voice register to write in
5. **Length** — word count or slide count target
6. **Key messages** — the non-negotiable points the content must land
7. **SEO keyword** — the target search term (web content only)

Vague answers here produce vague content. Push for specifics on every field before proceeding.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "brief",
  "role": "content",
  "label": "Content Brief",
  "status": "working",
  "detail": "Interviewing — extracting content type, audience, goal, tone, length, key messages"
}
```

Update `strategy` in `agents.json`:
```json
{ "name": "Content Production", "how": "BRIEF → OUTLINE (parallel) → DRAFT → CRITIQUE → REFINE → PUBLISH-READY" }
```

---

## Interview flow (dashboard-first, rule 12)

Run each question as a dashboard prompt (`prompt` object → `wait-answer.mjs` → CLI fallback).
One question at a time. Reflect answers back before the next question.

### Q1 — Content type
```
prompt.id:       "brief-type"
prompt.title:    "Content Type"
prompt.question: "What type of content should I produce?"
prompt.options:  [
  "Blog post",
  "Newsletter",
  "LinkedIn post",
  "Twitter thread",
  "Landing page copy",
  "Email campaign",
  "Pitch deck",
  "Case study",
  "Whitepaper",
  "Press release",
  "Product announcement"
]
```
Record: `type` — the selected option (lowercase, hyphen-separated, e.g. `"blog-post"`)

**SEO gate:** If `type` is one of `blog-post | landing-page-copy | whitepaper | case-study`,
set `is_web_content: true`. Otherwise `is_web_content: false`.
Non-web types skip SEO agent and SEO scoring (auto-score = 100).

### Q2 — Audience
```
prompt.id:       "brief-audience"
prompt.title:    "Target Audience"
prompt.question: "Who reads this content? Please describe:
                  - Role or title (e.g. 'VP of Marketing', 'early-stage founder', 'software developer')
                  - Knowledge level (beginner / intermediate / expert)
                  - What they most care about right now"
prompt.options:  []  // free-text
```
Record: `audience.role`, `audience.knowledge_level`, `audience.cares_about`

### Q3 — Goal
```
prompt.id:       "brief-goal"
prompt.title:    "Content Goal"
prompt.question: "What must this content achieve?"
prompt.options:  [
  "Inform — educate the audience on a topic",
  "Persuade — shift their opinion or belief",
  "Convert — drive a sign-up, purchase, or booking",
  "Entertain — engage and build affinity",
  "SEO traffic — rank for a keyword and drive organic visits"
]
```
Record: `goal` — selected option value (e.g. `"inform"`)

### Q4 — Tone
```
prompt.id:       "brief-tone"
prompt.title:    "Tone of Voice"
prompt.question: "What tone should this content use?"
prompt.options:  [
  "Professional — authoritative, formal, polished",
  "Casual — conversational, warm, approachable",
  "Technical — precise, jargon-accepted, expert-to-expert",
  "Inspirational — motivating, vision-forward, emotionally resonant",
  "Urgent — time-sensitive, action-forcing, direct"
]
```
Record: `tone` — one of `professional | casual | technical | inspirational | urgent`

### Q5 — Length
```
prompt.id:       "brief-length"
prompt.title:    "Length Target"
prompt.question: "How long should this content be?"
prompt.options:  [
  "Short — under 500 words",
  "Medium — 500 to 1,500 words",
  "Long — 1,500+ words",
  "Slide count — specify number of slides (for pitch decks)"
]
```
If "Slide count" selected: follow up with a free-text prompt to capture the target slide count.
Record: `length.range` — one of `short | medium | long | slides`
Record: `length.target` — numeric target if slides, otherwise derive from range midpoint for planning.

### Q6 — Key messages
```
prompt.id:       "brief-messages"
prompt.title:    "Key Messages"
prompt.question: "What are the up to 3 points this content MUST communicate?
                  List them as bullet points. These will appear verbatim in the final draft."
prompt.options:  []  // free-text, bullet list
```
Record: `key_messages[]` — array of up to 3 strings. Minimum 1 required.

### Q7 — SEO keyword (conditional)
```
// Only ask if is_web_content == true
prompt.id:       "brief-seo-keyword"
prompt.title:    "SEO Keyword"
prompt.question: "What is the primary keyword or phrase you want this content to rank for?
                  (e.g. 'best project management tools for startups')
                  — or type 'skip' to let the SEO agent suggest one."
prompt.options:  ["Skip — let the SEO agent suggest a keyword"]
```
If `is_web_content == false`: skip this question entirely, set `seo_keyword: null`.
Record: `seo_keyword` — string or `null`

---

## Output: `plan/state/content-brief.json`

Write this file on completion. All downstream phases read it.

```json
{
  "type": "blog-post",
  "is_web_content": true,
  "audience": {
    "role": "",
    "knowledge_level": "intermediate",
    "cares_about": ""
  },
  "goal": "inform",
  "tone": "professional",
  "length": {
    "range": "medium",
    "target": 1000
  },
  "key_messages": [],
  "seo_keyword": null,
  "briefed_at": ""
}
```

---

## Done condition

Mark `brief` card `status:"done"` when:
- `type` is set
- `audience.role` is non-empty
- `goal` is set
- `tone` is set
- `length.range` is set
- `key_messages[]` has ≥1 entry

Then proceed to `phase-outline.md`.
