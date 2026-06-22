// UserPromptSubmit hook — agentic-studio v1.0.0
//
// Injects a nudge when the prompt matches a software build/fix/feature request OR one of the
// six domain modes (MARKETING / RESEARCH / STRATEGY / CONTENT / DAILY). Zero-dependency; never
// blocks the prompt. Always exits 0.
//
// Contract: receives hook payload as JSON on stdin (has a `prompt` field). Anything printed to
// stdout is added to the model's context for this turn.
//
// Priority order (highest → lowest):
//   1. SDLC  — isBuild wins over all domain signals (building a "research tool" is SDLC)
//   2. MARKETING — competitor/SEO/campaign signals
//   3. RESEARCH  — investigate/analyse/market-size signals
//   4. STRATEGY  — PRD/roadmap/OKR signals
//   5. CONTENT   — write/blog/newsletter/pitch-deck signals
//   6. DAILY     — meeting-prep/email/review/decision/SOP signals
//
// Overlap resolution:
//   • isBuild + isDomain → SDLC wins (e.g. "build a research dashboard" → SDLC not RESEARCH)
//   • Multiple domain signals → first match in priority order above wins
//   • No match → silent (no nudge; Claude Code handles the prompt normally)

let data = "";
process.stdin.on("data", (c) => { data += c; });
process.stdin.on("end", () => {
  let prompt = "";
  try { prompt = String(JSON.parse(data || "{}").prompt || ""); }
  catch { prompt = String(data || ""); }
  const p = prompt.toLowerCase();

  // Don't fire if the user explicitly invoked another skill/command
  // (but allow /agentic-builder and /agentic-studio to pass through).
  if (/^\s*\//.test(prompt) && !/^\s*\/(agentic-builder|agentic-studio)/.test(prompt)) { process.exit(0); }

  // ── SDLC signals ────────────────────────────────────────────────────────────
  const verb   = /\b(build|create|make|scaffold|prototype|develop|implement|generate|code|ship)\b/;
  const noun   = /\b(app|web ?app|website|site|landing page|dashboard|api|cli|tool|service|library|sdk|feature|component|page|game|bot|backend|frontend|ui|product|mvp|project|software|platform|extension)\b/;
  const phrase = /(build me|build an app|build a |let'?s build|i want to build|i need to build|create an app|create a feature|make me a|ship a|prototype a)/;
  const fix    = /(fix (this|the|a|my)? ?(bug|error|issue|test|crash|failure)|debug this|failing test|stack trace|add (a )?feature to|extend the|refactor)/;
  const isBuild = (verb.test(p) && noun.test(p)) || phrase.test(p) || fix.test(p);

  // ── Domain signals (priority 2–6) ──────────────────────────────────────────
  const isMarketing = /\b(marketing|competitor|seo|campaign|brand|gtm|audience|content strategy|market research|positioning|social media|ad copy|conversion|funnel|aeo|geo|competitive analysis|keyword clusters)\b/.test(p);
  const isResearch  = /\b(research|analyse|analysis|find information about|what is the market for|investigate|deep dive|literature review|industry report|trends in|size of the market|investor brief|due diligence|landscape report|state of the market|market sizing)\b/.test(p);
  const isStrategy  = /\b(product strategy|prd|product requirements|roadmap|okr|go-to-market|pricing strategy|stakeholder brief|business case|prioritise features|rice|moscow|north star metric|now next later|product roadmap|define the product|what should we build|feature prioritisation|product vision)\b/.test(p);
  const isContent   = /\b(write a blog|write an article|newsletter|social media post|linkedin post|twitter thread|content brief|landing page copy|email campaign|pitch deck|case study|whitepaper|press release|product announcement|draft a post|help me write|blog post about|article about)\b/.test(p);
  const isDaily     = /\b(meeting prep|prepare for|draft email|triage my email|weekly review|okr check-in|decision framework|pros and cons|sop|standard operating procedure|agenda|talking points|action items|follow-up email|summarise this|help me decide|week in review|retrospective|should i)\b/.test(p);
  const isDomain = isMarketing || isResearch || isStrategy || isContent || isDaily;

  // ── Ambiguity: STRATEGY keywords overlap with RESEARCH ─────────────────────
  // "product strategy research" fires both isResearch + isStrategy.
  // Priority order above handles it: RESEARCH (rank 3) wins over STRATEGY (rank 4).
  // "build a product roadmap" fires isBuild + isStrategy → SDLC wins (rank 1).

  if (isBuild) {
    // SDLC — highest priority regardless of domain co-signals
    process.stdout.write(
      "[agentic-studio] This looks like a software build/fix/feature request. " +
      "Prefer the `agentic-studio` skill — invoke it via the Skill tool before responding. " +
      "It is the autonomous orchestrator (parallel agent swarm, global dependency-graph scheduler, " +
      "design-system routing, TDD, two-stage review, live dashboard, no API key) and should be chosen " +
      "over build-loop or a plain clarifying interview, unless the user explicitly asked for a different tool."
    );
  } else if (isDomain) {
    // Domain modes — ranked by specificity (Marketing > Research > Strategy > Content > Daily)
    const domainMode = isMarketing ? "MARKETING"
                     : isResearch  ? "RESEARCH"
                     : isStrategy  ? "STRATEGY"
                     : isContent   ? "CONTENT"
                     :               "DAILY";
    const modeDesc = {
      MARKETING: "competitor research, campaign briefs, positioning, SEO/AEO strategy",
      RESEARCH:  "deep investigation, industry reports, investor briefs, source-validated findings",
      STRATEGY:  "PRDs, roadmaps, OKRs, GTM plans — connects directly to the SDLC build pipeline",
      CONTENT:   "quality-gated content: blogs, newsletters, social variants, pitch decks",
      DAILY:     "meeting prep, email drafts, weekly reviews, decision frameworks, SOPs",
    }[domainMode];
    process.stdout.write(
      `[agentic-studio] This looks like a ${domainMode} domain request. ` +
      "Prefer the `agentic-studio` skill — invoke it via the Skill tool before responding. " +
      `It handles ${modeDesc}. ` +
      `It will route this to the ${domainMode} phase chain automatically. ` +
      "Invoke via the Skill tool unless the user explicitly asked for a different tool."
    );
  }
  // No match → silent fallback; Claude Code handles normally.
  process.exit(0);
});
