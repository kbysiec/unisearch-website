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
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
              {messages.freePro.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-slate-300">
              {messages.freePro.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-5 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,103,190,0.45)] ring-1 ring-primary-200/40 md:bg-white/80 md:backdrop-blur dark:border-white/10 dark:bg-slate-900/90 dark:md:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-[0_8px_20px_-10px_rgba(23,158,255,0.7)] dark:bg-primary-500/20 dark:text-primary-200">
                    <Check className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {t(messages, free.titleKey)}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {t(messages, free.descriptionKey)}
              </p>
              <ul className="grid gap-3 text-sm text-gray-700 dark:text-slate-300">
                {free.items.map((itemKey) => (
                  <li key={itemKey} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary-600 dark:text-primary-300" />
                    <span>{t(messages, itemKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative flex h-full flex-col gap-5 rounded-3xl border border-primary-200 bg-gradient-to-br from-white/95 via-white/85 to-primary-50 p-6 shadow-[0_25px_70px_-35px_rgba(23,158,255,0.5)] ring-1 ring-primary-300/40 dark:border-primary-500/40 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/60">
              <Badge variant="primary" className="absolute right-6 top-6 flex items-center gap-2">
                <Star className="h-3 w-3" />
                <span>{t(messages, pro.priceNoteKey)}</span>
              </Badge>
              <div className="flex flex-wrap items-center gap-3 pr-20">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-[0_10px_25px_-12px_rgba(23,158,255,0.7)] dark:bg-primary-500/20 dark:text-primary-200">
                  <Star className="h-5 w-5" />
                </span>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t(messages, pro.titleKey)}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {t(messages, pro.descriptionKey)}
              </p>
              <ul className="grid gap-3 text-sm text-gray-700 dark:text-slate-300">
                {pro.items.map((itemKey) => (
                  <li key={itemKey} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary-600 dark:text-primary-300" />
                    <span>{t(messages, itemKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_50px_-35px_rgba(15,103,190,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/70 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t(messages, summary.titleKey)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-white/10 dark:text-slate-300">
                  {t(messages, 'freePro.summary.headers.free')}
                </span>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                  {t(messages, 'freePro.summary.headers.pro')}
                </span>
              </div>
            </div>
            <div className="grid divide-y divide-white/60">
              {summary.rows.map((row) => (
                <div
                  key={row.labelKey}
                  className="grid grid-cols-3 gap-4 px-6 py-4 text-sm transition hover:bg-primary-50/60 dark:hover:bg-white/5"
                >
                  <div className="font-medium text-gray-700 dark:text-slate-200">
                    {t(messages, row.labelKey)}
                  </div>
                  <div className="text-gray-600 dark:text-slate-300">{t(messages, row.freeKey)}</div>
                  <div className="font-semibold text-primary-700 dark:text-primary-200">
                    {t(messages, row.proKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
