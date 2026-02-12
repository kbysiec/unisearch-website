'use client';

import { ShieldCheck, Gauge, Sparkles, Sliders } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import type { Messages } from '@/src/lib/i18n';

interface SocialProofProps {
  messages: Messages;
}

const icons = [Gauge, ShieldCheck, Sparkles, Sliders];

export function SocialProof({ messages }: SocialProofProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            {messages.trust.title}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {messages.trust.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="flex h-full flex-col gap-2 rounded-2xl border border-white/60 bg-white/95 p-5 shadow-sm md:bg-white/70 md:backdrop-blur dark:border-white/10 dark:bg-slate-900/90 dark:md:bg-slate-900/70">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
