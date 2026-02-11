import type { Metadata } from 'next';
import { PrivacyContent } from '@/components/privacy/privacy-content';
import { APP_NAME, ASSETS, SITE_URL } from '@/src/config/brand';
import { getMessages, requireLocale } from '@/src/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = requireLocale(params.locale);
  const messages = getMessages(locale);
  const title = `${messages.meta.privacyTitle} · ${APP_NAME}`;
  const description = messages.meta.privacyDescription;
  const url = `${SITE_URL}/${locale}/privacy`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      images: [
        {
          url: ASSETS.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ASSETS.ogImage],
    },
  };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale = requireLocale(params.locale);
  const messages = getMessages(locale);

  return <PrivacyContent locale={locale} messages={messages} />;
}
