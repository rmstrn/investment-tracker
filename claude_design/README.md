# Provedo Landing — Design Context Package

Self-contained snapshot of Provedo's marketing landing for an outside design review session (Claude Design / claude.ai).

**Project:** Provedo — pre-alpha Lane A portfolio AI assistant. Read-only multi-broker aggregation + chat-first answers + retrospective pattern detection.

**Live preview URL (fully deployed v3.2):**
https://investment-tracker-web-git-feat-lp-pr-7c8919-ruslan-maistrenko1.vercel.app

(Note: the preview may be behind Vercel SSO deployment-protection. Code in this folder represents the fully-shipped state.)

---

## Folder structure

```
claude_design/
├── PROMPT.md                       # Ready-to-send prompt for Claude Design
├── README.md                       # This file
│
├── 01_brand/                       # Brand foundation, voice, positioning
│   ├── 04_BRAND.md                 # Archetype, tagline, brand foundation v1.0
│   ├── 02_POSITIONING.md           # Positioning canvas (obviously-awesome)
│   ├── VOICE_PROFILE.md            # Voice fingerprint, verb-allowlist, banned co-occurrences
│   └── REFERENCES_LIVING.md        # Accumulated taste references
│
├── 02_design/                      # Design system, tokens, brief
│   ├── 04_DESIGN_BRIEF.md          # Direction A Modern AI-Tool Minimalist (v1.4)
│   ├── brand.json                  # Brand-level tokens
│   ├── color-primitives.json       # Color system primitives
│   ├── typography-primitives.json  # Typography system
│   ├── spacing-primitives.json     # Spacing scale
│   ├── motion-primitives.json      # Motion tokens
│   ├── semantic-light.json         # Semantic light theme mapping
│   ├── animations.css              # Animation utility CSS
│   └── globals.css                 # Web app global stylesheet
│
├── 03_landing_source/              # Currently-shipping marketing landing
│   ├── page.tsx                    # Marketing root page (10-section layout)
│   ├── marketing-layout.tsx        # Marketing layout shell
│   ├── disclosures-page.tsx        # /disclosures Layer 3 regulatory page
│   └── _components/                # 14 marketing components
│       ├── MarketingHeader.tsx
│       ├── MarketingFooter.tsx     # Includes 3-layer disclaimer
│       ├── ProvedoHeroV2.tsx       # Hero S1 (locked head + sub + ChatMockup + 3-layer mockup stack)
│       ├── ProvedoNumericProofBar.tsx  # S2 4-cell proof bar
│       ├── ProvedoNegationSection.tsx  # S3 «Provedo is not...»
│       ├── ProvedoDemoTabsV2.tsx   # S4 4-tab demo
│       ├── ProvedoInsightsBullets.tsx  # S5
│       ├── ProvedoEditorialNarrative.tsx  # S6 mid-page editorial
│       ├── ProvedoTestimonialCards.tsx  # S7 single-quote
│       ├── ProvedoAggregationSection.tsx  # S8 broker marquee
│       ├── ProvedoFAQ.tsx          # S9
│       ├── ProvedoRepeatCTAV2.tsx  # S10 pre-footer
│       ├── ProvedoButton.tsx       # CTA primitive
│       └── ScrollFadeIn.tsx        # Scroll-into-view animation wrapper
│
├── 04_charts/                      # 4 animated chart components mounted in S4 demo tabs
│   ├── PnlSparklineAnimated.tsx    # Tab 1
│   ├── DividendCalendarAnimated.tsx  # Tab 2
│   ├── TradeTimelineAnimated.tsx   # Tab 3
│   └── AllocationPieBarAnimated.tsx  # Tab 4 (currently the weakest per internal audit)
│
└── 05_recent_critique/             # Internal team's current assessment + pending decisions
    ├── 2026-04-27-redesign-synthesis-product-designer.md  # 3 strategic redesign options A/B/C
    ├── 2026-04-27-chart-upgrade-audit-product-designer.md  # Chart-by-chart visual audit
    ├── 2026-04-27-hero-chatmockup-audit-product-designer.md  # Hero chat mockup audit
    ├── 2026-04-27-brand-voice-review-charts-and-hero-chat.md  # Voice ruling on proposals
    ├── 2026-04-27-ai-tool-landing-audit-product-designer.md   # AI-tool landscape audit
    └── 2026-04-27-fintech-competitor-landing-audit-user-researcher.md  # Fintech competitor audit
```

---

## Quick context for the reviewer

- **Naming locked:** «Provedo» — Italian *provedere* «I provide for / I foresee» + bilingual RU «прове́до» = «I will lead through»
- **Tagline locked:** «Notice what you'd miss»
- **Hero head locked:** «Provedo will lead you through your portfolio.»
- **Hero sub locked:** «Notice what you'd miss across all your brokers.»
- **Visual lock:** Direction A Modern AI-Tool Minimalist (`#FAFAF7` warm-cream + slate-900 + teal-600 `#0D9488`) · Inter + JetBrains Mono
- **Archetype lock:** Magician + Sage primary · Everyman modifier
- **Lane A boundary:** information, not advice — verb-allowlist only («provides clarity / context / observation / foresight / leads through»); banned in non-negation context («advice / recommendations / strategy / suggestions»)
- **Stage:** pre-alpha; no cold-traffic data yet; PR #65 in flight
