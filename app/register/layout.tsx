import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Hookinator AI',
  description: 'Create a free Hookinator account to start optimizing your YouTube titles, descriptions, and hashtags.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
