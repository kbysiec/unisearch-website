'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
      <select
        value={locale}
        onChange={handleChange}
        className="rounded-full border border-gray-200 bg-white/80 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={label}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {getLocaleLabel(loc)}
          </option>
        ))}
      </select>
    </label>
  );
}
