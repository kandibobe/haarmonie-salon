import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';

import { Header } from '@components/layout/Header';
import { Footer } from '@components/layout/Footer';
import { DemoBanner } from '@components/ui/DemoBanner';
import { FloatingCallButton } from '@components/ui/FloatingCallButton';
import { ChatWidget } from '@components/chat/ChatWidget';
import { ConsentProvider } from '@components/features/consent/ConsentProvider';
import { CookieBanner } from '@components/features/consent/CookieBanner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { salonConfig } from '@lib/config';
import '../globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': salonConfig.businessType,
  name: salonConfig.name,
  description: salonConfig.seo.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: salonConfig.structuredAddress.street,
    addressLocality: salonConfig.structuredAddress.locality,
    postalCode: salonConfig.structuredAddress.postalCode,
    addressCountry: salonConfig.structuredAddress.country,
  },
  telephone: salonConfig.phone,
  email: salonConfig.email,
  url: process.env.NEXT_PUBLIC_APP_URL || salonConfig.defaultUrl,
  openingHours: salonConfig.openingHoursSchemaOrg,
  priceRange: '€€',
  areaServed: { '@type': 'City', name: salonConfig.structuredAddress.locality },
  hasMap: salonConfig.googleMapsEmbedUrl,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: salonConfig.aggregateRating.ratingValue,
    reviewCount: salonConfig.aggregateRating.reviewCount,
  },
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || salonConfig.defaultUrl
    ),
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      locale,
      siteName: salonConfig.name,
      title: t('title'),
      description: t('description'),
    },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: {
        de: '/',
        en: '/en',
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ConsentProvider>
            <DemoBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingCallButton />
            <ChatWidget />
            <CookieBanner />
            <Toaster position="bottom-center" richColors />
          </ConsentProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
