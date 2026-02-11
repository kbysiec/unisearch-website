'use client';

import { Accordion } from '@/components/ui/accordion';
import { Reveal } from '@/components/motion/reveal';
import { faqItems } from '@/src/content/faq';
import type { Messages } from '@/src/lib/i18n';
import { t } from '@/src/lib/i18n';

interface FAQProps {
  messages: Messages;
}

export function FAQ({ messages }: FAQProps) {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              {messages.faq.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600">{messages.faq.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-10 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <Accordion
            items={faqItems.map((item) => ({
              question: t(messages, item.questionKey),
              answer: t(messages, item.answerKey),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
