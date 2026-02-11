'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { privacySections } from '@/src/content/privacy';
import type { Messages } from '@/src/lib/i18n';
import type { Locale } from '@/src/config/i18n';
import { t } from '@/src/lib/i18n';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface PrivacyContentProps {
  locale: Locale;
  messages: Messages;
}

export function PrivacyContent({ locale, messages }: PrivacyContentProps) {
  const [activeSection, setActiveSection] = React.useState(privacySections[0].id);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of privacySections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 120;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="border-b border-white/50 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-4 inline-flex')}
          >
            <ArrowLeft className="h-4 w-4" />
            {messages.common.back}
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
            {messages.privacy.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            {messages.privacy.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2">
              {privacySections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'block w-full rounded-lg px-4 py-2 text-left text-sm transition',
                    activeSection === section.id
                      ? 'bg-primary-50 font-medium text-primary-700'
                      : 'text-gray-600 hover:bg-white'
                  )}
                >
                  {t(messages, section.titleKey)}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <div className="prose prose-gray max-w-none rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:prose-invert">
              <p className="text-lg text-gray-700 dark:text-slate-200">{messages.privacy.intro}</p>

              {privacySections.map((section) => {
                const content = (messages.privacy.sections as any)[section.id];
                return (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2>{content?.title ?? t(messages, section.titleKey)}</h2>
                    {(content?.body ?? []).map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
