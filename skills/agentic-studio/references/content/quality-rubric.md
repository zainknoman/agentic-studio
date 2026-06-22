# Content Quality Rubric

Detailed scoring criteria used by the CRITIQUE phase (SC4) to evaluate `plan/docs/content-draft.md`.
The orchestrator reads this file and applies every check before writing `plan/state/content-critique.json`.

**Minimum passing score:** 75 overall average.
**Hard block rule:** No single dimension may score below 40, even if the overall average is ≥75.
A catastrophically failing dimension (below 40) blocks publication regardless of other scores.

---

## Dimension 1: Clarity

**What it measures:** Whether the content communicates its main message efficiently and without confusion.
A reader skimming the first 50 words should understand what the piece is about and why it matters to them.

### Scoring breakpoints

| Score range | Meaning | Criteria |
|---|---|---|
| 90–100 | Excellent | Main message in first sentence. No unexplained jargon. Each section transitions cleanly to the next. CTA is a single, unambiguous action. |
| 75–89 | Good | Main message clear within 50 words. One or two jargon terms used without definition. Transitions mostly smooth with one abrupt shift. CTA present. |
| 50–74 | Needs work | Main message buried past the first paragraph. Multiple undefined jargon terms. Section transitions missing or jarring. CTA weak or vague. |
| Below 50 | Failing | Main message never stated clearly. Content reads as a list of facts with no narrative thread. No CTA. Reader would not know what to do after reading. |

### Specific questions to ask when scoring

1. Read only the first 50 words. Can you state the main message of the piece in one sentence? If no: score ≤50.
2. List every acronym and technical term in the piece. Are any used before being defined, for a `beginner` or `intermediate` audience? Each undefined term: -5 points from 90.
3. Read the last sentence of each section. Does it set up the next section? If fewer than half do: -10 points.
4. Find the CTA. Is it one action or multiple? If multiple: -5 points. If absent: score ≤50.
5. Read the opening paragraph and the conclusion. Do they say the same thing in different ways? If the conclusion merely restates the intro: -10 points.

### Common failure patterns

- **Buried lede:** Spending 2–3 paragraphs on context before stating the main point.
- **Jargon walls:** Back-to-back technical terms without definitions for non-expert audiences.
- **No transitions:** Sections that start with "Additionally," "Furthermore," or "Also," without connecting to the previous idea.
- **Phantom CTA:** A closing paragraph that ends the content without telling the reader what to do next.

---

## Dimension 2: Originality

**What it measures:** Whether the content brings a genuinely different angle to the topic that adds
value beyond what already exists in the top 3 competitor pieces found in `content-competitors.json`.
Originality does not mean novelty for its own sake — it means the reader gets something they could
not have gotten from the first page of Google results on this topic.

### Scoring breakpoints

| Score range | Meaning | Criteria |
|---|---|---|
| 90–100 | Excellent | Content takes a clearly unique angle. Introduces at least one original data point, proprietary framework, or perspective not found in any competitor piece. The `differentiation_angle` from the outline is unmistakably present. |
| 75–89 | Good | Mostly differentiated. Uses the differentiation angle but overlaps with one competitor piece on one section. Adds at least one piece of original insight or framing. |
| 50–74 | Needs work | Covers some unique ground but the majority of the content covers the same narrative arc as ≥1 competitor piece. No new data or framework introduced. |
| Below 50 | Failing | Same angle as ≥2 competitor pieces. Reads as a synthesis of existing content rather than an original contribution. No data or framework not already covered elsewhere. |

### Specific questions to ask when scoring

1. Read `content-competitors.json.differentiation_angle`. Find where this angle appears in the draft. If it does not appear: score ≤50.
2. List the main claims made in the draft. Cross-reference each against `content-competitors.json.pieces[].angle`. If >50% of claims are also made in ≥2 competitor pieces: score ≤60.
3. Look for any data point, framework, named model, or original perspective in the draft that does NOT appear in any competitor piece. If none found: -15 points from 85.
4. Check `content-research.json.facts[]` and `stats[]`. Are they cited and woven into unique analysis, or are they merely listed? Mere listing: -10 points.
5. Does the conclusion present a new synthesis or insight the reader would not have formed before reading? If the conclusion only summarises rather than synthesises: -10 points.

### Common failure patterns

- **Aggregator content:** Listing "top 10" items that are the same 10 items as every other article on the topic.
- **Missing differentiation angle:** The outline specified a unique angle but the draft reverts to the safe, consensus narrative.
- **Stat-dropping without insight:** Citing a statistic but not using it to support an original claim.
- **Generic frameworks:** Using "Awareness → Consideration → Decision" or other completely common frameworks without adding a new layer or critique.

---

## Dimension 3: SEO Compliance

**What it measures:** Whether the content meets technical on-page SEO requirements for web indexing
and keyword ranking, as specified in `content-seo.json`.

**Auto-score rule:** If `content-brief.json.is_web_content == false`, auto-assign 100. Skip all checks.
This applies to: LinkedIn posts, Twitter threads, newsletters, email campaigns, pitch decks, press releases, product announcements.

### Scoring breakpoints (web content only)

| Score range | Meaning | Criteria |
|---|---|---|
| 90–100 | Excellent | Keyword in H1, first 100 words, and ≥2 H2 headings. Meta description 150–160 chars. ≥3/5 LSI keywords present. Keyword density within target range. |
| 75–89 | Good | Keyword in H1 and first 100 words. Keyword in 1 H2 (not 2). Meta description present but slightly off length. ≥2/5 LSI keywords present. |
| 50–74 | Needs work | Keyword missing from H1 or first 100 words. No meta description. ≤1/5 LSI keywords present. Keyword density >2× target or <0.5× target. |
| Below 50 | Failing | Keyword appears fewer than 2 times total in the body. No meta description. No LSI keywords present. |

### Point system (web content only)

Apply these checks and sum the points:

| Check | Points |
|---|---|
| Primary keyword in H1 title | +25 |
| Primary keyword in first 100 words | +25 |
| Primary keyword in ≥2 H2 headings | +20 |
| Meta description present AND 150–160 characters | +15 |
| ≥3 of 5 LSI keywords used naturally in body | +15 |
| Total | 100 |

### Specific questions to ask when scoring

1. Copy the H1 title. Does it contain the exact primary keyword? If no: 0 points for that check.
2. Count the words in the first paragraph (before the first H2). Does the keyword appear? If no: 0 points.
3. List all H2 headings. Count how many contain the primary keyword or a close variant. Score accordingly.
4. Find the meta description in the frontmatter. Count its characters. Is it 150–160? Check this precisely.
5. Search the body for each of the 5 LSI keywords. Count matches. Score accordingly.

### Common failure patterns

- **Keyword stuffing:** Keyword appears more than 3× in the target density range — reads unnaturally and may trigger penalties.
- **Keyword in intro but not headings:** Good for first 100 words check but misses the H2 multiplier.
- **Missing meta description:** Frequently forgotten in drafts produced without a template.
- **LSI keywords absent:** Draft uses the primary keyword throughout but never uses related terms, making the content look thin to search engines.

---

## Dimension 4: Audience Fit

**What it measures:** Whether the content is calibrated correctly for the people who will read it —
the right tone, the right complexity, and the right outcome for the stated goal.

### Scoring breakpoints

| Score range | Meaning | Criteria |
|---|---|---|
| 90–100 | Excellent | Tone matches `content-brief.tone` throughout. Complexity exactly right for `knowledge_level`. Content directly addresses `audience.cares_about`. Closing section drives the `goal` outcome unmistakably. |
| 75–89 | Good | Tone mostly matches with 1–2 minor deviations. Complexity appropriate with one section slightly above or below level. Goal outcome present in closing. |
| 50–74 | Needs work | Tone noticeably wrong in ≥2 sections. Complexity consistently over or under the audience level. Goal outcome mentioned but not driven. |
| Below 50 | Failing | Content written in the wrong tone entirely. Addresses a different audience than specified. Goal not reflected in structure or CTA. |

### Specific questions to ask when scoring

1. Set the target tone from `content-brief.json.tone`. Read 5 random sentences from the body. Does the register match?
   - `professional`: no slang, no contractions where formality expected, authoritative statements
   - `casual`: contractions OK, second-person ("you") used, conversational transitions
   - `technical`: precise terminology, quantitative claims, assumes domain knowledge
   - `inspirational`: vision-forward language, emotion words, future tense for positive outcomes
   - `urgent`: short sentences, imperative verbs, time references ("now", "today", "before it's too late")
   If >2 of 5 sample sentences feel wrong for the tone: -15 points.

2. Check `knowledge_level` from the brief. Apply level-specific checks:
   - **Beginner:** No acronym used before spelled out? No concept used before introduced? If either fails: -10 points.
   - **Intermediate:** No over-explanation of basic concepts (e.g. "LinkedIn is a professional networking site")? If condescending passages found: -10 points.
   - **Expert:** Are claims made with appropriate precision and caveats? Does content avoid hedging that experts find condescending? If overly hedged or basic: -10 points.

3. Read `audience.cares_about` from the brief. Find where in the draft this concern is directly addressed. If not addressed: -15 points.

4. Check `goal` from the brief. Map to the closing section:
   - `inform` → closing should state a concrete conclusion or learning
   - `persuade` → closing should name the belief shift the reader should have made
   - `convert` → closing should contain a CTA with urgency or social proof
   - `entertain` → closing should leave the reader satisfied, not with homework
   - `seo` → closing should reinforce the primary keyword topic and offer a related resource
   If closing section does not serve the goal: -20 points.

### Common failure patterns

- **Tone bleed:** Starting in "professional" tone and drifting to "casual" by the third section.
- **Knowledge level mismatch:** Writing for experts when the brief says "beginner" (information overload) or over-explaining for experts (condescending).
- **Goal-CTA mismatch:** Brief says `convert` but the piece ends with "we hope you found this helpful."
- **Audience blindness:** Using audience-specific language from a different professional domain than the one stated in the brief.

---

## Dimension weighting by content type

Content is more subjective than engineering outputs. SEO is irrelevant for non-web formats.
This table shows how to adjust interpretation (not the scoring formula — all dimensions still
contribute equally to the overall average, except SEO which auto-scores 100 for non-web).

| Content type | Clarity priority | Originality priority | SEO priority | Audience fit priority |
|---|---|---|---|---|
| Blog post | High | High | High | High |
| Whitepaper | High | Very high | Medium | High |
| Case study | High | Medium | Medium | Very high |
| Landing page copy | Very high | High | High | Very high |
| LinkedIn post | Very high | High | None (auto-100) | Very high |
| Twitter thread | Very high | Medium | None (auto-100) | High |
| Newsletter | High | Medium | None (auto-100) | Very high |
| Email campaign | Very high | Medium | None (auto-100) | Very high |
| Pitch deck | High | Very high | None (auto-100) | Very high |
| Press release | Very high | Low | Low | High |
| Product announcement | Very high | Low | Medium | Very high |

**Interpretation:** "Very high priority" means a score below 65 in that dimension should almost always
fail the review, even if the overall average scrapes past 75. Apply judgment — do not pass content that
is clearly unfit on its most critical dimension.
