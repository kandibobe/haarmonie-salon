import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@components/ui/PageHero';
import { ContactSection } from '@components/sections/ContactSection';
import { KontaktForm } from '@components/sections/KontaktForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kontakt' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: locale === 'de' ? '/kontakt' : `/${locale}/kontakt` },
  };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kontakt' });

  return (
    <>
      <PageHero
        badge={t('pageTitle')}
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        breadcrumb={t('pageTitle')}
      />

      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-narrow max-w-2xl">
          <KontaktForm />
        </div>
      </section>

      <ContactSection showHeader={false} />
    </>
  );
}
