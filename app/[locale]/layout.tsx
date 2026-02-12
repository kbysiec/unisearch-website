import type { ReactNode } from 'react';
import { locales } from '@/src/config/i18n';
import { requireLocale } from '@/src/lib/i18n';
import { LocaleHtmlLang } from '@/components/layout/locale-html-lang';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);

  return (
    <div className="min-h-screen">
      <LocaleHtmlLang locale={locale} />
      {children}
    </div>
  );
}
