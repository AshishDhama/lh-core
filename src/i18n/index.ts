import { I18n } from 'i18n-js';

import { en } from './en';

export type { Translations } from './en';

const i18n = new I18n();

i18n.store(en);
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;

export { i18n };

/**
 * Translate a dot-notation key.
 * Example: t('nav.dashboard') → 'Dashboard'
 */
export function t(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options);
}

/** Set active locale (e.g. 'en', 'hi'). */
export function setLocale(locale: string): void {
  i18n.locale = locale;
}

/** Get active locale. */
export function getLocale(): string {
  return i18n.locale;
}
