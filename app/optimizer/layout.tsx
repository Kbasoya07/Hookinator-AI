import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Title Optimizer | Hookinator AI',
  description: 'AI-powered YouTube title optimizer and description generator tool. Boost click-through rates, format search-optimized description templates, and select targeted tags.',
  alternates: {
    canonical: 'https://hookinator.com/optimizer',
  },
  openGraph: {
    title: 'YouTube Title Optimizer | Hookinator AI',
    description: 'AI-powered YouTube title optimizer and description generator tool. Boost click-through rates, format search-optimized description templates, and select targeted tags.',
    url: 'https://hookinator.com/optimizer',
  },
};

export default function OptimizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
