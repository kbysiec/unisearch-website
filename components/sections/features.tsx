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
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              {messages.features.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600">{messages.features.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featureGroups.map((group, index) => {
            const Icon = iconMap[group.icon as keyof typeof iconMap];
            return (
              <Reveal key={group.id} delay={index * 0.05}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {t(messages, group.titleKey)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t(messages, group.descriptionKey)}
                      </p>
                    </div>
                  </div>
                  <ul className="grid gap-2 text-sm text-gray-700">
                    {group.items.map((itemKey) => (
                      <li key={itemKey} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-600" />
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
