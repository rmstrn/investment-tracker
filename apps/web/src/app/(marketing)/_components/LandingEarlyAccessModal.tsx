'use client';

// LandingEarlyAccessModal — Landing-v2 §E
//
// Modal triggered by every primary CTA on the page. Opens via window
// CustomEvent('provedo:open-early-access') so any CTA can dispatch without
// prop-drilling. Uses native <dialog> with showModal()/close() for built-in
// focus trap, ESC handling, and backdrop click semantics.
//
// Form: email (required) + setup (optional). POSTs to /api/early-access.
// Success: form is replaced with a confirmation. Error: inline message.
//
// Reduced-motion: instant open/close, no scale animation.

import {
  type CSSProperties,
  type FormEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const OPEN_EVENT = 'provedo:open-early-access';

const BACKDROP_STYLE = `
  .provedo-modal::backdrop {
    background-color: rgba(15, 23, 42, 0.4);
    animation: provedo-modal-backdrop-in 200ms ease-out;
  }
  .provedo-modal {
    border: 1px solid var(--provedo-border-subtle);
    border-radius: 12px;
    background-color: var(--provedo-bg-elevated);
    color: var(--provedo-text-primary);
    padding: 0;
    max-width: 480px;
    width: calc(100% - 32px);
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 48px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.08);
    animation: provedo-modal-in 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes provedo-modal-in {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes provedo-modal-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .provedo-modal,
    .provedo-modal::backdrop {
      animation: none !important;
    }
  }
`;

const HEADING_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: 1.25,
  letterSpacing: '-0.015em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
};

const SUB_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
};

const LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: 1.4,
  color: 'var(--provedo-text-secondary)',
  display: 'block',
  marginBottom: '6px',
};

const INPUT_STYLE: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--provedo-font-sans)',
  fontSize: '15px',
  lineHeight: 1.4,
  color: 'var(--provedo-text-primary)',
  backgroundColor: 'var(--provedo-bg-page)',
  border: '1px solid var(--provedo-border-default)',
  borderRadius: '6px',
  padding: '10px 12px',
  outline: 'none',
};

const FOOT_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  fontStyle: 'italic',
};

const ERROR_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '13px',
  color: 'var(--provedo-negative)',
  margin: 0,
};

const SUBMIT_STYLE: CSSProperties = {
  width: '100%',
  height: '48px',
  backgroundColor: 'var(--provedo-accent)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '6px',
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'background-color 150ms ease-out',
};

const CLOSE_BUTTON_STYLE: CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  border: 'none',
  borderRadius: '6px',
  background: 'transparent',
  color: 'var(--provedo-text-tertiary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  lineHeight: 1,
  fontFamily: 'var(--provedo-font-sans)',
};

export function LandingEarlyAccessModal(): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [setup, setSetup] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const prefersReduced = usePrefersReducedMotion();

  const handleClose = useCallback(() => {
    const dlg = dialogRef.current;
    if (dlg?.open) dlg.close();
  }, []);

  const handleOpen = useCallback(() => {
    const dlg = dialogRef.current;
    if (!dlg || dlg.open) return;
    dlg.showModal();
    // Focus the email input after the dialog opens
    requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
  }, []);

  // Wire the global open-event so any CTA can pop the modal
  useEffect(() => {
    function listener() {
      handleOpen();
    }
    window.addEventListener(OPEN_EVENT, listener);
    return () => window.removeEventListener(OPEN_EVENT, listener);
  }, [handleOpen]);

  // Backdrop click closes the dialog. Native <dialog> does not auto-handle
  // this. We listen for clicks where the target is the dialog itself
  // (i.e. the backdrop), not its children.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    function handleClick(e: MouseEvent) {
      if (e.target === dlg) handleClose();
    }
    dlg.addEventListener('click', handleClick);
    return () => dlg.removeEventListener('click', handleClick);
  }, [handleClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState === 'submitting') return;
    setErrorMessage('');
    setSubmitState('submitting');

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, setup: setup || undefined }),
      });
      const data = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !data.success) {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setSubmitState('error');
        return;
      }
      setSubmitState('success');
    } catch {
      setErrorMessage('Network error. Please try again.');
      setSubmitState('error');
    }
  }

  const transitionStyle: CSSProperties = prefersReduced ? { animation: 'none' } : {};

  return (
    <>
      <style>{BACKDROP_STYLE}</style>
      <dialog
        ref={dialogRef}
        className="provedo-modal"
        data-testid="early-access-modal"
        aria-labelledby="early-access-title"
        style={transitionStyle}
      >
        <div style={{ position: 'relative', padding: '40px' }}>
          <button
            type="button"
            data-testid="early-access-close"
            aria-label="Close dialog"
            onClick={handleClose}
            style={CLOSE_BUTTON_STYLE}
          >
            <span aria-hidden="true">×</span>
          </button>

          {submitState === 'success' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 id="early-access-title" style={HEADING_STYLE}>
                Thanks.
              </h2>
              <p style={SUB_STYLE}>We&apos;ll be in touch within a week. We read every reply.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-testid="early-access-form"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <h2 id="early-access-title" style={HEADING_STYLE}>
                Get early access
              </h2>
              <p style={SUB_STYLE}>
                Pre-alpha. We let people in slowly. Tell us a bit about your setup.
              </p>

              <div>
                <label htmlFor="early-access-email" style={LABEL_STYLE}>
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="early-access-email"
                  data-testid="early-access-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-invalid={submitState === 'error' && errorMessage.length > 0}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label htmlFor="early-access-setup" style={LABEL_STYLE}>
                  Your brokers (optional)
                </label>
                <input
                  id="early-access-setup"
                  data-testid="early-access-setup"
                  type="text"
                  value={setup}
                  onChange={(e) => setSetup(e.target.value)}
                  placeholder="Schwab + IBKR + Coinbase"
                  style={INPUT_STYLE}
                />
              </div>

              {errorMessage && (
                <p data-testid="early-access-error" style={ERROR_STYLE} role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                data-testid="early-access-submit"
                disabled={submitState === 'submitting'}
                style={{
                  ...SUBMIT_STYLE,
                  opacity: submitState === 'submitting' ? 0.7 : 1,
                  cursor: submitState === 'submitting' ? 'wait' : 'pointer',
                }}
              >
                {submitState === 'submitting' ? 'Sending…' : 'Request early access'}
              </button>

              <p style={FOOT_STYLE}>We read every reply. No marketing emails — ever.</p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}

/**
 * Helper for any CTA on the page to open the modal without prop-drilling.
 * Dispatches a window CustomEvent that the modal listens for.
 */
export function dispatchOpenEarlyAccess(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
