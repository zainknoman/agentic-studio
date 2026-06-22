# STRATEGY — Phase SI2: VALIDATE

Load this file after IDEATE completes and `plan/state/strategy-idea.json` exists.
VALIDATE runs as the orchestrator — no subagents unless the user explicitly requests
a deep validation sweep. It performs a lightweight market check and produces a
viability verdict before investing time in full artifact generation.

---

## Purpose

Answer three questions quickly and honestly:
1. **Does this already exist?** — identify 2–3 analogous products
2. **Is the timing right?** — assess whether the market is ready
3. **What are the top risks?** — surface market, execution, and regulatory threats

If the verdict is `amber` or `red`, pause and ask the user whether to proceed,
adjust scope, or pivot — before writing any strategy artifacts.

---

## Dashboard card

Add card to `agents.json`:
```json
{
  "id": "validate",
  "role": "strategy",
  "label": "Market Validation",
  "status": "working",
  "detail": "Checking analogous products, market timing, and top risks"
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

## Validation algorithm

### Step 1 — Identify analogous products

Using `strategy-idea.json.idea` and `strategy-idea.json.problem`, identify 2–3 products
that already address the same or adjacent problem. For each:
- Name
- Positioning angle (how they frame the problem)
- Key differentiator vs the user's idea
- Funding or traction signal (if known)

If fewer than 2 analogous products exist, that is a signal to note (could be blue ocean
or could mean the market hasn't formed yet).

### Step 2 — Assess market timing

Classify timing as one of three states and supply evidence:

| State | Definition | Signals |
|---|---|---|
| `too-early` | Market has not formed; buyers don't feel the pain yet | No search volume, no VC interest, no conferences, behaviour change required |
| `right-time` | Market is forming; early adopters exist; category name emerging | Growing search, seed/Series A activity, new job titles, analyst coverage |
| `too-late` | Market is dominated; switching costs are high; price has raced to zero | Established incumbents with network effects, price commoditisation |

Record: `market_timing` (one of `too-early` / `right-time` / `too-late`) plus a
`timing_signals` array of 2–3 concrete evidence points.

### Step 3 — Surface top 3 risks

Assess one risk in each category:

**Market risk** — Is the addressable market large enough? Is demand proven?
- Green: existing spend, established budget lines, proven TAM
- Amber: early indicators but no proven willingness to pay at scale
- Red: no evidence of demand; requires significant behaviour change

**Execution risk** — Can the team realistically build and distribute this?
- Green: proven playbook, available talent, short time-to-MVP
- Amber: novel technical challenge or distribution requires partnership
- Red: requires specialised hardware, regulatory approval, or multi-year build

**Regulatory risk** — Are there legal, compliance, or policy barriers?
- Green: unregulated space or existing regulatory clarity
- Amber: evolving regulation; legal grey area
- Red: active regulatory scrutiny; requires licences or government approval

Record each risk as: `{ category, description, severity: "green"|"amber"|"red" }`.

### Step 4 — Viability verdict

Compute overall viability from the three risk severities:
- **green** — all risks are green, or no more than one amber with `right-time` timing
- **amber** — one or two amber risks, or `too-early` timing with otherwise green risks
- **red** — any red risk, or `too-late` timing with dominant incumbents

Record: `viability` (one of `green` / `amber` / `red`).

### Step 5 — Amber/Red gate

If `viability` is `amber` or `red`, write a dashboard prompt before proceeding:

```
prompt.id:       "validate-proceed"
prompt.title:    "Validation Result: {viability}"
prompt.question: "The market check flagged {viability} viability. Here is why:
                  {one-paragraph summary of risks and timing}.

                  How would you like to proceed?"
prompt.options:  [
  "Proceed anyway — I understand the risks",
  "Adjust scope — let's narrow the idea",
  "Pivot — let's rethink the idea"
]
```

- **Proceed** → continue to DEFINE; record `recommendation: "proceed"`
- **Adjust scope** → run a follow-up Q: "What constraint would you add or relax?",
  update `strategy-idea.json`, re-run Steps 1–4 with revised idea,
  record `recommendation: "adjust"`
- **Pivot** → return to `phase-ideate.md` with a prompt to capture a new idea;
  record `recommendation: "pivot"`

If `viability` is `green`, skip the gate and record `recommendation: "proceed"`.

---

## Output: `plan/state/strategy-validation.json`

Write this file on completion. DEFINE phase reads it for risk context.

```json
{
  "analogous_products": [
    {
      "name": "",
      "positioning": "",
      "differentiator_vs_idea": "",
      "traction_signal": ""
    }
  ],
  "market_timing": "too-early | right-time | too-late",
  "timing_signals": [],
  "risks": [
    {
      "category": "market | execution | regulatory",
      "description": "",
      "severity": "green | amber | red"
    }
  ],
  "viability": "green | amber | red",
  "recommendation": "proceed | adjust | pivot",
  "validated_at": ""
}
```

---

## Done condition

Mark `validate` card `status:"done"` when:
- `strategy-validation.json` is written and valid
- `viability` is set
- `recommendation` is set (after gate resolution if amber/red)

Then proceed to `phase-define.md`.
