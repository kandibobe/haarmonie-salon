import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@components/ui/PageHero';
import { PriceList } from '@components/sections/PriceList';
import { CtaBand } from '@components/ui/CtaBand';
import { priceList, salonConfig } from '@lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'priceList' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: locale === 'de' ? '/leistungen' : `/${locale}/leistungen` },
  };
}

export default async function LeistungenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'priceList' });

  // OfferCatalog für strukturierte Daten (Preise in Suchergebnissen).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: t('title'),
    provider: { '@type': salonConfig.businessType, name: salonConfig.name },
    itemListElement: priceList.flatMap((cat) =>
      cat.items.map((item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''), 10);
        return {
          '@type': 'Offer',
          name: t(item.nameKey),
          category: t(cat.titleKey),
          priceCurrency: 'EUR',
          ...(price ? { price: String(price) } : {}),
        };
      })
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        badge={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumb={t('badge')}
      />
      <PriceList />
      <CtaBand title={t('ctaTitle')} text={t('ctaText')} button={t('ctaButton')} />
    </>
  );
}
