# RESEARCH — Phase 5: OUTPUT

Load this file after SYNTHESISE completes and `plan/state/knowledge-base.json` is written.
OUTPUT branches on the `depth` setting from `research-scope.json` to generate the correct
deliverable(s). All outputs go to `plan/docs/`.

---

## Purpose

Transform the structured knowledge base into human-ready deliverables matched to the
depth the user requested and the audience who will read them.

| Depth | Deliverables |
|---|---|
| surface | `exec-summary.md` only |
| standard | `structured-report.md` only |
| deep | `structured-report.md` + `decision-brief.md` + unknowns appendix |

---

## Dashboard card

```json
{
  "id": "output",
  "role": "research",
  "label": "Output Generation",
  "status": "working",
  "detail": "Generating {depth} output — {audience} audience"
}
```

---

## Inputs

- `plan/state/research-scope.json` → depth, audience, research_question
- `plan/state/knowledge-base.json` → all findings, cross-angle insights, unknowns

---

## Branch: SURFACE → exec-summary.md

Load `references/research/output-templates/exec-summary.md`.
Populate with knowledge base data. Rules:
- Exactly 1 page (≤500 words + 1 data table)
- Lead with the answer to the research question — no preamble
- Top 3 findings only (highest confidence from `key_findings[]`)
- One data table: top 5 statistics with sources
- One paragraph on key uncertainty / what is not yet known
- Output path: `plan/docs/research-exec-summary.md`

## Branch: STANDARD → structured-report.md

Load `references/research/output-templates/structured-report.md`.
Populate all sections from knowledge base. Rules:
- Every `by_angle` section that has data gets its own section
- Skip angles that were blocked (note the gap)
- Every statistic must have an inline citation `[Source: <URL>]`
- Contradictions must appear in the body where relevant, resolved per validation-report
- Output path: `plan/docs/research-report.md`

## Branch: DEEP → structured-report.md + decision-brief.md

Run STANDARD first (generates `research-report.md`).

Then load `references/research/output-templates/decision-brief.md` and generate:
- `plan/docs/research-decision-brief.md` — the brief only (separate file)

The decision brief is for executive or investor audiences who will NOT read the full report.
It must stand alone. Rules:
- Answer the research question directly in the first paragraph
- 3 strategic implications (actionable, not descriptive)
- Risk register: top 3 risks identified by the research with mitigation signal
- 3–5 key unknowns that should be resolved before committing
- 3–5 recommended next research questions (ranked by importance)
- Output path: `plan/docs/research-decision-brief.md`

Then append `## Appendix: Key Unknowns` to `research-report.md`:
```markdown
## Appendix: Key Unknowns

The following questions could not be answered by available data. Resolving them is recommended
before making high-stakes decisions based on this report.

| Unknown | Why it matters | Suggested resolution path |
|---|---|---|
| {unknown_1} | {why_1} | {how_to_resolve_1} |
```
Source from `knowledge-base.json.key_unknowns[]`.

---

## Quality gate (all depths)

Before marking done, self-check the generated output against these rules:

- [ ] Research question is answered (or explicitly stated as "unanswerable with current data")
- [ ] Every statistic cites a source
- [ ] No finding marked `trust_level: "discard"` appears in the output
- [ ] Contradictions are not silently dropped — each one is either resolved or flagged
- [ ] Coverage gaps are noted, not hidden
- [ ] Deep outputs: decision-brief stands alone (no forward references to the full report)

If any check fails: fix the output before proceeding. This is a self-check (orchestrator runs it
directly); no review subagent is needed at this phase.

---

## Final dashboard update

After all files are written:

1. Mark `output` card `status:"done"`.
2. Print to the user (in chat):
   ```
   Research complete.
   
   Depth: {depth} | Evidence quality: {evidence_quality}
   
   Deliverables:
   - plan/docs/research-exec-summary.md   (surface)
   - plan/docs/research-report.md          (standard / deep)
   - plan/docs/research-decision-brief.md  (deep only)
   
   Key finding: {top finding from knowledge-base.key_findings[0].finding}
   
   {N} unknowns remain — see Appendix or decision brief.
   ```
3. Update `progress.pct: 100` in `agents.json`.

---

## Done condition

Mark `output` card `status:"done"` when all deliverables for the chosen depth are written
and pass the quality gate. No further phases in RESEARCH mode.
