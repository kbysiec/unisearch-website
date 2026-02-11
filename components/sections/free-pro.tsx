'use client';

import { Check, Star } from 'lucide-react';
import { freeProContent } from '@/src/content/freePro';
import type { Messages } from '@/src/lib/i18n';
import { t } from '@/src/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/motion/reveal';

interface FreeProProps {
  messages: Messages;
}

export function FreePro({ messages }: FreeProProps) {
  const { free, pro, summary } = freeProContent;

  return (
    <section id="free-pro" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              {messages.freePro.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600">{messages.freePro.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-5 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h3 className="text-2xl font-semibold text-gray-900">{t(messages, free.titleKey)}</h3>
              <p className="text-sm text-gray-600">{t(messages, free.descriptionKey)}</p>
              <ul className="grid gap-3 text-sm text-gray-700">
                {free.items.map((itemKey) => (
                  <li key={itemKey} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary-600" />
                    <span>{t(messages, itemKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative flex h-full flex-col gap-5 rounded-3xl border border-primary-200 bg-gradient-to-br from-white/90 via-white/80 to-primary-50 p-6 shadow-lg shadow-primary-500/15">
              <Badge variant="primary" className="absolute right-6 top-6 flex items-center gap-1">
                <Star className="h-3 w-3" />
                {t(messages, pro.badgeKey)}
              </Badge>
              <h3 className="text-2xl font-semibold text-gray-900">{t(messages, pro.titleKey)}</h3>
              <p className="text-sm text-gray-600">{t(messages, pro.descriptionKey)}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                {t(messages, pro.priceNoteKey)}
              </p>
              <ul className="grid gap-3 text-sm text-gray-700">
                {pro.items.map((itemKey) => (
                  <li key={itemKey} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary-600" />
                    <span>{t(messages, itemKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <div className="border-b border-white/70 px-6 py-4 text-sm font-semibold text-gray-900">
              {t(messages, summary.titleKey)}
            </div>
            <div className="grid divide-y divide-white/60">
              {summary.rows.map((row) => (
                <div key={row.labelKey} className="grid grid-cols-3 gap-4 px-6 py-4 text-sm">
                  <div className="font-medium text-gray-700">{t(messages, row.labelKey)}</div>
                  <div className="text-gray-600">{t(messages, row.freeKey)}</div>
                  <div className="font-semibold text-primary-700">{t(messages, row.proKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
