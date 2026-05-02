import { THEME_INIT_SCRIPT } from '../../lib/theme';

/**
 * Server Component — emits the SSR no-flicker theme init <script>.
 *
 * Rendered inside <head> (or as the first child of <body>) BEFORE any client
 * code runs. Sets `data-theme` on <html> from localStorage / system preference.
 *
 * `dangerouslySetInnerHTML` is safe here: the content is a static string
 * defined in `lib/theme.ts` with no user input. React requires this form for
 * inline scripts so it does not escape the JS source.
 */
export function ThemeScript() {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: static, audited inline script — see lib/theme.ts
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  );
}
