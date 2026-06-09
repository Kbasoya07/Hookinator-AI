import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Creator Blog & Growth Guide | Hookinator AI',
  description: 'Learn how to write viral YouTube titles, optimize SEO descriptions, structure hashtags, and double your CTR using our growth guides.',
  alternates: {
    canonical: 'https://hookinator.com/blog',
  },
  openGraph: {
    title: 'YouTube Creator Blog & Growth Guide | Hookinator AI',
    description: 'Learn how to write viral YouTube titles, optimize SEO descriptions, structure hashtags, and double your CTR using our growth guides.',
    url: 'https://hookinator.com/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
