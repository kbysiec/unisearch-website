'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { ASSETS, APP_NAME, PLAY_STORE_URL } from '@/src/config/brand';
import type { Messages } from '@/src/lib/i18n';
import type { Locale } from '@/src/config/i18n';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { cn } from '@/lib/cn';

interface NavbarProps {
  locale: Locale;
  messages: Messages;
}

export function Navbar({ locale, messages }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: messages.nav.features, id: 'features' },
    { label: messages.nav.freePro, id: 'free-pro' },
    { label: messages.nav.changelog, href: `/${locale}/changelog` },
    { label: messages.nav.privacy, href: `/${locale}/privacy` },
    { label: messages.nav.faq, id: 'faq' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 88;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setIsMobileOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300 ease-out',
        isScrolled || isMobileOpen
          ? 'bg-white/90 shadow-sm backdrop-blur-xl dark:bg-slate-950/90 dark:shadow-none'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image src={ASSETS.logo} alt={`${APP_NAME} logo`} fill className="object-contain" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.href ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-primary-700 dark:text-slate-200 dark:hover:text-primary-200"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id!)}
                className="text-sm font-medium text-gray-700 transition hover:text-primary-700 dark:text-slate-200 dark:hover:text-primary-200"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="w-full md:w-auto">
            <LanguageSwitcher locale={locale} label={messages.nav.language} />
          </div>
          <ThemeToggle />
          <a
            className={cn(
              buttonVariants({ variant: 'primary', size: 'sm' }),
              'whitespace-nowrap transition-all duration-300 lg:px-4 lg:py-2 lg:text-sm',
              'h-9 w-9 p-0 lg:h-9 lg:w-auto justify-center gap-0 lg:gap-2'
            )}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GooglePlayIcon className="h-3.5 w-3.5 text-current" />
            <span className="overflow-hidden whitespace-nowrap transition-all duration-300 lg:max-w-[160px] lg:opacity-100 max-w-0 opacity-0">
              {messages.nav.getApp}
            </span>
          </a>
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setIsMobileOpen((open) => !open)}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-white/20 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out md:hidden dark:border-white/10 dark:bg-slate-950/95',
          isMobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMobileOpen}
      >
        <div
          className={cn(
            'space-y-3 px-4 py-4 transition-transform duration-300 ease-out',
            isMobileOpen ? 'translate-y-0' : '-translate-y-2'
          )}
        >
          {navLinks.map((link) =>
            link.href ? (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-white/5"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id!)}
                className="block w-full rounded-lg px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {link.label}
              </button>
            )
          )}
          <div className="flex items-center justify-center gap-3">
            <div className="w-full">
              <LanguageSwitcher locale={locale} label={messages.nav.language} />
            </div>
            <ThemeToggle />
          </div>
          <a
            className={cn(
              buttonVariants({ variant: 'primary', size: 'sm' }),
              'w-full whitespace-nowrap text-center'
            )}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GooglePlayIcon className="h-3.5 w-3.5 text-current" />
            {messages.nav.getApp}
          </a>
        </div>
      </div>
    </nav>
  );
}
