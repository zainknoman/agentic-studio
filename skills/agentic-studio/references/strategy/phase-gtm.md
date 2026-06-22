# STRATEGY — Phase SI4: GTM

Load this file after DEFINE completes and all four strategy docs exist in `plan/docs/`.
GTM runs entirely as the orchestrator — no subagents. You write the go-to-market plan
directly using the template in `references/strategy/output-templates/gtm-plan.md`.

---

## Purpose

Generate a concrete, actionable go-to-market plan covering four critical dimensions:
1. **ICP** — the precise ideal customer profile that tightens targeting
2. **Positioning** — a structured statement that guides all external messaging
3. **Launch channels** — ranked by fit with rationale and CAC difficulty
4. **Pricing model** — a recommendation tied to the target user's WTP from IDEATE

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "gtm",
  "role": "strategy",
  "label": "Go-to-Market Plan",
  "status": "working",
  "detail": "Writing ICP, positioning, channels, and pricing model"
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

## GTM generation algorithm

### Section A — Target segment (ICP)

Read `strategy-idea.json.target_user` and `strategy-prd.md` personas. Write a tightly
scoped ICP covering:

- **Role / title** — the specific job title most likely to buy or champion the product
- **Company size** — SMB (1–50), mid-market (51–500), enterprise (500+), or consumer
- **Industry** — top 2 verticals most likely to have the pain described in `problem`
- **Pain trigger** — the specific event or situation that makes the user actively seek a solution
  (e.g. "just hired their 5th engineer", "missed a quarterly target", "GDPR audit coming up")

Do not write a broad ICP. A narrow ICP produces better launch results than a wide one.
If `target_user` is vague (e.g. "anyone who…"), apply the pain trigger to narrow it.

### Section B — Positioning statement

Use this exact template to write the primary positioning statement:

```
For [target], [product name] is the [category]
that [primary benefit]
unlike [primary alternative], [key differentiator].
```

Derive inputs from:
- `[target]` → ICP role + company type from Section A
- `[category]` → the product category name (e.g. "contract intelligence platform",
  "async standup tool", "AI-powered procurement assistant")
- `[primary benefit]` → the clearest value from `strategy-prd.md` functional requirements
- `[primary alternative]` → the most used analogous product from `strategy-validation.json`
- `[key differentiator]` → what the product does that the alternative does not

Write one primary statement plus two alternative framings (benefit-led, emotion-led).

### Section C — Launch channels

Evaluate 5 candidate channels. For each, score and rate:

| Channel | Role | CAC difficulty | Expected volume | Rationale |
|---|---|---|---|---|
| [Channel name] | awareness / acquisition / retention | easy / medium / hard | low / medium / high | [1 sentence] |

**Rank 1–5** by fit with the ICP and the product's `goal.type`. Ranking criteria:
- Rank 1: channel where the ICP already spends time AND CAC difficulty is easy or medium
- Rank 5: broad channel with hard CAC and low ICP density

Derive channel fit from `strategy-idea.json.target_user`:
- Developer tools → developer communities, GitHub, Hacker News, Product Hunt
- B2B SaaS → LinkedIn, cold email outreach, content / SEO
- Consumer → TikTok, Instagram, App Store organic, influencer seeding
- Enterprise → direct sales, events, analyst relations, partner channels
- Marketplace / two-sided → growth hacking, community, referral programmes

### Section D — Pricing model

Select one pricing model and justify it relative to the `target_user`'s WTP from IDEATE:

| Model | Best for |
|---|---|
| Freemium | Consumer or developer tools with viral loop; low ACV |
| Subscription | B2B SaaS with recurring value; monthly or annual seat / usage |
| Usage-based | Infrastructure, API, or AI tools where value scales with usage |
| Per-seat | Team tools where more seats = more value; clear expansion motion |
| One-time | Developer tools, templates, or lifetime-value products; low support overhead |

Write:
- Model name
- Rationale (2–3 sentences tying model to `target_user` WTP and ICP)
- Price points: Free tier (if any), Entry tier, Growth tier
- Freemium or trial strategy (if applicable): duration and upgrade trigger

---

## Output: `plan/docs/strategy-gtm.md`

Template: `references/strategy/output-templates/gtm-plan.md`

Substitute all `{PLACEHOLDER}` tokens with content generated above.
Write all four sections: ICP, Positioning, Channel mix, Pricing.

---

## Done condition

Mark `gtm` card `status:"done"` when:
- `plan/docs/strategy-gtm.md` is written
- All four sections are non-empty (ICP, Positioning, Channels, Pricing)

Then proceed to `phase-handoff.md`.
