'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ASSETS, APP_NAME, PLAY_STORE_URL } from '@/src/config/brand';
import type { Messages } from '@/src/lib/i18n';
import type { Locale } from '@/src/config/i18n';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
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
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/85 shadow-sm backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm">
            <Image src={ASSETS.logo} alt={`${APP_NAME} logo`} fill className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-gray-900">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.href ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-primary-700"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id!)}
                className="text-sm font-medium text-gray-700 transition hover:text-primary-700"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} label={messages.nav.language} />
          <a
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {messages.nav.getApp}
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

      {isMobileOpen && (
        <div className="border-t border-white/20 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="space-y-3 px-4 py-4">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-primary-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.id!)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-primary-50"
                >
                  {link.label}
                </button>
              )
            )}
            <LanguageSwitcher locale={locale} label={messages.nav.language} />
            <a
              className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'w-full')}
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {messages.nav.getApp}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
