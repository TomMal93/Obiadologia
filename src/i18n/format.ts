type MessageValue = string | number;

export function formatMessage(
  template: string,
  values: Readonly<Record<string, MessageValue>>,
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => (
    Object.hasOwn(values, key) ? String(values[key]) : placeholder
  ));
}

type PluralMessages = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export function formatCountMessage(
  locale: string,
  count: number,
  messages: PluralMessages,
): string {
  const category = new Intl.PluralRules(locale).select(count);
  return formatMessage(messages[category] ?? messages.other, { count });
}
