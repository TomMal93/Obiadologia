import { describe, expect, it } from 'vitest';
import { formatCountMessage, formatMessage } from '@/i18n/format';
import { defaultLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

const messages = getMessages(defaultLocale);

describe('localized UI message formatting', () => {
  it('interpolates named values without changing unknown placeholders', () => {
    expect(formatMessage('Wynik: {count}, {missing}', { count: 3 }))
      .toBe('Wynik: 3, {missing}');
  });

  it('uses Polish plural categories for result announcements', () => {
    const forms = messages.experience.discovery.resultAnnouncement;

    expect(formatCountMessage(defaultLocale, 1, forms)).toBe('Znaleziono 1 propozycję.');
    expect(formatCountMessage(defaultLocale, 2, forms)).toBe('Znaleziono 2 propozycje.');
    expect(formatCountMessage(defaultLocale, 5, forms)).toBe('Znaleziono 5 propozycji.');
  });
});
