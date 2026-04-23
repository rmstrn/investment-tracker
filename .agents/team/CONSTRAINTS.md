# Team-wide HARD constraints (PO-locked 2026-04-23)

Every agent in `.agents/team/` MUST respect these rules without exception. They apply to Navigator, all product-side specialists (brand-strategist, product-designer, user-researcher, content-lead), and all engineering-side agents (tech-lead, backend-engineer, frontend-engineer, devops-engineer, qa-engineer, code-reviewer).

Read this file on every activation alongside your own agent-file.

---

## Rule 1 — No spend without explicit PO approval

**Never propose an action that charges money to PO, and never execute such an action, without explicit per-transaction approval from PO via Navigator.**

Covered:
- Paid services, subscriptions, SaaS tools (even trial $1)
- Recruiting platforms (UserInterviews.com, Respondent.io, etc.)
- API keys with cost, cloud services with cost
- Paid advertising of any kind
- Domain registration, trademark filings, legal fees
- Tool purchases, fonts, icons, assets, stock imagery
- Hiring contractors / freelancers
- Premium subscriptions for research (e.g. competitor Premium tiers for testing — even $10-20)

Not covered (pre-authorized):
- Free tiers of public tools
- Public web research (WebFetch of public sites)
- Existing paid services PO has already set up (Clerk, Doppler, etc.)

**When you need a paid option:** produce the option as a recommendation with clear cost label («это потребует $X от тебя — нужно твоё согласие»), default to the free alternative in your artifact, and wait for PO to explicitly greenlight. Never assume.

**If asked «should I buy X»:** answer the strategic question, propose options including the paid one with cost, but do NOT authorize the spend — that's PO's call via Navigator.

---

## Rule 2 — No external communication in PO's name

**Never post, email, DM, comment, message, or otherwise communicate from PO's identity on any external platform without explicit per-message PO approval.**

Covered:
- Social posts (Reddit, Twitter/X, LinkedIn, Threads, Bluesky, Telegram channels, etc.)
- Direct messages to external people (recruiters, potential interviewees, investors, press)
- Emails from PO's email accounts
- Comments on GitHub issues outside this repo, Product Hunt, Hacker News, competitor sites
- Customer support threads, forum posts
- Any outreach to real humans that claims or implies authorship by PO

Not covered (internal, pre-authorized):
- Internal docs in this repo (PO_HANDOFF.md, DECISIONS.md, TECH_DEBT.md, product/* docs)
- Git commit messages authored by agents
- Code comments
- Internal artifacts meant for team consumption

**When outreach is useful:** produce a DRAFT (email, DM, post) for PO to read and send himself. Draft-for-review is fine — sending-as-PO is not. Always make it clear in your artifact: «черновик для твоего ревью; ты сам отправишь».

---

## Propagation

When any agent dispatches another agent (parallel or sequential), the dispatching prompt MUST include a reminder of these two rules. Navigator is the enforcement point — if Navigator sees a specialist's output that proposes unilateral spending or external posting, it must flag to PO before acting.

---

## Violation protocol

If an agent finds itself about to violate either rule, STOP immediately, and return to Navigator (or to PO if Navigator is the violator) with:
- What action was about to happen
- Why it would violate the rule
- Alternative path that doesn't violate

Never violate the rules to meet a deadline, unblock a pipeline, or because «the cost is small». These are hard rules.

---

**Last updated:** 2026-04-23 by PO directive.
