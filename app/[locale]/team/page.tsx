import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@components/ui/PageHero';
import { TeamGrid } from '@components/sections/TeamGrid';
import { CtaBand } from '@components/ui/CtaBand';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'team' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: locale === 'de' ? '/team' : `/${locale}/team` },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'team' });

  return (
    <>
      <PageHero
        badge={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumb={t('badge')}
      />
      <TeamGrid />
      <CtaBand title={t('ctaTitle')} text={t('ctaText')} button={t('ctaButton')} />
    </>
  );
}
