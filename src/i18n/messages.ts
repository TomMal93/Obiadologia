import type { Locale } from '@/i18n/config';
import { pl } from '@/i18n/locales/pl';

type MessageShape<Value> = Value extends string
  ? string
  : Value extends readonly string[]
    ? readonly string[]
    : { readonly [Key in keyof Value]: MessageShape<Value[Key]> };

export type AppMessages = MessageShape<typeof pl>;

const messagesByLocale: Record<Locale, AppMessages> = {
  pl,
};

export function getMessages(locale: Locale): AppMessages {
  return messagesByLocale[locale];
}
