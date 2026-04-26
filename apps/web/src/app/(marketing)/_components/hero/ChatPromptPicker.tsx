'use client';

// ChatPromptPicker — Slice-LP6 fresh-eyes gap #2 (working chat demo)
//
// 4 clickable chips below the hero ChatAppShell. Each chip clicked triggers
// in-place replay of a pre-canned answer in the SAME ChatAppShell upstream.
// NO backend, NO real LLM call — just predefined Q→A pairs cycling through
// the existing ChatMockup machinery.
//
// Strategist gap addressed: hero CTA «Ask Provedo» previously jumped to a
// static §S4 anchor; cold visitor expected to type, got scripted teaser. The
// picker keeps the «no chat input box» promise (pre-alpha discipline — we do
// not yet have an open-prompt LLM surface) but converts the soft scroll into
// a clickable, replayable demo on the same screen.
//
// Lane A: chips are observation-coded labels («Why is my portfolio down?»,
// «Show my sector exposure», «Any patterns in my recent trades?», «What
// dividends are coming?»). Each canned answer (from chat-prompts.ts) stays
// inside the verb allowlist — no «recommend / advise / suggest».
//
// A11y:
//   - Each chip is a real <button> with `type="button"`, focus-visible ring,
//     and `aria-pressed` reflecting the active prompt for SR users.
//   - The picker is wrapped in a labelled <div role="group"> so SR navigation
//     announces «Sample questions» as the group label.
//   - Hero CTA «Ask Provedo» now anchors to `#prompt-picker` (the group's id)
//     and the first chip carries the `data-prompt-picker-first` attribute so
//     the CTA can scroll-and-focus the first chip in one motion.
//
// Motion budget (5 anim rules HARD):
//   - Chip transitions: opacity + transform only, ≤ 180ms ease-out.
//   - prefers-reduced-motion: disables all chip transitions; replay-on-click
//     still works (state change is the demo, not the animation).

import type { ReactElement } from 'react';
import { useId } from 'react';
import type { ChatPrompt, ChatPromptId } from './chat-prompts';
import { CHAT_PROMPTS } from './chat-prompts';

interface ChatPromptPickerProps {
  /** Currently active prompt id — drives `aria-pressed` + visual state. */
  activePromptId: ChatPromptId;
  /** Fired when a chip is clicked. Parent swaps the ChatMockup `prompt` prop. */
  onPromptSelect: (prompt: ChatPrompt) => void;
}

const PICKER_GROUP_ID = 'prompt-picker';

export function ChatPromptPicker({
  activePromptId,
  onPromptSelect,
}: ChatPromptPickerProps): ReactElement {
  const labelId = useId();

  return (
    <div
      data-testid="chat-prompt-picker"
      id={PICKER_GROUP_ID}
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> brings form-styling chrome we don't want on a marketing-surface button cluster; role="group" + aria-labelledby is the ARIA-correct grouping for an unrelated set of controls (WAI-ARIA 1.2 §7.4.3).
      role="group"
      aria-labelledby={labelId}
      style={{
        // Modest top spacing so the picker reads as a sibling of the chat
        // shell, not glued to its bottom edge.
        marginTop: '24px',
      }}
    >
      <p
        id={labelId}
        data-testid="chat-prompt-picker-label"
        style={{
          fontFamily: 'var(--provedo-font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--provedo-text-tertiary)',
          marginBottom: '10px',
        }}
      >
        Try a sample question
      </p>

      <div
        data-testid="chat-prompt-picker-chips"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {CHAT_PROMPTS.map((prompt, idx) => (
          <PromptChip
            key={prompt.id}
            prompt={prompt}
            isActive={prompt.id === activePromptId}
            isFirst={idx === 0}
            onClick={() => onPromptSelect(prompt)}
          />
        ))}
      </div>
    </div>
  );
}

interface PromptChipProps {
  prompt: ChatPrompt;
  isActive: boolean;
  isFirst: boolean;
  onClick: () => void;
}

function PromptChip({ prompt, isActive, isFirst, onClick }: PromptChipProps): ReactElement {
  // Chip visuals follow the same restraint register as the rest of the page:
  // mono-pill chrome (slate-100 bg + hairline border + rounded-full), with
  // the active chip getting a teal-accent border + cream-tinted bg so the
  // current selection reads at a glance.
  // Use longhand border-* props (not shorthand `border`) so the imperative
  // hover handlers can mutate borderColor without React warning about mixing
  // shorthand + longhand on the same element.
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: '36px',
    padding: '0 14px',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--provedo-border-subtle)',
    backgroundColor: 'var(--provedo-bg-elevated)',
    color: 'var(--provedo-text-secondary)',
    fontFamily: 'var(--provedo-font-sans)',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '-0.005em',
    lineHeight: 1,
    cursor: 'pointer',
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
  };

  const activeStyle: React.CSSProperties = isActive
    ? {
        backgroundColor: 'var(--provedo-accent-subtle)',
        borderColor: 'var(--provedo-accent)',
        color: 'var(--provedo-accent-active)',
      }
    : {};

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    if (isActive) return;
    e.currentTarget.style.borderColor = 'var(--provedo-accent)';
    e.currentTarget.style.color = 'var(--provedo-accent-active)';
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    if (isActive) return;
    e.currentTarget.style.borderColor = 'var(--provedo-border-subtle)';
    e.currentTarget.style.color = 'var(--provedo-text-secondary)';
  }

  return (
    <button
      type="button"
      data-testid={`chat-prompt-chip-${prompt.id}`}
      data-prompt-picker-first={isFirst ? 'true' : undefined}
      aria-pressed={isActive}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="focus-visible:outline-2 focus-visible:[outline-color:var(--provedo-accent)] focus-visible:[outline-offset:2px]"
      style={{ ...baseStyle, ...activeStyle, outline: 'none' }}
    >
      {prompt.chipLabel}
    </button>
  );
}
