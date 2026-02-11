'use client';

import { buttonVariants } from '@/components/ui/button';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { Reveal } from '@/components/motion/reveal';
import { PLAY_STORE_URL } from '@/src/config/brand';
import type { Messages } from '@/src/lib/i18n';

interface CTAProps {
  messages: Messages;
}

export function CTA({ messages }: CTAProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary-200 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 p-10 text-white shadow-xl dark:border-primary-500/40">
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{messages.cta.title}</h2>
                <p className="mt-2 text-white/80">{messages.cta.subtitle}</p>
              </div>
              <a
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GooglePlayIcon className="h-[18px] w-[18px] text-current" />
                {messages.cta.button}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
