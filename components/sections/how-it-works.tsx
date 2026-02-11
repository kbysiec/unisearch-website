'use client';

import { howItWorksSteps } from '@/src/content/howItWorks';
import type { Messages } from '@/src/lib/i18n';
import { t } from '@/src/lib/i18n';
import { Reveal } from '@/components/motion/reveal';

interface HowItWorksProps {
  messages: Messages;
}

export function HowItWorks({ messages }: HowItWorksProps) {
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
              {messages.how.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-slate-300">{messages.how.subtitle}</p>
          </div>
        </Reveal>

        <div className="relative mt-12">
          <svg
            className="absolute left-1/2 top-0 hidden h-full w-6 -translate-x-1/2 lg:block"
            viewBox="0 0 24 600"
            fill="none"
          >
            <path
              d="M12 10v580"
              stroke="#179EFF"
              strokeWidth="2"
              strokeDasharray="6 10"
              className="motion-safe:animate-draw"
            />
          </svg>
          <div className="grid gap-8 lg:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <Reveal key={step.id} delay={index * 0.1}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t(messages, step.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {t(messages, step.descriptionKey)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
