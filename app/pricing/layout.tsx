import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube SEO Tool India Pricing | Hookinator AI',
  description: 'Affordable YouTube SEO tool India plans starting from ₹199/month. Try the best free YouTube optimizer India has to offer for Indian YouTubers with UPI payment support.',
  alternates: {
    canonical: 'https://hookinator.com/pricing',
  },
  openGraph: {
    title: 'YouTube SEO Tool India Pricing | Hookinator AI',
    description: 'Affordable YouTube SEO tool India plans starting from ₹199/month. Try the best free YouTube optimizer India has to offer for Indian YouTubers with UPI payment support.',
    url: 'https://hookinator.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
