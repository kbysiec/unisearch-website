import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { SocialProof } from '@/components/sections/social-proof';
import { Features } from '@/components/sections/features';
import { HowItWorks } from '@/components/sections/how-it-works';
import { FreePro } from '@/components/sections/free-pro';
import { FAQ } from '@/components/sections/faq';
import { CTA } from '@/components/sections/cta';
import { APP_NAME, ASSETS, SITE_URL } from '@/src/config/brand';
import { locales } from '@/src/config/i18n';
import { getMessages, requireLocale } from '@/src/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const messages = getMessages(locale);
  const title = messages.meta.title;
  const description = messages.meta.description;
  const url = `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((loc) => [loc, `${SITE_URL}/${loc}`])),
    },
    openGraph: {
      title,
      description,
      type: 'website',
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
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ASSETS.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const messages = getMessages(locale);

  return (
    <>
      <Navbar locale={locale} messages={messages} />
      <main>
        <Hero messages={messages} />
        <SocialProof messages={messages} />
        <Features messages={messages} />
        <HowItWorks messages={messages} />
        <FreePro messages={messages} />
        <CTA messages={messages} />
        <FAQ messages={messages} />
      </main>
      <Footer locale={locale} messages={messages} />
    </>
  );
}
