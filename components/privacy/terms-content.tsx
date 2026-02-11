import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/src/config/i18n';
import type { Messages } from '@/src/lib/i18n';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface TermsContentProps {
  locale: Locale;
  messages: Messages;
}

export function TermsContent({ locale, messages }: TermsContentProps) {
  const sections = Object.entries(messages.terms.sections);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="border-b border-white/50 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-4 inline-flex')}
          >
            <ArrowLeft className="h-4 w-4" />
            {messages.common.back}
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
            {messages.terms.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
            {messages.terms.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:prose-invert">
          <p className="text-lg text-gray-700 dark:text-slate-200">{messages.terms.intro}</p>
          {sections.map(([id, section]) => (
            <section key={id} className="scroll-mt-28">
              <h2>{section.title}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
