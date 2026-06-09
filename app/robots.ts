import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/pricing', '/blog'],
      disallow: ['/dashboard', '/optimizer', '/history', '/profile', '/login', '/register', '/api/'],
    },
    sitemap: 'https://hookinator.com/sitemap.xml',
  };
}
