import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://friseur-demo.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/impressum', '/datenschutz'];

  return routes.flatMap((route) => [
    {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.5,
      alternates: {
        languages: {
          de: `${baseUrl}${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    },
  ]);
}
