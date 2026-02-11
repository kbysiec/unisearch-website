'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { locales, type Locale } from '@/src/config/i18n';
import { getLocaleLabel } from '@/src/lib/i18n';

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPath = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return '/';
    }
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '';
  }, [pathname]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    router.push(`/${nextLocale}${currentPath}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
      <span className="sr-only">{label}</span>
      <span className="relative w-full md:w-36">
        <select
          value={locale}
          onChange={handleChange}
          className="w-full appearance-none rounded-full border border-primary-500 bg-white px-4 py-2 pr-10 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-primary-400 dark:bg-slate-950 dark:text-primary-200 dark:hover:bg-white/5"
          aria-label={label}
        >
          {locales.map((loc) => (
            <option key={loc} value={loc}>
              {getLocaleLabel(loc)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-700 dark:text-primary-200" />
      </span>
    </label>
  );
}
