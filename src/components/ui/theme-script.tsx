import { THEME_COOKIE_NAME, THEME_LEGACY_COOKIE_NAMES } from '@/lib/cookies'

const script = `
(() => {
  const storageKeys = ${JSON.stringify([
    THEME_COOKIE_NAME,
    ...THEME_LEGACY_COOKIE_NAMES,
  ])};
  const defaultTheme = 'system';
  const root = document.documentElement;
  const getCookie = (name) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length !== 2) return undefined;
    return decodeURIComponent(parts.pop().split(';').shift());
  };
  const theme =
    storageKeys.map((name) => getCookie(name)).find(Boolean) || defaultTheme;
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
})();
`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
