import { MetadataRoute } from 'next';
import { salonConfig } from '@lib/config';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || salonConfig.defaultUrl;

// Inhaltliche Hauptseiten (höhere Priorität) + rechtliche Seiten.
const contentRoutes = ['', '/leistungen', '/team', '/galerie', '/gutscheine', '/kontakt'];
const legalRoutes = ['/impressum', '/datenschutz', '/agb'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...contentRoutes, ...legalRoutes];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : legalRoutes.includes(route) ? 0.3 : 0.8,
    alternates: {
      languages: {
        de: `${baseUrl}${route}`,
        en: `${baseUrl}/en${route}`,
      },
    },
  }));
}
