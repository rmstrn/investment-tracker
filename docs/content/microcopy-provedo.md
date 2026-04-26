# Microcopy — Provedo v1 (EN-only)

**Author:** content-lead
**Date:** 2026-04-25
**Status:** v1 DRAFT — first pass under Provedo lock + 5-item EN guardrails. EN-only per PO directive 2026-04-25. RU drafts deferred to wave-2.
**Pairs with:** `landing-provedo-v1.md` v2 · `04_DESIGN_BRIEF.md` §10 design system primitives + §14 AI module UI · `04_BRAND.md` §5 tone-of-voice map · `BRAND_VOICE/VOICE_PROFILE.md` 5-item EN guardrails.

**Constraints respected:**
- Rule 1 (no spend) — markdown only.
- Rule 2 (no external send) — repo artefact.
- Lane A — observation-register only; zero advice register.
- **5-item EN guardrails — load-bearing through every string:**
  1. Banned co-occurrence: Provedo + advice/recommendation/strategy/suggestion → audited zero.
  2. AI system-prompt anchor (where Provedo speaks) inherits from landing v2 §A.
  3. EN verb-allowlist enforced.
  4. «Guidance» splitter — no «provides guidance».
  5. Coach-surface microcopy (§5) audited line-by-line.

**Character budgets (per Brand Foundation §6):**
- Button primary ≤24 chars
- Button secondary ≤32 chars
- Tooltip ≤140 chars
- Empty-state headline ≤60 chars; body ≤140 chars
- Toast/notification ≤100 chars
- Error-state body ≤200 chars (with action)

---

## §0. Voice register for microcopy (locked)

Per `04_BRAND.md` §5 row «Microcopy / buttons»:
- **Register:** Direct + verb-imperative (user-side, never AI-side).
- **Anti-pattern rejected:** Vague «Click here» / «Get started» without object.

**Discipline:**
- User-side imperatives are Everyman-direct: Ask · Connect · Try · See · Open · Start · Continue · Save · Cancel.
- Provedo-as-agent strings stay in Sage-observation register: «Provedo notices…» / «Provedo holds your context…» — never «Provedo recommends…» / «Provedo suggests…».
- Errors: calm + actionable. NOT tech-jargon dump.
- Empty states: opening + path-forward. NOT scolding or empty-promotional.
- No exclamation marks anywhere (Notion-restrained tone lock).
- No emoji in agent voice (rare emoji-as-icon acceptable in user-facing chips per Design Brief §10).

---

## §1. Buttons

Primary user-facing CTAs and frequently-recurring action labels.

| Key | Copy (EN) | Context | Max chars |
|---|---|---|---|
| `btn.ask_provedo` | Ask Provedo | Chat input submit; primary landing CTA | 24 |
| `btn.connect_broker` | Connect a broker | Onboarding Stage 1; broker-list empty state | 24 |
| `btn.connect_more` | Connect another broker | Broker list with 1+ existing accounts | 32 |
| `btn.sign_in` | Sign in | Header; auth flow | 24 |
| `btn.sign_up` | Sign up | Header; auth flow | 24 |
| `btn.continue` | Continue | Multi-step flows; default forward | 24 |
| `btn.back` | Back | Multi-step flows; reverse | 24 |
| `btn.cancel` | Cancel | Modal dismiss; destructive abort | 24 |
| `btn.save` | Save | Form submit; settings | 24 |
| `btn.save_changes` | Save changes | Settings with unsaved diffs | 24 |
| `btn.discard` | Discard changes | Settings with unsaved diffs (alongside save) | 24 |
| `btn.try_plus_trial` | Try Plus 14 days free | Paywall primary CTA; landing trial CTA | 24 |
| `btn.start_free` | Start free forever | Landing free-CTA; paywall secondary | 24 |
| `btn.see_plus_details` | See Plus details | Limit-approaching email; soft upsell context | 24 |
| `btn.upgrade_plus` | Upgrade to Plus | Paywall primary; locked-feature CTA | 24 |
| `btn.cancel_subscription` | Cancel subscription | Settings billing; one-click cancel | 24 |
| `btn.open_provedo` | Open Provedo | Email CTA; cross-platform launch | 24 |
| `btn.see_full_digest` | See full digest | Weekly digest email CTA | 24 |
| `btn.see_pattern` | See full pattern | Coach popover CTA (Plus/Pro full detail) | 24 |
| `btn.dismiss` | Dismiss | Coach popover; insight card | 24 |
| `btn.snooze` | Snooze for a week | Coach popover; insight card; tooltip-paired | 24 |
| `btn.copy_answer` | Copy answer | Chat response action | 24 |
| `btn.cite_source` | View source | Chat response source-link | 24 |
| `btn.retry` | Retry | Error recovery; failed broker sync | 24 |
| `btn.refresh` | Refresh | Manual sync trigger; stale-data state | 24 |
| `btn.export_csv` | Export CSV | Pro-tier reports; transactions list | 24 |

**EN guardrail audit:** No banned co-occurrences. No «Recommend Provedo», no «Get advice», no «Strategy». PASS.

---

## §2. Tooltips

Explanatory hints on hover/focus. Non-pushy; clarify what the element does or what state it represents.

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `tip.snaptrade_readonly` | SnapTrade connects your broker read-only. Provedo never has trading rights. | Connect-broker flow; SnapTrade choice | 78 |
| `tip.plaid_readonly` | Plaid connects your broker read-only. Provedo never has trading rights. | Connect-broker flow; Plaid choice | 73 |
| `tip.cite_source` | Tap to open the source Provedo cited for this answer. | Source-link icon next to chat answer | 53 |
| `tip.message_counter` | {USED} of {CAP} chat messages this month. Resets on the 1st. | Free-tier message counter; chat input area | 60 |
| `tip.plus_unlocks_chat` | Plus unlocks unlimited chat plus daily insights. | Free-tier locked state; chat over cap | 49 |
| `tip.coach_dot` | Provedo noticed a pattern here. Tap to see what. | Coach-dot primitive on dashboard cards | 49 |
| `tip.coach_locked` | Plus unlocks the full pattern read. | Coach-dot Free-tier teaser state | 36 |
| `tip.dismiss_pattern` | Dismiss this pattern. Provedo won't surface it again. | Coach popover dismiss button | 54 |
| `tip.snooze_pattern` | Snooze for a week. Provedo brings it back if it persists. | Coach popover snooze button | 58 |
| `tip.weekly_digest` | Weekly digest arrives every {WEEKDAY} morning. | Insights settings; digest cadence label | 47 |
| `tip.daily_insight` | Daily insights are part of Plus. Free is once a week. | Daily-insight locked state on Free | 54 |
| `tip.csv_export` | Export your full transaction history as CSV. Pro tier. | Pro-tier export button | 56 |
| `tip.real_time_sync` | Real-time sync is Pro. Plus syncs every hour, Free daily. | Sync-frequency label on broker card | 58 |
| `tip.disclaimer_short` | Provedo provides observation, not investment advice. | Footer-anchor in-app reminder; AI response footer | 53 |
| `tip.coach_no_advice` | Provedo notices patterns. The decisions stay yours. | Coach-popover footer; first-time coach interaction | 53 |

**EN guardrail audit:**
- #1 Banned co-occurrence check: «advice» appears in `tip.disclaimer_short` («not investment advice»), `tip.coach_no_advice` doesn't appear (rephrased: «The decisions stay yours» = positive framing). Disclaim-by-negation only — no claim. PASS.
- #3 Allowlist: notices/holds/surfaces/cites/provides observation. PASS.
- #4 «Guidance» splitter: «provides observation» (allowlist), not «provides guidance». PASS.

---

## §3. Empty states

Surfaces with no data yet. Opening + path-forward, never scolding.

| Key | Headline (EN) | Body (EN) | CTA | Context |
|---|---|---|---|---|
| `empty.dashboard_no_brokers` | Connect a broker to start | Provedo reads your portfolio across every account you connect — IBKR, Schwab, Coinbase, and 1000+ more. SnapTrade and Plaid handle the connection, read-only. | Connect a broker | First-load dashboard, no brokers |
| `empty.chat_no_messages` | Ask anything about what you own | Try: "Why am I down this month?" or "When are dividends coming?" or "How concentrated is my tech exposure?" Provedo answers on your real holdings, with sources. | (suggested-prompt chips) | Chat surface, fresh user |
| `empty.insights_no_data` | Provedo's reading | Once your first broker sync completes, Provedo surfaces what's worth noticing. Usually a few minutes after connect. | (passive — auto-refreshes) | Insights tab, post-signup pre-sync |
| `empty.insights_caught_up` | Nothing notable this week | Provedo read your portfolio and didn't find anything that crossed the noise floor. That's a good week. Next digest in 7 days. | See last week's | Insights tab, calm-week state |
| `empty.coach_no_patterns_30d` | Coach is still reading | Coach surfaces patterns from your trade history — usually visible by day 30. {DAYS_TO_30} days to go. | (passive) | Dashboard coach feed, pre-30-day window |
| `empty.coach_no_patterns_post30d` | No patterns yet | Provedo has read your trades and hasn't found a pattern worth surfacing. That can mean your trading is consistent, or that there isn't enough variation to read. | (passive) | Dashboard coach feed, post-30-day quiet |
| `empty.dividends_none_quarter` | No dividends this quarter | Your current holdings don't include dividend-paying positions for the next 90 days. | See full calendar | Dividend calendar, dividend-free quarter |
| `empty.search_no_results` | Nothing matched «{QUERY}» | Try a broader term, or ask Provedo directly in chat. | Ask Provedo | Search across positions/transactions |
| `empty.transactions_none` | No transactions yet | Once your broker syncs, transactions appear here — buys, sells, dividends, fees, transfers. | (passive) | Transactions tab, pre-sync |

**EN guardrail audit:** Allowlist verbs throughout (reads/surfaces/notices/answers/holds). Zero «advise/recommend/suggest». «Provedo answers on your real holdings» — answers is allowlist. PASS.

---

## §4. Loading states

Calm + specific. Tell user what Provedo is doing, not generic «Loading…».

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `loading.broker_connect` | Connecting to {BROKER}… | OAuth flow in progress | 30 |
| `loading.first_sync` | Provedo is reading your first broker… | First sync after connect | 41 |
| `loading.sync_in_progress` | Syncing {BROKER}… | Manual or scheduled sync | 30 |
| `loading.chat_thinking` | Provedo is reading your portfolio… | Chat response in flight | 36 |
| `loading.chat_thinking_short` | Provedo is reading… | Compact chat-input loading | 23 |
| `loading.insight_generating` | Provedo is surfacing this week's three… | Weekly digest generation | 44 |
| `loading.coach_pattern_check` | Provedo is reading your trade history… | Coach pattern-detection in progress | 41 |
| `loading.dividend_calendar` | Building your dividend calendar… | Dividend tab load | 34 |
| `loading.export_csv` | Preparing your CSV export… | Pro-tier export action | 30 |
| `loading.scenario_running` | Running scenario across your holdings… | Scenario tool active | 41 |
| `loading.generic` | Reading… | Fallback for any other surface | 9 |

**Verb-allowlist applied:** reading / surfacing / building / preparing / running / connecting / syncing. All allowlist or functional-system verbs. **PASS guardrail #3.**

---

## §5. Error states (HIGH AUDIT — calm + actionable)

Calm tone + actionable recovery path. NOT tech-jargon. Provedo named where the error is interpretable; system-level errors stay neutral.

| Key | Headline (EN) | Body (EN) | Action | Context |
|---|---|---|---|---|
| `error.broker_connect_failed` | Provedo couldn't connect to {BROKER} | The broker rejected the connection. This usually clears with a retry — or check your broker login if 2FA is recent. | Retry / Try a different broker | OAuth flow failed |
| `error.sync_failed_partial` | Partial sync from {BROKER} | Provedo got some of your positions but the broker timed out before sending the rest. The partial data is below; a full retry usually clears it. | Retry sync | Broker sync timeout |
| `error.sync_failed_total` | Sync from {BROKER} didn't complete | The broker isn't responding right now. Provedo will retry automatically in 15 minutes, or you can retry now. | Retry now / Wait | Broker fully unreachable |
| `error.chat_no_response` | Provedo couldn't read that one | The question came through but the response failed to land. Try asking again — the same question often works on the second try. | Try again | Chat backend error |
| `error.chat_rate_limited_free` | You've used your 50 free chats this month | The counter resets on the 1st. Plus unlocks unlimited chat plus daily insights, with a 14-day free trial. | Stay on Free / Try Plus | Free-tier monthly cap |
| `error.chat_token_exceeded` | Your question was too long for one read | Provedo handles up to ~2,000 words per question. Try splitting it into two — Provedo holds context across the conversation. | (passive — user reformats) | Chat input over token cap |
| `error.network_offline` | You're offline | Provedo needs a connection to read your live positions. Reconnect and try again. | Retry | Network unreachable |
| `error.session_expired` | Your session timed out | Sign back in to continue. Provedo doesn't lose any of your data. | Sign in | Auth session expiry |
| `error.payment_failed` | Payment didn't go through | Your card was declined. Check the card details, or try a different card. Plus access continues until {DATE}. | Update card / Continue on Free | Subscription payment failure |
| `error.export_failed` | Export didn't complete | Something interrupted the file build. Try again — exports usually take under 30 seconds. | Retry export | CSV export error |
| `error.generic_with_id` | Something went wrong | Provedo logged the error ({ERROR_ID}). Try again, or send the error ID to support if it keeps happening. | Retry / Contact support | Unhandled fallback error |

**Lane A audit on errors:**
- No advice register in error recovery («consider switching brokers» NOT used; «check your broker login» = neutral system instruction).
- No performance-promise hedge in `error.chat_rate_limited_free` («Plus unlocks unlimited chat» = functional, «Try Plus» = soft CTA).
- `error.payment_failed` stays calm («Plus access continues until {DATE}» = factual; no panic-trigger).

**EN guardrail audit:**
- #1 Banned co-occurrence: zero. PASS.
- #3 Allowlist: read/holds/handles/logged/build. PASS.
- #5 Coach-audit: errors don't surface coach behavioral context — N/A.

---

## §6. Confirmations

Simple, low-noise acknowledgments.

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `confirm.saved` | Saved | Settings save success | 5 |
| `confirm.saved_check` | Saved | (with check icon) — toast variant | 5 |
| `confirm.broker_connected` | {BROKER} connected | Broker connect success toast | 30 |
| `confirm.broker_synced` | {BROKER} synced | Broker sync complete toast | 30 |
| `confirm.message_sent` | Sent | Chat send confirmation (rarely surfaced; chat usually shows response directly) | 4 |
| `confirm.copied` | Copied to clipboard | Copy-answer / copy-source action | 19 |
| `confirm.snoozed` | Snoozed for a week | Coach pattern snooze | 19 |
| `confirm.dismissed` | Dismissed | Coach pattern dismiss | 9 |
| `confirm.subscribed_plus` | Welcome to Plus | Subscription upgrade success modal | 17 |
| `confirm.subscription_canceled` | Subscription canceled | Cancel success; Plus access continues until period-end | 21 |
| `confirm.cancel_continues_until` | Plus continues until {DATE} | Sub-line under subscription_canceled toast | 30 |
| `confirm.export_ready` | CSV ready | Export success — auto-download triggered | 9 |
| `confirm.password_changed` | Password updated | Account security action | 16 |
| `confirm.email_changed` | Email updated. Check your inbox to verify | Account email change with verification | 41 |

**EN guardrail audit:** Functional confirmations only. No agent-voice claim of advice/recommendation. PASS.

---

## §7. AI response micro-additions (chat surface)

Strings appended to or surrounding AI chat output. These are NOT the AI response itself (that's runtime LLM output). These are the framing/footer/source-block strings the UI wraps around the response.

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `chat.response_footer` | Provedo provides observation, not advice. | Footer below every chat response | 43 |
| `chat.sources_label` | Sources | Header above source-link list | 7 |
| `chat.sources_count` | {N} sources | Inline label «3 sources» | 12 |
| `chat.no_sources_warn` | This response is general context — no live source for this one | Footer when AI couldn't tie answer to a specific source | 64 |
| `chat.copied` | Answer copied | Toast after copy-answer | 13 |
| `chat.thinking` | Reading… | Inline indicator while AI generates | 9 |
| `chat.feedback_helpful` | Helpful | Thumbs-up affordance | 7 |
| `chat.feedback_off` | Not what I asked | Thumbs-down affordance — neutral framing | 16 |

**EN guardrail audit:**
- `chat.response_footer` — «Provedo provides observation, not advice» = explicit disclaim with allowlist verb («provides observation»). PASS.
- No «Provedo recommends» / «Provedo's advice» / «strategic insight». PASS.

---

## §8. Coach surface microcopy (HIGH AUDIT — guardrail #5)

Per `04_BRAND.md` §6.5 and `04_DESIGN_BRIEF.md` §14.6 — coach is the highest Lane A risk surface. Every coach string audited line-by-line.

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `coach.dot_label` | Provedo noticed a pattern | Coach-dot accessibility label / hover tooltip | 28 |
| `coach.popover_header_full` | Provedo noticed | Coach popover header (Plus/Pro full detail) | 17 |
| `coach.popover_header_teaser` | A pattern is here | Coach popover header (Free teaser variant) | 19 |
| `coach.observation_closer` | Provedo notices — no judgment, no advice. The decisions stay yours. | Closing line in every coach popover body | 67 |
| `coach.teaser_lock_label` | Plus unlocks the full read | Free teaser popover lock indicator | 27 |
| `coach.teaser_lock_body` | Provedo holds the full pattern. Plus opens it — and every other pattern Provedo has noticed in your trades. | Free teaser popover body | 117 |
| `coach.teaser_cta` | See full pattern with Plus | Free teaser CTA | 27 |
| `coach.empty_30d_pre` | Coach reads your trades over 30 days. {DAYS} days to go. | Coach feed empty state, pre-30 | 60 |
| `coach.empty_30d_post_quiet` | No patterns yet | Coach feed empty state, post-30 quiet | 16 |
| `coach.empty_30d_post_quiet_body` | Provedo has read your trades and hasn't found a pattern worth surfacing. That can mean your trading is consistent. | Sub-body for post-30 quiet | 117 |
| `coach.dismissed_label` | Pattern dismissed | After-action label on dismissed pattern | 18 |
| `coach.snoozed_label` | Snoozed for a week | After-action label on snoozed pattern | 19 |
| `coach.bell_dropdown_header` | Patterns Provedo has noticed | Bell-dropdown header in dashboard | 29 |
| `coach.bell_dropdown_empty` | No new patterns | Bell-dropdown empty state | 16 |
| `coach.bell_dropdown_view_all` | View all patterns | Bell-dropdown footer link | 18 |

**Lane A audit (line-by-line, HIGH RISK):**
- Every Provedo-as-subject verb is from allowlist: noticed / notices / holds / read / opens / surfacing.
- `coach.observation_closer` is the load-bearing trust phrase — duplicated from landing v2 §2 Tab 3 («Provedo notices — no judgment, no advice»). Adds «The decisions stay yours» — positive Lane A framing (parallel «You decide» pattern).
- `coach.teaser_lock_body` — «Plus opens it» = functional unlock; not «Plus advises better». PASS.
- `coach.empty_30d_post_quiet_body` — «hasn't found a pattern worth surfacing» = neutral observation; «your trading is consistent» = factual non-judgment. NOT «you should keep doing what you're doing» (which would be advice). PASS.

**EN guardrail audit:**
- #1 Banned co-occurrence: «advice» appears in `coach.observation_closer` («no judgment, no advice») — disclaim-by-negation, never claim. PASS.
- #3 Allowlist: noticed/notices/holds/reads/opens/surfacing. PASS.
- #4 «Guidance» splitter: zero «provides guidance». PASS.
- #5 Coach-audit: every string passed line-by-line. **PASS.**

---

## §9. Onboarding microcopy (Stage 1 / 2 / 3 progress)

Per `04_BRAND.md` §5 onboarding tone-map rows + `04_DESIGN_BRIEF.md` §13 onboarding flow.

| Key | Copy (EN) | Context | Chars |
|---|---|---|---|
| `onboard.stage1_header` | Connect your brokers | Stage 1 entry header | 21 |
| `onboard.stage1_body` | Provedo takes it from there. SnapTrade or Plaid handles the connection, read-only. Provedo never has trading rights. | Stage 1 body | 117 |
| `onboard.stage1_skip_label` | Skip — try the demo first | Stage 1 secondary path | 26 |
| `onboard.stage2_first_sync_done` | Provedo finished its first read | Stage 2 trigger header (first sync done) | 32 |
| `onboard.stage2_first_sync_body` | Three observations are ready. Open the dashboard to see what Provedo noticed. | Stage 2 body | 80 |
| `onboard.stage2_cta` | See what Provedo noticed | Stage 2 CTA | 25 |
| `onboard.stage3_first_pattern` | Provedo read enough trades to see a pattern | Stage 3 trigger header (~day 30) | 45 |
| `onboard.stage3_first_pattern_body` | One pattern stands out across your past trades. Provedo notices — no judgment, no advice. | Stage 3 body | 95 |
| `onboard.stage3_cta` | Open the pattern | Stage 3 CTA | 16 |

**Lane A audit:**
- All three stages use observation register. No «Provedo recommends starting with broker X», no «consider connecting your tax-advantaged accounts first».
- Stage 1 read-only emphasis is the trust-load-bearing phrase.
- Stage 3 inherits the «no judgment, no advice» disclaim.

**EN guardrail audit:** Allowlist throughout. PASS all five.

---

## §10. Notifications (push/in-app toasts)

Per `04_DESIGN_BRIEF.md` §16 notification cadence.

| Key | Copy (EN) | Channel | Tier | Chars |
|---|---|---|---|---|
| `notif.weekly_digest_ready` | Three things from your portfolio this week | Push + email | All | 44 |
| `notif.daily_insight_ready` | Today's insight is ready | Push | Plus, Pro | 24 |
| `notif.realtime_event` | Provedo noticed: {SHORT_OBSERVATION} | Push | Pro | ≤100 (template) |
| `notif.coach_new_pattern` | Provedo noticed a pattern in your trades | Push + in-app | Plus, Pro | 41 |
| `notif.coach_new_pattern_free` | Provedo noticed something — Plus opens the full read | Push + in-app | Free | 53 |
| `notif.broker_synced` | {BROKER} synced — your portfolio is up to date | In-app toast | All | ≤90 (template) |
| `notif.broker_sync_stuck` | {BROKER} hasn't synced in 24h — try a manual refresh | In-app + email | All | ≤90 (template) |
| `notif.payment_due` | Plus renews on {DATE} | Email | Plus, Pro | ≤30 (template) |
| `notif.payment_failed_inapp` | Plus payment didn't go through | In-app banner | Plus, Pro | 31 |
| `notif.dividend_arrived` | Dividend arrived: {AMOUNT} from {TICKER} | Push | Plus, Pro | ≤90 (template) |

**Lane A audit:**
- All notifications use allowlist verbs (noticed / synced / arrived / renews).
- `notif.coach_new_pattern_free` — «Plus opens the full read» = functional unlock framing; «Provedo noticed something» = observation, not advice. PASS.

**EN guardrail audit:**
- #1 Banned co-occurrence: zero. PASS.
- #3 Allowlist: noticed/synced/arrived. PASS.
- #5 Coach-audit: `notif.coach_new_pattern` and `notif.coach_new_pattern_free` audited — «Provedo noticed» (allowlist verb), no advice claim. PASS.

---

## §11. EN guardrail consolidated audit

| Section | #1 Banned co-occurrence | #2 System-prompt anchor | #3 Allowlist verbs | #4 Guidance splitter | #5 Coach audit |
|---|---|---|---|---|---|
| §1 Buttons | PASS | N/A | PASS | PASS | N/A |
| §2 Tooltips | PASS (disclaim only) | N/A | PASS | PASS | PASS (coach tooltips clean) |
| §3 Empty states | PASS | N/A | PASS | PASS | PASS (coach empty states clean) |
| §4 Loading | PASS | N/A | PASS | PASS | N/A |
| §5 Errors | PASS | N/A | PASS | PASS | N/A |
| §6 Confirmations | PASS | N/A | PASS | PASS | N/A |
| §7 Chat micro-additions | PASS (disclaim only) | inherits landing §A | PASS | PASS | N/A |
| §8 Coach surface | PASS (disclaim only) | inherits landing §A | PASS | PASS | **PASS line-by-line** |
| §9 Onboarding | PASS (disclaim only) | N/A | PASS | PASS | PASS (Stage 3 clean) |
| §10 Notifications | PASS | N/A | PASS | PASS | PASS |

**Audit result: CLEAN across all 10 sections. Zero violations.**

---

## §12. Open questions for PO (return to Navigator)

1. **`tip.disclaimer_short` placement.** v1 spec puts the short disclaimer in tooltip form on AI response surfaces. PO may prefer (a) tooltip-only (current v1), (b) always-visible inline footer below every AI response (already in §7 `chat.response_footer`), or (c) both. Recommendation: keep both — tooltip on first interaction, footer always visible. Per `02_POSITIONING.md` §In-context AI disclaimer (LOCKED 2026-04-23, format TBD), this is the format proposal.
2. **`error.chat_token_exceeded` length tolerance.** v1 sets ~2,000 words. Engineering may want a different token-count cap. Update once tech-lead confirms.
3. **`notif.realtime_event` Pro-tier cadence.** Real-time events are Pro-only per Design Brief §13. v1 leaves observation template open ({SHORT_OBSERVATION}). Backend integration needs to enforce sub-100-char budget at template-fill time.
4. **`onboard.stage3_first_pattern` Day-30 trigger flexibility.** Per Design Brief §13 contextual coach update v1.1, Stage 3 may trigger pre-day-30 if backfill surfaces sufficient history. Copy is written cadence-agnostic (works pre- or post-30). Confirm scope.
5. **Suggested-prompt chips for `empty.chat_no_messages`.** v1 lists three example prompts inline in the body. Alternative: surface as actual clickable chips per Design Brief §10.3 SuggestedPrompt primitive. Recommendation: chip-form (better UX for ICP-A productivity-natives). PO call.

---

## §13. Files in suite

This file is one of three v1 deliverables landing 2026-04-25 alongside `landing-provedo-v1.md` v2 and `email-sequences-provedo-v1.md` + `paywall-provedo-v1.md`. See landing v2 §12 for full suite manifest.

**END microcopy-provedo-v1.md (v1)**
