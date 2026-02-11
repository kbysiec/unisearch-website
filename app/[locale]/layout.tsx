import type { ReactNode } from 'react';
import { locales } from '@/src/config/i18n';
import { requireLocale } from '@/src/lib/i18n';
import { LocaleHtmlLang } from '@/components/layout/locale-html-lang';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = requireLocale(params.locale);

  return (
    <div className="min-h-screen">
      <LocaleHtmlLang locale={locale} />
      {children}
    </div>
  );
}
