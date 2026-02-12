'use client';

import {
  Search,
  Zap,
  FolderSearch,
  Users,
  Calculator,
  Globe,
  Palette,
  Sparkles,
} from 'lucide-react';
import { featureGroups } from '@/src/content/features';
import type { Messages } from '@/src/lib/i18n';
import { t } from '@/src/lib/i18n';
import { Reveal } from '@/components/motion/reveal';

const iconMap = {
  Search,
  Zap,
  FolderSearch,
  Users,
  Calculator,
  Globe,
  Palette,
  Sparkles,
};

interface FeaturesProps {
  messages: Messages;
}

export function Features({ messages }: FeaturesProps) {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
              {messages.features.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-slate-300">
              {messages.features.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featureGroups.map((group, index) => {
            const Icon = iconMap[group.icon as keyof typeof iconMap];
            return (
              <Reveal key={group.id} delay={index * 0.05}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/95 p-6 shadow-sm md:bg-white/80 md:backdrop-blur dark:border-white/10 dark:bg-slate-900/90 dark:md:bg-slate-900/70">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {t(messages, group.titleKey)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        {t(messages, group.descriptionKey)}
                      </p>
                    </div>
                  </div>
                  <ul className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
                    {group.items.map((itemKey) => (
                      <li key={itemKey} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-600 dark:bg-primary-300" />
                        <span>{t(messages, itemKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
