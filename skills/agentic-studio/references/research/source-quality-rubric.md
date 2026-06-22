# Source Quality Rubric

Used by the VALIDATE phase to score each finding in `gather-{angle}.json`.
Apply this rubric to every entry in `key_findings[]` across all gather files.

---

## Scoring scale: 1–5

### Score 5 — Primary source, original data
The source itself produced the data through original research, measurement, or official record.
- Government statistics agencies (ONS, BLS, Eurostat, Census Bureau)
- Peer-reviewed academic papers (with methodology stated)
- Official regulatory body publications (SEC filings, FDA approvals, court judgements)
- Public company earnings reports, annual reports, investor presentations
- Original survey data from named research firm (Gartner, IDC, Forrester) with sample size stated

**Trust level: HIGH**

### Score 4 — Authoritative industry report
The source compiled and analysed data from multiple primary sources; methodology is disclosed.
- Named industry analyst reports (Gartner Magic Quadrant, IDC MarketScape, Forrester Wave)
- Trade association annual reports with cited methodology
- Reputable consultancy reports (McKinsey Global Institute, Bain, Deloitte Insights) with sourcing
- Central bank or IMF/World Bank statistical publications

**Trust level: HIGH**

### Score 3 — Credible news or trade publication
Written by a named journalist or author at a publication with an editorial process.
- Major tech / financial press: Reuters, Bloomberg, Financial Times, WSJ, Economist
- Vertical trade publications: TechCrunch, The Information, Axios, STAT News
- Analyst commentary summarising a named report (secondary, but traceable)

**Trust level: MEDIUM** — verify the cited primary source if the claim is quantitative.

### Score 2 — General news or unverified secondary source
May cite no primary source, or original source is a blog or PR release.
- General-interest press (not vertical specialists)
- Vendor blogs and product announcement posts
- Press releases (cite the underlying data separately if needed)
- LinkedIn posts, Medium articles
- Wikipedia (can be a pointer to primary sources — follow the citation, don't cite Wikipedia itself)

**Trust level: LOW** — use only if no Score ≥3 source says the same thing.

### Score 1 — Unreliable or undatable
No authorship, no date, no methodology, or visibly promotional.
- Anonymous forum posts (Reddit, Quora) — usable for consumer_sentiment angle ONLY
  as "sentiment signal", never as a factual claim
- Undated web pages
- AI-generated summary sites with no source citations
- SEO-farmed content farms
- Vendor "industry reports" that cite only their own survey (N <100, no methodology)

**Trust level: DISCARD** for factual claims. For consumer_sentiment: demote to LOW.

---

## Angle-specific adjustments

### consumer_sentiment angle
- Score-1 sources (Reddit, Quora, App Store reviews) are ALLOWED but capped at LOW trust.
- They are evidence of sentiment, not fact. Never use them for statistics.
- Representative quotes are valid if the source is real and the context is clear.

### regulatory angle
- Government publications and official body websites always Score 5.
- Law firm client alerts are Score 3 (authoritative, but interpretive — not the law itself).
- "What is GDPR?" blog posts are Score 1.

### financial angle
- SEC/regulatory filings: Score 5.
- Crunchbase / PitchBook public data: Score 3 (crowd-sourced, usually accurate but lagged).
- "According to sources familiar" news: Score 2.

---

## Contradiction resolution priority

When two findings conflict, prefer the one with the higher score.

| Comparison | Resolution |
|---|---|
| Score 5 vs Score 3 | Prefer Score 5; note Score 3 as secondary |
| Score 4 vs Score 4 | Express as range; note methodology difference |
| Score 3 vs Score 3 | Express as range; flag as contested |
| Score 5 vs Score 5 | Deeper inspection required — check publication dates, methodologies; may still be a range |
| Score 2 or lower involved | Discard the lower-score claim; keep the higher |

If both sources are Score 5 and still contradict: mark as `resolution: "unresolvable"`.
Include both claims in the knowledge base as a contested finding.

---

## Quick reference card

| Score | Category | Trust | Examples |
|---|---|---|---|
| 5 | Primary | HIGH | Government data, SEC filings, peer-reviewed papers |
| 4 | Authoritative report | HIGH | Gartner, IDC, Forrester, McKinsey Global Institute |
| 3 | Credible press | MEDIUM | Reuters, Bloomberg, TechCrunch, The Information |
| 2 | General/vendor | LOW | Vendor blogs, press releases, general press |
| 1 | Unreliable | DISCARD (or LOW for sentiment) | Anonymous posts, undated pages, content farms |
