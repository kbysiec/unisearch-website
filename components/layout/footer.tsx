import Link from 'next/link';
import { APP_NAME, CONTACT_EMAIL, PLAY_STORE_URL } from '@/src/config/brand';
import type { Locale } from '@/src/config/i18n';
import type { Messages } from '@/src/lib/i18n';
import { t } from '@/src/lib/i18n';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';

interface FooterProps {
  locale: Locale;
  messages: Messages;
  showTerms?: boolean;
}

export function Footer({ locale, messages, showTerms = true }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/30 bg-white/70 py-12 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{APP_NAME}</p>
            <p className="text-sm text-gray-600 dark:text-slate-300">{messages.hero.note}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 dark:text-slate-300">
            <Link href={`/${locale}/privacy`} className="hover:text-primary-700">
              {messages.footer.privacy}
            </Link>
            {showTerms && (
              <Link href={`/${locale}/terms`} className="hover:text-primary-700">
                {messages.footer.terms}
              </Link>
            )}
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary-700">
              {messages.footer.contact}
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary-700"
            >
              <GooglePlayIcon className="h-3.5 w-3.5 text-current" />
              {messages.footer.googlePlay}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-slate-400">
          <p>{t(messages, 'footer.copyright', { year })}</p>
          <a
            href="https://webybox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-200"
          >
            {messages.footer.createdBy}
          </a>
        </div>
        <p className="sr-only">
          {t(messages, 'footer.copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
