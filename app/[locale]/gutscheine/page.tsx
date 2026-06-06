import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Gift, FileText, Mail } from 'lucide-react';
import { PageHero } from '@components/ui/PageHero';
import { GutscheinForm } from '@components/sections/GutscheinForm';
import { salonConfig } from '@lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gutscheine' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: locale === 'de' ? '/gutscheine' : `/${locale}/gutscheine` },
  };
}

export default async function GutscheinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gutscheine' });

  const steps = [
    { icon: Gift, title: t('step1Title'), desc: t('step1Desc') },
    { icon: FileText, title: t('step2Title'), desc: t('step2Desc') },
    { icon: Mail, title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <>
      <PageHero
        badge={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumb={t('badge')}
      />

      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-narrow grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: how it works + amounts */}
          <div className="space-y-10">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-text)] mb-6 tracking-tight">
                {t('howTitle')}
              </h2>
              <div className="space-y-5">
                {steps.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center">
                        <Icon size={20} className="text-[var(--color-blue-glow)]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)] mb-0.5">{title}</h3>
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                {t('amountsTitle')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {salonConfig.giftVoucherAmounts.map((a) => (
                  <div
                    key={a}
                    className="relative rounded-2xl gradient-blue px-6 py-5 text-white shadow-lg shadow-[var(--color-blue)]/20"
                  >
                    <Gift size={16} className="text-white/70 mb-1" />
                    <p className="text-2xl font-extrabold leading-none">{a} €</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <GutscheinForm />
        </div>
      </section>
    </>
  );
}
