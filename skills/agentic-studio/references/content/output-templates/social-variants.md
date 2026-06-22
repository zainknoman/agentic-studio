# Social Variants Template

This template is rendered by the PUBLISH-READY phase into `plan/docs/content-social.md`.
Replace all `{PLACEHOLDER}` tokens with real content derived from the final draft.
Remove this header comment block before writing the final file.

Character and word limits are hard — enforce them. Every variant must be fully written, not a prompt.

---

```markdown
# Social Media Variants: {CONTENT_TITLE}

Source: plan/docs/content-final.md
Generated: {DATE_ISO_8601}

---

## Twitter / X Variants

*Limit: 280 characters per tweet. No URLs included — add tracking links manually before posting.*

---

### Variant 1 — Hook Tweet (stat or bold claim)

{HOOK_TWEET}

*Pattern: Open with a surprising number or counterintuitive claim from the content.
Attribute the stat inline. End with an implied question or tease.
Example: "83% of {audience} do {X} wrong — and most don't know it. Thread below 🧵"*

Character count: {HOOK_TWEET_CHAR_COUNT} / 280

---

### Variant 2 — Thread-Starter Tweet (numbered list)

{THREAD_TWEET}

*Pattern: Numbered list format. State the count upfront. Each item is a short fragment
that teases — not reveals — a section of the full piece.
Example: "5 things about {topic} most people get wrong:
1. {Fragment A}
2. {Fragment B}
3. {Fragment C}
4. {Fragment D}
5. {Fragment E}
(Full breakdown: link)"*

Character count: {THREAD_TWEET_CHAR_COUNT} / 280

---

### Variant 3 — Conversational Tweet (question or hot take)

{CONVERSATIONAL_TWEET}

*Pattern: Poses a question or a hot take that invites disagreement or agreement.
Does not require the user to click anything to engage — the tweet IS the value.
Example: "Unpopular opinion: {Topic} isn't actually about {common belief}. It's about {reframe}."
or: "What's your take — is {X} or {Y} more important for {audience role}?"*

Character count: {CONVERSATIONAL_TWEET_CHAR_COUNT} / 280

---

## LinkedIn Post

*Limit: 150–200 words. Do not include a URL in the first line (LinkedIn suppresses reach on
posts that lead with external links). Add the content URL in the first comment instead.*

---

{LINKEDIN_POST}

*Structure:*
*Paragraph 1 (hook — 1 sentence): A single strong opening line. Stat, question, or claim.*
*Do NOT use a bullet list or emoji in the first line — LinkedIn penalises this in reach.*

*Paragraph 2 (value — 3–5 sentences): Expand on the most interesting insight from the content.*
*Write in {TONE} register. Professional tone applies regardless of content-brief tone for LinkedIn.*

*Paragraph 3 (CTA — 1–2 sentences + hashtags):*
*Direct ask: "Read the full piece [link in comments]" or "What's your experience with {topic}?"*
*End with 3–5 relevant hashtags on the last line.*

*Hashtags: #{HASHTAG_1} #{HASHTAG_2} #{HASHTAG_3} #{HASHTAG_4} #{HASHTAG_5}*

Word count: {LINKEDIN_POST_WORD_COUNT} / 150–200

---

## Newsletter Snippet

*Limit: 50–75 words. This is a teaser for inclusion in an existing newsletter.*
*It should stand alone without context — the reader may not know who you are.*

---

**Subject line options (choose one):**

1. {SUBJECT_LINE_CURIOSITY} *(curiosity gap — omits the answer)*
2. {SUBJECT_LINE_BENEFIT} *(clear benefit — states what the reader gains)*
3. {SUBJECT_LINE_URGENCY} *(time or stakes pressure — why read now)*

**Preview text (under 60 characters):**
{PREVIEW_TEXT}

**Snippet body:**

{NEWSLETTER_SNIPPET}

*Structure:*
*Sentence 1: Restate the hook from the final content in new words.*
*Sentences 2–3: Tease the most interesting insight — make the reader feel they're missing out.*
*Final sentence: "read more" hook with implied link anchor text.*
*Example: "The full breakdown — including a step-by-step checklist — is waiting for you here."*

Word count: {SNIPPET_WORD_COUNT} / 50–75
```

---

## Variant generation rules

**Do NOT copy-paste the intro paragraph of the blog post as a tweet.** Social content must be
rewritten for its platform's native format. The table below summarises what "native" means per platform:

| Platform | Native format | What to avoid |
|---|---|---|
| Twitter / X | Short, punchy, conversational. Incomplete sentences OK. | Formal prose. Long paragraphs. Corporate language. |
| LinkedIn | Professional but human. First-person perspective. | Bullet lists in first line. External links in body. Hashtag spam (>5 tags). |
| Newsletter | Teaser energy. Incomplete on purpose. Warm, personal. | Summarising the whole piece. Spoiling the main insight. Hard sell. |

**Tone adaptation:**

| content-brief.json tone | Twitter / X | LinkedIn | Newsletter |
|---|---|---|---|
| professional | Confident, declarative | Authoritative, peer-to-peer | Warm, credible |
| casual | Conversational, first-person, contractions OK | Slightly more formal but still human | Friendly, personal |
| technical | Precise, jargon-accepted | Expert-to-expert | Assumes domain familiarity |
| inspirational | Vision-forward, future tense | Motivating, story-led | Aspirational opener |
| urgent | Imperative verbs, time references | Stakes-led, decision-forcing | Deadline or loss-framing |

---

*Generated by agentic-studio CONTENT mode*
