# STRATEGY — Phase SI5: HANDOFF

Load this file after GTM completes and `plan/docs/strategy-gtm.md` exists.
HANDOFF is the final phase of STRATEGY mode. It closes the strategy → development loop
by converting the strategy artifacts into a complete GREENFIELD input for agentic-studio.
The orchestrator writes the handoff brief directly — no subagents.

---

## Purpose

Produce a single, self-contained document — `plan/docs/GREENFIELD-HANDOFF.md` — that can
be pasted directly into a new agentic-studio session to trigger GREENFIELD mode and begin
building the product described in the strategy.

This phase answers: "Now that we know what to build and why, how do we start building?"

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "handoff",
  "role": "strategy",
  "label": "Greenfield Handoff",
  "status": "working",
  "detail": "Synthesising strategy artifacts into GREENFIELD build brief"
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

## Handoff generation algorithm

### Step 1 — Read strategy artifacts

Read these three files in sequence:
1. `plan/docs/strategy-prd.md` — for product name, description, personas, success metrics
2. `plan/docs/strategy-features.md` — for top 5 RICE-scored features (the `Now` tier)
3. `plan/docs/strategy-roadmap.md` — for guiding principles and the Now/Next/Later split

Also read `plan/state/strategy-idea.json` for the raw `idea`, `target_user`, and `success_metric`.

### Step 2 — Determine recommended tech stack

Based on the product type inferred from the PRD, recommend a concrete tech stack:

| Product type | Recommended stack |
|---|---|
| Web app (SaaS) | Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma |
| API / backend service | Node.js (Fastify) or Python (FastAPI), PostgreSQL, Docker |
| Mobile app | React Native (Expo), TypeScript, Supabase |
| CLI tool | Node.js or Python, published to npm or PyPI |
| Browser extension | TypeScript, Webpack, Chrome Extensions Manifest V3 |
| AI-native app | Next.js + Vercel AI SDK, LLM provider API, PostgreSQL |

If the PRD mentions a specific technology, honour that choice over the defaults.

### Step 3 — Write GREENFIELD-HANDOFF.md

Format the handoff brief using this exact structure:

```markdown
# GREENFIELD Build Brief — {PRODUCT_NAME}

## Product description
{One-paragraph description drawn from the PRD's Problem Statement + Goal sections.
 Covers: what it is, who it's for, and what pain it relieves.}

## Features to build (Now tier — top 5 by RICE score)
{Bulleted list of the top 5 features from strategy-features.md, in RICE rank order.
 Each bullet: Feature name — one-sentence description of what it does.}

## Tech stack
{Recommended stack from Step 2. List as: Frontend, Backend, Database, Infrastructure.}

## Target
{web app | API | CLI | mobile app | browser extension}

## Success criteria (90 days)
{Primary KPI from strategy-prd.md success_metrics section.
 Plus 1–2 supporting KPIs.}

## ICP
{One sentence: role + company type + pain trigger, from strategy-gtm.md.}

## Source strategy
- PRD: plan/docs/strategy-prd.md
- Features: plan/docs/strategy-features.md
- Roadmap: plan/docs/strategy-roadmap.md
- GTM: plan/docs/strategy-gtm.md
```

### Step 4 — Print completion message to user

After writing the file, print to the user:

```
Strategy complete.

To build this product, paste the contents of:
  plan/docs/GREENFIELD-HANDOFF.md

into a new agentic-studio session. It will trigger GREENFIELD mode and begin
the full build pipeline: interview → PRD → DAG → TDD → parallel implementation → review.
```

---

## Output: `plan/docs/GREENFIELD-HANDOFF.md`

Written in Step 3 above. This is the only output file for this phase.

---

## Done condition

Mark `handoff` card `status:"done"` when:
- `plan/docs/GREENFIELD-HANDOFF.md` is written
- The completion message has been printed to the user
- All five strategy cards (`ideate`, `validate`, `define`, `gtm`, `handoff`) are `status:"done"`

STRATEGY mode is now complete. No further phases follow.
