/**
 * Themes Clerk-hosted UI (SignIn / SignUp / UserButton) using our design
 * tokens. Tokens are referenced as CSS custom properties so dark-mode flips
 * follow the rest of the app.
 *
 * Typed via Clerk's structural `appearance` prop — no explicit annotation so
 * we avoid pulling `@clerk/types` as a direct devDep.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--color-interactive-primary)',
    colorText: 'var(--color-text-primary)',
    colorTextSecondary: 'var(--color-text-secondary)',
    colorBackground: 'var(--color-background-primary)',
    colorInputBackground: 'var(--color-background-elevated)',
    colorInputText: 'var(--color-text-primary)',
    colorDanger: 'var(--color-state-negative-default)',
    colorSuccess: 'var(--color-state-positive-default)',
    colorWarning: 'var(--color-state-warning-default)',
    borderRadius: '0.5rem',
    fontFamily: 'var(--font-sans)',
  },
  elements: {
    card: 'shadow-md border border-border-subtle bg-background-elevated',
    headerTitle: 'text-text-primary',
    headerSubtitle: 'text-text-secondary',
    socialButtonsBlockButton:
      'border border-border-default bg-background-elevated text-text-primary hover:bg-interactive-ghostHover',
    formButtonPrimary: 'bg-interactive-primary text-text-onBrand hover:bg-interactive-primaryHover',
    footerActionLink: 'text-interactive-primary hover:text-interactive-primaryHover',
  },
} as const;
