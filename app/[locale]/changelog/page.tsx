import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import ReactMarkdown from 'react-markdown';
import { APP_NAME, ASSETS, SITE_URL } from '@/src/config/brand';
import { getMessages, requireLocale } from '@/src/lib/i18n';
import type { Locale } from '@/src/config/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = requireLocale(params.locale);
  const messages = getMessages(locale);
  const title = `Changelog · ${APP_NAME}`;
  const description = 'Release notes and improvements for UniSearch.';
  const url = `${SITE_URL}/${locale}/changelog`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      images: [
        {
          url: ASSETS.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ASSETS.ogImage],
    },
  };
}

export default function ChangelogPage({ params }: { params: { locale: Locale } }) {
  const locale = requireLocale(params.locale);
  const filePath = path.join(process.cwd(), 'src', 'content', 'changelog.md');
  const markdown = fs.readFileSync(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="border-b border-white/50 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">Changelog</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Latest updates and improvements.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
