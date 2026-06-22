# Structured Report Template

This template is rendered by the OUTPUT phase into `plan/docs/research-report.md`.
Replace all `{PLACEHOLDER}` tokens with synthesised data from `knowledge-base.json`.
Omit any section for an angle that was not included or was blocked (note the omission).
Remove this header comment block before writing the final file.

---

# Research Report: {RESEARCH_QUESTION}

**Prepared for:** {AUDIENCE}
**Depth:** {DEPTH}
**Evidence quality:** {EVIDENCE_QUALITY}
**Research date:** {DATE}
**Angles covered:** {ANGLES_COVERED}

---

## Executive Summary

{EXECUTIVE_SUMMARY_3_PARAGRAPHS}

Paragraph 1: Direct answer to the research question (or best available evidence).
Paragraph 2: The 2–3 most important cross-angle insights.
Paragraph 3: Confidence level and most significant uncertainty.

---

## 1. Market Overview

*From angle: market_data | Omit this section if market_data was not gathered.*

**Market size:** {TAM} (total addressable) · {SAM} (serviceable) · {SOM} (obtainable)

**Growth trajectory:**
{GROWTH_NARRATIVE} — e.g. "The market is projected to grow from $X in 2024 to $Y by 2028,
representing a CAGR of Z%." [Source: {SOURCE}]

**Key segments:**
| Segment | Relative size | Growth rate | Notes |
|---|---|---|---|
| {SEGMENT_1} | {SIZE_1} | {GROWTH_1} | {NOTES_1} |
| {SEGMENT_2} | {SIZE_2} | {GROWTH_2} | {NOTES_2} |

**Top statistics:**
| Metric | Value | Source | Year |
|---|---|---|---|
| {METRIC_1} | {VALUE_1} | {SOURCE_1} | {YEAR_1} |

*Note any contested statistics: {MARKET_CONTRADICTIONS_NOTE}*

---

## 2. Competitive Landscape

*From angle: competitor_landscape | Omit if not gathered.*

**Market structure:** {MARKET_STRUCTURE_DESCRIPTION}
(e.g. "Fragmented — 10+ players, no single leader with >20% share" or "Consolidated — 3 players hold ~70%")

**Key players:**
| Company | Positioning | Relative strength | Key weakness |
|---|---|---|---|
| {COMPANY_1} | {ARCHETYPE_1} | {STRENGTH_1} | {WEAKNESS_1} |
| {COMPANY_2} | {ARCHETYPE_2} | {STRENGTH_2} | {WEAKNESS_2} |

**White space / underserved niches:**
- {WHITE_SPACE_1}
- {WHITE_SPACE_2}

**Common weaknesses across the field:**
{COMMON_WEAKNESSES_NARRATIVE}

---

## 3. Regulatory Environment

*From angle: regulatory | Omit if not gathered.*

**Applicable frameworks:**
| Framework / Law | Jurisdiction | Status | Key requirement |
|---|---|---|---|
| {LAW_1} | {JURISDICTION_1} | {STATUS_1} (active/pending/proposed) | {REQUIREMENT_1} |

**Enforcement trend:** {ENFORCEMENT_TREND}
(tightening / stable / loosening — with evidence)

**Pending regulation:**
{PENDING_REGULATION_DESCRIPTION} — expected timeline: {EXPECTED_TIMELINE}

**Compliance implications for the research question:**
{REGULATORY_IMPLICATION}

---

## 4. Technology Landscape

*From angle: technology | Omit if not gathered.*

**Dominant solutions (deployed at scale):**
{DOMINANT_TECH_LIST} — maturity level: {MATURITY}

**Emerging technologies (early adopter phase):**
{EMERGING_TECH_LIST} — readiness: {READINESS_LEVEL}

**Research directions / open problems:**
{RESEARCH_DIRECTIONS}

**Adoption barriers:**
- {BARRIER_1}
- {BARRIER_2}

---

## 5. Consumer / User Sentiment

*From angle: consumer_sentiment | Omit if not gathered.*

**Net sentiment:** {NET_SENTIMENT} (positive / mixed / negative)

**Recurring pain themes** (most to least mentioned):
1. {PAIN_1}
2. {PAIN_2}
3. {PAIN_3}

**What users value most:**
- {VALUE_1}
- {VALUE_2}

**Representative quotes:**
> "{QUOTE_1}"
> — {SOURCE_TYPE_1}, {PLATFORM_1}

> "{QUOTE_2}"
> — {SOURCE_TYPE_2}, {PLATFORM_2}

---

## 6. Financial & Investment Signals

*From angle: financial | Omit if not gathered.*

**Total investment (past 12 months):** {TOTAL_INVESTMENT_12MO}

**Notable funding rounds:**
| Company | Amount | Stage | Date | Lead investor |
|---|---|---|---|---|
| {COMPANY_1} | {AMOUNT_1} | {STAGE_1} | {DATE_1} | {INVESTOR_1} |

**M&A activity:**
{MA_NARRATIVE}

**Revenue signals:**
{REVENUE_SIGNALS_NARRATIVE}

---

## 7. Cross-Angle Insights

*Insights that emerge from combining two or more angles — not visible in any single section.*

### {INSIGHT_1_TITLE}
{INSIGHT_1_NARRATIVE}
*Supporting angles: {ANGLES_1} | Confidence: {CONFIDENCE_1}*
**Implication:** {IMPLICATION_1}

### {INSIGHT_2_TITLE}
{INSIGHT_2_NARRATIVE}
*Supporting angles: {ANGLES_2} | Confidence: {CONFIDENCE_2}*
**Implication:** {IMPLICATION_2}

---

## 8. Contradictions & Contested Data

*Areas where sources disagreed. Resolutions applied in this report.*

| Topic | Claim A | Claim B | Resolution | Rationale |
|---|---|---|---|---|
| {TOPIC_1} | {CLAIM_A_1} | {CLAIM_B_1} | {RESOLUTION_1} | {RATIONALE_1} |

---

## 9. Limitations & Evidence Quality

**Overall evidence quality:** {EVIDENCE_QUALITY}

**Coverage gaps:**
| Angle | Gap | Impact |
|---|---|---|
| {ANGLE_1} | {GAP_REASON_1} | {IMPACT_1} |

**Key limitations:**
- {LIMITATION_1}
- {LIMITATION_2}

---

## Appendix: Key Unknowns

*Questions the research could not answer with current data.*

| Unknown | Why it matters | Suggested resolution |
|---|---|---|
| {UNKNOWN_1} | {WHY_1} | {HOW_TO_RESOLVE_1} |
| {UNKNOWN_2} | {WHY_2} | {HOW_TO_RESOLVE_2} |

---

## Sources

*All URLs visited during research. Grouped by angle.*

**Market data:** {MARKET_DATA_SOURCES}
**Competitor landscape:** {COMPETITOR_SOURCES}
**Regulatory:** {REGULATORY_SOURCES}
**Technology:** {TECHNOLOGY_SOURCES}
**Consumer sentiment:** {SENTIMENT_SOURCES}
**Financial:** {FINANCIAL_SOURCES}

---

*Generated by agentic-studio RESEARCH mode — {DEPTH} depth*
*Evidence based on publicly available sources as of {DATE}. Verify critical statistics before use.*
