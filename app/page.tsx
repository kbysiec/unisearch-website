'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, defaultLocale } from '@/src/config/i18n';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Get browser's preferred language
    const browserLanguages = navigator.languages || [navigator.language];

    // Find the first matching locale
    let selectedLocale = defaultLocale;
    for (const browserLang of browserLanguages) {
      const shortCode = browserLang.split('-')[0].toLowerCase();
      if (locales.includes(shortCode as any)) {
        selectedLocale = shortCode as any;
        break;
      }
    }

    // Redirect to the detected locale
    router.replace(`/${selectedLocale}`);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
