import { notFound } from 'next/navigation';
import type { Locale } from '@/src/config/i18n';
import { defaultLocale, locales, localeLabels } from '@/src/config/i18n';

import en from '@/src/messages/en.json';
import pl from '@/src/messages/pl.json';
import de from '@/src/messages/de.json';
import fr from '@/src/messages/fr.json';
import es from '@/src/messages/es.json';
import it from '@/src/messages/it.json';
import nl from '@/src/messages/nl.json';
import sv from '@/src/messages/sv.json';
import no from '@/src/messages/no.json';
import da from '@/src/messages/da.json';
import fi from '@/src/messages/fi.json';
import cs from '@/src/messages/cs.json';
import sk from '@/src/messages/sk.json';
import hu from '@/src/messages/hu.json';
import ro from '@/src/messages/ro.json';
import ja from '@/src/messages/ja.json';
import ko from '@/src/messages/ko.json';
import zh from '@/src/messages/zh.json';
import th from '@/src/messages/th.json';
import vi from '@/src/messages/vi.json';
import id from '@/src/messages/id.json';
import ru from '@/src/messages/ru.json';
import tr from '@/src/messages/tr.json';
import fil from '@/src/messages/fil.json';
import hi from '@/src/messages/hi.json';
import pt from '@/src/messages/pt.json';

const messages = {
  en,
  pl,
  de,
  fr,
  es,
  it,
  nl,
  sv,
  no,
  da,
  fi,
  cs,
  sk,
  hu,
  ro,
  ja,
  ko,
  zh,
  th,
  vi,
  id,
  ru,
  tr,
  fil,
  hi,
  pt,
} as const;

export type Messages = typeof en;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: string): Messages {
  if (!isLocale(locale)) {
    return messages[defaultLocale];
  }
  return messages[locale] ?? messages[defaultLocale];
}

export function requireLocale(locale: string): Locale {
  if (!isLocale(locale)) {
    notFound();
  }
  return locale;
}

export function getLocaleLabel(locale: Locale): string {
  return localeLabels[locale];
}

export function t(
  dict: Messages,
  key: string,
  values?: Record<string, string | number>
): string {
  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    current = current?.[part];
  }
  if (typeof current !== 'string') {
    return key;
  }
  if (!values) {
    return current;
  }
  return Object.entries(values).reduce((acc, [valueKey, value]) => {
    return acc.replaceAll(`{${valueKey}}`, String(value));
  }, current);
}
