'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { PhoneMock } from '@/components/ui/phone-mock';
import { Reveal } from '@/components/motion/reveal';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container';
import { PLAY_STORE_URL } from '@/src/config/brand';
import type { Messages } from '@/src/lib/i18n';

interface HeroProps {
  messages: Messages;
}

export function Hero({ messages }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-20%] top-[-10%] h-[420px] w-[420px] rounded-full bg-primary-200/50 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[360px] w-[360px] rounded-full bg-primary-400/30 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700 shadow-sm">
                {messages.hero.badge}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-balance text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {messages.hero.title}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-balance text-lg text-gray-600 sm:text-xl">
                {messages.hero.subtitle}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  className={buttonVariants({ variant: 'primary', size: 'lg' })}
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {messages.hero.primaryCta}
                </a>
                <Link
                  className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                  href="#features"
                >
                  {messages.hero.secondaryCta}
                </Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ChevronDown className="h-4 w-4" />
                {messages.hero.note}
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        <Reveal direction="up" className="flex justify-center lg:justify-end">
          <PhoneMock priority className="motion-safe:hover:rotate-2" />
        </Reveal>
      </div>
    </section>
  );
}
