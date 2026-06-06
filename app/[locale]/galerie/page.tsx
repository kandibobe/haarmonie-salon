import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@components/ui/PageHero';
import { ProjectsSection } from '@components/sections/ProjectsSection';
import { CtaBand } from '@components/ui/CtaBand';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: locale === 'de' ? '/galerie' : `/${locale}/galerie` },
  };
}

export default async function GaleriePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  const tp = await getTranslations({ locale, namespace: 'priceList' });

  return (
    <>
      <PageHero
        badge={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumb={t('badge')}
      />
      <ProjectsSection showHeader={false} />
      <CtaBand title={tp('ctaTitle')} text={tp('ctaText')} button={tp('ctaButton')} />
    </>
  );
}
