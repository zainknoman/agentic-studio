# Email Campaign Template

This template is rendered by the DRAFT phase when `content-brief.json.type == "email-campaign"`,
and by the PUBLISH-READY phase into `plan/docs/content-final.md`.
Replace all `{PLACEHOLDER}` tokens with real content. Remove this header comment block.

---

```markdown
---
title: {CAMPAIGN_NAME}
content_type: email-campaign
date: {DATE_ISO_8601}
word_count: {WORD_COUNT}
quality_score: {CRITIQUE_OVERALL_SCORE}
status: final
---

# Email Campaign: {CAMPAIGN_NAME}

---

## Subject Line Options

Choose ONE for the primary send. The other two are A/B test variants (see A/B guidance below).

1. **Curiosity:** {SUBJECT_LINE_CURIOSITY}
   *Opens a question or reveals a surprising fact. Does not give away the answer.*
   *Example: "The mistake 9 in 10 {audience role} make with {topic}"*

2. **Benefit:** {SUBJECT_LINE_BENEFIT}
   *States the direct outcome the reader gets from opening this email.*
   *Example: "How to {achieve outcome} in {timeframe} — no {common obstacle} required"*

3. **Urgency:** {SUBJECT_LINE_URGENCY}
   *Creates time pressure or stakes. Use sparingly — urgency loses power when overused.*
   *Example: "{Offer / insight} expires {date / condition} — here's what you need to know"*

Character counts: Curiosity: {N} | Benefit: {N} | Urgency: {N}
*Target: 40–60 characters per subject line for optimal mobile display.*

---

## Preview Text

{PREVIEW_TEXT}

*Preview text appears next to the subject line in most email clients.*
*Limit: under 100 characters.*
*Rule: It must not repeat the subject line — it should complete the thought or add a new hook.*
*Example: Subject: "The mistake 9 in 10 managers make" → Preview: "We audited 500 teams to find out."*

Character count: {PREVIEW_TEXT_CHAR_COUNT} / 100

---

## Email Body

---

### Opening (personalised, 1–2 sentences)

{PERSONALISED_OPENER}

*Use first-name personalisation token: Hi {{first_name}},*
*Opener must reference something specific to the reader's context or the reason they're on this list.*
*Avoid generic openers: "I hope this email finds you well."*
*Good: "You joined {list/community} because you care about {relevant topic} — I have something relevant."*
*Or: "Last week I asked {audience segment} about {topic}. Your responses led me here."*

---

### Problem Acknowledgment (2–3 sentences)

{PROBLEM_PARAGRAPH}

*Name the specific pain or challenge the audience is experiencing.*
*Reference `content-brief.json.audience.cares_about`.*
*Do not offer the solution yet — sit with the problem long enough for the reader to nod.*
*Use second-person: "You're probably…", "If you've ever…", "Most {role} find that…"*

---

### Solution or Offer (3–5 sentences)

{SOLUTION_PARAGRAPH}

*Introduce the solution, resource, product, or insight the email is delivering.*
*Be specific: what is it, how does it work, what does it do for the reader.*
*Connect it directly to the problem named above.*
*Do not use vague language like "innovative" or "powerful" — describe the mechanism.*
*Key messages from `content-brief.json.key_messages[]` must appear in this section.*

---

### Social Proof (1–2 sentences)

{SOCIAL_PROOF}

*One concrete proof point that makes the solution credible.*
*Formats that work:*
*- A specific result: "{N} {audience role} used this to achieve {outcome} in {timeframe}"*
*- A recognisable name: "Used by teams at {Company A}, {Company B}, and {Company C}"*
*- A quote fragment: "'{Single most compelling phrase}' — {Name}, {Title}, {Company}"*
*Avoid generic testimonials ("Life-changing!", "The best tool I've ever used!").*

---

### CTA Button

**Primary CTA text:** {CTA_BUTTON_TEXT}

*CTA text rules:*
*- Verb-led: start with an action word ("Get", "Start", "Download", "Read", "Join", "Try")*
*- Specific: name what happens when they click ("Get the free checklist", not "Click here")*
*- Short: 2–5 words maximum for a button label*
*- One CTA only per email — do not include secondary links in the body*

**CTA destination URL:** {CTA_URL}

---

### PS Line (optional but recommended)

**P.S.** {PS_LINE}

*The PS is the second-most-read element in an email after the subject line.*
*Use it for ONE of:*
*- Restate the urgency or deadline if there is one*
*- Surface a secondary benefit not mentioned in the body*
*- Add a personal note or humanising detail*
*- Tease what is coming next ("Next week I'll share {topic}")*
*One sentence only.*

---
```

---

## A/B test guidance

Email campaigns should never be sent without a structured test plan. Test elements in this order:

### Priority 1: Subject lines (highest impact)

Test the 3 subject line variants against each other.
- Minimum segment size per variant: 1,000 recipients (or 33% of list if smaller)
- Metric to optimise: open rate
- Winner selection: after 4 hours if send time is workday; after 24 hours if weekend
- Apply winner to remainder of list

### Priority 2: CTA copy (second-highest impact on conversions)

After a winning subject line is identified, test 2 CTA button text variants:
- **Variant A:** Task-oriented ("Download the guide")
- **Variant B:** Outcome-oriented ("Save 3 hours per week")
- Metric to optimise: click-through rate (CTR)
- Run as a 50/50 split on the next campaign send

### Priority 3: Opener style

Test against a cold-open variant (no personalisation token, bold claim in sentence 1):
- **Variant A:** Personalised opener (`Hi {{first_name}}, …`)
- **Variant B:** Bold-claim opener (No greeting, start with the most provocative line in the problem section)
- Metric: click-to-open rate (CTOR) — filters for quality of engagement beyond opens

### Priority 4: Send time

Only test send time after CTA and opener are optimised.
- Test Tuesday 9am vs Thursday 12pm (workday) or Friday 6pm vs Sunday 8am (weekend)
- Run each time slot for ≥3 sends before declaring a winner
- Metric: open rate + CTR combined

### Elements NOT worth testing early

- Email length (too many variables confounded)
- Images vs no images (client rendering varies too much)
- Footer design (negligible impact on conversions)

---

*Generated by agentic-studio CONTENT mode*
