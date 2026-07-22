export const supportedLocales = ['pl'] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'pl';

export const localeMetadata: Record<Locale, { htmlLang: string }> = {
  pl: { htmlLang: 'pl-PL' },
};
